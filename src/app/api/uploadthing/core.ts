import {
  createUploadthing as createUploadThing,
  type FileRouter
} from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { Role } from "@prisma/client";
import { authenticateUser } from "@/auth";
import { getSessionCookie } from "@/lib/session";

const f = createUploadThing();

export const imageFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      const requestSessionCookie = await getSessionCookie();

      if (!requestSessionCookie) {
        throw new UploadThingError("Unauthorized");
      }

      const { session } = await authenticateUser(
        Role.EMPLOYEE,
        requestSessionCookie
      );

      if (!session || !session.userId) {
        throw new UploadThingError("Unauthorized");
      }

      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return { success: true, fileUrl: file.url };
    })
} satisfies FileRouter;

export type ImageFileRouter = typeof imageFileRouter;
