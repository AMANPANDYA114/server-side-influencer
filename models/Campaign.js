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
  }
}, { timestamps: true });

const Campaign = mongoose.model("Campaign", campaignSchema);

module.exports = Campaign;
