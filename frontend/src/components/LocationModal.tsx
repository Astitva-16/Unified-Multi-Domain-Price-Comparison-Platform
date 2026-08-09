import {
  useEffect,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  X,
  MapPin,
  Navigation,
  Search,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { useStore } from "@/store/useStore";


/* =====================================================
   PROPS
===================================================== */

interface LocationModalProps {
  open: boolean;
  onClose: () => void;
}


/* =====================================================
   LOCATION MODAL
===================================================== */

const LocationModal = ({
  open,
  onClose,
}: LocationModalProps) => {


  /* =====================================================
     STORE
  ===================================================== */

  const {
    location,
    setLocation,
  } = useStore();


  /* =====================================================
     STATES
  ===================================================== */

  const [searchQuery, setSearchQuery] =
    useState("");

  const [isDetecting, setIsDetecting] =
    useState(false);

  const [isSearching, setIsSearching] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  /* =====================================================
     RESET WHEN MODAL OPENS
  ===================================================== */

  useEffect(() => {

    if (open) {

      setError("");
      setSuccess("");
      setSearchQuery("");

    }

  }, [open]);


  /* =====================================================
     CLOSE ON ESC
  ===================================================== */

  useEffect(() => {

    const handleEscape = (
      event: KeyboardEvent
    ) => {

      if (
        event.key === "Escape" &&
        open
      ) {

        onClose();

      }

    };


    window.addEventListener(
      "keydown",
      handleEscape
    );


    return () => {

      window.removeEventListener(
        "keydown",
        handleEscape
      );

    };

  }, [open, onClose]);


  /* =====================================================
     GET CURRENT LOCATION
  ===================================================== */

  const handleUseCurrentLocation = () => {


    /* -----------------------------------------------
       Check browser support
    ------------------------------------------------ */

    if (
      !navigator.geolocation
    ) {

      setError(
        "Your browser does not support location access."
      );

      return;

    }


    setIsDetecting(true);

    setError("");

    setSuccess("");


    /* -----------------------------------------------
       GET COORDINATES
    ------------------------------------------------ */

    navigator.geolocation.getCurrentPosition(

      async (position) => {

        try {

          const {
            latitude,
            longitude,
          } =
            position.coords;


          /* -------------------------------------------
             REVERSE GEOCODING
             Free OpenStreetMap Nominatim API
          -------------------------------------------- */

          const response =
            await fetch(

              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,

              {
                headers: {
                  Accept:
                    "application/json",
                },
              }

            );


          if (
            !response.ok
          ) {

            throw new Error(
              "Unable to find your address"
            );

          }


          const data =
            await response.json();


          /* -------------------------------------------
             EXTRACT LOCATION
          -------------------------------------------- */

          const address =
            data.address ||
            {};


          const city =
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            address.county ||
            "";


          const state =
            address.state ||
            address.state_district ||
            "";


          const country =
            address.country ||
            "";


          const detectedLocation =
            [
              city,
              state,
            ]
              .filter(Boolean)
              .join(", ") ||
            country ||
            "Current Location";


          /* -------------------------------------------
             SAVE LOCATION
          -------------------------------------------- */

          setLocation(
            detectedLocation
          );


          setSuccess(
            `Location set to ${detectedLocation}`
          );


          /* -------------------------------------------
             CLOSE AFTER SUCCESS
          -------------------------------------------- */

          setTimeout(() => {

            onClose();

          }, 900);


        } catch (
          err
        ) {

          console.error(
            "Location error:",
            err
          );


          setError(
            "We found your coordinates but could not determine your city. Please search manually."
          );

        } finally {

          setIsDetecting(
            false
          );

        }

      },


      /* -----------------------------------------------
         GEOLOCATION ERROR
      ------------------------------------------------ */

      (geoError) => {

        setIsDetecting(
          false
        );


        switch (
          geoError.code
        ) {

          case geoError.PERMISSION_DENIED:

            setError(
              "Location permission was denied. Please allow location access in your browser settings."
            );

            break;


          case geoError.POSITION_UNAVAILABLE:

            setError(
              "Your current location is unavailable. Please try again."
            );

            break;


          case geoError.TIMEOUT:

            setError(
              "Location request timed out. Please try again."
            );

            break;


          default:

            setError(
              "Unable to get your current location."
            );

        }

      },


      /* -----------------------------------------------
         OPTIONS
      ------------------------------------------------ */

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      }

    );

  };


  /* =====================================================
     SEARCH LOCATION MANUALLY
  ===================================================== */

  const handleSearchLocation =
    async (
      event: React.FormEvent
    ) => {

      event.preventDefault();


      const query =
        searchQuery.trim();


      if (!query) {

        return;

      }


      setIsSearching(
        true
      );

      setError("");

      setSuccess("");


      try {

        const response =
          await fetch(

            `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&addressdetails=1&q=${encodeURIComponent(
              query
            )}`,

            {
              headers: {
                Accept:
                  "application/json",
              },
            }

          );


        if (
          !response.ok
        ) {

          throw new Error(
            "Search failed"
          );

        }


        const data =
          await response.json();


        if (
          !data ||
          data.length === 0
        ) {

          setError(
            "Location not found. Try entering your city or area name."
          );

          return;

        }


        const result =
          data[0];


        const address =
          result.address ||
          {};


        const city =
          address.city ||
          address.town ||
          address.village ||
          address.municipality ||
          address.county ||
          "";


        const state =
          address.state ||
          "";


        const detectedLocation =
          [
            city,
            state,
          ]
            .filter(Boolean)
            .join(", ") ||
          result.display_name;


        setLocation(
          detectedLocation
        );


        setSuccess(
          `Location set to ${detectedLocation}`
        );


        setTimeout(() => {

          onClose();

        }, 900);


      } catch (
        err
      ) {

        console.error(
          "Search location error:",
          err
        );


        setError(
          "Unable to search for this location. Please try again."
        );

      } finally {

        setIsSearching(
          false
        );

      }

    };


  /* =====================================================
     SELECT SAVED LOCATION
  ===================================================== */

  const handleSelectLocation = (
    selectedLocation: string
  ) => {

    setLocation(
      selectedLocation
    );


    setSuccess(
      `Location set to ${selectedLocation}`
    );


    setTimeout(() => {

      onClose();

    }, 500);

  };


  /* =====================================================
     POPULAR LOCATIONS
  ===================================================== */

  const popularLocations = [

    "New Delhi, Delhi",

    "Mumbai, Maharashtra",

    "Bengaluru, Karnataka",

    "Hyderabad, Telangana",

    "Chennai, Tamil Nadu",

    "Kolkata, West Bengal",

  ];


  /* =====================================================
     RETURN
  ===================================================== */

  return (

    <AnimatePresence>

      {open && (

        <>


          {/* =================================================
              BACKDROP
          ================================================== */}

          <motion.div

            initial={{
              opacity: 0,
            }}

            animate={{
              opacity: 1,
            }}

            exit={{
              opacity: 0,
            }}

            transition={{
              duration: 0.2,
            }}

            onClick={onClose}

            className="
              fixed inset-0
              z-[100]
              bg-black/50
              backdrop-blur-[2px]
            "

          />


          {/* =================================================
              CENTER WRAPPER

              IMPORTANT:
              This wrapper handles the centering.
              The modal itself does NOT use:
              top-1/2, left-1/2, translate transforms.
          ================================================== */}

          <div
            className="
              fixed inset-0
              z-[101]

              flex
              items-center
              justify-center

              p-4

              pointer-events-none
            "
          >


            {/* ===============================================
                ACTUAL MODAL
            ================================================ */}

            <motion.div

              initial={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}

              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}

              exit={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}

              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}

              className="
                pointer-events-auto

                w-full
                max-w-md

                max-h-[90vh]

                bg-white
                dark:bg-slate-950

                rounded-2xl

                border
                border-slate-200
                dark:border-slate-800

                shadow-2xl
                dark:shadow-black/50

                overflow-hidden
              "
            >


              {/* ===============================================
                  HEADER
              ================================================ */}

              <div
                className="
                  flex
                  items-center
                  justify-between

                  px-5
                  py-4

                  border-b
                  border-slate-200
                  dark:border-slate-800
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  <div
                    className="
                      w-10
                      h-10

                      rounded-xl

                      bg-blue-100
                      dark:bg-blue-500/10

                      flex
                      items-center
                      justify-center
                    "
                  >

                    <MapPin
                      size={21}
                      className="
                        text-blue-600
                        dark:text-blue-400
                      "
                    />

                  </div>


                  <div>

                    <h2
                      className="
                        text-lg
                        font-bold

                        text-slate-900
                        dark:text-slate-100
                      "
                    >

                      Choose your location

                    </h2>


                    <p
                      className="
                        text-xs

                        text-slate-500
                        dark:text-slate-400

                        mt-0.5
                      "
                    >

                      Get better delivery information

                    </p>

                  </div>

                </div>


                {/* CLOSE */}

                <button

                  type="button"

                  onClick={onClose}

                  className="
                    w-9
                    h-9

                    rounded-lg

                    flex
                    items-center
                    justify-center

                    text-slate-500
                    dark:text-slate-400

                    hover:bg-slate-100
                    dark:hover:bg-slate-900

                    hover:text-slate-900
                    dark:hover:text-slate-100

                    transition-colors
                  "

                  aria-label="Close location modal"
                >

                  <X
                    size={20}
                  />

                </button>

              </div>


              {/* ===============================================
                  SCROLLABLE CONTENT
              ================================================ */}

              <div
                className="
                  overflow-y-auto
                  max-h-[calc(90vh-72px)]

                  p-5
                "
              >


                {/* =============================================
                    CURRENT SAVED LOCATION
                ============================================== */}

                {location && (

                  <div
                    className="
                      mb-4

                      p-3.5

                      rounded-xl

                      bg-blue-50
                      dark:bg-blue-500/10

                      border
                      border-blue-100
                      dark:border-blue-500/20
                    "
                  >

                    <p
                      className="
                        text-xs
                        text-blue-600
                        dark:text-blue-400
                        font-medium
                      "
                    >

                      Current location

                    </p>


                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        mt-1
                      "
                    >

                      <MapPin
                        size={16}
                        className="
                          text-blue-600
                          dark:text-blue-400
                        "
                      />

                      <span
                        className="
                          text-sm
                          font-bold

                          text-slate-900
                          dark:text-slate-100
                        "
                      >

                        {location}

                      </span>

                    </div>

                  </div>

                )}


                {/* =============================================
                    USE CURRENT LOCATION
                ============================================== */}

                <button

                  type="button"

                  onClick={
                    handleUseCurrentLocation
                  }

                  disabled={
                    isDetecting ||
                    isSearching
                  }

                  className="
                    w-full

                    flex
                    items-center
                    justify-center
                    gap-2

                    py-3

                    rounded-xl

                    bg-blue-600
                    hover:bg-blue-700

                    disabled:bg-blue-400
                    disabled:cursor-not-allowed

                    text-white
                    text-sm
                    font-bold

                    transition-colors
                  "
                >

                  {isDetecting ? (

                    <>

                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                      Detecting your location...

                    </>

                  ) : (

                    <>

                      <Navigation
                        size={18}
                      />

                      Use my current location

                    </>

                  )}

                </button>


                {/* =============================================
                    DIVIDER
                ============================================== */}

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    my-5
                  "
                >

                  <div
                    className="
                      flex-1
                      h-px

                      bg-slate-200
                      dark:bg-slate-800
                    "
                  />


                  <span
                    className="
                      text-xs

                      text-slate-400
                      dark:text-slate-500
                    "
                  >

                    OR

                  </span>


                  <div
                    className="
                      flex-1
                      h-px

                      bg-slate-200
                      dark:bg-slate-800
                    "
                  />

                </div>


                {/* =============================================
                    MANUAL SEARCH
                ============================================== */}

                <form
                  onSubmit={
                    handleSearchLocation
                  }
                >

                  <div
                    className="
                      flex
                      items-center

                      rounded-xl

                      border
                      border-slate-300
                      dark:border-slate-700

                      bg-white
                      dark:bg-slate-900

                      overflow-hidden

                      focus-within:ring-2
                      focus-within:ring-blue-500/20

                      transition-all
                    "
                  >

                    <Search
                      size={19}

                      className="
                        ml-3

                        text-slate-400
                        dark:text-slate-500
                      "
                    />


                    <input

                      type="text"

                      value={
                        searchQuery
                      }

                      onChange={(event) =>
                        setSearchQuery(
                          event.target.value
                        )
                      }

                      placeholder="Enter city, area or pincode"

                      className="
                        flex-1

                        h-12

                        px-3

                        bg-transparent

                        text-sm

                        text-slate-900
                        dark:text-slate-100

                        placeholder:text-slate-400
                        dark:placeholder:text-slate-500

                        outline-none
                      "
                    />


                    <button

                      type="submit"

                      disabled={
                        !searchQuery.trim() ||
                        isSearching ||
                        isDetecting
                      }

                      className="
                        h-9

                        mr-1.5

                        px-3

                        rounded-lg

                        bg-slate-900
                        dark:bg-blue-600

                        hover:bg-slate-800
                        dark:hover:bg-blue-700

                        disabled:opacity-50
                        disabled:cursor-not-allowed

                        text-white

                        text-xs
                        font-bold

                        transition-colors
                      "
                    >

                      {isSearching
                        ? "..."
                        : "Search"}

                    </button>

                  </div>

                </form>


                {/* =============================================
                    ERROR MESSAGE
                ============================================== */}

                <AnimatePresence>

                  {error && (

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
                        flex
                        items-start
                        gap-2

                        mt-4
                        p-3

                        rounded-xl

                        bg-red-50
                        dark:bg-red-500/10

                        border
                        border-red-100
                        dark:border-red-500/20

                        text-red-700
                        dark:text-red-400
                      "
                    >

                      <AlertCircle
                        size={17}
                        className="
                          flex-shrink-0
                          mt-0.5
                        "
                      />

                      <p
                        className="
                          text-xs
                          leading-5
                        "
                      >

                        {error}

                      </p>

                    </motion.div>

                  )}

                </AnimatePresence>


                {/* =============================================
                    SUCCESS MESSAGE
                ============================================== */}

                <AnimatePresence>

                  {success && (

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
                        flex
                        items-start
                        gap-2

                        mt-4
                        p-3

                        rounded-xl

                        bg-green-50
                        dark:bg-green-500/10

                        border
                        border-green-100
                        dark:border-green-500/20

                        text-green-700
                        dark:text-green-400
                      "
                    >

                      <CheckCircle2
                        size={17}
                        className="
                          flex-shrink-0
                          mt-0.5
                        "
                      />

                      <p
                        className="
                          text-xs
                          leading-5
                        "
                      >

                        {success}

                      </p>

                    </motion.div>

                  )}

                </AnimatePresence>


                {/* =============================================
                    POPULAR LOCATIONS
                ============================================== */}

                <div
                  className="mt-6"
                >

                  <h3
                    className="
                      text-sm
                      font-bold

                      text-slate-900
                      dark:text-slate-100

                      mb-3
                    "
                  >

                    Popular locations

                  </h3>


                  <div
                    className="
                      grid
                      grid-cols-1
                      sm:grid-cols-2
                      gap-2
                    "
                  >

                    {popularLocations.map(
                      (
                        popularLocation
                      ) => (

                        <button

                          key={
                            popularLocation
                          }

                          type="button"

                          onClick={() =>
                            handleSelectLocation(
                              popularLocation
                            )
                          }

                          disabled={
                            isDetecting ||
                            isSearching
                          }

                          className="
                            flex
                            items-center
                            gap-2

                            px-3
                            py-3

                            rounded-xl

                            border
                            border-slate-200
                            dark:border-slate-800

                            bg-white
                            dark:bg-slate-900

                            text-left

                            hover:border-blue-300
                            dark:hover:border-blue-500/50

                            hover:bg-blue-50
                            dark:hover:bg-blue-500/10

                            transition-colors
                          "
                        >

                          <MapPin

                            size={16}

                            className="
                              flex-shrink-0

                              text-slate-400
                              dark:text-slate-500
                            "
                          />


                          <span
                            className="
                              text-xs
                              font-medium

                              text-slate-700
                              dark:text-slate-200

                              truncate
                            "
                          >

                            {
                              popularLocation
                            }

                          </span>

                        </button>

                      )
                    )}

                  </div>

                </div>


                {/* =============================================
                    FOOTER NOTE
                ============================================== */}

                <p
                  className="
                    text-[11px]
                    text-center

                    text-slate-400
                    dark:text-slate-500

                    leading-5

                    mt-6
                  "
                >

                  Your location is used to show
                  relevant delivery and shopping options.

                </p>

              </div>

            </motion.div>

          </div>

        </>

      )}

    </AnimatePresence>

  );

};


export default LocationModal;