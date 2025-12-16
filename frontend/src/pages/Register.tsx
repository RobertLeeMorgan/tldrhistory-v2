import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../hooks/useAuthMutations";
import { registerSchema } from "../schemas/registerSchema";

export default function Register() {
  const navigate = useNavigate();
  const mutation = useRegisterMutation();

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
        onSuccess: () => navigate("/"),
        onError: () => {
          setErrors({ email: "Registration failed" });
        },
      }
    );
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Register now!</h1>
          <p className="py-6">Create an account to continue.</p>
        </div>

        <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
          <form className="card-body" onSubmit={handleRegister}>
            {/* Username */}
            <label className="input input-bordered flex items-center gap-2">
              <input
                name="username"
                type="text"
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
            <label className="input input-bordered flex items-center gap-2">
              <input
                name="email"
                type="email"
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
            <label className="input input-bordered flex items-center gap-2">
              <input
                name="password"
                type="password"
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
            <label className="input input-bordered flex items-center gap-2">
              <input
                name="confirmPassword"
                type="password"
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

            <button
              className="btn btn-neutral mt-4"
              disabled={mutation.isPending}
              aria-label="register"
            >
              {mutation.isPending ? (
                <>
                  <span className="loading loading-spinner loading-md"></span>
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
