const Influencer = require('../models/influencers')
var id = '63c5825341af87b8073eaf87';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { response } = require('express');
const Consignment = require('../models/consignment');



// exports.influencerSignupdata = async (req, res) => {

//     const {
//         fname, lname, phone, email, city, state, country, password, gender,
//         age, instagram, instagramURL, instagramFollowers, instagramEngagementRate,
//         facebook, facebookURL, facebookFollowers, facebookEngagementRate,
//         twitter, twitterURL, twitterFollowers, twitterEngagementRate
//     } = req.body;


//     if (
//         !email ||
//         !fname ||
//         !lname ||
//         !phone ||
//         !age || !gender ||
//         !city || !state || !country ||
//         !instagram || !instagramURL || !password
//     ) {
//         return res.status(422).json({ error: "Please fill all the fields" });
//     }

//     try {
//         const data = await Influencer.findOne({ email: email });
//         if (data) {

//             return res.status(422).json({ error: "Email already exists", success: false });
//         }
//         const influencer = new Influencer(req.body);
//         influencer.save()

//         // console.log(influencer)
//         return res.status(200).json({ success: true, message: "Your data is under verification" });

//     } catch (err) {
//         return res.status(422).json({ error: "Something went wronge!! try later!!", success: false });

//     };

// };


exports.influencerSignupdata = async (req, res) => {

    const {
        fname, lname, phone, email, city, state, country, password, gender,
        age, instagram, instagramURL, instagramFollowers, instagramEngagementRate,
        facebook, facebookURL, facebookFollowers, facebookEngagementRate,
        twitter, twitterURL, twitterFollowers, twitterEngagementRate
    } = req.body;

    // Validate that all required fields are provided
    if (
        !email ||
        !fname ||
        !lname ||
        !phone ||
        !age || !gender ||
        !city || !state || !country ||
        !instagram || !instagramURL || !password
    ) {
        return res.status(422).json({ error: "Please fill all the fields" });
    }

    try {
        // Check if the email already exists
        const data = await Influencer.findOne({ email: email });
        if (data) {
            return res.status(422).json({ error: "Email already exists", success: false });
        }

        // Create a new influencer entry
        const influencer = new Influencer(req.body);

        // Save the influencer data directly (no verification step)
        await influencer.save();

        // Respond with success message
        return res.status(200).json({ success: true, message: "Your account has been created successfully" });

    } catch (err) {
        return res.status(422).json({ error: "Something went wrong! Please try again later.", success: false });
    };
};


exports.getAllInfluencer = async (req, res) => {
    const page = req.query.page;
    // console.log(req.query);
    const influencers = await Influencer
        .find({ valid: 1, Adsrequired: true })
        .skip((page - 1) * 6).limit(6)

    if (influencers) {
        res.status(200).json({ success: true, data: influencers })
    }
    // res.send(req.rootUser)

}



exports.getInfluencer = async (req, res) => {
    try {
      // Extract influencerId from URL parameters
      const { influencerId } = req.params;
  
      // Find the influencer by ID
      const influencer = await Influencer.findById(influencerId);
  
      if (!influencer) {
        return res.status(404).json({ error: "Influencer not found." });
      }
  
      res.status(200).json({
        success: true,
        data: influencer,  // Send the influencer data
      });
    } catch (err) {
      console.error("Error fetching influencer:", err);
      return res.status(500).json({ error: "Internal server error." });
    }
  };
  
exports.editProfiledisplay = (req, res) => {
    // res.send("hello from editProfiledisplay");
    // Influencer.findById(id)
    //     .then(res => console.log(res));

}

exports.updateProfile = async (req, res) => {
    const id = req.userId
    // const profle = req.file
    // console.log(req.body);
    // console.log(req)
    // const data=req.body;  
    const influencer = await Influencer.findByIdAndUpdate(id, { $set: req.body }, { new: true }).select("-tokens")
    if (!influencer) {
        return res.status(422).json({ message: "Data not updated!", success: false, data: influencer });
    } else {
        return res.status(200).json({ message: "Data updated successfully!", success: true, data: influencer });
    }

}

exports.uploadImage = async (req, res) => {
    const id = req.userId
    // console.log(req.body);
    var influencer = "";
    if (req.body.type == 1) {

        const profile = req.body.profile
        influencer = await Influencer.findByIdAndUpdate(id, { profile: profile }, { new: true }).select("-tokens")
    } else {
        const photo = req.body.photo
        influencer = await Influencer.findByIdAndUpdate(id, { photo: photo }, { new: true }).select("-tokens")
    }
    // console.log(influencer);
    if (!influencer) {
        return res.status(422).json({ message: "Image not updated!", success: false, data: influencer });
    } else {
        return res.status(200).json({ message: "Image updated successfully!", success: true, data: influencer });
    }
}




