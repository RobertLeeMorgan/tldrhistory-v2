import { Resend } from 'resend';

const emailDeliveryMode = process.env.EMAIL_DELIVERY_MODE ?? 'resend';

if (!['resend', 'disabled'].includes(emailDeliveryMode)) {
  throw new Error('EMAIL_DELIVERY_MODE must be resend or disabled');
}

const resend = emailDeliveryMode === 'resend'
  ? new Resend(process.env.RESEND_API_KEY!)
  : null;

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
  if (!resend) return;

  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString();

  const result = await resend.emails.send({
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
  if (result.error) throw new Error("Verification email delivery failed");
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
  if (!resend) return;

  const expiry = new Date(Date.now() + 60 * 60 * 1000).toLocaleString();

  const result = await resend.emails.send({
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
  if (result.error) throw new Error("Password reset email delivery failed");
}
