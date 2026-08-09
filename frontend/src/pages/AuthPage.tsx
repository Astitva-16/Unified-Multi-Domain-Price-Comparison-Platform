import {
  useState,
} from "react";

import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  UserPlus,
  LogIn,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";


const AuthPage = () => {

  const navigate =
    useNavigate();

  const {
    user,
    loading,
    signUp,
    signIn,
  } = useAuth();


  const [
    isLogin,
    setIsLogin,
  ] = useState(true);


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
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);


  const [
    message,
    setMessage,
  ] = useState("");


  const [
    error,
    setError,
  ] = useState("");


  /* =========================================
     LOADING
  ========================================= */

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-slate-50
          dark:bg-slate-950
        "
      >

        <Loader2
          className="
            animate-spin
            text-blue-600
          "
          size={40}
        />

      </div>

    );

  }


  /* =========================================
     ALREADY LOGGED IN
  ========================================= */

  if (user) {

    return (
      <Navigate
        to="/home"
        replace
      />
    );

  }


  /* =========================================
     EMAIL VALIDATION
  ========================================= */

  const isValidEmail = (
    value: string
  ) => {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      value
    );

  };


  /* =========================================
     SUBMIT
  ========================================= */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();


    setError("");
    setMessage("");


    const cleanEmail =
      email.trim();


    /* Email check */

    if (
      !isValidEmail(
        cleanEmail
      )
    ) {

      setError(
        "Please enter a valid email address."
      );

      return;

    }


    /* Password check */

    if (
      password.length < 6
    ) {

      setError(
        "Password must be at least 6 characters long."
      );

      return;

    }


    try {

      setIsSubmitting(
        true
      );


      const result =
        isLogin

          ? await signIn(
              cleanEmail,
              password
            )

          : await signUp(
              cleanEmail,
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


      setMessage(
        result.message
      );


      /* LOGIN SUCCESS */

      if (isLogin) {

        setTimeout(
          () => {

            navigate(
              "/home",
              {
                replace: true,
              }
            );

          },
          500
        );

      }


      /* REGISTER SUCCESS */

      else {

        setEmail("");
        setPassword("");


        /*
          Supabase email confirmation ON hai
          to user ko email verify karna padega.
        */

        setMessage(
          "Account created successfully! Please check your email and verify your account."
        );

      }

    }

    catch {

      setError(
        "Something went wrong. Please try again."
      );

    }

    finally {

      setIsSubmitting(
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


        {/* LOGO */}

        <div
          className="
            text-center
            mb-8
          "
        >

          <h1
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

          </h1>


          <p
            className="
              mt-2
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >

            {
              isLogin
                ? "Sign in to continue shopping"
                : "Create your account to get started"
            }

          </p>

        </div>


        {/* SUCCESS MESSAGE */}

        {
          message && (

            <div
              className="
                mb-5
                rounded-lg
                border
                border-green-200
                bg-green-50
                px-4
                py-3
                text-sm
                text-green-700
                dark:border-green-900
                dark:bg-green-950/40
                dark:text-green-400
              "
            >

              {message}

            </div>

          )
        }


        {/* ERROR MESSAGE */}

        {
          error && (

            <div
              className="
                mb-5
                rounded-lg
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-sm
                text-red-700
                dark:border-red-900
                dark:bg-red-950/40
                dark:text-red-400
              "
            >

              {error}

            </div>

          )
        }


        {/* FORM */}

        <form
          onSubmit={
            handleSubmit
          }
          className="
            space-y-5
          "
        >


          {/* EMAIL */}

          <div>

            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
                dark:text-slate-200
              "
            >
              Email Address
            </label>


            <div
              className="
                relative
              "
            >

              <Mail
                size={20}
                className="
                  absolute
                  left-4
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
                placeholder="Enter your email"
                className="
                  w-full
                  h-12
                  rounded-xl
                  border
                  border-slate-300
                  dark:border-slate-700
                  bg-white
                  dark:bg-slate-950
                  pl-11
                  pr-4
                  text-slate-900
                  dark:text-white
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/20
                "
                required
              />

            </div>

          </div>


          {/* PASSWORD */}

          <div>

            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
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
                size={20}
                className="
                  absolute
                  left-4
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
                placeholder="Minimum 6 characters"
                className="
                  w-full
                  h-12
                  rounded-xl
                  border
                  border-slate-300
                  dark:border-slate-700
                  bg-white
                  dark:bg-slate-950
                  pl-11
                  pr-12
                  text-slate-900
                  dark:text-white
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/20
                "
                required
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
                  p-1
                  text-slate-400
                  hover:text-blue-600
                "
              >

                {
                  showPassword

                    ? (
                      <EyeOff
                        size={20}
                      />
                    )

                    : (
                      <Eye
                        size={20}
                      />
                    )
                }

              </button>

            </div>

          </div>


          {/* SUBMIT */}

          <button
            type="submit"
            disabled={
              isSubmitting
            }
            className="
              w-full
              h-12
              rounded-xl
              bg-blue-600
              text-white
              font-bold
              flex
              items-center
              justify-center
              gap-2
              hover:bg-blue-700
              disabled:opacity-60
              disabled:cursor-not-allowed
              transition-colors
            "
          >

            {
              isSubmitting

                ? (
                  <>

                    <Loader2
                      size={20}
                      className="
                        animate-spin
                      "
                    />

                    Please wait...

                  </>
                )

                : isLogin

                  ? (
                    <>

                      <LogIn
                        size={20}
                      />

                      Sign In

                    </>
                  )

                  : (
                    <>

                      <UserPlus
                        size={20}
                      />

                      Create Account

                    </>
                  )
            }

          </button>

        </form>


        {/* SWITCH LOGIN / REGISTER */}

        <div
          className="
            mt-6
            text-center
            text-sm
            text-slate-500
            dark:text-slate-400
          "
        >

          {
            isLogin
              ? "Don't have an account?"
              : "Already have an account?"
          }


          <button
            type="button"
            onClick={() => {

              setIsLogin(
                !isLogin
              );

              setError("");
              setMessage("");
              setPassword("");

            }}
            className="
              ml-2
              font-bold
              text-blue-600
              hover:text-blue-700
              dark:text-blue-400
            "
          >

            {
              isLogin
                ? "Create one"
                : "Sign in"
            }

          </button>

        </div>


        {/* BACK HOME */}

        <button
          type="button"
          onClick={() =>
            navigate("/home")
          }
          className="
            mt-6
            w-full
            text-center
            text-sm
            text-slate-500
            hover:text-blue-600
            dark:text-slate-400
            dark:hover:text-blue-400
          "
        >

          ← Back to Home

        </button>

      </div>

    </div>

  );

};


export default AuthPage;