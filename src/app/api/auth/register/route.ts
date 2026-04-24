import { NextResponse } from 'next/server';
import { ContactsService } from '@/lib/hubspot/service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const JWT_SECRET = process.env.NEXTAUTH_SECRET || "jhi-development-secret-key-12345";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    // 1. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. Check if contact exists
    let contact = await ContactsService.findByEmail(email);

    if (contact) {
      if (contact.properties.broker_status === 'activo') {
         return NextResponse.json({ error: 'Este correo ya es un broker activo. Inicia sesión.' }, { status: 400 });
      }

      // Update existing contact
      await ContactsService.update(contact.id, {
        firstName: firstName || contact.properties.firstname,
        lastName: lastName || contact.properties.lastname,
        rol_en_la_operacion: 'broker',
        broker_password_hash: hashedPassword,
        broker_status: 'pendiente',
      } as any); // Cast as any because we added custom fields to ContactData
    } else {
      // Create new contact
      contact = await ContactsService.create({
        email,
        firstName,
        lastName,
        rol_en_la_operacion: 'broker',
        broker_password_hash: hashedPassword,
        broker_status: 'pendiente',
      } as any);
    }

    // 3. Generate JWT Token for activation
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
    const baseUrlFormatted = BASE_URL.replace(/\/$/, '');
    const activationLink = `${baseUrlFormatted}/broker/verify?token=${token}`;

    // 4. Send Email
    if (resend) {
      const emailFrom = process.env.EMAIL_FROM || 'onboarding@resend.dev';
      await resend.emails.send({
        from: `J Huge International <${emailFrom}>`,
        to: email,
        subject: 'Verifica tu cuenta de Broker - J Huge International',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #c9a84c;">Bienvenido a J Huge International</h2>
            <p>Has solicitado registrarte como Broker intermediario.</p>
            <p>Para activar tu cuenta y acceder al portal para consultar tus cotizaciones, por favor haz clic en el siguiente enlace:</p>
            <br/>
            <p style="text-align: center;">
              <a href="${activationLink}" style="display:inline-block;padding:12px 24px;background-color:#c9a84c;color:white;text-decoration:none;border-radius:4px;font-weight:bold;">Activar mi cuenta de Broker</a>
            </p>
            <br/>
            <p>Si el botón no funciona, copia y pega esta URL en tu navegador:</p>
            <p style="color: #666; word-break: break-all;"><small>${activationLink}</small></p>
            <hr style="border: 1px solid #eee; margin: 30px 0;" />
            <p style="color: #999; font-size: 12px;">Este enlace expirará en 24 horas. Si no solicitaste esto, puedes ignorar este correo.</p>
          </div>
        `
      });
    } else {
      console.log("[Email Mock] Activation Link for", email, ":\n", activationLink);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Registro exitoso. Revisa tu correo para activar la cuenta.' 
    });

  } catch (error: any) {
    console.error("Register API Error:", error);
    return NextResponse.json({ error: error.message || 'Error en el servidor' }, { status: 500 });
  }
}
