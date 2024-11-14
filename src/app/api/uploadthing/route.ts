import { createRouteHandler } from "uploadthing/next";
import { imageFileRouter } from "@/app/api/uploadthing/core";

export const { GET, POST } = createRouteHandler({ router: imageFileRouter });
