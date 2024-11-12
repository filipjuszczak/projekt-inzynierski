import { Resend } from "resend";
import { EmailTemplate } from "@/components/emails/EmailTemplate";
import type { NextRequest } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // const { data, error } = await resend.emails.send({
    //   from: "Cinema <notifications@notifications.filipjuszczak.pl>",
    //   to: ["nextjscinemaapp@mailinator.com"],
    //   subject: "Hello, world!",
    //   react: EmailTemplate({ firstName: "John" })
    // });

    // if (error) {
    //   return Response.json({ error }, { status: 500 });
    // }

    // return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
