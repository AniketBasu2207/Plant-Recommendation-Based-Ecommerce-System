import React, { useState, useEffect } from "react";
import "./Profile.css";
import axios from "axios";
import Success_Alert from "./Success_Alert";

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const ProfilePage = () => {
  const [step, setStep] = useState(0);
  const [profilePhoto, setProfilePhoto] = useState(null);
  // access extra key
  const [extra, setextra] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [pincodeLookup, setPincodeLookup] = useState({
    district: "",
    block: "",
    state: "",
    country: "",
  });

  // Initialize state with empty values
  const [userData, setUserData] = useState({
    name: "",
    email: "",
  });

  const [basicInfo, setBasicInfo] = useState({
    gender: "",
    country: "",
    state: "",
    district: "",
    block: "",
    zipcode: "",
    address: "",
    phone: "",
  });

  // //----------------off
  // const [orderAddress, setOrderAddress] = useState({
  //   name:'',
  //   country: '',
  //   state: '',
  //   district: '',
  //   block:'',
  //   zipcode: '',
  //   address: '',
  //   address2: '',
  //   phone: ''
  // });

  // const [sameAsBasic, setSameAsBasic] = useState(false);
  // //----------------off----------------

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/api/profile");
        const profile = response.data;
        console.log(profile);
        setextra(profile);
        if (profile.response) {
          if (profile.Create) {
            // if profile.Create is true then set up account else update
            // for account creation
            setUserData({
              name: profile.message.user_details.name || "",
              email: profile.message.user_details.email || "",
            });
          } else if (profile.Update) {
            //updated code
            setUserData({
              name: profile.message.user_profile.name,
              email: profile.message.user_profile.email,
            });

            setBasicInfo({
              ...profile.message.user_profile,
              zipcode: profile.message.user_profile.pincode,
            });
            // setOrderAddress(profile.message.user_profile.orderAddress) ;
          }
        } else {
          // not found
          console.log(profile);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Generate profile photo when name changes
  useEffect(() => {
    if (userData.name && !profilePhoto) {
      setProfilePhoto(
        `https://api.dicebear.com/9.x/initials/svg?seed=${userData.name}&radius=50&size=96`
      );
    }
  }, [userData.name, profilePhoto]);

  // Lookup pincode details when zipcode changes
  useEffect(() => {
    const lookupPincode = async () => {
      if (basicInfo.zipcode && basicInfo.zipcode.length === 6) {
        try {
          const response = await axios.get(
            `https://api.postalpincode.in/pincode/${basicInfo.zipcode}`
          );
          if (response.data && response.data[0].Status === "Success") {
            const postOffice = response.data[0].PostOffice[0];
            setPincodeLookup({
              district: postOffice.District,
              block: postOffice.Block || postOffice.Name,
              state: postOffice.State,
              country: postOffice.Country,
            });

            // Auto-fill the basic info with pincode details
            setBasicInfo((prev) => ({
              ...prev,
              country: postOffice.Country,
              state: postOffice.State,
              district: postOffice.District,
              block: postOffice.Block || postOffice.Name,
              address: `${postOffice.Block},P.O: ${postOffice.Name}`,
            }));
          }
        } catch (error) {
          console.error("Error fetching pincode details:", error);
        }
      }
    };

    const timer = setTimeout(() => {
      lookupPincode();
    }, 500);

    return () => clearTimeout(timer);
  }, [basicInfo.zipcode]);

  //-------------------off
  // Update order address when sameAsBasic is checked
  // useEffect(() => {
  //   if (sameAsBasic) {
  //     setOrderAddress({
  //       name:userData.name,
  //       country: basicInfo.country,
  //       state: basicInfo.state,
  //       district: basicInfo.district,
  //       block:basicInfo.block,
  //       zipcode: basicInfo.zipcode,
  //       address: basicInfo.address,
  //       address2: '',
  //       phone: basicInfo.phone
  //     });
  //   }
  // }, [sameAsBasic, basicInfo]);
  //-------------------off--------------

  const handleNextStep = () => setStep(step + 1);
  const handlePreviousStep = () => setStep(step - 1);

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo((prev) => ({ ...prev, [name]: value }));
  };

  //-------------------off--------------
  // const handleOrderAddressChange = (e) => {
  //   const { name, value } = e.target;
  //   setOrderAddress((prev) => ({ ...prev, [name]: value }));
  // };
  //-------------------off--------------

  const saveProfile = async () => {
    try {
      setIsLoading(true);
      console.log(userData, basicInfo, extra);
      // const
      const { name, email } = userData;
      const {
        gender,
        country,
        state,
        district,
        block,
        zipcode,
        address,
        phone,
      } = basicInfo;
      //orderAddress
      if (extra.Create) {
        // create profile
        const create_flag = extra.Create;
        const save = await api.post("/api/profile", {
          name,
          email,
          gender,
          country,
          state,
          district,
          block,
          pincode: zipcode,
          address,
          phone,
          create_flag,
        });
        console.log(`data save: ${save}`);
        console.log(save);

        // check and set alert accordingly
        if (save.data.response) {
          // update all feilds with updated data
          setUserData({
            name: save.data.data.name,
            email: save.data.data.email,
          });

          setBasicInfo({
            ...save.data.data,
            zipcode: save.data.data.pincode,
          });
          //setOrderAddress(save.data.data.orderAddress);
          setextra({
            ...extra,
            Create: false,
          });

          Success_Alert(save.data.message);
        } else {
          Success_Alert(save.data.message, true);
        }
      } else {
        //update
        const create_flag = extra.Create;
        const save = await api.post("/api/profile", {
          name,
          email,
          gender,
          country,
          state,
          district,
          block,
          pincode: zipcode,
          address,
          phone,
          create_flag,
        });
        console.log(save);
        if (save.data.response) {
          // update all feilds with updated data
          setUserData({
            name: save.data.data.name,
            email: save.data.data.email,
          });

          setBasicInfo({
            ...save.data.data,
            zipcode: save.data.data.pincode,
          });
          //setOrderAddress(save.data.data.orderAddress);

          Success_Alert(save.data.message);
        } else {
          Success_Alert(save.data.message);
        }
        // setStep(2);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Success_Alert("Failed to update profile", true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className="p-4 container body-bg-color d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 container body-bg-color">
      {/* Stepper */}
      {/* <div className="row p-3 mb-3">
        <h2 className="text-center col-md-6 body-text-color fs-2 fw-bold">Profile Page</h2>
        <div className="d-flex justify-content-center align-items-center stepper-container-unique col-md-6">
          <div className={`step-unique ${step >= 0 ? 'completed-unique' : ''}`}>
            {step >= 0 ? '✓' : '1'}
          </div>
          <div className="line-unique"></div>
          <div className={`step-unique ${step >= 1 ? 'completed-unique' : ''}`}>
            {step >= 1 ? '✓' : '2'}
          </div>
        </div>
      </div> */}

      {/* Section 1: Basic Information */}
      {/* {step === 0 && ( */}
      <div className="p-4 row body-text-color">
        <h4 className="body-text-color fw-bold">Basic Information</h4>
        <hr className="p-3 mb-5" />

        <div className="text-center mb-4 col-md-2 position-relative">
          {profilePhoto && (
            <>
              <img
                src={profilePhoto}
                alt="Profile"
                className="rounded-circle profile-photo"
              />
              {/* <label htmlFor="photo-upload" className="btn btn-sm btn-secondary position-absolute bottom-0 end-0">
                  <i className="bi bi-camera"></i>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="d-none"
                    onChange={handlePhotoUpload}
                  />
                </label> */}
            </>
          )}
        </div>

        <div className="mb-3 col-md-3">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            readOnly
          />
        </div>

        <div className="mb-3 col-md-4">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            readOnly
          />
        </div>

        <div className="mb-3 col-md-3">
          <label>Gender:</label>
          <select
            className="form-control"
            name="gender"
            value={basicInfo.gender}
            onChange={handleBasicInfoChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-3 col-md-3">
          <label>Phone:</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={basicInfo.phone}
            onChange={handleBasicInfoChange}
            required
          />
        </div>

        <div className="mb-3 col-md-3">
          <label>Zipcode:</label>
          <input
            type="text"
            className="form-control"
            name="zipcode"
            value={basicInfo.zipcode}
            onChange={handleBasicInfoChange}
            maxLength="6"
            required
          />
        </div>

        <div className="mb-3 col-md-3">
          <label>Country:</label>
          <input
            type="text"
            className="form-control"
            name="country"
            value={basicInfo.country}
            onChange={handleBasicInfoChange}
            required
          />
        </div>

        <div className="mb-3 col-md-3">
          <label>State:</label>
          <input
            type="text"
            className="form-control"
            name="state"
            value={basicInfo.state}
            onChange={handleBasicInfoChange}
            required
          />
        </div>
        <div className="mb-3 col-md-3">
          <label>District:</label>
          <input
            type="text"
            className="form-control"
            name="district"
            value={basicInfo.district}
            onChange={handleBasicInfoChange}
            required
          />
        </div>
        <div className="mb-3 col-md-3">
          <label>Block:</label>
          <input
            type="text"
            className="form-control"
            name="block"
            value={basicInfo.block}
            onChange={handleBasicInfoChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Address:</label>
          <textarea
            rows="3"
            className="form-control"
            name="address"
            value={basicInfo.address}
            onChange={handleBasicInfoChange}
            required
          />
        </div>

        <div className="d-flex justify-content-center align-items-center mt-4">
          <button
            className="btn bt-bgcolor body-light-text-color w-50 fw-bold"
            onClick={saveProfile}
            disabled={
              !userData.name ||
              !userData.email ||
              !basicInfo.phone ||
              !basicInfo.address ||
              !basicInfo.zipcode ||
              !basicInfo.block ||
              !basicInfo.district ||
              !basicInfo.state ||
              !basicInfo.gender
            }
          >
            {/* Next */}
            {isLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : extra.Create ? (
              "Save"
            ) : (
              "Update"
            )}
          </button>
        </div>
      </div>
      {/* )} */}

      {/* Section 2: Order Address */}
      {/* {step === 1 && (
        <div className="border p-4 rounded row body-text-color">
          <h4 className='body-text-color fw-bold'>Order Address</h4>

          <div className="form-check mb-3 ms-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={sameAsBasic}
              onChange={() => setSameAsBasic(!sameAsBasic)}
            />
            <label className="form-check-label">Same as Basic Information</label>
          </div>

          <div className="mb-3 col-md-3">
            <label>Name:</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={orderAddress.name}
              onChange={handleOrderAddressChange}
            />
          </div>

          <div className="mb-3 col-md-3">
            <label>Country:</label>
            <input
              type="text"
              className="form-control"
              name="country"
              value={orderAddress.country}
              onChange={handleOrderAddressChange}
            />
          </div>

          <div className="mb-3 col-md-3">
            <label>State:</label>
            <input
              type="text"
              className="form-control"
              name="state"
              value={orderAddress.state}
              onChange={handleOrderAddressChange}
            />
          </div>

          <div className="mb-3 col-md-3">
            <label>District:</label>
            <input
              type="text"
              className="form-control"
              name="district"
              value={orderAddress.district}
              onChange={handleOrderAddressChange}
              required
            /></div>
            <div className="mb-3 col-md-3">
              <label>Block:</label>
              <input
                type="text"
                className="form-control"
                name="block"
                value={orderAddress.block}
                onChange={handleOrderAddressChange}
                required
              />
            </div>
          <div className="mb-3 col-md-3">
            <label>Zipcode:</label>
            <input
              type="text"
              className="form-control"
              name="zipcode"
              value={orderAddress.zipcode}
              onChange={handleOrderAddressChange}
              maxLength="6"
            />
          </div>

          <div className="mb-3 col-md-3">
            <label>Phone:</label>
            <input
              type="text"
              className="form-control"
              name="phone"
              value={orderAddress.phone}
              onChange={handleOrderAddressChange}
            />
          </div>

          <div className="mb-3">
            <label>Address:</label>
            <textarea
              className="form-control"
              name="address"
              value={orderAddress.address}
              onChange={handleOrderAddressChange}
              rows="3"
            />
          </div>

          <div className="mb-3">
            <label>Address 2 (Optional):</label>
            <textarea
              className="form-control"
              name="address2"
              value={orderAddress.address2}
              onChange={handleOrderAddressChange}
              rows="3"
            />
          </div>

          <div className="d-flex align-items-center justify-content-between mt-4">
            <button
              className="btn border btn-light body-text-color w-25 fw-bold"
              onClick={handlePreviousStep}
            >
              Back
            </button>
            <button
              className="btn bt-bgcolor body-light-text-color w-25 fw-bold"
              onClick={saveProfile}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                extra.Create ? 'Save' : 'Update'
              )}
            </button>
          </div>
        </div>
      )} */}

      {/* Success View */}
      {/* {step === 2 && (
        <div className="p-5 text-center body-text-color">
          <div className="mb-4">
            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
          </div>
          <h3 className="mb-3">Profile Saved Successfully!</h3>
          <p>Your profile information has been saved.</p>
          <button
            className="btn bt-bgcolor body-light-text-color mt-3"
            onClick={() => setStep(0)}
          >
            Edit Profile
          </button>
        </div>
      )} */}
    </div>
  );
};

export default ProfilePage;
