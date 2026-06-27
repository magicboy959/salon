import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createUser } from "@/lib/users";
import { sendWelcomeEmail } from "@/services/notifications";

const registerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(7).max(30).optional(),
  password: z.string().min(8).max(100)
});

export async function POST(request: NextRequest) {
  const parsed = registerSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const id = await createUser({ ...parsed.data, role: "CUSTOMER" });
    await Promise.allSettled([sendWelcomeEmail({ to: parsed.data.email, name: parsed.data.name })]);
    return NextResponse.json({ id });
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_EXISTS") {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    console.error("Registration failed", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
