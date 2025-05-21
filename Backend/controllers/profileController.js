const Profile = require("../models/profileModel");
const user = require("../models/User");
const axios = require("axios");

// Get location details from pincode API
async function getLocationDetails(pincode) {
  try {
    const response = await axios.get(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    if (response.data && response.data[0].Status === "Success") {
      const postOffice = response.data[0].PostOffice[0];
      return {
        district: postOffice.District,
        block: postOffice.Block || postOffice.Division,
        state: postOffice.State,
        country: postOffice.Country,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching location details:", error);
    return null;
  }
}

// Get or create profile
exports.getProfile = async (req, res) => {
  try {
    //1. find userid from session
    //2. find user_details ( name , user_id , email ) from profile
    //3. fetch user_profile from profile
    //4. if user not create profile then profile created
    //5. next time profile update
    const user_id = req.session.user_id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let user_details = await user.findById({ _id: user_id });
    if (!user_details)
      return res
        .status(401)
        .json({ message: "User Not Found", response: false });

    let user_profile = await Profile.findOne({ user_id: user_id });
    if (!user_profile)
      return res
        .status(200)
        .json({
          message: {user_details},
          response: true,
          Profile_State: "incomplete",
          Create:true,
          Update:false
        });

    res
      .status(200)
      .json({
        message: {user_details,user_profile},
        response: true,
        Profile_State: "complete",
        Create:false,
        Update:true
      });
  } catch (error) {
    console.error("Error getting profile:", error);
    res.status(500).json({ message: "Server error", error: error });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    
    const user_id = req.session.user_id;
    req.body.user_id=user_id;

    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if(req.body.create_flag){
        // create
        delete  req.body.create_flag
        const save=await Profile.create(req.body);
        if(!save) return res.status(401).json({ message: "Profile Not Created",response:false });
        return res.status(200).json({ message: "Profile Created",response:true,data:save });
    }else{
        //update
        delete  req.body.create_flag
        const updatedProfile = await Profile.findOneAndUpdate(
          { user_id: user_id }, //  match using user_id
          req.body,
          { new: true }
        );

      if (!updatedProfile) {
        return res.status(404).json({ message: "Profile not found", response: false });
      }

      return res.status(200).json({ message: "Profile Updated", response: true, data: updatedProfile });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
