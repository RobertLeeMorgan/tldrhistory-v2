import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useRegisterMutation } from "../../src/hooks/useAuthMutations";
import { registerSchema } from "../../src/schemas/registerSchema";
import PageContainer from "../../src/components/ui/PageContainer";
import Button from "../../src/components/ui/Button";
import { useToast } from "../../src/context/ToastContext";
import { useAuth } from "../../src/context/AuthContext";
import type { Route } from "./+types/register";
import { buildMeta } from "../../src/lib/seo";

export function meta({}: Route.MetaArgs) {
  return buildMeta({
    title: "Register | TLDR History",
    description:
      "Create a TLDR History account to save timelines, personalize your experience, and access member features.",
    path: "/register",
    robots: "noindex, nofollow",
    type: "website",
  });
}

export default function Register() {
  const navigate = useNavigate();
  const mutation = useRegisterMutation();
  const { addToast } = useToast();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof form, string>>
  >({});

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof typeof form, string>> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field) fieldErrors[field as keyof typeof form] = issue.message;
      });

      setErrors(fieldErrors);
      return;
    }

    mutation.mutate(
      {
        email: result.data.email,
        username: result.data.username,
        password: result.data.password,
      },
      {
        onSuccess: (data) => {
          login(
            data.register.token,
            {
              ...data.register.user,
              emailVerifiedAt: data.register.user.emailVerifiedAt ?? null,
            },
            true,
          );

          addToast({
            type: "success",
            message: "Registration successful! Please verify your email.",
          });

          navigate("/timeline", {
            replace: true,
            state: { email: data.register.user.email },
          });
        },
        onError: (error) => {
          if (error instanceof Error) {
            const message = error.message.toLowerCase();

            if (message.includes("email")) {
              setErrors({ email: "That email is already in use" });
              return;
            }

            if (message.includes("username")) {
              setErrors({ username: "That username is already taken" });
              return;
            }
          }

          addToast({
            type: "error",
            message: "Could not create your account. Please try again.",
          });
        },
      },
    );
  };

  return (
    <PageContainer>
      <div className="p-4">
        <div className="card border border-stone-900/70 bg-gradient-to-br from-stone-800 to-stone-900 w-full max-w-sm shadow-stone-950/40 shadow-xl">
          <form className="card-body text-center" onSubmit={handleRegister}>
            <h1 className="text-4xl font-serif font-semibold tracking-wide text-stone-200 pb-2">
              Register now!
            </h1>

            <p className="hidden sm:block pb-6 text-stone-300/90 lg:text-lg">
              Create an account to continue.
            </p>
            <label className="input input-bordered flex items-center gap-2 w-full bg-stone-900/93 border-stone-600">
              <input
                name="username"
                type="text"
                className="text-stone-200 caret-stone-200"
                aria-label="username"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                autoComplete="on"
              />
            </label>
            {errors.username && (
              <p className="text-error text-xs">{errors.username}</p>
            )}

            <label className="input input-bordered flex items-center gap-2 w-full bg-stone-900/93 border-stone-600">
              <input
                name="email"
                type="email"
                className="text-stone-200 caret-stone-200"
                aria-label="email"
                placeholder="mail@site.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="on"
              />
            </label>
            {errors.email && (
              <p className="text-error text-xs">{errors.email}</p>
            )}

            <label className="input input-bordered flex items-center gap-2 w-full bg-stone-900/93 border-stone-600">
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

            <label className="input input-bordered flex items-center gap-2 w-full bg-stone-900/93 border-stone-600 mb-4">
              <input
                name="confirmPassword"
                type="password"
                className="text-stone-200 caret-stone-200"
                aria-label="confirm password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
              />
            </label>

            {errors.confirmPassword && (
              <p className="text-error text-xs">{errors.confirmPassword}</p>
            )}

            <label
              htmlFor="accept"
              className="flex items-start gap-3 text-stone-300 cursor-pointer mb-4"
            >
              <input
                id="accept"
                type="checkbox"
                required
                className="mt-1 shrink-0 checkbox rounded border-stone-600 inset-shadow-none bg-stone-900 checked:border-gold checked:bg-stone-950 checked:text-gold"
              />

              <span className="text-sm leading-6 text-start">
                I have read and agree to the{" "}
                <Link
                  to="/terms"
                  className="text-gold underline underline-offset-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  Terms of Service
                </Link>{" "}
                and the{" "}
                <Link
                  to="/privacy"
                  className="text-gold underline underline-offset-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            <Button
              isLoading={mutation.isPending}
              primary
              label="Register"
              type="submit"
              loading="Registering..."
            />
          </form>
        </div>{" "}
      </div>
    </PageContainer>
  );
}
