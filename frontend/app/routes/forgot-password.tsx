import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useForgotPasswordMutation } from "../../src/hooks/useAuthMutations";
import PageContainer from "../../src/components/ui/PageContainer";
import Button from "../../src/components/ui/Button";
import { useToast } from "../../src/context/ToastContext";
import type { Route } from "./+types/forgot-password";
import { buildMeta } from "../../src/lib/seo";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../../src/schemas/emailSchema";

type ViewState = "form" | "success";

export function meta({}: Route.MetaArgs) {
  return buildMeta({
    title: "Forgot Password | TLDR History",
    description:
      "Enter your email address and we'll send you a link to reset your password.",
    path: "/forgot-password",
    robots: "noindex, nofollow",
    type: "website",
  });
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const mutation = useForgotPasswordMutation();

  const [form, setForm] = useState<ForgotPasswordFormData>({
    email: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ForgotPasswordFormData, string>>
  >({});
  const [view, setView] = useState<ViewState>("form");
  const [submittedEmail, setSubmittedEmail] = useState("");

  useEffect(() => {
    if (view !== "success") return;

    const timeout = window.setTimeout(() => {
      navigate("/timeline", {
        state: {
          emailSentTo: submittedEmail,
          justRequestedPasswordReset: true,
        },
      });
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [view, submittedEmail, navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const result = forgotPasswordSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = Object.fromEntries(
        result.error.issues.map((issue) => [issue.path[0], issue.message]),
      ) as Partial<Record<keyof ForgotPasswordFormData, string>>;
      setErrors(fieldErrors);
      return;
    }

    mutation.mutate(
      { email: result.data.email },
      {
        onSuccess: (data) => {
          setSubmittedEmail(result.data.email);
          setView("success");
          addToast({
            type: "success",
            message: data.forgotPassword.message,
          });
        },
        onError: (error) => {
          const message =
            error instanceof Error ? error.message : "Something went wrong.";
          addToast({
            type: "error",
            message,
          });
        },
      },
    );
  };

  return (
    <PageContainer>
      <div className="card border border-stone-900/70 bg-gradient-to-br from-stone-800 to-stone-900 w-full max-w-md shadow-stone-950/40 shadow-xl overflow-hidden">
        <AnimatePresence mode="wait">
          {view === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="card-body items-center text-center"
            >
              <div className="flex flex-col items-center space-y-2 mb-6">
                <div className="w-20 h-20 bg-gold/30 rounded-full flex items-center justify-center border-4 border-gold">
                  <span className="text-3xl">✓</span>
                </div>
                <h1 className="card-title text-2xl font-serif text-stone-200 mx-auto mb-2">
                  Check your email
                </h1>
              </div>

              <p className="text-stone-300 mb-6">
                We&apos;ve sent a password reset link to <br />
                <strong className="text-stone-200">{submittedEmail}</strong>
              </p>

              <p className="text-sm text-stone-400 mb-8">
                Didn&apos;t receive the email? Check your spam folder.
              </p>

              <Button
                primary
                label="Back to login"
                onClick={() => navigate("/login")}
              />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="card-body"
            >
              <h1 className="card-title text-4xl font-serif text-stone-200 text-center mx-auto mb-2">
                Forgot password?
              </h1>

              <p className="text-stone-300 text-center mb-8">
                Enter your email address and we&apos;ll send you a link to reset
                your password.
              </p>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="input input-bordered flex items-center gap-2 bg-stone-900/93 border-stone-600 w-full">
                  <input
                    name="email"
                    type="email"
                    className="text-stone-200 caret-stone-200 flex-1"
                    aria-label="email"
                    placeholder="mail@site.com"
                    value={form.email}
                    onChange={(e) => setForm({ email: e.target.value })}
                    autoComplete="email"
                  />
                </label>
                {errors.email && (
                  <p className="text-error text-xs">{errors.email}</p>
                )}

                <div className="flex flex-col gap-4">
                  <Button
                    isLoading={mutation.isPending}
                    primary
                    label="Send reset link"
                    type="submit"
                    loading="Sending..."
                  />

                  <Button
                    label="Back to login"
                    onClick={() => navigate("/login")}
                  />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageContainer>
  );
}
