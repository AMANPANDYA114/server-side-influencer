// const mongoose = require("mongoose");
// const { ObjectId } = mongoose.Schema.Types;

// const campaignSchema = new mongoose.Schema({
//   brandName: {
//     type: String,
//     required: true,
//   },
//   campaignType: {
//     type: String,
//     required: true,
//   },
//   startDate: {
//     type: Date,
//     required: true,
//   },
//   endDate: {
//     type: Date,
//     required: true,
//   },
//   budget: {
//     type: Number,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },

//   followerRange: {
//     type: [Number],
//     default: [],
//   },
//   tags: {
//     type: [String],
//     default: [],
//   },
  
// }, { timestamps: true });

// const Campaign = mongoose.model("Campaign", campaignSchema);

// module.exports = Campaign;


const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const campaignSchema = new mongoose.Schema({
  brandName: {
    type: String,
    required: true,
  },
  campaignType: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  followerRange: {
    type: [Number],
    default: [],
  },
  tags: {
    type: [String],
    default: [],
  },
  brandId: {
    type: ObjectId, // This references the brand that created the campaign
    ref: "Brand", // Assuming you have a 'Brand' model
    required: true, // Ensure this field is required for all campaigns
  },
}, { timestamps: true });

const Campaign = mongoose.model("Campaign", campaignSchema);

module.exports = Campaign;

