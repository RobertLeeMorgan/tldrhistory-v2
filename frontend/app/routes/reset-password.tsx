import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useResetPasswordMutation } from "../../src/hooks/useAuthMutations";
import { resetSchema, type ResetFormData } from "../../src/schemas/resetSchema";
import AccountPanel, { AccountStatusMark } from "../../src/components/ui/AccountPanel";
import FormField from "../../src/components/form/FormField";
import Button from "../../src/components/ui/Button";
import { useToast } from "../../src/context/ToastContext";
import { buildMeta } from "../../src/lib/seo";

export function meta() {
  return buildMeta({ title: "Reset Password | TLDR History", description: "Choose a new password for your TLDR History account.", path: "/reset-password", robots: "noindex, nofollow", type: "website" });
}

type ViewState = "form" | "success" | "invalid";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();
  const mutation = useResetPasswordMutation();
  const token = searchParams.get("token");
  const [passwords, setPasswords] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof passwords, string>>>({});
  const [viewState, setViewState] = useState<{ token: string | null; view: ViewState }>({ token, view: token ? "form" : "invalid" });
  const view = viewState.token === token ? viewState.view : token ? "form" : "invalid";
  const setView = (nextView: ViewState) => setViewState({ token, view: nextView });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    if (!token) {
      setView("invalid");
      addToast({ type: "error", message: "Invalid reset link. Please request a new one." });
      return;
    }
    const result = resetSchema.safeParse(passwords);
    if (!result.success) {
      setErrors(Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message])) as Partial<Record<keyof ResetFormData, string>>);
      return;
    }
    mutation.mutate({ token, password: passwords.password }, {
      onSuccess: () => {
        setView("success");
        addToast({ type: "success", message: "Password reset successfully." });
        window.setTimeout(() => navigate("/timeline", { replace: true, state: { passwordResetComplete: true } }), 2000);
      },
      onError: () => {
        setView("invalid");
        addToast({ type: "error", message: "Reset link is invalid or expired." });
      },
    });
  };

  const title = view === "invalid" ? "Invalid reset link" : view === "success" ? "Password reset" : "Reset your password";
  return (
    <AccountPanel eyebrow="Account recovery" title={title} description={view === "form" ? "Enter a new password for your TLDR History account." : undefined}>
      {view === "invalid" ? (
        <div className="space-y-5 text-center" role="alert">
          <AccountStatusMark tone="danger">×</AccountStatusMark>
          <p className="text-content-muted">This reset link is missing or invalid. Please request a new one.</p>
          <Button primary label="Try again" onClick={() => navigate("/forgot-password")} className="w-full" />
        </div>
      ) : view === "success" ? (
        <div className="space-y-5 text-center" role="status">
          <AccountStatusMark>✓</AccountStatusMark>
          <p className="text-content-muted">Your password has been reset. Redirecting you to the timeline…</p>
          <Button primary label="Go to timeline" onClick={() => navigate("/timeline")} className="w-full" />
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <FormField label="New password" name="password" type="password" placeholder="New password" value={passwords.password} onChange={(event) => setPasswords({ ...passwords, password: event.target.value })} autoComplete="new-password" error={errors.password} />
          <FormField label="Confirm new password" name="confirmPassword" type="password" placeholder="Confirm new password" value={passwords.confirmPassword} onChange={(event) => setPasswords({ ...passwords, confirmPassword: event.target.value })} autoComplete="new-password" error={errors.confirmPassword} />
          <div className="flex flex-col gap-3 pt-2">
            <Button isLoading={mutation.isPending} primary label="Reset password" type="submit" loading="Resetting..." className="w-full" />
            <Button label="Back to login" onClick={() => navigate("/login")} className="w-full" />
          </div>
        </form>
      )}
    </AccountPanel>
  );
}
