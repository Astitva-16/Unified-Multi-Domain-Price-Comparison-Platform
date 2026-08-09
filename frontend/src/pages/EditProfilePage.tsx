import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  Plus,
  Trash2,
  ArrowLeft,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "@/context/AuthContext";


interface Address {
  id: number;
  label: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}


const EditProfilePage = () => {

  const navigate = useNavigate();

  const { user } = useAuth();


  const [name, setName] =
    useState(
      user?.user_metadata?.full_name || ""
    );


  const [phone, setPhone] =
    useState(
      user?.user_metadata?.phone || ""
    );


  const [addresses, setAddresses] =
    useState<Address[]>([
      {
        id: 1,
        label: "Home",
        address: "",
        city: "",
        state: "",
        pincode: "",
      },
    ]);


  const [preferredAddressId, setPreferredAddressId] =
    useState(1);


  const addAddress = () => {

    const newAddress: Address = {
      id: Date.now(),
      label: "Address",
      address: "",
      city: "",
      state: "",
      pincode: "",
    };


    setAddresses(
      [
        ...addresses,
        newAddress,
      ]
    );

  };


  const removeAddress = (
    id: number
  ) => {

    if (
      addresses.length === 1
    ) {
      return;
    }


    const updatedAddresses =
      addresses.filter(
        (address) =>
          address.id !== id
      );


    setAddresses(
      updatedAddresses
    );


    if (
      preferredAddressId === id
    ) {

      setPreferredAddressId(
        updatedAddresses[0].id
      );

    }

  };


  const updateAddress = (
    id: number,
    field: keyof Address,
    value: string
  ) => {

    setAddresses(
      addresses.map(
        (address) =>
          address.id === id
            ? {
                ...address,
                [field]: value,
              }
            : address
      )
    );

  };


  const handleSave = async () => {

    console.log(
      "Profile data:",
      {
        name,
        email: user?.email,
        phone,
        addresses,
        preferredAddressId,
      }
    );


    /*
      NEXT STEP:
      Yahan hum ye data
      Supabase database me save karenge.
    */


    alert(
      "Profile saved successfully!"
    );


    navigate(
      "/profile"
    );

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
        py-6
        space-y-8
      "
    >


      {/* ============================
          HEADER
      ============================ */}

      <div
        className="
          flex
          items-center
          gap-4
        "
      >

        <Link
          to="/profile"
          className="
            p-2
            rounded-xl
            border
            hover:bg-muted
            transition
          "
        >

          <ArrowLeft size={22} />

        </Link>


        <div>

          <h1
            className="
              text-2xl
              sm:text-3xl
              font-bold
            "
          >
            Edit Profile
          </h1>


          <p
            className="
              text-sm
              text-muted-foreground
              mt-1
            "
          >
            Manage your personal information and delivery addresses
          </p>

        </div>

      </div>



      {/* ============================
          PERSONAL INFORMATION
      ============================ */}

      <div
        className="
          bg-card
          border
          rounded-2xl
          p-5
          sm:p-6
          space-y-5
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          <User
            size={21}
            className="
              text-primary
            "
          />

          <h2
            className="
              text-lg
              font-bold
            "
          >
            Personal Information
          </h2>

        </div>



        {/* NAME */}

        <div>

          <label
            className="
              text-sm
              font-medium
              mb-2
              block
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
              size={19}
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
              value={name}
              onChange={(e) =>
                setName(
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
                outline-none
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
              text-sm
              font-medium
              mb-2
              block
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
              size={19}
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
              value={
                user?.email || ""
              }
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


          <p
            className="
              text-xs
              text-muted-foreground
              mt-2
            "
          >
            Email is linked to your account.
          </p>

        </div>



        {/* PHONE */}

        <div>

          <label
            className="
              text-sm
              font-medium
              mb-2
              block
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
              size={19}
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
                outline-none
                focus:ring-2
                focus:ring-primary/30
                focus:border-primary
              "
            />

          </div>

        </div>

      </div>



      {/* ============================
          ADDRESSES
      ============================ */}

      <div
        className="
          bg-card
          border
          rounded-2xl
          p-5
          sm:p-6
          space-y-6
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
            gap-4
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <MapPin
              size={21}
              className="
                text-primary
              "
            />

            <h2
              className="
                text-lg
                font-bold
              "
            >
              Delivery Addresses
            </h2>

          </div>


          <Button
            type="button"
            variant="outline"
            onClick={
              addAddress
            }
            className="
              gap-2
            "
          >

            <Plus size={18} />

            Add Address

          </Button>

        </div>



        {/* ============================
            ADDRESS LIST
        ============================ */}

        {
          addresses.map(
            (address, index) => (

              <div
                key={address.id}
                className="
                  border
                  rounded-2xl
                  p-4
                  sm:p-5
                  space-y-4
                "
              >


                {/* ADDRESS HEADER */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <Home
                      size={19}
                      className="
                        text-primary
                      "
                    />

                    <h3
                      className="
                        font-semibold
                      "
                    >
                      Address {index + 1}
                    </h3>

                  </div>


                  {
                    addresses.length > 1 && (

                      <button
                        type="button"
                        onClick={() =>
                          removeAddress(
                            address.id
                          )
                        }
                        className="
                          p-2
                          text-destructive
                          hover:bg-destructive/10
                          rounded-lg
                          transition
                        "
                      >

                        <Trash2
                          size={19}
                        />

                      </button>

                    )
                  }

                </div>



                {/* ADDRESS LABEL */}

                <input
                  type="text"
                  value={
                    address.label
                  }
                  onChange={(e) =>
                    updateAddress(
                      address.id,
                      "label",
                      e.target.value
                    )
                  }
                  placeholder="Address name (Home, Work, etc.)"
                  className="
                    w-full
                    h-11
                    px-4
                    rounded-xl
                    border
                    bg-background
                    outline-none
                    focus:ring-2
                    focus:ring-primary/30
                  "
                />



                {/* FULL ADDRESS */}

                <textarea
                  value={
                    address.address
                  }
                  onChange={(e) =>
                    updateAddress(
                      address.id,
                      "address",
                      e.target.value
                    )
                  }
                  placeholder="House / Flat No., Street, Area"
                  rows={3}
                  className="
                    w-full
                    p-4
                    rounded-xl
                    border
                    bg-background
                    outline-none
                    resize-none
                    focus:ring-2
                    focus:ring-primary/30
                  "
                />



                {/* CITY + STATE */}

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-4
                  "
                >

                  <input
                    type="text"
                    value={
                      address.city
                    }
                    onChange={(e) =>
                      updateAddress(
                        address.id,
                        "city",
                        e.target.value
                      )
                    }
                    placeholder="City"
                    className="
                      h-11
                      px-4
                      rounded-xl
                      border
                      bg-background
                      outline-none
                      focus:ring-2
                      focus:ring-primary/30
                    "
                  />


                  <input
                    type="text"
                    value={
                      address.state
                    }
                    onChange={(e) =>
                      updateAddress(
                        address.id,
                        "state",
                        e.target.value
                      )
                    }
                    placeholder="State"
                    className="
                      h-11
                      px-4
                      rounded-xl
                      border
                      bg-background
                      outline-none
                      focus:ring-2
                      focus:ring-primary/30
                    "
                  />

                </div>



                {/* PINCODE */}

                <input
                  type="text"
                  value={
                    address.pincode
                  }
                  onChange={(e) =>
                    updateAddress(
                      address.id,
                      "pincode",
                      e.target.value
                    )
                  }
                  placeholder="PIN Code"
                  className="
                    w-full
                    h-11
                    px-4
                    rounded-xl
                    border
                    bg-background
                    outline-none
                    focus:ring-2
                    focus:ring-primary/30
                  "
                />



                {/* PREFERRED ADDRESS */}

                <label
                  className="
                    flex
                    items-center
                    gap-3
                    cursor-pointer
                    p-3
                    rounded-xl
                    border
                    hover:bg-muted/50
                    transition
                  "
                >

                  <input
                    type="radio"
                    name="preferredAddress"
                    checked={
                      preferredAddressId ===
                      address.id
                    }
                    onChange={() =>
                      setPreferredAddressId(
                        address.id
                      )
                    }
                    className="
                      w-4
                      h-4
                      accent-primary
                    "
                  />


                  <div>

                    <p
                      className="
                        font-medium
                        text-sm
                      "
                    >
                      Preferred Delivery Address
                    </p>

                    <p
                      className="
                        text-xs
                        text-muted-foreground
                      "
                    >
                      Use this address as default
                    </p>

                  </div>

                </label>

              </div>

            )
          )
        }

      </div>



      {/* ============================
          SAVE BUTTON
      ============================ */}

      <div
        className="
          flex
          justify-end
          gap-3
          pb-8
        "
      >

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            navigate(
              "/profile"
            )
          }
        >
          Cancel
        </Button>


        <Button
          type="button"
          onClick={
            handleSave
          }
          className="
            gap-2
          "
        >

          <Check
            size={18}
          />

          Save Changes

        </Button>

      </div>

    </motion.div>

  );

};


export default EditProfilePage;