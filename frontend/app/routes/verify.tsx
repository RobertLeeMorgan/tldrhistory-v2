import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useResendVerificationEmailMutation, useVerifyEmailMutation } from "../../src/hooks/useAuthMutations";
import AccountPanel, { AccountStatusMark } from "../../src/components/ui/AccountPanel";
import Button from "../../src/components/ui/Button";
import { useToast } from "../../src/context/ToastContext";
import { buildMeta } from "../../src/lib/seo";
import { useAuth } from "../../src/context/AuthContext";
import { refreshAndApplySession } from "../../src/lib/authSession";

type ViewState = "prompt" | "verifying" | "success" | "invalid";

export function meta() {
  return buildMeta({ title: "Verify Email | TLDR History", description: "Verify your email address to complete your TLDR History account setup.", path: "/verify", robots: "noindex, nofollow", type: "website" });
}

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();
  const { isAuth } = useAuth();
  const verifyMutation = useVerifyEmailMutation();
  const resendMutation = useResendVerificationEmailMutation();
  const verifiedTokenRef = useRef<string | null>(null);
  const redirectTimeoutRef = useRef<number | null>(null);
  const token = searchParams.get("token");
  const from = (location.state as { from?: string } | null)?.from || "/timeline";
  const alreadyVerified = !token && Boolean(isAuth.token && isAuth.emailVerifiedAt);
  const [view, setView] = useState<ViewState>(token ? "verifying" : alreadyVerified ? "success" : "prompt");
  const [message, setMessage] = useState(alreadyVerified ? "Your email is already verified." : "");

  useEffect(() => () => {
    if (redirectTimeoutRef.current) window.clearTimeout(redirectTimeoutRef.current);
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }
    if (verifiedTokenRef.current === token) return;
    verifiedTokenRef.current = token;
    verifyMutation.mutate({ token }, {
      onSuccess: async (data) => {
        if (data.verifyEmail.success) {
          try { await refreshAndApplySession(); } catch { /* Verification also works without this device's refresh cookie. */ }
          setView("success");
          setMessage("Your email has been verified successfully.");
          addToast({ type: "success", message: "Email verified successfully." });
          redirectTimeoutRef.current = window.setTimeout(() => navigate(from, { replace: true }), 1500);
          return;
        }
        setView("invalid");
        setMessage(data.verifyEmail.message || "This verification link is invalid or has expired.");
      },
      onError: () => {
        setView("invalid");
        setMessage("This verification link is invalid or has expired.");
      },
    });
  }, [token, verifyMutation, navigate, from, addToast]);

  const handleResend = () => {
    setMessage("");
    resendMutation.mutate(undefined, {
      onSuccess: () => {
        const nextMessage = "We have sent you a new verification email. Please check your inbox and spam folder.";
        addToast({ type: "success", message: "We have sent you a verification email. Please check your inbox and spam folder." });
        setView("prompt");
        setMessage(nextMessage);
      },
      onError: () => setMessage("We could not send a new verification email right now. Please try again shortly."),
    });
  };

  const title = view === "prompt" ? "Verify your email" : "Email verification";
  return (
    <AccountPanel eyebrow="Account security" title={title}>
      {view === "verifying" ? (
        <div className="space-y-5 text-center" role="status">
          <span className="loading loading-spinner loading-lg text-accent" aria-hidden="true" />
          <p className="text-content-muted">Verifying your email address…</p>
        </div>
      ) : view === "success" ? (
        <div className="space-y-5 text-center" role="status">
          <AccountStatusMark>✓</AccountStatusMark>
          <p className="font-bold text-content">Email verified successfully</p>
          <p className="text-content-muted">{message || "Redirecting you back…"}</p>
          <Button primary label="Continue" onClick={() => navigate(from, { replace: true })} className="w-full" />
        </div>
      ) : view === "invalid" ? (
        <div className="space-y-5 text-center" role="alert">
          <AccountStatusMark tone="danger">×</AccountStatusMark>
          <p className="font-bold text-content">Verification failed</p>
          <p className="text-content-muted">{message || "This verification link is invalid or has expired."}</p>
          <div className="flex flex-col gap-3 pt-2">
            <Button isLoading={resendMutation.isPending} primary label="Resend email" onClick={handleResend} loading="Sending..." className="w-full" />
            <Button label="Go back" onClick={() => navigate("/timeline")} className="w-full" />
          </div>
        </div>
      ) : (
        <div className="space-y-5 text-center">
          <AccountStatusMark tone="info">!</AccountStatusMark>
          <p className="font-bold text-content">Your account is not verified yet</p>
          <p className="text-content-muted">{message || "Please verify your email address to use account features such as creating and editing content."}</p>
          <p className="text-sm text-content-muted">We can send you a new verification email now.</p>
          <div className="flex flex-col gap-3 pt-2">
            <Button isLoading={resendMutation.isPending} primary label="Verify email" onClick={handleResend} loading="Sending..." className="w-full" />
            <Button label="Go back" onClick={() => navigate("/timeline")} className="w-full" />
          </div>
        </div>
      )}
    </AccountPanel>
  );
}
