import { motion } from "framer-motion";

import {
  User,
  Mail,
  Bell,
  Settings,
  LogOut,
  Loader2,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "@/context/AuthContext";


const ProfilePage = () => {


  /* ==========================================
     AUTH
  ========================================== */

  const {
    user,
    signOut,
  } = useAuth();


  /* ==========================================
     NAVIGATION
  ========================================== */

  const navigate =
    useNavigate();


  /* ==========================================
     LOGOUT LOADING
  ========================================== */

  const [
    isSigningOut,
    setIsSigningOut,
  ] = useState(false);


  /* ==========================================
     USER DETAILS
  ========================================== */

  const email =
    user?.email || "";


  const displayName =
    user?.user_metadata?.full_name ||
    email.split("@")[0] ||
    "User";


  const initial =
    displayName
      .charAt(0)
      .toUpperCase();


  /* ==========================================
     SIGN OUT
  ========================================== */

  const handleSignOut =
    async () => {

      try {

        setIsSigningOut(
          true
        );

        await signOut();

        navigate(
          "/auth",
          {
            replace: true,
          }
        );

      } catch (error) {

        console.error(
          "Sign out failed:",
          error
        );

      } finally {

        setIsSigningOut(
          false
        );

      }

    };


  return (

    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        max-w-3xl
        mx-auto
        px-4
        py-8
      "
    >


      {/* ==========================================
          PROFILE HEADER
      ========================================== */}

      <div
        className="
          p-6
          sm:p-8
          rounded-2xl
          bg-card
          border
          shadow-sm
          mb-6
        "
      >

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            gap-5
          "
        >


          {/* PROFILE AVATAR */}

          <div
            className="
              w-20
              h-20
              rounded-full
              bg-primary
              text-primary-foreground
              flex
              items-center
              justify-center
              text-3xl
              font-bold
              flex-shrink-0
            "
          >
            {initial}
          </div>


          {/* USER DETAILS */}

          <div
            className="
              min-w-0
            "
          >

            <h1
              className="
                text-2xl
                sm:text-3xl
                font-bold
                truncate
              "
            >
              {displayName}
            </h1>


            <div
              className="
                flex
                items-center
                gap-2
                mt-2
                text-muted-foreground
                min-w-0
              "
            >

              <Mail
                size={17}
                className="
                  flex-shrink-0
                "
              />

              <span
                className="
                  truncate
                "
              >
                {email}
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* ==========================================
          STATS
      ========================================== */}

      <div
        className="
          grid
          grid-cols-3
          gap-3
          sm:gap-4
          mb-8
        "
      >

        {[
          {
            label: "Comparisons",
            value: "0",
          },
          {
            label: "Saved",
            value: "0",
          },
          {
            label: "Alerts",
            value: "0",
          },
        ].map(
          (stat) => (

            <div
              key={
                stat.label
              }
              className="
                p-4
                rounded-2xl
                bg-card
                border
                text-center
              "
            >

              <p
                className="
                  text-2xl
                  font-bold
                  text-primary
                "
              >
                {stat.value}
              </p>

              <p
                className="
                  text-xs
                  text-muted-foreground
                  mt-1
                "
              >
                {stat.label}
              </p>

            </div>

          )
        )}

      </div>


      {/* ==========================================
          MENU
      ========================================== */}

      <div
        className="
          space-y-2
        "
      >


        {/* ==========================================
            EDIT PROFILE
        ========================================== */}

        <Link
          to="/profile/edit"
          className="
            flex
            items-center
            gap-3
            p-4
            rounded-xl
            bg-card
            border
            hover:shadow-md
            hover:border-primary/30
            transition-all
          "
        >

          <User
            size={20}
            className="
              text-muted-foreground
            "
          />

          <div
            className="
              flex-1
            "
          >

            <span
              className="
                font-medium
                block
              "
            >
              Edit Profile
            </span>

            <span
              className="
                text-xs
                text-muted-foreground
              "
            >
              Name, phone number and addresses
            </span>

          </div>

        </Link>



        {/* ==========================================
            NOTIFICATIONS
        ========================================== */}

        <button
          type="button"
          className="
            flex
            items-center
            gap-3
            p-4
            rounded-xl
            bg-card
            border
            hover:shadow-md
            hover:border-primary/30
            transition-all
            w-full
            text-left
          "
        >

          <Bell
            size={20}
            className="
              text-muted-foreground
            "
          />

          <div
            className="
              flex-1
            "
          >

            <span
              className="
                font-medium
                block
              "
            >
              Notifications
            </span>

            <span
              className="
                text-xs
                text-muted-foreground
              "
            >
              Manage price alerts and updates
            </span>

          </div>

        </button>


        {/* ==========================================
            SETTINGS
        ========================================== */}

        <button
          type="button"
          className="
            flex
            items-center
            gap-3
            p-4
            rounded-xl
            bg-card
            border
            hover:shadow-md
            hover:border-primary/30
            transition-all
            w-full
            text-left
          "
        >

          <Settings
            size={20}
            className="
              text-muted-foreground
            "
          />

          <div
            className="
              flex-1
            "
          >

            <span
              className="
                font-medium
                block
              "
            >
              Settings
            </span>

            <span
              className="
                text-xs
                text-muted-foreground
              "
            >
              Manage your account preferences
            </span>

          </div>

        </button>


        {/* ==========================================
            SIGN OUT
        ========================================== */}

        <button
          type="button"
          onClick={
            handleSignOut
          }
          disabled={
            isSigningOut
          }
          className="
            flex
            items-center
            gap-3
            p-4
            rounded-xl
            bg-card
            border
            hover:shadow-md
            hover:bg-destructive/5
            transition-all
            w-full
            text-destructive
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >

          {
            isSigningOut

              ? (

                <Loader2
                  size={20}
                  className="
                    animate-spin
                  "
                />

              )

              : (

                <LogOut
                  size={20}
                />

              )
          }


          <div
            className="
              flex-1
              text-left
            "
          >

            <span
              className="
                font-medium
                block
              "
            >
              {
                isSigningOut
                  ? "Signing Out..."
                  : "Sign Out"
              }
            </span>


            {
              !isSigningOut && (

                <span
                  className="
                    text-xs
                    text-muted-foreground
                  "
                >
                  Sign out of your Mol Bhao account
                </span>

              )
            }

          </div>

        </button>

      </div>

    </motion.div>

  );

};


export default ProfilePage;