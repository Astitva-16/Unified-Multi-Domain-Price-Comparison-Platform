import { motion } from "framer-motion";

import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  Save,
  Loader2,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";


const EditProfilePage = () => {

  /* ==========================================
     AUTH
  ========================================== */

  const {
    user,
  } = useAuth();


  /* ==========================================
     NAVIGATION
  ========================================== */

  const navigate =
    useNavigate();


  /* ==========================================
     USER DETAILS
  ========================================== */

  const email =
    user?.email || "";


  /* ==========================================
     FORM STATES
  ========================================== */

  const [
    fullName,
    setFullName,
  ] = useState("");


  const [
    phone,
    setPhone,
  ] = useState("");


  const [
    address,
    setAddress,
  ] = useState("");


  const [
    city,
    setCity,
  ] = useState("");


  const [
    state,
    setState,
  ] = useState("");


  const [
    pincode,
    setPincode,
  ] = useState("");


  const [
    preferredAddress,
    setPreferredAddress,
  ] = useState("Home");


  /* ==========================================
     LOADING STATES
  ========================================== */

  const [
    isLoadingProfile,
    setIsLoadingProfile,
  ] = useState(true);


  const [
    isSaving,
    setIsSaving,
  ] = useState(false);


  /* ==========================================
     LOAD PROFILE FROM SUPABASE
  ========================================== */

  useEffect(() => {

    const loadProfile =
      async () => {

        if (!user) {

          setIsLoadingProfile(
            false
          );

          return;

        }


        try {

          const {
            data,
            error,
          } =
            await supabase
              .from("profiles")
              .select(`
                full_name,
                phone,
                address,
                city,
                state,
                pincode,
                preferred_address
              `)
              .eq(
                "id",
                user.id
              )
              .maybeSingle();


          if (error) {

            throw error;

          }


          /* ==========================================
             IF PROFILE ALREADY EXISTS
          ========================================== */

          if (data) {

            setFullName(
              data.full_name || ""
            );

            setPhone(
              data.phone || ""
            );

            setAddress(
              data.address || ""
            );

            setCity(
              data.city || ""
            );

            setState(
              data.state || ""
            );

            setPincode(
              data.pincode || ""
            );

            setPreferredAddress(
              data.preferred_address ||
              "Home"
            );

          }


          /* ==========================================
             IF PROFILE DOES NOT EXIST
             USE AUTH METADATA AS DEFAULT
          ========================================== */

          else {

            setFullName(
              user.user_metadata?.full_name ||
              ""
            );

            setPhone(
              user.user_metadata?.phone ||
              ""
            );

          }

        }

        catch (error) {

          console.error(
            "Error loading profile:",
            error
          );

          alert(
            "Could not load your profile."
          );

        }

        finally {

          setIsLoadingProfile(
            false
          );

        }

      };


    loadProfile();

  }, [
    user,
  ]);


  /* ==========================================
     SAVE PROFILE TO SUPABASE
  ========================================== */

  const handleSave =
    async () => {

      if (!user) {

        alert(
          "You must be signed in to save your profile."
        );

        return;

      }


      if (
        !fullName.trim()
      ) {

        alert(
          "Please enter your full name."
        );

        return;

      }


      try {

        setIsSaving(
          true
        );


        const {
          error,
        } =
          await supabase
            .from("profiles")
            .upsert(
              {
                id:
                  user.id,

                full_name:
                  fullName.trim(),

                phone:
                  phone.trim(),

                address:
                  address.trim(),

                city:
                  city.trim(),

                state:
                  state.trim(),

                pincode:
                  pincode.trim(),

                preferred_address:
                  preferredAddress,

                updated_at:
                  new Date()
                    .toISOString(),
              },
              {
                onConflict:
                  "id",
              }
            );


        if (error) {

          throw error;

        }


        /* ==========================================
           ALSO UPDATE AUTH METADATA
        ========================================== */

        const {
          error:
            authError,
        } =
          await supabase.auth.updateUser(
            {
              data: {
                full_name:
                  fullName.trim(),

                phone:
                  phone.trim(),
              },
            }
          );


        if (authError) {

          console.error(
            "Auth metadata update error:",
            authError
          );

        }


        alert(
          "Profile saved successfully!"
        );


        navigate(
          "/profile"
        );

      }

      catch (error) {

        console.error(
          "Error saving profile:",
          error
        );


        alert(
          error instanceof Error
            ? error.message
            : "Failed to save profile."
        );

      }

      finally {

        setIsSaving(
          false
        );

      }

    };


  /* ==========================================
     PROFILE LOADING SCREEN
  ========================================== */

  if (
    isLoadingProfile
  ) {

    return (

      <div
        className="
          min-h-[60vh]
          flex
          items-center
          justify-center
        "
      >

        <div
          className="
            flex
            flex-col
            items-center
            gap-4
          "
        >

          <Loader2
            size={36}
            className="
              animate-spin
              text-primary
            "
          />

          <p
            className="
              text-muted-foreground
            "
          >
            Loading your profile...
          </p>

        </div>

      </div>

    );

  }


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
          BACK BUTTON
      ========================================== */}

      <Link
        to="/profile"
        className="
          inline-flex
          items-center
          gap-2
          text-sm
          font-medium
          text-muted-foreground
          hover:text-primary
          transition-colors
          mb-6
        "
      >

        <ArrowLeft
          size={18}
        />

        Back to Profile

      </Link>


      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <div
        className="
          mb-8
        "
      >

        <h1
          className="
            text-3xl
            font-bold
          "
        >
          Edit Profile
        </h1>

        <p
          className="
            text-muted-foreground
            mt-2
          "
        >
          Manage your personal information and delivery details.
        </p>

      </div>


      {/* ==========================================
          PERSONAL INFORMATION
      ========================================== */}

      <div
        className="
          bg-card
          border
          rounded-2xl
          p-5
          sm:p-6
          mb-6
          shadow-sm
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
            mb-6
          "
        >

          <div
            className="
              w-10
              h-10
              rounded-xl
              bg-primary/10
              text-primary
              flex
              items-center
              justify-center
            "
          >

            <User size={20} />

          </div>


          <div>

            <h2
              className="
                text-lg
                font-semibold
              "
            >
              Personal Information
            </h2>

            <p
              className="
                text-sm
                text-muted-foreground
              "
            >
              Update your basic account details.
            </p>

          </div>

        </div>


        <div
          className="
            space-y-5
          "
        >


          {/* FULL NAME */}

          <div>

            <label
              className="
                block
                text-sm
                font-medium
                mb-2
              "
            >
              Full Name
            </label>

            <div
              className="
                relative
              "
            >

              <User
                size={18}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-muted-foreground
                "
              />

              <input
                type="text"
                value={fullName}
                onChange={(e) =>
                  setFullName(
                    e.target.value
                  )
                }
                placeholder="Enter your full name"
                className="
                  w-full
                  h-12
                  pl-11
                  pr-4
                  rounded-xl
                  border
                  bg-background
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary/30
                  focus:border-primary
                "
              />

            </div>

          </div>


          {/* EMAIL */}

          <div>

            <label
              className="
                block
                text-sm
                font-medium
                mb-2
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
                size={18}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-muted-foreground
                "
              />

              <input
                type="email"
                value={email}
                disabled
                className="
                  w-full
                  h-12
                  pl-11
                  pr-4
                  rounded-xl
                  border
                  bg-muted
                  text-muted-foreground
                  cursor-not-allowed
                "
              />

            </div>

          </div>


          {/* PHONE */}

          <div>

            <label
              className="
                block
                text-sm
                font-medium
                mb-2
              "
            >
              Phone Number
            </label>

            <div
              className="
                relative
              "
            >

              <Phone
                size={18}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-muted-foreground
                "
              />

              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
                placeholder="Enter your phone number"
                className="
                  w-full
                  h-12
                  pl-11
                  pr-4
                  rounded-xl
                  border
                  bg-background
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary/30
                  focus:border-primary
                "
              />

            </div>

          </div>

        </div>

      </div>


      {/* ==========================================
          ADDRESS INFORMATION
      ========================================== */}

      <div
        className="
          bg-card
          border
          rounded-2xl
          p-5
          sm:p-6
          mb-6
          shadow-sm
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
            mb-6
          "
        >

          <div
            className="
              w-10
              h-10
              rounded-xl
              bg-primary/10
              text-primary
              flex
              items-center
              justify-center
            "
          >

            <MapPin size={20} />

          </div>

          <div>

            <h2
              className="
                text-lg
                font-semibold
              "
            >
              Delivery Address
            </h2>

            <p
              className="
                text-sm
                text-muted-foreground
              "
            >
              Add the address you prefer for deliveries.
            </p>

          </div>

        </div>


        <div
          className="
            space-y-5
          "
        >


          {/* ADDRESS */}

          <div>

            <label
              className="
                block
                text-sm
                font-medium
                mb-2
              "
            >
              Complete Address
            </label>

            <textarea
              value={address}
              onChange={(e) =>
                setAddress(
                  e.target.value
                )
              }
              placeholder="House number, street, locality..."
              rows={3}
              className="
                w-full
                p-4
                rounded-xl
                border
                bg-background
                resize-none
                focus:outline-none
                focus:ring-2
                focus:ring-primary/30
                focus:border-primary
              "
            />

          </div>


          {/* CITY + STATE */}

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-5
            "
          >

            <div>

              <label
                className="
                  block
                  text-sm
                  font-medium
                  mb-2
                "
              >
                City
              </label>

              <input
                type="text"
                value={city}
                onChange={(e) =>
                  setCity(
                    e.target.value
                  )
                }
                placeholder="Enter city"
                className="
                  w-full
                  h-12
                  px-4
                  rounded-xl
                  border
                  bg-background
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary/30
                  focus:border-primary
                "
              />

            </div>


            <div>

              <label
                className="
                  block
                  text-sm
                  font-medium
                  mb-2
                "
              >
                State
              </label>

              <input
                type="text"
                value={state}
                onChange={(e) =>
                  setState(
                    e.target.value
                  )
                }
                placeholder="Enter state"
                className="
                  w-full
                  h-12
                  px-4
                  rounded-xl
                  border
                  bg-background
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary/30
                  focus:border-primary
                "
              />

            </div>

          </div>


          {/* PINCODE */}

          <div>

            <label
              className="
                block
                text-sm
                font-medium
                mb-2
              "
            >
              PIN Code
            </label>

            <input
              type="text"
              value={pincode}
              onChange={(e) =>
                setPincode(
                  e.target.value
                )
              }
              placeholder="Enter PIN code"
              maxLength={6}
              className="
                w-full
                h-12
                px-4
                rounded-xl
                border
                bg-background
                focus:outline-none
                focus:ring-2
                focus:ring-primary/30
                focus:border-primary
              "
            />

          </div>


          {/* PREFERRED ADDRESS */}

          <div>

            <label
              className="
                block
                text-sm
                font-medium
                mb-3
              "
            >
              Preferred Address Type
            </label>


            <div
              className="
                grid
                grid-cols-2
                gap-4
              "
            >

              <button
                type="button"
                onClick={() =>
                  setPreferredAddress(
                    "Home"
                  )
                }
                className={`
                  flex
                  items-center
                  justify-center
                  gap-2
                  h-12
                  rounded-xl
                  border
                  font-medium
                  transition-all
                  ${
                    preferredAddress === "Home"
                      ? `
                        border-primary
                        bg-primary/10
                        text-primary
                      `
                      : `
                        hover:bg-muted
                      `
                  }
                `}
              >

                <Home size={18} />

                Home

              </button>


              <button
                type="button"
                onClick={() =>
                  setPreferredAddress(
                    "Other"
                  )
                }
                className={`
                  flex
                  items-center
                  justify-center
                  gap-2
                  h-12
                  rounded-xl
                  border
                  font-medium
                  transition-all
                  ${
                    preferredAddress === "Other"
                      ? `
                        border-primary
                        bg-primary/10
                        text-primary
                      `
                      : `
                        hover:bg-muted
                      `
                  }
                `}
              >

                <MapPin size={18} />

                Other

              </button>

            </div>

          </div>

        </div>

      </div>


      {/* ==========================================
          SAVE BUTTON
      ========================================== */}

      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        className="
          w-full
          h-14
          rounded-xl
          bg-primary
          text-primary-foreground
          font-semibold
          flex
          items-center
          justify-center
          gap-2
          hover:opacity-90
          transition-opacity
          disabled:opacity-60
          disabled:cursor-not-allowed
        "
      >

        {
          isSaving

            ? (
              <>
                <Loader2
                  size={20}
                  className="
                    animate-spin
                  "
                />

                Saving Profile...
              </>
            )

            : (
              <>
                <Save size={20} />

                Save Changes
              </>
            )
        }

      </button>

    </motion.div>

  );

};


export default EditProfilePage;