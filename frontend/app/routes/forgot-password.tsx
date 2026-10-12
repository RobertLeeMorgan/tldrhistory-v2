import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useForgotPasswordMutation } from "../../src/hooks/useAuthMutations";
import AccountPanel, { AccountStatusMark } from "../../src/components/ui/AccountPanel";
import FormField from "../../src/components/form/FormField";
import Button from "../../src/components/ui/Button";
import { useToast } from "../../src/context/ToastContext";
import { buildMeta } from "../../src/lib/seo";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "../../src/schemas/emailSchema";

type ViewState = "form" | "success";

export function meta() {
  return buildMeta({
    title: "Forgot Password | TLDR History",
    description: "Enter your email address and we'll send you a link to reset your password.",
    path: "/forgot-password",
    robots: "noindex, nofollow",
    type: "website",
  });
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const mutation = useForgotPasswordMutation();
  const [form, setForm] = useState<ForgotPasswordFormData>({ email: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof ForgotPasswordFormData, string>>>({});
  const [view, setView] = useState<ViewState>("form");
  const [submittedEmail, setSubmittedEmail] = useState("");

  useEffect(() => {
    if (view !== "success") return;
    const timeout = window.setTimeout(() => {
      navigate("/timeline", { state: { emailSentTo: submittedEmail, justRequestedPasswordReset: true } });
    }, 3000);
    return () => window.clearTimeout(timeout);
  }, [view, submittedEmail, navigate]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    const result = forgotPasswordSchema.safeParse(form);
    if (!result.success) {
      setErrors(Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message])) as Partial<Record<keyof ForgotPasswordFormData, string>>);
      return;
    }
    mutation.mutate({ email: result.data.email }, {
      onSuccess: (data) => {
        setSubmittedEmail(result.data.email);
        setView("success");
        addToast({ type: "success", message: data.forgotPassword.message });
      },
      onError: (error) => addToast({ type: "error", message: error instanceof Error ? error.message : "Something went wrong." }),
    });
  };

  return (
    <AccountPanel eyebrow="Account recovery" title={view === "success" ? "Check your email" : "Forgot password?"} description={view === "form" ? "Enter your email address and we’ll send you a link to reset your password." : undefined}>
      {view === "success" ? (
        <div className="space-y-5 text-center" role="status">
          <AccountStatusMark>✓</AccountStatusMark>
          <p className="text-content-muted">We&apos;ve sent a password reset link to <strong className="text-content">{submittedEmail}</strong>.</p>
          <p className="text-sm text-content-muted">Didn&apos;t receive the email? Check your spam folder.</p>
          <Button primary label="Back to login" onClick={() => navigate("/login")} className="w-full" />
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <FormField label="Email address" name="email" type="email" placeholder="mail@site.com" value={form.email} onChange={(event) => setForm({ email: event.target.value })} autoComplete="email" error={errors.email} />
          <div className="flex flex-col gap-3">
            <Button isLoading={mutation.isPending} primary label="Send reset link" type="submit" loading="Sending..." className="w-full" />
            <Button label="Back to login" onClick={() => navigate("/login")} className="w-full" />
          </div>
        </form>
      )}
    </AccountPanel>
  );
}
