import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useRegisterMutation } from "../../src/hooks/useAuthMutations";
import { registerSchema } from "../../src/schemas/registerSchema";
import AccountPanel from "../../src/components/ui/AccountPanel";
import FormField from "../../src/components/form/FormField";
import Button from "../../src/components/ui/Button";
import { useToast } from "../../src/context/ToastContext";
import { useAuth } from "../../src/context/AuthContext";
import { buildMeta } from "../../src/lib/seo";

export function meta() {
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
    <AccountPanel title="Create your account" description="Save timeline views and contribute carefully sourced history.">
          <form className="space-y-5" onSubmit={handleRegister} noValidate>
            <FormField
                label="Username"
                name="username"
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                autoComplete="username"
                error={errors.username}
              />
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
                autoComplete="new-password"
                error={errors.password}
              />
            <FormField
                label="Confirm password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                autoComplete="new-password"
                error={errors.confirmPassword}
              />

            <label
              htmlFor="accept"
              className="flex cursor-pointer items-start gap-3 text-content-muted"
            >
              <input
                id="accept"
                type="checkbox"
                required
                className="checkbox mt-1 shrink-0 rounded border-control [--chkbg:var(--color-accent)] [--chkfg:var(--color-on-accent)]"
              />

              <span className="text-sm leading-6 text-start">
                I have read and agree to the{" "}
                <Link
                  to="/terms"
                  className="font-bold text-accent underline underline-offset-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  Terms of Service
                </Link>{" "}
                and the{" "}
                <Link
                  to="/privacy"
                  className="font-bold text-accent underline underline-offset-4"
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
              className="w-full"
            />
          </form>
    </AccountPanel>
  );
}
