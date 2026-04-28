import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import {
  useResendVerificationEmailMutation,
  useVerifyEmailMutation,
} from "../../src/hooks/useAuthMutations";
import Button from "../../src/components/ui/Button";
import PageContainer from "../../src/components/ui/PageContainer";
import { useToast } from "../../src/context/ToastContext";
import type { Route } from "./+types/verify";
import { buildMeta } from "../../src/lib/seo";
import { useAuth } from "../../src/context/AuthContext";

type ViewState = "prompt" | "verifying" | "success" | "invalid";

export function meta({}: Route.MetaArgs) {
  return buildMeta({
    title: "Verify Email | TLDR History",
    description:
      "Verify your email address to complete your TLDR History account setup.",
    path: "/verify",
    robots: "noindex, nofollow",
    type: "website",
  });
}

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();
  const { isAuth } = useAuth();

  const verifyMutation = useVerifyEmailMutation();
  const resendMutation = useResendVerificationEmailMutation();

  const hasVerifiedRef = useRef(false);
  const redirectTimeoutRef = useRef<number | null>(null);

  const token = searchParams.get("token");
  const from =
    (location.state as { from?: string } | null)?.from || "/timeline";

  const [view, setView] = useState<ViewState>(token ? "verifying" : "prompt");
  const [message, setMessage] = useState("");

useEffect(() => {
  if (!token && isAuth.token && isAuth.emailVerifiedAt) {
    setView("success");
    setMessage("Your email is already verified.");
  }
}, [token, isAuth.token, isAuth.emailVerifiedAt]);

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        window.clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!token) {
      setView("prompt");
      setMessage("");
      return;
    }

    if (hasVerifiedRef.current) return;
    hasVerifiedRef.current = true;

    setView("verifying");
    setMessage("");

    verifyMutation.mutate(
      { token },
      {
        onSuccess: (data) => {
          if (data.verifyEmail.success) {
            setView("success");
            setMessage("Your email has been verified successfully.");

            addToast({
              type: "success",
              message: "Email verified successfully.",
            });

            redirectTimeoutRef.current = window.setTimeout(() => {
              navigate(from, { replace: true });
            }, 1500);

            return;
          }

          setView("invalid");
          setMessage(
            data.verifyEmail.message ||
              "This verification link is invalid or has expired.",
          );
        },
        onError: () => {
          setView("invalid");
          setMessage("This verification link is invalid or has expired.");
        },
      },
    );
  }, [token, verifyMutation, navigate, from, addToast]);

  const handleResend = () => {
    setMessage("");

    resendMutation.mutate(undefined, {
      onSuccess: () => {
        setView("prompt");
        addToast({
          type: "success",
          message:
            "We have sent you a verification email. Please check your inbox and spam folder.",
        });
        setMessage(
          "We have sent you a new verification email. Please check your inbox and spam folder.",
        );
      },
      onError: () => {
        setMessage(
          "We could not send a new verification email right now. Please try again shortly.",
        );
      },
    });
  };

  const motionProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  };

  return (
    <PageContainer>
      <div className="card border border-stone-900/70 bg-gradient-to-br from-stone-800 to-stone-900 w-full max-w-md shadow-stone-950/40 shadow-xl overflow-hidden">
        <AnimatePresence mode="wait">
          {view === "verifying" ? (
            <motion.div
              key="verifying"
              {...motionProps}
              className="card-body items-center text-center"
            >
              <h1 className="card-title text-4xl font-serif text-stone-200 mb-2">
                Email Verification
              </h1>

              <div className="space-y-4">
                <div className="loading loading-bars loading-lg text-gold mx-auto" />
                <p className="text-stone-300">
                  Verifying your email address...
                </p>
              </div>
            </motion.div>
          ) : view === "success" ? (
            <motion.div
              key="success"
              {...motionProps}
              className="card-body items-center text-center"
            >
              <h1 className="card-title text-4xl font-serif text-stone-200  mb-2">
                Email Verification
              </h1>

              <div className="space-y-4">
                <div className="w-20 h-20 bg-gold/30 rounded-full flex items-center justify-center border-4 border-gold mx-auto">
                  <span className="text-3xl">✓</span>
                </div>
                <p className="text-stone-200 font-semibold">
                  Email verified successfully
                </p>
                <p className="text-stone-300">
                  {message || "Redirecting you back..."}
                </p>
                <Button
                  primary
                  label="Continue"
                  onClick={() => navigate(from, { replace: true })}
                />
              </div>
            </motion.div>
          ) : view === "invalid" ? (
            <motion.div
              key="invalid"
              {...motionProps}
              className="card-body items-center text-center"
            >
              <h1 className="card-title text-4xl font-serif text-stone-200 mb-2">
                Email Verification
              </h1>

              <div className="space-y-4">
                <div className="w-20 h-20 bg-gold/30 rounded-full flex items-center justify-center border-4 border-gold mx-auto">
                  <span className="text-3xl">✕</span>
                </div>
                <p className="text-stone-200 font-semibold">
                  Verification failed
                </p>
                <p className="text-stone-300">
                  {message ||
                    "This verification link is invalid or has expired."}
                </p>

                <div className="flex flex-col gap-4 pt-2">
                  <Button
                    isLoading={resendMutation.isPending}
                    primary
                    label="Resend email"
                    onClick={handleResend}
                    loading="Sending..."
                  />
                  <Button
                    label="Go back"
                    onClick={() => navigate(from, { replace: true })}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="prompt"
              {...motionProps}
              className="card-body items-center text-center"
            >
              <h1 className="card-title text-4xl font-serif text-stone-200 mb-2">
                Verify your email
              </h1>

              <div className="space-y-4">
                <div className="w-20 h-20 bg-gold/30 rounded-full flex items-center justify-center border-4 border-gold mx-auto">
                  <span className="text-3xl">!</span>
                </div>
                <p className="text-stone-200 font-semibold">
                  Your account is not verified yet
                </p>
                <p className="text-stone-300">
                  {message ||
                    "Please verify your email address to continue with account features like creating and editing content."}
                </p>
                <p className="text-sm text-stone-400">
                  We can send you a new verification email now.
                </p>

                <div className="flex flex-col gap-4 pt-2">
                  <Button
                    isLoading={resendMutation.isPending}
                    primary
                    label="Verify Email"
                    onClick={handleResend}
                    loading="Sending..."
                  />
                  <Button
                    label="Go back"
                    onClick={() => navigate(from, { replace: true })}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageContainer>
  );
}
