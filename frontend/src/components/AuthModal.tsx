import { useState } from "react";
import { X, Mail, Lock, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({
  isOpen,
  onClose,
}: AuthModalProps) => {
  const { signIn, signUp } = useAuth();

  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const validateForm = () => {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address");
      return false;
    }

    if (password.length < 6) {
      setMessage(
        "Password must be at least 6 characters"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setMessage("");

    if (!validateForm()) return;

    setLoading(true);

    const result = isLogin
      ? await signIn(email, password)
      : await signUp(email, password);

    setLoading(false);

    setMessage(result.message);

    if (result.success) {
      if (isLogin) {
        setTimeout(() => {
          onClose();
        }, 800);
      }
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setMessage("");
    setPassword("");
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-[#0b1220] p-6 shadow-2xl">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15">
              <User className="text-blue-400" />
            </div>

            <h2 className="text-2xl font-bold text-white">
              {isLogin
                ? "Welcome Back"
                : "Create Account"}
            </h2>
          </div>

          <p className="text-sm text-slate-400">
            {isLogin
              ? "Sign in to continue to Mol Bhao"
              : "Create your account to continue"}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Email */}
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-10 pr-4 text-white outline-none transition focus:border-blue-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Minimum 6 characters"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-10 pr-4 text-white outline-none transition focus:border-blue-500"
              />
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`rounded-lg p-3 text-sm ${
                message.toLowerCase().includes("success")
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {message}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-500 py-3 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        {/* Switch */}
        <div className="mt-5 text-center text-sm text-slate-400">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            onClick={switchMode}
            className="ml-2 font-semibold text-blue-400 hover:text-blue-300"
          >
            {isLogin
              ? "Register"
              : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;