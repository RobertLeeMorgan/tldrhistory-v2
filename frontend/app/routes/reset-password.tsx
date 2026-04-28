import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useResetPasswordMutation } from "../../src/hooks/useAuthMutations";
import { AnimatePresence, motion } from "framer-motion";
import { resetSchema, type ResetFormData } from "../../src/schemas/resetSchema";
import PageContainer from "../../src/components/ui/PageContainer";
import Button from "../../src/components/ui/Button";
import { useToast } from "../../src/context/ToastContext";
import type { Route } from "./+types/reset-password";
import { buildMeta } from "../../src/lib/seo";

export function meta({}: Route.MetaArgs) {
  return buildMeta({
    title: "Reset Password | TLDR History",
    description: "Choose a new password for your TLDR History account.",
    path: "/reset-password",
    robots: "noindex, nofollow",
    type: "website",
  });
}

type ViewState = "form" | "success" | "invalid";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();
  const mutation = useResetPasswordMutation();

  const token = searchParams.get("token");

  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof passwords, string>>
  >({});

  const [view, setView] = useState<ViewState>(token ? "form" : "invalid");

  useEffect(() => {
    setView(token ? "form" : "invalid");
  }, [token]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    if (!token) {
      setView("invalid");
      addToast({
        type: "error",
        message: "Invalid reset link. Please request a new one.",
      });
      return;
    }

    const result = resetSchema.safeParse(passwords);
    if (!result.success) {
      const fieldErrors = Object.fromEntries(
        result.error.issues.map((issue) => [issue.path[0], issue.message]),
      ) as Partial<Record<keyof ResetFormData, string>>;
      setErrors(fieldErrors);
      return;
    }

    mutation.mutate(
      {
        token,
        password: passwords.password,
      },
      {
        onSuccess: () => {
          setView("success");
          addToast({
            type: "success",
            message: "Password reset successfully.",
          });

          setTimeout(() => {
            navigate("/timeline", {
              replace: true,
              state: { passwordResetComplete: true },
            });
          }, 2000);
        },
        onError: () => {
          setView("invalid");
          addToast({
            type: "error",
            message: "Reset link is invalid or expired.",
          });
        },
      },
    );
  };

  return (
    <PageContainer>
      <div className="card border border-stone-900/70 bg-gradient-to-br from-stone-800 to-stone-900 w-full max-w-md shadow-stone-950/40 shadow-xl overflow-hidden">
        <AnimatePresence mode="wait">
          {view === "invalid" ? (
            <motion.div
              key="invalid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="card-body items-center text-center"
            >
              <h1 className="card-title text-4xl font-serif text-stone-200 mx-auto mb-2">
                Invalid reset link
              </h1>
              <p className="text-stone-300 mb-6">
                This reset link is missing or invalid. Please request a new one.
              </p>
              <Button
                primary
                label="Try again"
                onClick={() => navigate("/forgot-password")}
              />
            </motion.div>
          ) : view === "success" ? (
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
                  Password reset successful
                </h1>
              </div>
              <p className="text-stone-300 mb-6">
                Redirecting you to timeline...
              </p>
              <Button
                primary
                label="Go to timeline"
                onClick={() => navigate("/timeline")}
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
                Reset your password
              </h1>

              <p className="text-stone-300 text-center mb-8">
                Enter a new password for your TLDR History account.
              </p>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="input input-bordered flex items-center gap-2 bg-stone-900/93 border-stone-600 w-full">
                  <input
                    name="password"
                    type="password"
                    className="text-stone-200 caret-stone-200 flex-1"
                    aria-label="new password"
                    placeholder="New password"
                    value={passwords.password}
                    onChange={(e) =>
                      setPasswords({ ...passwords, password: e.target.value })
                    }
                    autoComplete="new-password"
                  />
                </label>
                {errors.password && (
                  <p className="text-error text-xs">{errors.password}</p>
                )}

                <label className="input input-bordered flex items-center gap-2 bg-stone-900/93 border-stone-600 w-full">
                  <input
                    name="confirmPassword"
                    type="password"
                    className="text-stone-200 caret-stone-200 flex-1"
                    aria-label="confirm new password"
                    placeholder="Confirm new password"
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        confirmPassword: e.target.value,
                      })
                    }
                    autoComplete="new-password"
                  />
                </label>
                {errors.confirmPassword && (
                  <p className="text-error text-xs">{errors.confirmPassword}</p>
                )}

                <div className="flex flex-col gap-4 pt-4">
                  <Button
                    isLoading={mutation.isPending}
                    primary
                    label="Reset password"
                    type="submit"
                    loading="Resetting..."
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
