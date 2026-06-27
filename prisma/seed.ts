import { PrismaClient, RoleName } from "@prisma/client";
import bcrypt from "bcryptjs";
import { services, memberships, blogPosts, gallery } from "../lib/data";
import { slugify } from "../lib/utils";

const prisma = new PrismaClient();

async function main() {
  const permissions = [
    "bookings.read",
    "bookings.write",
    "customers.read",
    "employees.write",
    "payments.read",
    "cms.write",
    "reports.read",
    "settings.write"
  ];

  for (const key of permissions) {
    await prisma.permission.upsert({
      where: { key },
      update: {},
      create: { key, name: key.replace(".", " ") }
    });
  }

  for (const name of Object.values(RoleName)) {
    await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
  }

  const admin = await prisma.user.upsert({
    where: { email: "admin@alshamyalaswad.com" },
    update: {},
    create: {
      name: "Alshamy Admin",
      email: "admin@alshamyalaswad.com",
      passwordHash: await bcrypt.hash("ChangeMe123!", 12)
    }
  });

  const adminRole = await prisma.role.findUniqueOrThrow({ where: { name: "SUPER_ADMIN" } });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } },
    update: {},
    create: { userId: admin.id, roleId: adminRole.id }
  });

  const branch = await prisma.branch.upsert({
    where: { id: "main-dubai-branch" },
    update: {},
    create: {
      id: "main-dubai-branch",
      name: "Business Bay Flagship",
      address: "Business Bay, Dubai, United Arab Emirates",
      latitude: 25.1872,
      longitude: 55.2767,
      phone: "+971 50 000 0000"
    }
  });

  const categoryByName = new Map<string, string>();
  for (const service of services) {
    const category = await prisma.category.upsert({
      where: { slug: slugify(service.category) },
      update: {},
      create: { name: service.category, slug: slugify(service.category) }
    });
    categoryByName.set(service.category, category.id);
    await prisma.service.upsert({
      where: { slug: slugify(service.name) },
      update: {
        price: service.price,
        duration: service.duration
      },
      create: {
        categoryId: category.id,
        name: service.name,
        slug: slugify(service.name),
        description: `Premium ${service.name.toLowerCase()} service.`,
        duration: service.duration,
        price: service.price
      }
    });
  }

  for (const plan of memberships) {
    await prisma.membershipPlan.create({
      data: {
        name: plan.name,
        monthlyPrice: plan.price,
        features: [...plan.features]
      }
    });
  }

  const productCategory = await prisma.category.upsert({
    where: { slug: "products" },
    update: {},
    create: { name: "Products", slug: "products" }
  });
  const product = await prisma.product.upsert({
    where: { sku: "BLACK-GOLD-BEARD-OIL" },
    update: {},
    create: {
      categoryId: productCategory.id,
      name: "Black Gold Beard Oil",
      sku: "BLACK-GOLD-BEARD-OIL",
      price: 125
    }
  });
  await prisma.inventoryItem.upsert({
    where: { branchId_productId: { branchId: branch.id, productId: product.id } },
    update: { quantity: 40 },
    create: { branchId: branch.id, productId: product.id, quantity: 40, threshold: 8 }
  });

  for (const [index, imageUrl] of gallery.entries()) {
    await prisma.galleryItem.create({
      data: {
        title: `Salon Gallery ${index + 1}`,
        imageUrl,
        alt: "Luxury men's salon grooming result",
        category: "Salon"
      }
    });
  }

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        slug: post.slug,
        titleEn: post.title,
        titleAr: post.title,
        excerptEn: post.excerpt,
        excerptAr: post.excerpt,
        bodyEn: post.excerpt,
        bodyAr: post.excerpt,
        published: true,
        publishedAt: new Date()
      }
    });
  }

  await prisma.coupon.upsert({
    where: { code: "BLACK10" },
    update: {},
    create: { code: "BLACK10", description: "Launch offer", discountPct: 10 }
  });

  await prisma.emailTemplate.upsert({
    where: { key: "booking-confirmation" },
    update: {},
    create: {
      key: "booking-confirmation",
      subject: "Your appointment is confirmed",
      html: "<p>Your luxury grooming appointment is confirmed.</p>"
    }
  });

  await prisma.whatsAppTemplate.upsert({
    where: { key: "booking-reminder" },
    update: {},
    create: {
      key: "booking-reminder",
      message: "Your Alshamy Alaswad appointment is coming up soon."
    }
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
