import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const uploadRouter = {
  galleryImage: f({ image: { maxFileSize: "8MB", maxFileCount: 8 } })
    .middleware(async () => ({ uploadedBy: "admin" }))
    .onUploadComplete(async ({ file, metadata }) => ({
      url: file.ufsUrl,
      uploadedBy: metadata.uploadedBy
    }))
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
