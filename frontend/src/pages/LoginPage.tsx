import {
  useState,
  type FormEvent,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogIn,
  Loader2,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

const LoginPage = () => {

  const navigate =
    useNavigate();

  const {
    signIn,
  } = useAuth();


  const [
    email,
    setEmail,
  ] = useState("");


  const [
    password,
    setPassword,
  ] = useState("");


  const [
    showPassword,
    setShowPassword,
  ] = useState(false);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const handleSubmit = async (
    e: FormEvent
  ) => {

    e.preventDefault();

    setError("");


    if (
      !email.trim()
    ) {

      setError(
        "Please enter your email address."
      );

      return;

    }


    if (
      !/\S+@\S+\.\S+/.test(
        email
      )
    ) {

      setError(
        "Please enter a valid email address."
      );

      return;

    }


    if (
      !password
    ) {

      setError(
        "Please enter your password."
      );

      return;

    }


    try {

      setLoading(true);

      const result =
        await signIn(
          email.trim(),
          password
        );


      if (
        !result.success
      ) {

        setError(
          result.message
        );

        return;

      }


      navigate(
        "/home",
        {
          replace: true,
        }
      );

    }

    finally {

      setLoading(
        false
      );

    }

  };


  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        px-4
        py-10
        bg-slate-50
        dark:bg-slate-950
      "
    >

      <div
        className="
          w-full
          max-w-md
          bg-white
          dark:bg-slate-900
          border
          border-slate-200
          dark:border-slate-800
          rounded-2xl
          shadow-xl
          p-6
          sm:p-8
        "
      >

        {/* Logo */}

        <Link
          to="/home"
          className="
            block
            text-center
            mb-8
          "
        >

          <span
            className="
              text-3xl
              font-extrabold
              tracking-tight
            "
          >

            <span
              className="
                text-blue-600
                dark:text-blue-400
              "
            >
              Mol
            </span>

            <span
              className="
                text-slate-900
                dark:text-white
              "
            >
              Bhao
            </span>

          </span>

        </Link>


        <h1
          className="
            text-2xl
            font-bold
            text-slate-900
            dark:text-white
          "
        >
          Welcome back
        </h1>

        <p
          className="
            mt-2
            text-sm
            text-slate-500
            dark:text-slate-400
          "
        >
          Sign in to continue shopping and comparing prices.
        </p>


        {/* Error */}

        {
          error && (

            <div
              className="
                mt-5
                rounded-lg
                bg-red-50
                dark:bg-red-950/30
                border
                border-red-200
                dark:border-red-900
                px-4
                py-3
                text-sm
                text-red-600
                dark:text-red-400
              "
            >
              {error}
            </div>

          )
        }


        <form
          onSubmit={
            handleSubmit
          }
          className="
            mt-6
            space-y-5
          "
        >

          {/* Email */}

          <div>

            <label
              className="
                block
                mb-2
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-200
              "
            >
              Email address
            </label>

            <div
              className="
                relative
              "
            >

              <Mail
                size={19}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="you@example.com"
                className="
                  w-full
                  h-12
                  pl-11
                  pr-4
                  rounded-xl
                  border
                  border-slate-300
                  dark:border-slate-700
                  bg-white
                  dark:bg-slate-800
                  text-slate-900
                  dark:text-white
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/20
                "
              />

            </div>

          </div>


          {/* Password */}

          <div>

            <label
              className="
                block
                mb-2
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-200
              "
            >
              Password
            </label>

            <div
              className="
                relative
              "
            >

              <Lock
                size={19}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="Enter your password"
                className="
                  w-full
                  h-12
                  pl-11
                  pr-12
                  rounded-xl
                  border
                  border-slate-300
                  dark:border-slate-700
                  bg-white
                  dark:bg-slate-800
                  text-slate-900
                  dark:text-white
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/20
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                  hover:text-slate-700
                  dark:hover:text-white
                "
              >

                {
                  showPassword
                    ? <EyeOff size={19} />
                    : <Eye size={19} />
                }

              </button>

            </div>

          </div>


          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              h-12
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-semibold
              transition-colors
              disabled:opacity-60
              disabled:cursor-not-allowed
            "
          >

            {
              loading

                ? (
                  <>
                    <Loader2
                      size={20}
                      className="
                        animate-spin
                      "
                    />
                    Signing in...
                  </>
                )

                : (
                  <>
                    <LogIn
                      size={20}
                    />
                    Sign In
                  </>
                )
            }

          </button>

        </form>


        <p
          className="
            mt-6
            text-center
            text-sm
            text-slate-600
            dark:text-slate-400
          "
        >
          Don't have an account?

          {" "}

          <Link
            to="/register"
            className="
              font-semibold
              text-blue-600
              hover:text-blue-700
            "
          >
            Create account
          </Link>

        </p>

      </div>

    </div>

  );

};

export default LoginPage;