const Brand = require("../models/brand");
const Consignment = require("../models/consignment");
const Influencer = require("../models/influencers");
const Campaign = require("../models/campaign");


const nodemailer = require("nodemailer");

exports.applyToCampaign = async (req, res) => {
  const { name, age, followers, following, email } = req.body;

  // Validate required fields
  if (!name || !age || !followers || !following || !email) {
    return res.status(422).json({ error: "Please fill all the fields" });
  }

  try {
    // Check influencer eligibility (followers count should be above 10k)
    if (followers < 10000) {
      // Send email notifying the influencer they are not eligible
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
          user: 'amanpandya318@gmail.com', // Use an actual email account for production
          pass: 'qoga tmdu copb gnkf', // Make sure to use the correct password or environment variables for sensitive info
        },
      });

      const mailOptions = {
        from: 'amanpandya318@gmail.com',
        to: email, // Use the influencer's provided email
        subject: "Campaign Application - Not Eligible",
        text: `Dear ${name},\n\nThank you for applying to the campaign. Unfortunately, you are not eligible because your follower count is below the required 10k. We encourage you to keep growing your following and apply again later.\n\nBest regards,\nThe Team`,
      };

      await transporter.sendMail(mailOptions);

      return res.status(400).json({
        success: false,
        message: "You are not eligible for this campaign due to follower count",
      });
    } else {
      // Eligible for the campaign, send email notifying them they are eligible
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
          user: 'amanpandya318@gmail.com', // Use an actual email account for production
          pass: 'qoga tmdu copb gnkf', // Make sure to use the correct password or environment variables for sensitive info
        },
      });

      const mailOptions = {
        from: 'amanpandya318@gmail.com',
        to: email, // Use the influencer's provided email
        subject: 'Campaign Application - Eligibility Confirmed',
        text: `Dear ${name},\n\nThank you for applying to the campaign. We are pleased to inform you that you are eligible based on your follower count. We will reach out with further steps soon.\n\nBest regards,\nThe Team`,
      };

      await transporter.sendMail(mailOptions);

      return res.status(200).json({
        success: true,
        message: "You are eligible for the campaign. Please check your email for confirmation.",
      });
    }
  } catch (err) {
    console.error("Error applying to campaign:", err);
    return res.status(500).json({
      error: "Something went wrong, please try again later",
    });
  }
};

// exports.createCampaign = async (req, res) => {
//   const { brandName, campaignType, startDate, endDate, budget, description } = req.body;
//   const brandId = req.userId; // Assuming the user is authenticated and we have the brand's ID in req.userId

//   // Check if all fields are provided
//   if (!brandName || !campaignType || !startDate || !endDate || !budget || !description) {
//     return res.status(422).json({ error: "Please fill all the fields" });
//   }

//   try {
//     const campaign = new Campaign({
//       brandName,
//       campaignType,
//       startDate,
//       endDate,
//       budget,
//       description,
//       brandId,
//     });

//     await campaign.save();
//     return res.status(200).json({
//       success: true,
//       message: "Campaign created successfully",
//       data: campaign,
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       error: "Something went wrong, please try again later",
//     });
//   }
// };



exports.createCampaign = async (req, res) => {
  const { brandName, campaignType, startDate, endDate, budget, description } = req.body;
  const brandId = req.userId; // Assuming the user is authenticated and we have the brand's ID in req.userId

  // Log the incoming request data to track what the user is submitting
  console.log("Received data:", req.body);

  // Check if all required fields are provided
  if (!brandName || !campaignType || !startDate || !endDate || !budget || !description) {
    console.error("Missing required fields"); // Log missing fields
    return res.status(422).json({ error: "Please fill all the fields" });
  }

  try {
    // Create a new campaign instance
    const campaign = new Campaign({
      brandName,
      campaignType,
      startDate,
      endDate,
      budget,
      description,
      brandId,
    });

    // Save the campaign to the database
    await campaign.save();

    // Log success message and campaign data
    console.log("Campaign created successfully:", campaign);

    // Respond with success
    return res.status(200).json({
      success: true,
      message: "Campaign created successfully",
      data: campaign,
    });
  } catch (err) {
    // Log the error to track the exact issue
    console.error("Error occurred during campaign creation:", err);

    // Respond with a generic error message for server-side issues
    return res.status(500).json({
      error: "Something went wrong, please try again later",
    });
  }
};



exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 }); // Fetch all campaigns, sorted by creation date

    if (!campaigns.length) {
      return res.status(404).json({
        success: false,
        message: "No campaigns found",
      });
    }

    return res.status(200).json({
      success: true,
      data: campaigns,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Something went wrong, please try again later",
    });
  }
};

exports.brandSignUpData = async (req, res) => {
  const {
    uname,
    shopName,
    brandType,
    phone,
    email,
    city,
    state,
    country,
    address,
    location,
    password,
  } = req.body;

  if (
    !email ||
    !password ||
    !uname ||
    !brandType ||
    !phone ||
    !shopName ||
    !address || !city || !state || !country ||
    !location
  ) {
    return res.status(422).json({ error: "Please fill all the fields" });
  }
  try {

    const data = await Brand.findOne({ email: email });
    if (data) {
      return res.status(422).json({ error: "Email already exists", success: false });
    }
    const brand = new Brand(req.body);
    brand.save()
    // console.log(brand)
    return res.status(200).json({ success: true, message: "Your data is under verification" });

  } catch (err) {
    return res.status(422).json({ error: "Something went wronge!! try later!!", success: false });

  };
};

