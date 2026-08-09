import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "@/context/AuthContext";


const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const {
    user,
    loading,
  } =
    useAuth();


  const location =
    useLocation();


  if (loading) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-slate-950
          text-white
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

          <div
            className="
              w-10
              h-10
              rounded-full
              border-4
              border-slate-700
              border-t-blue-500
              animate-spin
            "
          />

          <p>
            Loading Mol Bhao...
          </p>

        </div>

      </div>

    );

  }


  if (!user) {

    return (

      <Navigate
        to="/auth"
        replace
        state={{
          from:
            location.pathname +
            location.search,
        }}
      />

    );

  }


  return (
    <>
      {children}
    </>
  );

};


export default ProtectedRoute;