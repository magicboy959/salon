import { randomUUID } from "node:crypto";
import { unstable_noStore as noStore } from "next/cache";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { services as staticServices, gallery as staticGallery, offers as staticOffers } from "@/lib/data";
import { query } from "@/lib/db";

export type AdminService = {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: number;
  price: number;
  active: boolean;
};

export type AdminGalleryItem = {
  id: string;
  title: string;
  imageUrl: string;
  alt: string;
  category: string;
  published: boolean;
};

export type AdminOffer = {
  id: string;
  code: string;
  description: string;
  discountPct: number;
  active: boolean;
  expiresAt: string | null;
};

export type AdminTemplate = {
  id: string;
  type: "email" | "whatsapp";
  key: string;
  subject?: string;
  body: string;
};

type ServiceRow = RowDataPacket & AdminService & { price: string | number; active: 0 | 1 | boolean };
type GalleryRow = RowDataPacket & AdminGalleryItem & { published: 0 | 1 | boolean };
type OfferRow = RowDataPacket & AdminOffer & { active: 0 | 1 | boolean; expiresAt: Date | string | null };
type TemplateRow = RowDataPacket & { id: string; key: string; subject?: string; html?: string; message?: string };
type CategoryRow = RowDataPacket & { id: string };

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || randomUUID();
}

async function categoryId(name: string) {
  const slug = slugify(name);
  const rows = await query<CategoryRow[]>("SELECT id FROM Category WHERE slug = ? LIMIT 1", [slug]);
  if (rows[0]) return rows[0].id;
  const id = randomUUID();
  await query<ResultSetHeader>("INSERT INTO Category (id, name, slug) VALUES (?, ?, ?)", [id, name, slug]);
  return id;
}

export async function listEditableContent() {
  const [services, gallery, coupons, emailTemplates, whatsappTemplates] = await Promise.all([
    query<ServiceRow[]>(
      `SELECT Service.id, Service.name, Category.name AS category, Service.description, Service.duration, Service.price, Service.active
      FROM Service
      INNER JOIN Category ON Category.id = Service.categoryId
      ORDER BY Service.name ASC`
    ),
    query<GalleryRow[]>("SELECT id, title, imageUrl, alt, category, published FROM GalleryItem ORDER BY createdAt DESC"),
    query<OfferRow[]>("SELECT id, code, description, discountPct, active, expiresAt FROM Coupon ORDER BY code ASC"),
    query<TemplateRow[]>("SELECT id, `key`, subject, html FROM EmailTemplate ORDER BY `key` ASC"),
    query<TemplateRow[]>("SELECT id, `key`, message FROM WhatsAppTemplate ORDER BY `key` ASC")
  ]);

  return {
    services: services.map((service) => ({ ...service, price: Number(service.price), active: Boolean(service.active) })),
    gallery: gallery.map((item) => ({ ...item, published: Boolean(item.published) })),
    offers: coupons.map((offer) => ({
      ...offer,
      discountPct: Number(offer.discountPct),
      active: Boolean(offer.active),
      expiresAt: offer.expiresAt ? new Date(offer.expiresAt).toISOString().slice(0, 10) : null
    })),
    templates: [
      ...emailTemplates.map((template) => ({ id: template.id, type: "email" as const, key: template.key, subject: template.subject, body: template.html ?? "" })),
      ...whatsappTemplates.map((template) => ({ id: template.id, type: "whatsapp" as const, key: template.key, body: template.message ?? "" }))
    ]
  };
}

export async function listPublicServices() {
  noStore();
  const rows = await query<ServiceRow[]>(
    `SELECT Service.id, Service.name, Category.name AS category, Service.description, Service.duration, Service.price, Service.active
    FROM Service
    INNER JOIN Category ON Category.id = Service.categoryId
    WHERE Service.active = true
    ORDER BY Service.name ASC`
  );
  if (!rows.length) return staticServices.map((service) => ({ ...service }));
  return rows.map((service) => ({
    name: service.name,
    category: service.category,
    duration: Number(service.duration),
    price: Number(service.price),
    priceLabel: `AED ${Number(service.price)}`,
    detail: service.description,
    image: staticServices.find((item) => item.name === service.name)?.image
  }));
}

export async function listPublicGallery() {
  noStore();
  const rows = await query<GalleryRow[]>("SELECT title, imageUrl, alt, category FROM GalleryItem WHERE published = true ORDER BY createdAt DESC");
  if (!rows.length) return [...staticGallery];
  return rows.map((item) => ({ type: "image" as const, src: item.imageUrl, alt: item.alt, title: item.title }));
}

export async function listPublicOffers() {
  noStore();
  const rows = await query<OfferRow[]>("SELECT code, description, discountPct FROM Coupon WHERE active = true AND (expiresAt IS NULL OR expiresAt >= NOW()) ORDER BY code ASC");
  if (!rows.length) return staticOffers.map((offer) => `${offer.title} - AED ${offer.price}`);
  return rows.map((offer) => `${offer.code} - ${offer.discountPct}% off - ${offer.description}`);
}

export async function upsertService(input: { id?: string; name: string; category: string; description: string; duration: number; price: number; active: boolean }) {
  const id = input.id || randomUUID();
  const catId = await categoryId(input.category);
  const slug = slugify(input.name);
  await query<ResultSetHeader>(
    `INSERT INTO Service (id, categoryId, name, slug, description, duration, price, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE categoryId = VALUES(categoryId), name = VALUES(name), description = VALUES(description), duration = VALUES(duration), price = VALUES(price), active = VALUES(active)`,
    [id, catId, input.name, slug, input.description, input.duration, input.price, input.active]
  );
  return id;
}

export async function upsertGalleryItem(input: { id?: string; title: string; imageUrl: string; alt: string; category: string; published: boolean }) {
  const id = input.id || randomUUID();
  await query<ResultSetHeader>(
    `INSERT INTO GalleryItem (id, title, imageUrl, alt, category, published, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, NOW(3))
    ON DUPLICATE KEY UPDATE title = VALUES(title), imageUrl = VALUES(imageUrl), alt = VALUES(alt), category = VALUES(category), published = VALUES(published)`,
    [id, input.title, input.imageUrl, input.alt, input.category, input.published]
  );
  return id;
}

export async function upsertOffer(input: { id?: string; code: string; description: string; discountPct: number; active: boolean; expiresAt?: string | null }) {
  const id = input.id || randomUUID();
  await query<ResultSetHeader>(
    `INSERT INTO Coupon (id, code, description, discountPct, active, expiresAt)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE description = VALUES(description), discountPct = VALUES(discountPct), active = VALUES(active), expiresAt = VALUES(expiresAt)`,
    [id, input.code.toUpperCase(), input.description, input.discountPct, input.active, input.expiresAt ? new Date(input.expiresAt) : null]
  );
  return id;
}

export async function updateTemplate(input: { id: string; type: "email" | "whatsapp"; subject?: string; body: string }) {
  if (input.type === "email") {
    await query<ResultSetHeader>("UPDATE EmailTemplate SET subject = ?, html = ? WHERE id = ?", [input.subject ?? "", input.body, input.id]);
  } else {
    await query<ResultSetHeader>("UPDATE WhatsAppTemplate SET message = ? WHERE id = ?", [input.body, input.id]);
  }
}

export async function seedServicesIfEmpty() {
  const rows = await query<CategoryRow[]>("SELECT id FROM Service LIMIT 1");
  if (rows.length) return;
  for (const service of staticServices) {
    await upsertService({
      name: service.name,
      category: service.category,
      description: service.detail,
      duration: service.duration,
      price: service.price,
      active: true
    });
  }
}