exports.brandhome = async (req, res) => {
  const page = req.query.page
  // console.log(req.query.page);
  const brand = await Brand.find({ valid: 1 })
    .skip((page - 1) * 3).limit(3)
  // if (brand) {
  //   let influencerArray = new Array();
  //   const promises = brand.map(async (element) => {

  //     const id = element._id;
  //     // console.log("id is",id);

  //     const cons = await Consignment.find({ brandId: id })
  //     if (cons) {
  //       const promises1 = cons.map(async (element1) => {

  //         // console.log(cons);
          // console.log(element1.influencerId);
  //         const _id = element1.influencerId;
  //         const influencer = await Influencer.findById(_id).select("-password").select("-tokens")
          // console.log(influencer);
  //         influencerArray.push(influencer);
  //       })

  //     }

  //   })
  // }
  // Promise.all(promises).then(() => {
  // console.log(influencerArray);
  // console.log(influencerArray.length);
  // })
  // return res.status(422).json({ success: false, message: "No brand found" });
  if (brand) {
    return res.status(200).json({ success: true, data: brand });
  }

};

exports.brandLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please add email or password" });
  } else {
    const userLogin = await Brand.findOne({ email: email, password: password });

      // console.log(userLogin);

    if (!userLogin) {
      return res.status(422).json({ error: "User not found", success: false });
    } else if (userLogin.valid === 0) {
      return res
        .status(425)
        .json({
          error: "Verification under process, You can't proceed.",
          success: false,
        });
    } else {
      //  const token = jwt.sign({ _id: userLogin._id }, "mynameisFenilsavaniandthisisoursdpproject");
      const token = await userLogin.generateAuthToken();
      const { fname } = userLogin;
      // console.log(token);
      if (token) {
        res.cookie("jwtoken", token, {
          expires: new Date(Date.now() + 2589200000),
          httpOnly: true,
        });
        return res.status(200).json({
          success: true,
          message: "You are logged in",
          token,
          user: { fname },
          type: "Influencer",
        });
      } else {
        return res
          .status(422)
          .json({
            error: "Something went wronge!! try later!!",
            success: false,
          });
      }
    }
    // bcrypt
    // .compare(password, user.password)
    //     .then(doMatch => {
    //         if (!doMatch) {
    //             return res.status(422).json({ error: "Invalid password" });
    //         }
    //     })
  }
};

exports.getBrandData = async (req, res) => {
  const brand = req.rootUser;
  res.json({ data: brand });
};

exports.updateProfile = async (req, res) => {
  const id = req.userId
  // const profle = req.file
  // console.log(req.body);

  const brand = await Brand.findByIdAndUpdate(id, { $set: req.body }, { new: true }).select("-tokens")
  if (!brand) {
    return res.status(422).json({ message: "Data not updated!", success: false, data: brand });
  } else {
    return res.status(200).json({ message: "Data updated successfully!", success: true, data: brand });
  }

}

exports.logoUpload = async (req, res) => {
  const id = req.userId
  // console.log(req.body);
  var brand = "";
  if (req.body.type == 1) {
    const logo = req.body.logo
    brand = await Brand.findByIdAndUpdate(id, { logo: logo }, { new: true }).select("-tokens")

  } else {
    const photo1 = req.body.photo1
    brand = await Brand.findByIdAndUpdate(id, { photo1: photo1 }, { new: true }).select("-tokens")
  }
  // console.log(brand);
  if (!brand) {
    return res.status(422).json({ message: "Logo not updated!", success: false, data: brand });
  } else {
    return res.status(200).json({ message: "Logo updated successfully!", success: true, data: brand });
  }
}
exports.imageUpload = async (req, res) => {
  const id = req.userId
  // console.log(req.body);
  const image = req.body.image
  const brand = await Brand.findByIdAndUpdate(id, { $push: { images: { url: image } } }, { new: true }).select("-tokens")
  // console.log("hello");
  // console.log(brand);
  if (!brand) {
    return res.status(422).json({ message: "Image not updated!", success: false, data: brand });
  } else {
    return res.status(200).json({ message: "Image updated successfully!", success: true, data: brand });
  }
}

exports.getConnectedbrand=async(req,res)=>{
  // console.log(req.body);
    const id = req.body.id;
    // console.log(id);
    const data = await Consignment.find({
        influencerId: id,
        shoprequest: 1,
        influencerrequest: 1,
    });
    // console.log(data.length)
    let brand = new Array()
    let date = new Array()
    const promises = data.map(async (item) => {
        const id = item.brandId
        const data = await Brand.findById(id).select("-tokens").select("-password")
        brand.push(data);
        date.push(item.Date)
    })
    Promise.all(promises).then(async (result) => {
        res.status(200).json({ success: true, data: brand, date: date });
    })
}