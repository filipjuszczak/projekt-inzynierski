import { Resend } from "resend";
import { DEFAULT_EMAIL_SENDER } from "./constants";

export const resend = new Resend(process.env.RESEND_API_KEY);
