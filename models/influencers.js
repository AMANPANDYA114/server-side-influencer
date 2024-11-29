const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { ObjectId } = mongoose.Schema.Types;

const influencerSchema = new mongoose.Schema({
  fname: { type: String },
  lname: { type: String },
  gender: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  age: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  photo: { type: String, default: "https://bootdey.com/img/Content/avatar/avatar7.png" },
  instagram: { type: String },
  instagramURL: { type: String },
  instagramFollowers: { type: String },
  Adsrequired: { type: Boolean, default: true },
  instagramEngagementRate: { type: String },
  instagramComments: { type: String },
  facebook: { type: String },
  facebookURL: { type: String },
  facebookFollowers: { type: String },
  facebookEngagementRate: { type: String },
  facebookComments: { type: String },
  twitter: String,
  twitterURL: String,
  twitterFollowers: String,
  twitterEngagementRate: String,
  twitterComments: String,
  valid: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  count: { type: Number, default: 0 },
  feedbacks: [{
    brandId: { type: ObjectId, ref: "Shop" },
    review: { type: String },
    rating: { type: Number, default: 0 }
  }],
  tokens: [{
    token: { type: String, required: true }
  }],
  cat1: { type: String },
  cat2: { type: String },
  cat3: { type: String },
  discription: { type: String },
  profile: { type: String, default: "https://bootdey.com/img/Content/avatar/avatar7.png" },
  resetToken: { type: String },
  expireToken: { type: Date },
});

influencerSchema.methods.generateAuthToken = async function () {
  try {
    const newToken = jwt.sign({ _id: this._id }, "mynameisFenilsavaniandthisisoursdpproject");
    this.tokens = this.tokens.concat({ token: newToken });
    await this.save();
    return newToken;
  } catch (err) {
    console.log(err);
    return err;
  }
};

// Check if the model already exists
const influencer = mongoose.models.influencer || mongoose.model("influencer", influencerSchema);

module.exports = influencer;