exports.influencerlogin = async (req, res) => {
    const { email, password } = req.body;
  
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(422).json({ error: "Please add email or password" });
    }
  
    try {
      // Find user by email and password
      const userLogin = await Influencer.findOne({ email: email, password: password });
  
      // If user is not found
      if (!userLogin) {
        return res.status(422).json({ error: "User not found", success: false });
      }
  
      // Generate authentication token
      const token = await userLogin.generateAuthToken();
  
      // Send response with influencer data including influencerId
      return res.status(200).json({
        success: true,
        message: "You are logged in",
        token,
        user: {
          fname: userLogin.fname,
          influencerId: userLogin._id,  // Include influencerId in the response
        },
        type: "Influencer",
      });
    } catch (err) {
      console.error("Error during login:", err);
      return res.status(500).json({
        error: "Something went wrong! Please try again later.",
        success: false,
      });
    }
  };
  

// exports.influencerlogin = async (req, res) => {
//     const { email, password } = req.body;
//     if (!email || !password) {
//         return res.status(422).json({ error: "Please add email or password" });
//     }
//     else {
//         const userLogin = await Influencer.findOne({ email: email, password: password });
//         // console.log(userLogin);

//         if (!userLogin) {
//             return res.status(422).json({ error: "User not found", success: false });
//         } else if (userLogin.valid === 0) {
//             return res
//                 .status(425)
//                 .json({ error: "Verification under process, You can't proceed.", success: false });
//         }
//         else {

//             //  const token = jwt.sign({ _id: userLogin._id }, "mynameisFenilsavaniandthisisoursdpproject");
//             var token = await userLogin.generateAuthToken()
//             const { fname } = userLogin;
//             // console.log(token)

//             if (token) {
//                 res.cookie('jwtoken', token, {
//                     expires: new Date(Date.now() + 2589200000),
//                     httpOnly: true
//                 })
//                 return res.status(200).json({
//                     success: true, message: "You are logged in",
//                     token, user: { fname }, type: "Influencer"
//                 });
//             } else {
//                 return res.status(422).json({ error: "Something went wronge!! try later!!", success: false });
//             }
//         }
//         // bcrypt
//         // .compare(password, user.password)
//         //     .then(doMatch => {
//         //         if (!doMatch) {
//         //             return res.status(422).json({ error: "Invalid password" });
//         //         }
//         //     })

//     }

// }
exports.influencerhome = (req, res) => {

}

exports.adrequired = async (req, res) => {
    const email = req.body.email;

    // const Adsrequired = req.body.Adsrequired;
    const id = req.userId;
    try {
        const data = await Influencer.findByIdAndUpdate(id, { $set: { Adsrequired: true } })
        // console.log(data);
        if (!data) {
            return res.status(400).json({ success: false, error: "Something went wronge!! try later!!" });
        }
        return res.status(200).json({ success: true, message: "Profile is now public to brand for Ads...!!!", data: data });
    } catch (err) {
        // console.log(err);
        return res.status(422).json({ success: false, message: "Something went wronge!! try later!!" });

    }
}


exports.adrequiredRemove = async (req, res) => {
    const email = req.body.email;

    // const Adsrequired = req.body.Adsrequired;
    const id = req.userId;
    try {
        const data = await Influencer.findByIdAndUpdate(id, { $set: { Adsrequired: false } })
        // console.log(data);
        if (!data) {
            return res.status(400).json({ success: false, error: "Something went wronge!! try later!!" });
        }
        return res.status(200).json({ success: true, message: "Ads request Removed...!!", data: data });
    } catch (err) {
        // console.log(err);
        return res.status(422).json({ success: false, message: "Something went wronge!! try later!!" });

    }
}

exports.getConnectedinf = async (req, res) => {
    // console.log(req.body);
    const id = req.body.id;
    // console.log(id);
    const data = await Consignment.find({
        brandId: id,
        shoprequest: 1,
        influencerrequest: 1,
    });
    // console.log(data.length);
    let influencers = new Array()
    let date = new Array()
    const promises = data.map(async (item) => {
        const id = item.influencerId
        const data = await Influencer.findById(id).select("-tokens").select("-password")
        influencers.push(data);
        date.push(item.Date)
    })
    Promise.all(promises).then(async (result) => {
        res.status(200).json({ success: true, data: influencers, date: date });
    })
}
