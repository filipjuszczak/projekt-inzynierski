import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin as adminPlugin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import prisma from "../prisma";
import { ac, admin, employee, user } from "./permissions";
import { resend } from "../resend";
import { DEFAULT_EMAIL_SENDER } from "../constants";
import ResetPasswordEmail from "@/components/emails/ResetPasswordEmail";
import ChangeEmailEmail from "@/components/emails/ChangeEmailEmail";
import UserDeletedEmail from "@/components/emails/UserDeletedEmail";
import AccountActivationEmail from "@/components/emails/AccountActivationEmail";

export const auth = betterAuth({
  appName: "Sunema",
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: DEFAULT_EMAIL_SENDER,
        to: [user.email],
        subject: "Sunema - Twoja rezerwacja została utworzona",
        react: ResetPasswordEmail({
          firstName: user.name.split(" ")[0],
          link: url
        })
      });
    }
  },
  user: {
    additionalFields: {
      dateOfBirth: {
        type: "date",
        required: true
      },
      newsletterConsent: {
        type: "boolean",
        required: false
      }
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, newEmail, url, token }) => {
        await resend.emails.send({
          from: DEFAULT_EMAIL_SENDER,
          to: [newEmail],
          subject: "Sunema - potwierdź zmianę adresu e-mail",
          react: ChangeEmailEmail({
            firstName: user.name.split(" ")[0],
            link: url
          })
        });
      }
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await resend.emails.send({
          from: DEFAULT_EMAIL_SENDER,
          to: [user.email],
          subject: "Sunema - potwierdź usunięcie konta",
          react: UserDeletedEmail({
            firstName: user.name.split(" ")[0],
            link: url
          })
        });
      }
    }
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: DEFAULT_EMAIL_SENDER,
        to: [user.email],
        subject: "Sunema - potwierdź utworzenie konta",
        react: AccountActivationEmail({
          firstName: user.name.split(" ")[0],
          link: url
        })
      });
    }
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 300
    }
  },
  plugins: [
    adminPlugin({
      defaultRole: "user",
      ac,
      roles: {
        admin,
        employee,
        user
      }
    }),
    nextCookies()
  ]
});
