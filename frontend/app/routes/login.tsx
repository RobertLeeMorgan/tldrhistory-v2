import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useLoginMutation } from "../../src/hooks/useAuthMutations";
import { loginSchema } from "../../src/schemas/loginSchema";
import Button from "../../src/components/ui/Button";
import AccountPanel from "../../src/components/ui/AccountPanel";
import FormField from "../../src/components/form/FormField";
import { useAuth } from "../../src/context/AuthContext";
import { useToast } from "../../src/context/ToastContext";
import { buildMeta } from "../../src/lib/seo";

export function meta() {
  return buildMeta({
    title: "Login | TLDR History",
    description:
      "Log in to your TLDR History account to access saved timelines, writing tools, and account features.",
    path: "/login",
    robots: "noindex, nofollow",
    type: "website",
  });
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { addToast } = useToast();
  const mutation = useLoginMutation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof form, string>>
  >({});

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = Object.fromEntries(
        result.error.issues.map((issue) => [issue.path[0], issue.message]),
      ) as Partial<Record<keyof typeof form, string>>;
      setErrors(fieldErrors);
      return;
    }

    const from = (location.state as { from?: string } | null)?.from || "/";

    mutation.mutate(result.data, {
      onSuccess: (data) => {
        const authUser = {
          id: data.login.user.id,
          username: data.login.user.username,
          role: data.login.user.role,
          emailVerifiedAt: data.login.user.emailVerifiedAt ?? null,
        };

        login(data.login.token, authUser, true);

        if (data.login.needsEmailVerification) {
          addToast({
            type: "success",
            message: "Please verify your email address.",
          });

          navigate(from, {
            replace: true,
            state: { email: data.login.user.email, from },
          });
          return;
        }

        navigate(from, { replace: true });
      },
      onError: () => setErrors({ password: "Invalid email or password" }),
    });
  };

  return (
    <AccountPanel title="Welcome back" description="Log in to continue exploring and contributing to the historical atlas.">
          <form className="space-y-5" onSubmit={handleLogin} noValidate>
            <FormField
                label="Email address"
                name="email"
                type="email"
                placeholder="mail@site.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
                error={errors.email}
              />
            <FormField
                label="Password"
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete="current-password"
                error={errors.password}
              />

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm font-bold text-accent underline decoration-control underline-offset-4 hover:text-content"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              isLoading={mutation.isPending}
              primary
              label="Login"
              type="submit"
              loading="Logging In..."
              className="w-full"
            />
          </form>
    </AccountPanel>
  );
}
