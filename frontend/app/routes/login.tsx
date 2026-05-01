import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useLoginMutation } from "../../src/hooks/useAuthMutations";
import { loginSchema } from "../../src/schemas/loginSchema";
import Button from "../../src/components/ui/Button";
import PageContainer from "../../src/components/ui/PageContainer";
import { useAuth } from "../../src/context/AuthContext";
import { useToast } from "../../src/context/ToastContext";
import type { Route } from "./+types/login";
import { buildMeta } from "../../src/lib/seo";

export function meta({}: Route.MetaArgs) {
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
    <PageContainer>
      <div className="p-4">
        <div className="card border border-stone-900/70 bg-gradient-to-br from-stone-800 to-stone-900 w-full max-w-sm shadow-stone-950/40 shadow-xl text-center">
          <form className="card-body" onSubmit={handleLogin}>
            <h1 className="text-4xl font-serif font-semibold tracking-wide text-stone-200 pb-2">
              Welcome Back!
            </h1>

            <p className="hidden sm:block pb-6 text-stone-300/90 lg:text-lg">
              Login to continue.
            </p>
            <label className="input input-bordered flex items-center gap-2 bg-stone-900/93 border-stone-600 w-full">
              <input
                name="email"
                type="email"
                className="text-stone-200 caret-stone-200"
                placeholder="mail@site.com"
                aria-label="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="on"
              />
            </label>
            {errors.email && (
              <p className="text-error text-xs">{errors.email}</p>
            )}

            <label className="input input-bordered flex items-center gap-2 bg-stone-900/93 border-stone-600 w-full">
              <input
                name="password"
                type="password"
                className="text-stone-200 caret-stone-200"
                aria-label="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </label>
            {errors.password && (
              <p className="text-error text-xs">{errors.password}</p>
            )}

            <div className="mb-4 text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-gold underline underline-offset-2"
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
            />
          </form>
        </div>
      </div>
    </PageContainer>
  );
}
