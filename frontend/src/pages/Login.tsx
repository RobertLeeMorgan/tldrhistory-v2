import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../hooks/useAuthMutations";
import { loginSchema } from "../schemas/loginSchema";
import Button from "../components/ui/Button";
import PageContainer from "../components/ui/PageContainer";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
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

    const from = (location.state as { from?: Location })?.from?.pathname || "/";

    mutation.mutate(result.data, {
      onSuccess: (data) => {
        login(data.login.token, data.login.user, true);
        navigate(from, { replace: true });
      },
      onError: () => setErrors({ password: "Invalid email or password" }),
    });
  };

  return (
    <PageContainer>
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="relative max-w-md text-center lg:text-left">
          <div className="absolute inset-y-[-24px] inset-x-[-32px] -z-10 rounded-3xl bg-gradient-to-r from-black/55 via-black/35 to-black/10 blur-xl" />

          <h1 className="text-5xl font-serif font-semibold tracking-wide text-stone-200">
            Welcome back!
          </h1>

          <p className="hidden sm:block py-6 text-stone-300 font-medium lg:text-lg">
            Log in to continue.
          </p>
        </div>

        <div className="card border border-stone-900/70 bg-gradient-to-br from-stone-800 to-stone-900 w-full max-w-sm shadow-stone-950/40 shadow-xl">
          <form className="card-body" onSubmit={handleLogin}>
            {/* Email */}
            <label className="input input-bordered flex items-center gap-2 bg-stone-900/93 border-stone-600">
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

            {/* Password */}
            <label className="input input-bordered flex items-center gap-2 bg-stone-900/93 border-stone-600 mb-4">
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
