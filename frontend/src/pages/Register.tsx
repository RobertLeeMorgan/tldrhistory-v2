import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../hooks/useAuthMutations";
import { registerSchema } from "../schemas/registerSchema";
import PageContainer from "../components/ui/PageContainer";
import Button from "../components/ui/Button";
import { useToast } from "../context/ToastContext";

export default function Register() {
  const navigate = useNavigate();
  const mutation = useRegisterMutation();
  const { addToast } = useToast();

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
        onSuccess: () => {
          addToast({
            type: "success",
            message: "Registration successful! Please log in.",
          });
          navigate("/login");
        },
        onError: () => {
          setErrors({ email: "Registration failed" });
        },
      },
    );
  };

  return (
    <PageContainer>
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="relative max-w-md text-center lg:text-left">
          <div className="absolute inset-y-[-24px] inset-x-[-32px] -z-10 rounded-3xl bg-gradient-to-r from-black/55 via-black/35 to-black/10 blur-xl" />

          <h1 className="text-5xl font-serif font-semibold tracking-wide text-stone-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]">
            Register now!
          </h1>

          <p className="hidden sm:block py-6 text-stone-300 font-medium lg:text-lg drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]">
            Create an account to continue.
          </p>
        </div>

        <div className="card border border-stone-900/70 bg-gradient-to-br from-stone-800 to-stone-900 w-full max-w-sm shadow-stone-950/40 shadow-xl">
          <form className="card-body" onSubmit={handleRegister}>
            {/* Username */}
            <label className="input input-bordered flex items-center gap-2 bg-stone-900/93 border-stone-600">
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

            {/* Email */}
            <label className="input input-bordered flex items-center gap-2 bg-stone-900/93 border-stone-600">
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

            {/* Password */}
            <label className="input input-bordered flex items-center gap-2 bg-stone-900/93 border-stone-600">
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

            {/* Confirm Password */}
            <label className="input input-bordered flex items-center gap-2 bg-stone-900/93 border-stone-600 mb-4">
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

            <Button
              isLoading={mutation.isPending}
              primary
              label="Register"
              type="submit"
              loading="Registering..."
            />
          </form>
        </div>
      </div>
    </PageContainer>
  );
}
