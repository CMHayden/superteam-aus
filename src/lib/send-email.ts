import { Resend } from "resend";
import { render } from "@react-email/render";

let _resend: Resend | null = null;

function getResend() {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL ?? "Superteam Australia <noreply@superteam.fun>";

  const html = await render(react);

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
}
