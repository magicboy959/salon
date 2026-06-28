import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { updateCustomerProfile } from "@/lib/customer-dashboard";

const profileSchema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().max(30).optional()
});

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = profileSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await updateCustomerProfile(session.user.email, parsed.data);
  return NextResponse.json({ ok: true });
}
