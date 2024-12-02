const Brand = require("../models/brand");

console.log('Consignment path: ', require.resolve('../models/consignment'));
const Consignment = require('../models/consignment');

// const Consignment = require("../models/Consignment");

const Influencer = require("../models/influencers");
const Campaign = require("../models/Campaign");


const nodemailer = require("nodemailer");


exports.applyToCampaign = async (req, res) => {
  const { name, age, followers, following, email, campaignId } = req.body;

  // Validate required fields
  if (!name || !age || !followers || !following || !email || !campaignId) {
    return res.status(422).json({ error: "Please fill all the fields" });
  }

  // Log the email to ensure it's being passed correctly
  console.log('Email received:', email);

  // Check if email is valid
  if (!email || email.trim() === '') {
    return res.status(422).json({
      error: 'Please provide a valid email address.',
    });
  }

  try {
    // Fetch the campaign by ID
    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    // Check if the influencer's follower count falls within the campaign's follower range
    const [minFollowers, maxFollowers] = campaign.followerRange;

    if (followers < minFollowers || followers > maxFollowers) {
      // Send email notifying the influencer they are not eligible
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
          user: 'amanpandya318@gmail.com', // Use an actual email account for production
          pass: 'qoga tmdu copb gnkf', // Use correct password or environment variable
        },
      });

      const mailOptions = {
        from: 'amanpandya318@gmail.com',
        to: email,  // Make sure the email is valid here
        subject: "Campaign Application - Not Selected",
        text: `Dear ${name},\n\nThank you for applying to the campaign. Unfortunately, your follower count does not fall within the required range of ${minFollowers} to ${maxFollowers} followers. We encourage you to apply again when you meet the criteria.\n\nBest regards,\nThe Team`,
      };

      await transporter.sendMail(mailOptions);

      return res.status(400).json({
        success: false,
        message: `You are not eligible for this campaign due to your follower count being outside the required range of ${minFollowers} to ${maxFollowers}.`,
      });
    } else {
      // Eligible for the campaign, send email notifying them they are selected
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
          user: 'amanpandya318@gmail.com', // Use an actual email account for production
          pass: 'qoga tmdu copb gnkf', // Use correct password or environment variable
        },
      });

      const mailOptions = {
        from: 'amanpandya318@gmail.com',
        to: email,  // Make sure the email is valid here
        subject: "Campaign Application - Selected",
        text: `Dear ${name},\n\nCongratulations! You have been selected for the campaign. Your follower count falls within the required range, and we will reach out with the next steps soon.\n\nBest regards,\nThe Team`,
      };

      await transporter.sendMail(mailOptions);

      return res.status(200).json({
        success: true,
        message: "You have been selected for the campaign. Please check your email for further details.",
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
//   const { brandName, campaignType, startDate, endDate, budget, description, followerRange, tags } = req.body;
//   const brandId = req.userId; // Assuming the user is authenticated and we have the brand's ID in req.userId

//   // Log the incoming request data to track what the user is submitting
//   console.log("Received data:", req.body);

//   // Check if all required fields are provided
//   if (!brandName || !campaignType || !startDate || !endDate || !budget || !description || !followerRange || !tags) {
//     console.error("Missing required fields"); // Log missing fields
//     return res.status(422).json({ error: "Please fill all the fields" });
//   }

//   // Validate followerRange
//   if (!Array.isArray(followerRange) || followerRange.length !== 2 || followerRange[0] > followerRange[1]) {
//     return res.status(400).json({ error: "Invalid followerRange. It should be an array with two numbers: [min, max]" });
//   }

//   // Validate tags
//   if (!Array.isArray(tags) || tags.length === 0) {
//     return res.status(400).json({ error: "Tags should be an array with at least one element." });
//   }

//   try {
//     // Create a new campaign instance
//     const campaign = new Campaign({
//       brandName,
//       campaignType,
//       startDate,
//       endDate,
//       budget,
//       description,
//       followerRange,
//       tags,
//       brandId,
//     });

//     // Save the campaign to the database
//     await campaign.save();

//     // Log success message and campaign data, including followerRange and tags
//     console.log("Campaign created successfully:", {
//       brandName: campaign.brandName,
//       campaignType: campaign.campaignType,
//       startDate: campaign.startDate,
//       endDate: campaign.endDate,
//       budget: campaign.budget,
//       description: campaign.description,
//       followerRange: campaign.followerRange,  // Log the follower range
//       tags: campaign.tags,  // Log the tags
//       _id: campaign._id
//     });

//     // Respond with success
//     return res.status(200).json({
//       success: true,
//       message: "Campaign created successfully",
//       data: {
//         brandName: campaign.brandName,
//         campaignType: campaign.campaignType,
//         startDate: campaign.startDate,
//         endDate: campaign.endDate,
//         budget: campaign.budget,
//         description: campaign.description,
//         followerRange: campaign.followerRange,
//         tags: campaign.tags,
//         _id: campaign._id,
//         createdAt: campaign.createdAt,
//         updatedAt: campaign.updatedAt
//       },
//     });
//   } catch (err) {
//     // Log the error to track the exact issue
//     console.error("Error occurred during campaign creation:", err);

//     // Respond with a generic error message for server-side issues
//     return res.status(500).json({
//       error: "Something went wrong, please try again later",
//     });
//   }
// };




exports.createCampaign = async (req, res) => {
  // Get the brandId from the URL params
  const { brandId } = req.params;

  // Destructure other fields from the request body
  const { brandName, campaignType, startDate, endDate, budget, description, followerRange, tags } = req.body;

  // Log the incoming request data to track what the user is submitting (excluding brandId from the body)
  console.log("Received data:", req.body);
  console.log("Brand ID from params:", brandId); // Log the brandId from URL

  // Check if all required fields are provided (without the brandId in the body)
  if (!brandId || !brandName || !campaignType || !startDate || !endDate || !budget || !description || !followerRange || !tags) {
    console.error("Missing required fields"); // Log missing fields
    return res.status(422).json({ error: "Please fill all the fields" });
  }

  // Validate followerRange
  if (!Array.isArray(followerRange) || followerRange.length !== 2 || followerRange[0] > followerRange[1]) {
    return res.status(400).json({ error: "Invalid followerRange. It should be an array with two numbers: [min, max]" });
  }

  // Validate tags
  if (!Array.isArray(tags) || tags.length === 0) {
    return res.status(400).json({ error: "Tags should be an array with at least one element." });
  }

  try {
    // Create a new campaign instance using data from body and the brandId from URL params
    const campaign = new Campaign({
      brandName,
      campaignType,
      startDate,
      endDate,
      budget,
      description,
      followerRange,
      tags,
      brandId, // Use the brandId from the URL params
    });

    // Save the campaign to the database
    await campaign.save();

    // Log success message and campaign data
    console.log("Campaign created successfully:", {
      brandName: campaign.brandName,
      campaignType: campaign.campaignType,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      budget: campaign.budget,
      description: campaign.description,
      followerRange: campaign.followerRange,  // Log the follower range
      tags: campaign.tags,  // Log the tags
      _id: campaign._id
    });

    // Respond with success
    return res.status(200).json({
      success: true,
      message: "Campaign created successfully",
      data: {
        brandName: campaign.brandName,
        campaignType: campaign.campaignType,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        budget: campaign.budget,
        description: campaign.description,
        followerRange: campaign.followerRange,
        tags: campaign.tags,
        _id: campaign._id,
        createdAt: campaign.createdAt,
        updatedAt: campaign.updatedAt
      },
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



exports.getMyCampaigns = async (req, res) => {
  // Retrieve brandId from route parameters
  const brandId = req.params.brandId; 

  console.log("Brand ID:", brandId);  // Log the brandId

  try {
    // Fetch the campaigns that belong to the logged-in brand
    const campaigns = await Campaign.find({ brandId });

    if (!campaigns || campaigns.length === 0) {
      return res.status(404).json({
        error: "No campaigns found for this brand",
      });
    }

    // Return the campaigns in the response
    return res.status(200).json({
      success: true,
      message: "Campaigns fetched successfully",
      data: campaigns,
    });
  } catch (err) {
    console.error("Error fetching campaigns:", err);
    return res.status(500).json({
      error: "Something went wrong, please try again later",
    });
  }
};



exports.deleteCampaign = async (req, res) => {
  const { brandId, campaignId } = req.params;  // Getting brandId and campaignId from the route parameters

  try {
    // First, check if the campaign belongs to the specified brand (optional, if you want to enforce this check)
    const campaign = await Campaign.findOne({ _id: campaignId, brand: brandId });

    if (!campaign) {
      // If no campaign is found with the given brandId and campaignId, return 404
      return res.status(404).json({ message: 'Campaign already removed' });
    }

    // Attempting to delete the campaign by its ID
    await Campaign.findByIdAndDelete(campaignId);  

    // Return success message if the campaign is deleted
    return res.status(200).json({ message: 'Campaign deleted successfully' });
  } catch (err) {
    // Log the error and return 500 server error message
    console.error(err);
    return res.status(500).json({ message: 'Failed to delete campaign', error: err.message });
  }
};


exports.getAllCampaigns = async (req, res) => {
  try {
    // Fetch all campaigns, sorted by creation date, and include 'followerRange' and 'tags' fields
    const campaigns = await Campaign.find().sort({ createdAt: -1 }).select('brandName campaignType startDate endDate budget description followerRange tags _id createdAt updatedAt'); 

    if (!campaigns.length) {
      return res.status(404).json({
        success: false,
        message: "No campaigns found",
      });
    }

    // Return the response with the campaigns data
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

// exports.brandLogin = async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.status(422).json({ error: "Please add email or password" });
//   } else {
//     const userLogin = await Brand.findOne({ email: email, password: password });

//       // console.log(userLogin);

//     if (!userLogin) {
//       return res.status(422).json({ error: "User not found", success: false });
//     } else if (userLogin.valid === 0) {
//       return res
//         .status(425)
//         .json({
//           error: "Verification under process, You can't proceed.",
//           success: false,
//         });
//     } else {
//       //  const token = jwt.sign({ _id: userLogin._id }, "mynameisFenilsavaniandthisisoursdpproject");
//       const token = await userLogin.generateAuthToken();
//       const { fname } = userLogin;
//       // console.log(token);
//       if (token) {
//         res.cookie("jwtoken", token, {
//           expires: new Date(Date.now() + 2589200000),
//           httpOnly: true,
//         });
//         return res.status(200).json({
//           success: true,
//           message: "You are logged in",
//           token,
//           user: { fname },
//           type: "Influencer",
//         });
//       } else {
//         return res
//           .status(422)
//           .json({
//             error: "Something went wronge!! try later!!",
//             success: false,
//           });
//       }
//     }
//     // bcrypt
//     // .compare(password, user.password)
//     //     .then(doMatch => {
//     //         if (!doMatch) {
//     //             return res.status(422).json({ error: "Invalid password" });
//     //         }
//     //     })
//   }
// };



exports.brandLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please add email or password" });
  } else {
    try {
      const userLogin = await Brand.findOne({ email: email, password: password });

      // If no user is found
      if (!userLogin) {
        return res.status(422).json({ error: "User not found", success: false });
      } else if (userLogin.valid === 0) {
        return res.status(425).json({
          error: "Verification under process, You can't proceed.",
          success: false,
        });
      } else {
        // Log the brand ID here
        console.log("Brand ID:", userLogin._id);

        // Generate the token for the user
        const token = await userLogin.generateAuthToken();
        const { fname } = userLogin;

        // If the token is generated, set the cookie and return a success response
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
            brandId: userLogin._id,  // Include brandId in the response
            type: "Influencer",
          });
        } else {
          return res.status(422).json({
            error: "Something went wrong! Try later.",
            success: false,
          });
        }
      }
    } catch (err) {
      console.error("Error during login:", err);
      return res.status(500).json({
        error: "Internal server error, please try again later.",
        success: false,
      });
    }
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