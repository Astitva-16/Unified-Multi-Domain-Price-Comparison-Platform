import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Search,
  ShoppingCart,
  User,
  MapPin,
  ChevronDown,
  Mic,
  Camera,
  Loader2,
  LogOut,
  Heart,
} from "lucide-react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import { useStore } from "@/store/useStore";
import { categories } from "@/data/mockData";

import LocationModal from "@/components/LocationModal";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";


/* =====================================================
   SPEECH RECOGNITION TYPES
===================================================== */

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;

  start: () => void;
  stop: () => void;
  abort: () => void;

  onstart: (() => void) | null;

  onresult:
    | ((event: SpeechRecognitionEvent) => void)
    | null;

  onerror:
    | ((event: SpeechRecognitionErrorEvent) => void)
    | null;

  onend: (() => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}


/* =====================================================
   NAVBAR
===================================================== */

const Navbar = () => {

  /* =====================================================
     AUTH
  ===================================================== */

  const {
    user,
    signOut,
  } = useAuth();


  /* =====================================================
     DROPDOWN STATES
  ===================================================== */

  const [
    locationOpen,
    setLocationOpen,
  ] = useState(false);

  const [
    accountOpen,
    setAccountOpen,
  ] = useState(false);


  /* =====================================================
     VOICE SEARCH STATE
  ===================================================== */

  const [
    isListening,
    setIsListening,
  ] = useState(false);


  /* =====================================================
     IMAGE SEARCH STATE
  ===================================================== */

  const [
    isImageSearching,
    setIsImageSearching,
  ] = useState(false);


  /* =====================================================
     SIGN OUT STATE
  ===================================================== */

  const [
    isSigningOut,
    setIsSigningOut,
  ] = useState(false);


  /* =====================================================
     REFS
  ===================================================== */

  const recognitionRef =
    useRef<SpeechRecognitionInstance | null>(
      null
    );

  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const finalTranscriptRef =
    useRef("");

  const searchQueryRef =
    useRef("");


  /* =====================================================
     STORE
  ===================================================== */

  const {
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    cart,
    wishlist,
    location,
  } = useStore();


  /* =====================================================
     NAVIGATION
  ===================================================== */

  const navigate =
    useNavigate();


  /* =====================================================
     USER DISPLAY NAME
  ===================================================== */

  const userEmail =
    user?.email || "";

  const userName =
    user?.user_metadata?.full_name ||
    userEmail.split("@")[0] ||
    "User";


  /* =====================================================
     KEEP SEARCH QUERY REF UPDATED
  ===================================================== */

  useEffect(() => {

    searchQueryRef.current =
      searchQuery;

  }, [
    searchQuery,
  ]);


  /* =====================================================
     CLEANUP VOICE RECOGNITION
  ===================================================== */

  useEffect(() => {

    return () => {

      if (
        recognitionRef.current
      ) {

        recognitionRef.current.abort();

      }

    };

  }, []);


  /* =====================================================
     NORMAL SEARCH
  ===================================================== */

  const handleSearch = (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    const query =
      searchQuery.trim();

    if (!query) {
      return;
    }

    navigate(
      `/search?q=${encodeURIComponent(
        query
      )}`
    );

  };


  /* =====================================================
     IMAGE SEARCH
  ===================================================== */

  const handleImageSearch = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }


    /* Check valid image */

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {

      alert(
        "Please select a valid image."
      );

      return;

    }


    try {

      setIsImageSearching(
        true
      );


      const formData =
        new FormData();

      formData.append(
        "image",
        file
      );


      const response =
        await fetch(
          "http://localhost:5000/api/image-search",
          {
            method: "POST",
            body: formData,
          }
        );


      const result =
        await response.json();


      if (!response.ok) {

        throw new Error(
          result.message ||
          "Failed to analyze image"
        );

      }


      const detectedQuery =
        result.data?.searchQuery;


      if (!detectedQuery) {

        throw new Error(
          "Could not identify the product in this image."
        );

      }


      setSearchQuery(
        detectedQuery
      );


      navigate(
        `/search?q=${encodeURIComponent(
          detectedQuery
        )}`
      );

    }

    catch (error) {

      console.error(
        "Image search error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to search using image."
      );

    }

    finally {

      setIsImageSearching(
        false
      );


      if (
        fileInputRef.current
      ) {

        fileInputRef.current.value =
          "";

      }

    }

  };


  /* =====================================================
     VOICE SEARCH
  ===================================================== */

  const handleVoiceSearch =
    () => {

      if (
        isListening &&
        recognitionRef.current
      ) {

        recognitionRef.current.stop();

        return;

      }


      const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


      if (!SpeechRecognition) {

        alert(
          "Voice search is not supported in this browser. Please use Google Chrome."
        );

        return;

      }


      const recognition =
        new SpeechRecognition();

      recognitionRef.current =
        recognition;


      recognition.continuous =
        true;

      recognition.interimResults =
        true;

      recognition.lang =
        "en-IN";


      recognition.onstart =
        () => {

          finalTranscriptRef.current =
            searchQueryRef.current
              .trim()
              ? `${searchQueryRef.current.trim()} `
              : "";

          setIsListening(
            true
          );

        };


      recognition.onresult =
        (
          event: SpeechRecognitionEvent
        ) => {

          let finalText = "";

          let interimText = "";


          for (
            let i =
              event.resultIndex;

            i <
            event.results.length;

            i++
          ) {

            const result =
              event.results[i];

            const transcript =
              result[0].transcript;


            if (
              result.isFinal
            ) {

              finalText +=
                transcript;

            }

            else {

              interimText +=
                transcript;

            }

          }


          if (finalText) {

            finalTranscriptRef.current +=
              finalText;

          }


          const liveText =
            `${finalTranscriptRef.current}${interimText}`
              .replace(
                /\s+/g,
                " "
              )
              .trim();


          setSearchQuery(
            liveText
          );

        };


      recognition.onerror =
        (
          event: SpeechRecognitionErrorEvent
        ) => {

          console.error(
            "Voice recognition error:",
            event.error
          );


          if (
            event.error ===
            "not-allowed"
          ) {

            alert(
              "Microphone permission was denied. Please allow microphone access and try again."
            );

          }


          if (
            event.error ===
            "audio-capture"
          ) {

            alert(
              "No microphone was found on your device."
            );

          }


          setIsListening(
            false
          );

        };


      recognition.onend =
        () => {

          setIsListening(
            false
          );

        };


      try {

        recognition.start();

      }

      catch (error) {

        console.error(
          "Could not start voice recognition:",
          error
        );

        setIsListening(
          false
        );

      }

    };


  /* =====================================================
     SIGN OUT
  ===================================================== */

  const handleSignOut =
    async () => {

      try {

        setIsSigningOut(
          true
        );

        setAccountOpen(
          false
        );


        await signOut();


        navigate(
          "/auth",
          {
            replace: true,
          }
        );

      }

      catch (error) {

        console.error(
          "Sign out failed:",
          error
        );

      }

      finally {

        setIsSigningOut(
          false
        );

      }

    };


  /* =====================================================
     CATEGORY CLICK
  ===================================================== */

  const handleCategoryClick = (
    id: string
  ) => {

    setSelectedCategory(
      id
    );

    navigate(
      `/search?category=${id}`
    );

  };


  /* =====================================================
     CART COUNT
  ===================================================== */

  const cartCount =
    cart.reduce(
      (
        total,
        item
      ) =>
        total +
        item.quantity,
      0
    );


  /* =====================================================
     WISHLIST COUNT
  ===================================================== */

  const wishlistCount =
    wishlist.length;


  /* =====================================================
     UI
  ===================================================== */

  return (

    <>

      <header
        className="
          sticky top-0 z-50
          bg-white/95
          dark:bg-slate-950/95
          backdrop-blur-xl
          border-b
          border-slate-200
          dark:border-slate-800
          shadow-sm
          dark:shadow-black/20
          transition-colors
          duration-300
        "
      >

        <div
          className="
            max-w-[1800px]
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            xl:px-10
          "
        >

          {/* MAIN NAVBAR */}

          <div
            className="
              min-h-[88px]
              flex
              items-center
              gap-3
              lg:gap-5
            "
          >

            {/* LOGO */}

            <Link
              to="/home"
              className="
                flex-shrink-0
              "
            >

              <span
                className="
                  text-2xl
                  sm:text-3xl
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
                    dark:text-slate-100
                  "
                >
                  Bhao
                </span>

              </span>

            </Link>


            {/* LOCATION */}

            <button
              type="button"
              onClick={() =>
                setLocationOpen(true)
              }
              className="
                hidden
                xl:flex
                items-center
                gap-2
                px-3
                py-2
                rounded-lg
                text-left
                flex-shrink-0
                hover:bg-slate-100
                dark:hover:bg-slate-900
                transition-colors
              "
            >

              <MapPin
                size={23}
                className="
                  text-slate-700
                  dark:text-slate-300
                "
              />

              <div>

                <p
                  className="
                    text-[11px]
                    text-slate-500
                    dark:text-slate-400
                    leading-none
                  "
                >
                  Deliver to
                </p>

                <div
                  className="
                    flex
                    items-center
                    gap-1
                  "
                >

                  <span
                    className="
                      text-sm
                      font-bold
                      text-slate-900
                      dark:text-slate-100
                      max-w-[190px]
                      truncate
                    "
                  >
                    {
                      location ||
                      "Select location"
                    }
                  </span>

                  <ChevronDown
                    size={14}
                    className="
                      text-slate-500
                      dark:text-slate-400
                    "
                  />

                </div>

              </div>

            </button>


            {/* SEARCH BAR */}

            <form
              onSubmit={
                handleSearch
              }
              className="
                flex-1
                min-w-0
              "
            >

              <div
                className="
                  flex
                  items-center
                  h-[56px]
                  border
                  border-slate-300
                  dark:border-slate-700
                  rounded-xl
                  overflow-hidden
                  bg-white
                  dark:bg-slate-900
                  shadow-sm
                  focus-within:border-blue-500
                  focus-within:ring-2
                  focus-within:ring-blue-500/20
                  transition-all
                "
              >

                <input
                  type="text"
                  value={
                    searchQuery
                  }
                  onChange={(e) =>
                    setSearchQuery(
                      e.target.value
                    )
                  }
                  placeholder="Search for products, brands and more"
                  className="
                    flex-1
                    min-w-0
                    h-full
                    px-5
                    text-sm
                    sm:text-base
                    bg-transparent
                    text-slate-900
                    dark:text-slate-100
                    placeholder:text-slate-400
                    dark:placeholder:text-slate-500
                    focus:outline-none
                  "
                />


                {/* VOICE SEARCH */}

                <button
                  type="button"
                  onClick={
                    handleVoiceSearch
                  }
                  className={`
                    hidden
                    sm:flex
                    items-center
                    justify-center
                    w-14
                    h-full
                    transition-all
                    ${
                      isListening
                        ? `
                          text-red-500
                          bg-red-500/10
                          animate-pulse
                        `
                        : `
                          text-slate-500
                          dark:text-slate-400
                          hover:text-blue-600
                          dark:hover:text-blue-400
                        `
                    }
                  `}
                  title={
                    isListening
                      ? "Stop voice search"
                      : "Start voice search"
                  }
                >

                  <Mic size={22} />

                </button>


                {/* IMAGE SEARCH */}

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  disabled={
                    isImageSearching
                  }
                  className="
                    hidden
                    sm:flex
                    items-center
                    justify-center
                    w-14
                    h-full
                    text-slate-500
                    dark:text-slate-400
                    hover:text-blue-600
                    dark:hover:text-blue-400
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    transition-colors
                  "
                  title="Search by image"
                >

                  {
                    isImageSearching

                      ? (
                        <Loader2
                          size={22}
                          className="
                            animate-spin
                          "
                        />
                      )

                      : (
                        <Camera
                          size={22}
                        />
                      )
                  }

                </button>


                {/* HIDDEN FILE INPUT */}

                <input
                  ref={
                    fileInputRef
                  }
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImageSearch
                  }
                  className="hidden"
                />


                {/* SEARCH BUTTON */}

                <button
                  type="submit"
                  className="
                    h-full
                    w-16
                    bg-blue-600
                    text-white
                    flex
                    items-center
                    justify-center
                    hover:bg-blue-700
                    dark:bg-blue-500
                    dark:hover:bg-blue-600
                    transition-colors
                    flex-shrink-0
                  "
                >

                  <Search
                    size={25}
                  />

                </button>

              </div>

            </form>


            {/* THEME TOGGLE */}

            <div
              className="
                flex-shrink-0
              "
            >

              <ThemeToggle />

            </div>


            {/* ACCOUNT */}

            <div
              className="
                relative
                hidden
                lg:block
              "
            >

              <button
                type="button"
                onClick={() =>
                  setAccountOpen(
                    !accountOpen
                  )
                }
                className="
                  flex
                  items-center
                  gap-2
                  px-3
                  py-2
                  rounded-lg
                  hover:bg-slate-100
                  dark:hover:bg-slate-900
                  transition-colors
                "
              >

                <User
                  size={23}
                  className="
                    text-slate-800
                    dark:text-slate-200
                  "
                />

                <div
                  className="
                    text-left
                    max-w-[150px]
                  "
                >

                  <p
                    className="
                      text-[11px]
                      text-slate-500
                      dark:text-slate-400
                      leading-none
                      truncate
                    "
                  >
                    Hello, {userName}
                  </p>

                  <div
                    className="
                      flex
                      items-center
                      gap-1
                    "
                  >

                    <span
                      className="
                        text-sm
                        font-bold
                        text-slate-900
                        dark:text-slate-100
                      "
                    >
                      Account
                    </span>

                    <ChevronDown
                      size={14}
                      className="
                        text-slate-500
                        dark:text-slate-400
                      "
                    />

                  </div>

                </div>

              </button>


              {/* ACCOUNT DROPDOWN */}

              <AnimatePresence>

                {
                  accountOpen && (

                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -5,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -5,
                      }}
                      className="
                        absolute
                        top-full
                        right-0
                        mt-2
                        w-60
                        bg-white
                        dark:bg-slate-900
                        rounded-xl
                        border
                        border-slate-200
                        dark:border-slate-700
                        shadow-xl
                        dark:shadow-black/40
                        p-2
                        z-[60]
                      "
                    >

                      {/* USER INFO */}

                      <div
                        className="
                          px-3
                          py-3
                          border-b
                          border-slate-200
                          dark:border-slate-700
                          mb-2
                        "
                      >

                        <p
                          className="
                            text-sm
                            font-semibold
                            text-slate-900
                            dark:text-slate-100
                            truncate
                          "
                        >
                          {userName}
                        </p>

                        <p
                          className="
                            text-xs
                            text-slate-500
                            dark:text-slate-400
                            truncate
                            mt-1
                          "
                        >
                          {userEmail}
                        </p>

                      </div>


                      {/* PROFILE */}

                      <Link
                        to="/profile"
                        onClick={() =>
                          setAccountOpen(
                            false
                          )
                        }
                        className="
                          block
                          px-3
                          py-3
                          rounded-lg
                          text-sm
                          font-medium
                          text-slate-800
                          dark:text-slate-100
                          hover:bg-slate-100
                          dark:hover:bg-slate-800
                          transition-colors
                        "
                      >
                        👤 My Profile
                      </Link>


                      {/* WISHLIST */}

                      <Link
                        to="/wishlist"
                        onClick={() =>
                          setAccountOpen(
                            false
                          )
                        }
                        className="
                          flex
                          items-center
                          justify-between
                          px-3
                          py-3
                          rounded-lg
                          text-sm
                          font-medium
                          text-slate-800
                          dark:text-slate-100
                          hover:bg-slate-100
                          dark:hover:bg-slate-800
                          transition-colors
                        "
                      >

                        <span
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >
                          <Heart
                            size={17}
                            className="
                              text-red-500
                            "
                          />

                          Wishlist
                        </span>


                        {
                          wishlistCount > 0 && (

                            <span
                              className="
                                min-w-[22px]
                                h-[22px]
                                px-1.5
                                rounded-full
                                bg-red-500
                                text-white
                                text-[11px]
                                font-bold
                                flex
                                items-center
                                justify-center
                              "
                            >
                              {wishlistCount}
                            </span>

                          )
                        }

                      </Link>


                      {/* ORDERS */}

                      <button
                        type="button"
                        className="
                          w-full
                          text-left
                          px-3
                          py-3
                          rounded-lg
                          text-sm
                          text-slate-700
                          dark:text-slate-200
                          hover:bg-slate-100
                          dark:hover:bg-slate-800
                          transition-colors
                        "
                      >
                        📦 My Orders
                      </button>


                      {/* SIGN OUT */}

                      <div
                        className="
                          mt-2
                          pt-2
                          border-t
                          border-slate-200
                          dark:border-slate-700
                        "
                      >

                        <button
                          type="button"
                          onClick={
                            handleSignOut
                          }
                          disabled={
                            isSigningOut
                          }
                          className="
                            w-full
                            flex
                            items-center
                            gap-2
                            text-left
                            px-3
                            py-3
                            rounded-lg
                            text-sm
                            font-semibold
                            text-red-600
                            dark:text-red-400
                            hover:bg-red-50
                            dark:hover:bg-red-500/10
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                            transition-colors
                          "
                        >

                          {
                            isSigningOut

                              ? (
                                <Loader2
                                  size={17}
                                  className="
                                    animate-spin
                                  "
                                />
                              )

                              : (
                                <LogOut
                                  size={17}
                                />
                              )
                          }

                          {
                            isSigningOut
                              ? "Signing out..."
                              : "Sign Out"
                          }

                        </button>

                      </div>

                    </motion.div>

                  )
                }

              </AnimatePresence>

            </div>


            {/* CART */}

            <Link
              to="/cart"
              className="
                relative
                flex
                items-center
                gap-2
                px-2
                lg:px-3
                py-2
                rounded-lg
                hover:bg-slate-100
                dark:hover:bg-slate-900
                transition-colors
                flex-shrink-0
              "
            >

              <ShoppingCart
                size={27}
                className="
                  text-slate-900
                  dark:text-slate-100
                "
              />

              <span
                className="
                  hidden
                  xl:block
                  font-semibold
                  text-slate-900
                  dark:text-slate-100
                "
              >
                Cart
              </span>


              {
                cartCount > 0 && (

                  <span
                    className="
                      absolute
                      -top-1
                      -right-1
                      min-w-[20px]
                      h-[20px]
                      px-1
                      rounded-full
                      bg-red-500
                      text-white
                      text-[11px]
                      font-bold
                      flex
                      items-center
                      justify-center
                      border-2
                      border-white
                      dark:border-slate-950
                    "
                  >
                    {cartCount}
                  </span>

                )
              }

            </Link>

          </div>


          {/* CATEGORY NAVIGATION */}

          <div
            className="
              h-[68px]
              flex
              items-center
              justify-between
              gap-2
              border-t
              border-slate-200
              dark:border-slate-800
              overflow-x-auto
              lg:overflow-visible
              scrollbar-hide
            "
          >

            {
              categories.map(
                (cat) => (

                  <button
                    key={
                      cat.id
                    }
                    type="button"
                    onClick={() =>
                      handleCategoryClick(
                        cat.id
                      )
                    }
                    className="
                      flex-1
                      min-w-max
                      lg:min-w-0
                      flex
                      items-center
                      justify-center
                      gap-3
                      h-full
                      px-3
                      text-sm
                      lg:text-base
                      font-semibold
                      text-slate-700
                      dark:text-slate-300
                      hover:text-blue-600
                      dark:hover:text-blue-400
                      transition-colors
                      whitespace-nowrap
                    "
                  >

                    <span
                      className="
                        text-xl
                        lg:text-2xl
                      "
                    >
                      {cat.icon}
                    </span>

                    <span>
                      {cat.name}
                    </span>

                  </button>

                )
              )
            }

          </div>

        </div>

      </header>


      {/* LOCATION MODAL */}

      <LocationModal
        open={
          locationOpen
        }
        onClose={() =>
          setLocationOpen(
            false
          )
        }
      />

    </>

  );

};


export default Navbar;