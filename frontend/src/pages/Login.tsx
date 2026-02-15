import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../hooks/useAuthMutations";
import { loginSchema } from "../schemas/loginSchema";

export default function Login() {
  const navigate = useNavigate();
  const mutation = useLoginMutation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof form, string>>
  >({});

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof typeof form, string>> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field) fieldErrors[field as keyof typeof form] = issue.message;
      });

      setErrors(fieldErrors);
      return;
    }

    mutation.mutate(result.data, {
      onSuccess: () => navigate("/"),
      onError: () => {
        setErrors({ password: "Invalid email or password" });
      },
    });
  };

  return (
    <div className="hero bg-zinc-600 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Welcome back!</h1>
          <p className="py-6">Log in to continue.</p>
        </div>

        <div className="card bg-neutral-900 w-full max-w-sm shadow-2xl">
          <form className="card-body" onSubmit={handleLogin}>
            {/* Email */}
            <label className="input input-bordered flex items-center gap-2 bg-neutral-900">
              <input
                name="email"
                type="email"
                className="text-neutral-200 caret-neutral-200"
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
            <label className="input input-bordered flex items-center gap-2 bg-neutral-900">
              <input
                name="password"
                type="password"
                className="text-neutral-200 caret-neutral-200"

                aria-label="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </label>
            {errors.password && (
              <p className="text-error text-xs">{errors.password}</p>
            )}

            <button
              className="btn bg-indigo-700 hover:bg-indigo-600 transition-colors duration-400 mt-4 rounded-lg "
              disabled={mutation.isPending}
              aria-label="login"
            >
              {mutation.isPending ? (
                <>
                  <span className="loading loading-spinner loading-md"></span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
