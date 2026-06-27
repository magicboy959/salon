import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { addStoreCredit, createUser, listAdminUsers } from "@/lib/users";

const createUserSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(7).max(30).optional(),
  password: z.string().min(8).max(100),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "MANAGER", "BARBER", "CUSTOMER"]).default("CUSTOMER")
});

const creditSchema = z.object({
  userId: z.string().min(1),
  amount: z.coerce.number().positive().max(100000),
  note: z.string().max(191).optional()
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const users = await listAdminUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Admin users fetch failed", error);
    return NextResponse.json({ error: "Could not load users" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = createUserSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const id = await createUser(parsed.data);
    return NextResponse.json({ id });
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_EXISTS") {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    console.error("Admin user create failed", error);
    return NextResponse.json({ error: "Could not create user" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = creditSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    await addStoreCredit({ ...parsed.data, adminUserId: admin.id });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Store credit update failed", error);
    return NextResponse.json({ error: "Could not add store credit" }, { status: 500 });
  }
}
