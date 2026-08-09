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
} from "lucide-react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import { useStore } from "@/store/useStore";
import { categories } from "@/data/mockData";

import LocationModal from "@/components/LocationModal";
import ThemeToggle from "@/components/ThemeToggle";


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

  onstart:
    | (() => void)
    | null;

  onresult:
    | ((event: SpeechRecognitionEvent) => void)
    | null;

  onerror:
    | ((event: SpeechRecognitionErrorEvent) => void)
    | null;

  onend:
    | (() => void)
    | null;
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
     DROPDOWN STATES
  ====================================================== */

  const [
    locationOpen,
    setLocationOpen,
  ] = useState(false);

  const [
    accountOpen,
    setAccountOpen,
  ] = useState(false);

  const [
    categoryOpen,
    setCategoryOpen,
  ] = useState(false);


  /* =====================================================
     VOICE SEARCH STATE
  ====================================================== */

  const [
    isListening,
    setIsListening,
  ] = useState(false);


  /* =====================================================
     VOICE RECOGNITION REF
  ====================================================== */

  const recognitionRef =
    useRef<SpeechRecognitionInstance | null>(
      null
    );


  /*
    Final speech jo confirm ho chuki hai.
  */

  const finalTranscriptRef =
    useRef("");


  /*
    Latest search query.
    Ye isliye use kar rahe hain taaki
    voice recognition purane state ko use na kare.
  */

  const searchQueryRef =
    useRef("");


  /* =====================================================
     STORE
  ====================================================== */

  const {
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    cart,
    location,
  } = useStore();


  /* =====================================================
     NAVIGATION
  ====================================================== */

  const navigate =
    useNavigate();


  /* =====================================================
     KEEP SEARCH QUERY REF UPDATED
  ====================================================== */

  useEffect(() => {

    searchQueryRef.current =
      searchQuery;

  }, [
    searchQuery,
  ]);


  /* =====================================================
     CLEANUP VOICE RECOGNITION
  ====================================================== */

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
     SEARCH
  ====================================================== */

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
     VOICE SEARCH
  ====================================================== */

  const handleVoiceSearch =
    () => {

      /*
        Agar already listening hai,
        mic dobara click karne par stop.
      */

      if (
        isListening &&
        recognitionRef.current
      ) {

        recognitionRef.current.stop();

        return;

      }


      /*
        Browser support check
      */

      const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


      if (
        !SpeechRecognition
      ) {

        alert(
          "Voice search is not supported in this browser. Please use Google Chrome."
        );

        return;

      }


      /*
        New recognition instance
      */

      const recognition =
        new SpeechRecognition();


      recognitionRef.current =
        recognition;


      /*
        Continuous speech:
        User continuously bol sakta hai.
      */

      recognition.continuous =
        true;


      /*
        Jo user bol raha hai,
        woh live input me dikhega.
      */

      recognition.interimResults =
        true;


      /*
        Hindi + English ke liye.

        Agar mainly Hindi bolna hai:
        hi-IN

        Agar mainly English:
        en-IN

        Yahan India users ke liye
        Hindi preference rakhi hai.
      */

      recognition.lang =
        "en-IN";


      /*
        Start hone par
      */

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


      /*
        LIVE SPEECH RESULT
      */

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


            /*
              Final result
              → permanently add
            */

            if (
              result.isFinal
            ) {

              finalText +=
                transcript;

            }

            /*
              User abhi jo bol raha hai
              → live show
            */

            else {

              interimText +=
                transcript;

            }

          }


          /*
            Final words ko store karo
          */

          if (
            finalText
          ) {

            finalTranscriptRef.current +=
              finalText;

          }


          /*
            Search bar me
            final + currently speaking text
          */

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


      /*
        Error handling
      */

      recognition.onerror =
        (
          event: SpeechRecognitionErrorEvent
        ) => {

          console.error(
            "Voice recognition error:",
            event.error
          );


          /*
            Permission denied
          */

          if (
            event.error ===
            "not-allowed"
          ) {

            alert(
              "Microphone permission was denied. Please allow microphone access and try again."
            );

          }


          /*
            Mic not found
          */

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


      /*
        Recognition stop hone par
      */

      recognition.onend =
        () => {

          setIsListening(
            false
          );

        };


      /*
        Start recognition
      */

      try {

        recognition.start();

      }

      catch (
        error
      ) {

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
     CATEGORY
  ====================================================== */

  const handleCategoryClick = (
    id: string
  ) => {

    setSelectedCategory(
      id
    );

    setCategoryOpen(
      false
    );

    navigate(
      `/search?category=${id}`
    );

  };


  /* =====================================================
     CART COUNT
  ====================================================== */

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
     UI
  ====================================================== */

  return (

    <>

      {/* =====================================================
          NAVBAR
      ====================================================== */}

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
            max-w-[1500px]
            mx-auto
            px-4
            lg:px-8
          "
        >


          {/* =================================================
              MAIN NAVBAR
          ================================================= */}

          <div
            className="
              min-h-[76px]
              flex
              items-center
              gap-3
              lg:gap-5
            "
          >


            {/* =================================================
                LOGO
            ================================================= */}

            <Link
              to="/home"
              className="flex-shrink-0"
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
                    dark:text-slate-100
                  "
                >
                  Bhao
                </span>

              </span>

            </Link>


            {/* =================================================
                LOCATION
            ================================================= */}

            <button
              type="button"
              onClick={() =>
                setLocationOpen(
                  true
                )
              }
              className="
                hidden
                lg:flex
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
                size={22}
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
                      max-w-[150px]
                      truncate
                    "
                  >

                    {location ||
                      "Select location"}

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


            {/* =================================================
                SEARCH BAR
            ================================================= */}

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
                  h-[48px]
                  border
                  border-blue-500
                  dark:border-blue-500/70
                  rounded-xl
                  overflow-hidden
                  bg-white
                  dark:bg-slate-900
                  shadow-sm
                  focus-within:ring-2
                  focus-within:ring-blue-500/20
                  transition-all
                "
              >


                {/* =============================================
                    CATEGORY SELECTOR
                ============================================== */}

                <div
                  className="
                    relative
                    hidden
                    sm:block
                  "
                >

                  <button
                    type="button"
                    onClick={() =>
                      setCategoryOpen(
                        !categoryOpen
                      )
                    }
                    className="
                      h-[46px]
                      px-4
                      flex
                      items-center
                      gap-2
                      border-r
                      border-slate-200
                      dark:border-slate-700
                      bg-slate-50
                      dark:bg-slate-800
                      text-sm
                      font-medium
                      text-slate-700
                      dark:text-slate-200
                      hover:bg-slate-100
                      dark:hover:bg-slate-700
                      transition-colors
                    "
                  >

                    All

                    <ChevronDown
                      size={15}
                    />

                  </button>


                  {/* CATEGORY DROPDOWN */}

                  <AnimatePresence>

                    {categoryOpen && (

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
                          left-0
                          mt-2
                          w-56
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

                        {/* ALL CATEGORIES */}

                        <button
                          type="button"
                          onClick={() => {

                            setCategoryOpen(
                              false
                            );

                            setSelectedCategory(
                              null
                            );

                            navigate(
                              "/search"
                            );

                          }}
                          className="
                            w-full
                            text-left
                            px-3
                            py-2.5
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
                          All Categories
                        </button>


                        {/* CATEGORY LIST */}

                        {categories.map(
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
                                w-full
                                flex
                                items-center
                                gap-3
                                text-left
                                px-3
                                py-2.5
                                rounded-lg
                                text-sm
                                text-slate-700
                                dark:text-slate-200
                                hover:bg-slate-100
                                dark:hover:bg-slate-800
                                transition-colors
                              "
                            >

                              <span>
                                {cat.icon}
                              </span>

                              {cat.name}

                            </button>

                          )
                        )}

                      </motion.div>

                    )}

                  </AnimatePresence>

                </div>


                {/* =============================================
                    SEARCH INPUT
                ============================================== */}

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
                    px-4
                    text-sm
                    bg-transparent
                    text-slate-900
                    dark:text-slate-100
                    placeholder:text-slate-400
                    dark:placeholder:text-slate-500
                    focus:outline-none
                  "
                />


                {/* =============================================
                    VOICE SEARCH
                ============================================== */}

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
                    w-11
                    h-full
                    transition-all
                    ${
                      isListening
                        ? `
                          text-red-500
                          bg-red-50
                          dark:bg-red-950/40
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

                  <Mic
                    size={20}
                  />

                </button>


                {/* =============================================
                    IMAGE SEARCH
                ============================================== */}

                <button
                  type="button"
                  className="
                    hidden
                    sm:flex
                    items-center
                    justify-center
                    w-11
                    h-full
                    text-slate-500
                    dark:text-slate-400
                    hover:text-blue-600
                    dark:hover:text-blue-400
                    transition-colors
                  "
                  title="Search by image"
                >

                  <Camera
                    size={20}
                  />

                </button>


                {/* =============================================
                    SEARCH BUTTON
                ============================================== */}

                <button
                  type="submit"
                  className="
                    h-full
                    w-14
                    bg-blue-600
                    text-white
                    flex
                    items-center
                    justify-center
                    hover:bg-blue-700
                    dark:bg-blue-500
                    dark:hover:bg-blue-600
                    transition-colors
                  "
                >

                  <Search
                    size={22}
                  />

                </button>

              </div>

            </form>


            {/* =================================================
                THEME TOGGLE
            ================================================= */}

            <div
              className="
                flex-shrink-0
              "
            >

              <ThemeToggle />

            </div>


            {/* =================================================
                ACCOUNT
            ================================================= */}

            <div
              className="
                relative
                hidden
                md:block
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
                  className="text-left"
                >

                  <p
                    className="
                      text-[11px]
                      text-slate-500
                      dark:text-slate-400
                      leading-none
                    "
                  >
                    Hello, sign in
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

                {accountOpen && (

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
                      w-52
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
                      ❤️ Wishlist
                    </button>


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

                  </motion.div>

                )}

              </AnimatePresence>

            </div>


            {/* =================================================
                CART
            ================================================= */}

            <Link
              to="/cart"
              className="
                relative
                flex
                items-center
                gap-2
                px-3
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
                  lg:block
                  font-medium
                  text-slate-900
                  dark:text-slate-100
                "
              >
                Cart
              </span>


              {/* CART COUNT */}

              {cartCount > 0 && (

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

              )}

            </Link>

          </div>


          {/* =====================================================
              CATEGORY NAVIGATION
          ====================================================== */}

          <div
            className="
              h-[52px]
              flex
              items-center
              gap-8
              overflow-x-auto
              border-t
              border-slate-100
              dark:border-slate-800
              scrollbar-hide
            "
          >

            {categories.map(
              (cat) => (

                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    handleCategoryClick(
                      cat.id
                    )
                  }
                  className="
                    flex-shrink-0
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-slate-700
                    dark:text-slate-300
                    hover:text-blue-600
                    dark:hover:text-blue-400
                    transition-colors
                  "
                >

                  <span
                    className="
                      text-lg
                    "
                  >
                    {cat.icon}
                  </span>

                  {cat.name}

                </button>

              )
            )}

          </div>

        </div>

      </header>


      {/* =====================================================
          LOCATION MODAL
      ====================================================== */}

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