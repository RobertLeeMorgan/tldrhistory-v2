import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

const EMAIL_VERIFICATION_TEMPLATE_ID = 'email-verification';
const PASSWORD_RESET_TEMPLATE_ID = 'reset-password';

export async function sendVerificationEmail({
  to,
  username,
  verificationUrl,
}: {
  to: string;
  username: string;
  verificationUrl: string;
}) {
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString();

  await resend.emails.send({
    to: [to],
    template: {
      id: EMAIL_VERIFICATION_TEMPLATE_ID,
      variables: {
        username,
        expiry,
        verification_url: verificationUrl,
      },
    },
  });
}

export async function sendPasswordResetEmail({
  to,
  username,
  resetUrl,
}: {
  to: string;
  username: string;
  resetUrl: string;
}) {
  const expiry = new Date(Date.now() + 60 * 60 * 1000).toLocaleString();

  await resend.emails.send({
    to: [to],
    template: {
      id: PASSWORD_RESET_TEMPLATE_ID,
      variables: {
        username,
        expiry,
        reset_url: resetUrl,
      },
    },
  });
}