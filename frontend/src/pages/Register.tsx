import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../hooks/useAuthMutations";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const mutation = useRegisterMutation();

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    mutation.mutate(
      { email: form.email, username: form.username, password: form.password },
      {
        onSuccess: () => navigate("/"),
        onError: (err: any) => {
          setError(err.response?.data?.errors?.[0]?.message || "Registration failed");
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

        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body" onSubmit={handleRegister}>
            {error && <div className="text-red-500">{error}</div>}

            <fieldset className="fieldset">
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <label className="label mt-2">Username</label>
              <input
                className="input"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />

              <label className="label mt-2">Password</label>
              <input
                type="password"
                className="input"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />

              <label className="label mt-2">Confirm Password</label>
              <input
                type="password"
                className="input"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
              />

              <button
                className="btn btn-neutral mt-4"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Registering..." : "Register"}
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}
