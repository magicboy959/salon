import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2";
import { z } from "zod";
import { query } from "@/lib/db";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

async function getRoleNames(userId: string) {
  const rows = await query<Array<RowDataPacket & { name: string }>>(
    `SELECT Role.name
    FROM UserRole
    INNER JOIN Role ON Role.id = UserRole.roleId
    WHERE UserRole.userId = ?`,
    [userId]
  );
  return rows.map((row) => row.name);
}

const providers: NextAuthConfig["providers"] = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize(raw) {
      const parsed = credentialsSchema.safeParse(raw);
      if (!parsed.success) return null;
      const users = await query<Array<RowDataPacket & { id: string; name: string | null; email: string | null; image: string | null; passwordHash: string | null }>>(
        "SELECT id, name, email, image, passwordHash FROM User WHERE email = ? LIMIT 1",
        [parsed.data.email]
      );
      const user = users[0];
      if (!user?.passwordHash) return null;
      const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
      if (!valid) return null;
      return { id: user.id, name: user.name, email: user.email, image: user.image };
    }
  })
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }));
}

if (process.env.APPLE_ID && process.env.APPLE_SECRET) {
  providers.push(Apple({ clientId: process.env.APPLE_ID, clientSecret: process.env.APPLE_SECRET }));
}

export const authConfig = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/en/login"
  },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
        token.roles = await getRoleNames(user.id);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      if (session.user) session.user.roles = Array.isArray(token.roles) ? token.roles.filter((role): role is string => typeof role === "string") : [];
      return session;
    }
  },
  trustHost: true
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
