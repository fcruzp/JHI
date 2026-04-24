import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { ContactsService } from "@/lib/hubspot/service";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "broker@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Faltan credenciales");
        }

        try {
          const contact = await ContactsService.findByEmail(credentials.email);
          if (!contact) {
            throw new Error("Correo o contraseña inválidos");
          }

          const { broker_password_hash, broker_status, rol_en_la_operacion } = contact.properties;

          if (rol_en_la_operacion !== "broker") {
             throw new Error("Acceso denegado: No es broker");
          }

          if (broker_status === "pendiente") {
            throw new Error("La cuenta está pendiente de activación. Por favor verifica tu correo.");
          }

          if (broker_status !== "activo") {
             throw new Error("La cuenta no está activa.");
          }

          if (!broker_password_hash) {
            throw new Error("Correo o contraseña inválidos");
          }

          const isValid = await bcrypt.compare(credentials.password, broker_password_hash);
          if (!isValid) {
            throw new Error("Correo o contraseña inválidos");
          }

          return {
            id: contact.id,
            name: `${contact.properties.firstname || ""} ${contact.properties.lastname || ""}`.trim(),
            email: contact.properties.email || credentials.email,
          };
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
    })
  ],
  pages: {
    signIn: '/broker/login',
    error: '/broker/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "jhi-development-secret-key-12345",
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
