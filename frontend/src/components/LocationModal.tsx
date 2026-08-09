import { useState } from "react";
import {
  MapPin,
  Navigation,
  X,
} from "lucide-react";

import { useStore } from "@/store/useStore";


interface LocationModalProps {
  open: boolean;
  onClose: () => void;
}


const LocationModal = ({
  open,
  onClose,
}: LocationModalProps) => {

  const {
    location,
    setLocation,
  } = useStore();


  const [pincode, setPincode] =
    useState(location);


  /* =====================================================
     MODAL CLOSED
  ====================================================== */

  if (!open) {
    return null;
  }


  /* =====================================================
     SAVE LOCATION
  ====================================================== */

  const handleSave = () => {

    // Only allow a valid 6 digit Indian pincode
    if (!/^\d{6}$/.test(pincode)) {
      return;
    }

    setLocation(pincode);

    onClose();
  };


  /* =====================================================
     CURRENT LOCATION
  ====================================================== */

  const handleCurrentLocation = () => {

    if (!navigator.geolocation) {

      alert(
        "Location is not supported by your browser."
      );

      return;
    }


    navigator.geolocation.getCurrentPosition(

      (position) => {

        const {
          latitude,
          longitude,
        } = position.coords;


        /*
          For now we display coordinates.

          Later we can use reverse geocoding
          to convert these coordinates into
          an actual address.
        */

        const coordinates =
          `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;


        setPincode(coordinates);

      },


      () => {

        alert(
          "Unable to access your location. Please allow location permission."
        );

      }

    );

  };


  /* =====================================================
     UI
  ====================================================== */

  return (

    <div className="fixed inset-0 z-[100]">


      {/* =================================================
          BACKDROP
      ================================================== */}

      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />


      {/* =================================================
          MODAL CONTAINER
      ================================================== */}

      <div className="relative min-h-full flex items-center justify-center p-4">

        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">


          {/* =================================================
              HEADER
          ================================================== */}

          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">

                <MapPin
                  size={20}
                  className="text-blue-600"
                />

              </div>


              <div>

                <h2 className="font-bold text-gray-900">
                  Choose your location
                </h2>

                <p className="text-xs text-gray-500">
                  Check products available in your area
                </p>

              </div>

            </div>


            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >

              <X size={18} />

            </button>

          </div>


          {/* =================================================
              BODY
          ================================================== */}

          <div className="p-5">


            {/* Pincode */}

            <label className="block text-sm font-semibold text-gray-700 mb-2">

              Enter your pincode

            </label>


            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="e.g. 110001"
              value={pincode}
              onChange={(e) => {

                const value =
                  e.target.value.replace(
                    /\D/g,
                    ""
                  );

                setPincode(value);

              }}
              className="w-full h-11 px-4 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />


            {/* Current Location */}

            <button
              type="button"
              onClick={handleCurrentLocation}
              className="w-full flex items-center justify-center gap-2 mt-4 h-11 rounded-lg border border-blue-200 text-blue-600 font-medium hover:bg-blue-50 transition-colors"
            >

              <Navigation size={16} />

              Use my current location

            </button>


            {/* Save */}

            <button
              type="button"
              onClick={handleSave}
              disabled={
                !/^\d{6}$/.test(pincode)
              }
              className="w-full mt-4 h-11 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >

              Save Location

            </button>


            {/* Information */}

            <p className="text-xs text-gray-400 text-center mt-4">

              Your location helps Mol Bhao show
              relevant delivery information.

            </p>

          </div>

        </div>

      </div>

    </div>

  );

};


export default LocationModal;