import {
  createUploadthing as createUploadThing,
  type FileRouter
} from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { authEmployee } from "@/app/(staff)/staff/auth";
import { getSessionCookie } from "@/app/(staff)/staff/session";

const f = createUploadThing();

export const imageFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      const requestSessionCookie = await getSessionCookie();

      const { session } = await authEmployee(requestSessionCookie);

      if (!session || !session.userId) {
        throw new UploadThingError("Unauthorized");
      }

      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { success: true, fileUrl: file.url };
    })
} satisfies FileRouter;

export type ImageFileRouter = typeof imageFileRouter;
