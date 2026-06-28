import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { listEditableContent, seedServicesIfEmpty, updateTemplate, upsertGalleryItem, upsertOffer, upsertService } from "@/lib/admin-content";

const serviceSchema = z.object({
  action: z.literal("service"),
  id: z.string().optional(),
  name: z.string().min(2).max(120),
  category: z.string().min(2).max(120),
  description: z.string().min(2).max(191),
  duration: z.coerce.number().int().min(5).max(480),
  price: z.coerce.number().min(0).max(100000),
  active: z.boolean().default(true)
});

const gallerySchema = z.object({
  action: z.literal("gallery"),
  id: z.string().optional(),
  title: z.string().min(2).max(120),
  imageUrl: z.string().min(3).max(191),
  alt: z.string().min(2).max(191),
  category: z.string().min(2).max(80),
  published: z.boolean().default(true)
});

const offerSchema = z.object({
  action: z.literal("offer"),
  id: z.string().optional(),
  code: z.string().min(2).max(40),
  description: z.string().min(2).max(191),
  discountPct: z.coerce.number().int().min(1).max(100),
  active: z.boolean().default(true),
  expiresAt: z.string().optional().nullable()
});

const templateSchema = z.object({
  action: z.literal("template"),
  id: z.string().min(1),
  type: z.enum(["email", "whatsapp"]),
  subject: z.string().max(191).optional(),
  body: z.string().min(1).max(191)
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await seedServicesIfEmpty();
  const content = await listEditableContent();
  return NextResponse.json(content);
}

export async function PATCH(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const service = serviceSchema.safeParse(body);
  if (service.success) return NextResponse.json({ id: await upsertService(service.data) });

  const gallery = gallerySchema.safeParse(body);
  if (gallery.success) return NextResponse.json({ id: await upsertGalleryItem(gallery.data) });

  const offer = offerSchema.safeParse(body);
  if (offer.success) return NextResponse.json({ id: await upsertOffer(offer.data) });

  const template = templateSchema.safeParse(body);
  if (template.success) {
    await updateTemplate(template.data);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid content update" }, { status: 400 });
}
