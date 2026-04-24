import { redirect } from 'next/navigation';
import { ContactsService } from '@/lib/hubspot/service';
import jwt from 'jsonwebtoken';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <VerificationCard 
        title="Error de Verificación" 
        message="No se proporcionó un token de verificación válido."
        success={false}
      />
    );
  }

  try {
    const JWT_SECRET = process.env.NEXTAUTH_SECRET || "jhi-development-secret-key-12345";
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    
    if (!decoded.email) {
      throw new Error("Token inválido");
    }

    const contact = await ContactsService.findByEmail(decoded.email);

    if (!contact) {
       throw new Error("Usuario no encontrado");
    }

    if (contact.properties.broker_status !== 'activo') {
      await ContactsService.update(contact.id, {
        broker_status: 'activo'
      });
    }

    return (
      <VerificationCard 
        title="¡Cuenta Activada!" 
        message="Tu cuenta ha sido verificada correctamente. Ya puedes acceder al portal de brokers."
        success={true}
      />
    );

  } catch (error: any) {
    return (
      <VerificationCard 
        title="Error de Verificación" 
        message={error.name === 'TokenExpiredError' ? 'El enlace de verificación ha expirado. Por favor regístrate de nuevo.' : 'El enlace de verificación es inválido.'}
        success={false}
      />
    );
  }
}

function VerificationCard({ title, message, success }: { title: string, message: string, success: boolean }) {
  return (
    <div className="flex justify-center items-center py-20 px-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl border border-black/5 dark:border-white/5 p-8 text-center">
        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 ${success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {success ? (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{title}</h1>
        <p className="text-gray-500 mb-8">{message}</p>
        
        <Link href="/broker/login">
          <Button className="w-full bg-[#c9a84c] hover:bg-[#b0923f] text-white">
            Ir a Iniciar Sesión
          </Button>
        </Link>
      </div>
    </div>
  );
}
