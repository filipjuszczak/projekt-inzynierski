import {
  createUploadthing as createUploadThing,
  type FileRouter
} from "uploadthing/next";
import { authEmployee } from "@/lib/auth/helpers";

const f = createUploadThing();

export const imageFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      await authEmployee({ throwUploadThingError: true });

      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return { success: true, fileUrl: file.ufsUrl };
    })
} satisfies FileRouter;

export type ImageFileRouter = typeof imageFileRouter;
