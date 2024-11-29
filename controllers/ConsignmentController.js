




const Brand = require("../models/brand");  // Ensure the correct casing of the file
const Influencer = require("../models/Influencers");
const Consignment = require("../models/consignment");
const mongoose = require("mongoose");
const { response } = require("express");
const { ObjectId } = mongoose.Schema.Types;




exports.createConsignment = async (req, res, next) => {
  const brandId = req.userId;
  const influencerId = req.body.influencerId;

  const consignment = await Consignment.findOne({
    brandId: brandId,
    influencerId: influencerId,
  });
  if (consignment) {
    return res.status(400).json({
      success: false,
      error: "Consignment already exists with this influencer...",
    });
  }
  const newconsignment = new Consignment({
    brandId,
    influencerId,
    influencerrequest: 1,
    Date: new Date().toLocaleDateString(),
  });
  try {
    newconsignment.save();
    return res.status(200).json({
      success: true,
      data: { brandId, influencerId },
      message: "Request sent to influencer",
    });
  } catch (e) {
    return res.status(422).json({
      success: false,
      error: "Something went wrong",
    });
  }
};

exports.createConsignmentInf = async (req, res, next) => {
  const influencerId = req.userId;
  const brandId = req.body.brandId;

  const consignment = await Consignment.findOne({
    brandId: brandId,
    influencerId: influencerId,
  });
  if (consignment) {
    return res.status(400).json({
      success: false,
      error: "Consignment already exists with this Brand...",
    });
  }
  const newconsignment = new Consignment({
    brandId,
    influencerId,
    shoprequest: 1,
    Date: new Date().toLocaleDateString(),
  });
  try {
    newconsignment.save();
    return res.status(200).json({
      success: true,
      data: { brandId, influencerId },
      message: "Request sent to Brand",
    });
  } catch (e) {
    return res.status(422).json({
      success: false,
      error: "Something went wrong",
    });
  }
};

exports.getBrandRequest = async (req, res, next) => {
  const influencerId = req.userId;
  let array = new Array();
  const data = await Consignment.find({ influencerId, shoprequest: 0 });

  const promises = data.map(async (element) => {
    const id = element.brandId.toString();
    var data2 = await Brand.findById(id).select("-tokens");
    array.push(data2);
  });

  Promise.all(promises).then(() => {
    return res.status(200).json({ success: true, data: array });
  });
};

exports.getInfluenerPendingRequest = async (req, res, next) => {
  const influencerId = req.userId;
  let array = new Array();

  const cons = await Consignment.find({ influencerId, influencerrequest: 0 }).select("-tokens");

  const promises = cons.map(async (element) => {
    const id = element.brandId.toString();
    const data = await Brand.findById(id).select("-tokens");
    array.push(data);
  });

  Promise.all(promises).then(() => {
    return res
      .status(200)
      .json({ success: true, message: "data sent...", data: array });
  });
};

exports.acceptBrandReq = async (req, res) => {
  const influencerId = req.userId;
  const brandId = req.body._id;

  const data = await Consignment.findOneAndUpdate(
    { influencerId, brandId },
    { $set: { shoprequest: 1 } },
    { new: true }
  );
  if (!data) {
    return res
      .status(400)
      .json({ success: false, error: "Something went wrong" });
  }
  return res.status(200).json({ success: true, message: "Request accepted" });
};

exports.deleteBrandReq = async (req, res) => {
  const influencerId = req.userId;
  const brandId = req.body._id;

  const data = await Consignment.findOneAndDelete({ influencerId, brandId });
  if (!data) {
    return res
      .status(400)
      .json({ success: false, error: "Something went wrong" });
  }

  return res.status(200).json({ success: true, message: "Request Removed successfully!!" });
};

exports.acceptInfluencerReq = async (req, res) => {
  const brandId = req.userId;
  const influencerId = req.body._id;

  const data = await Consignment.findOneAndUpdate(
    { influencerId, brandId },
    { $set: { influencerrequest: 1 } },
    { new: true }
  );
  if (!data) {
    return res
      .status(400)
      .json({ success: false, error: "Something went wrong" });
  }
  return res.status(200).json({ success: true, message: "Request accepted successfully!!" });
};

exports.deleteInfluencerReq = async (req, res) => {
  const brandId = req.userId;
  const influencerId = req.body._id;

  const data = await Consignment.findOneAndDelete({ influencerId, brandId });
  if (!data) {
    return res
      .status(400)
      .json({ success: false, error: "Something went wrong" });
  }

  return res.status(200).json({ success: true, message: "Request Deleted successfully!!!" });
};

exports.getInfConsignment = async (req, res) => {
  const influencerId = req.userId;
  try {
    let array = new Array();
    let array2 = new Array();
    const data = await Consignment.find({
      influencerId,
      shoprequest: 1,
      influencerrequest: 1,
      acceptstatus: false,
    });
    const promises = data.map(async (element) => {
      const id = element.brandId;
      const data1 = await Brand.findById(id).select("-tokens");
      array2.push(element);
      array.push(data1);
    });
    Promise.all(promises).then(() => {
      return res
        .status(200)
        .json({ success: true, message: "data sent...", data: array, cons: array2 });
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: err,
    });
  }
};

exports.getBrandPendingRequest = async (req, res) => {
  const brandId = req.userId;
  const data = await Consignment.find({ brandId, shoprequest: 0 });

  let array = new Array();
  const promises = data.map(async (element) => {
    const id = element.influencerId.toString();
    var data2 = await Influencer.findById(id).select("-tokens");
    array.push(data2);
  });

  Promise.all(promises).then(() => {
    return res.status(200).json({ success: true, data: array });
  });
};

exports.getInfluencerRequest = async (req, res) => {
  const brandId = req.userId;
  const data = await Consignment.find({ brandId, influencerrequest: 0 });

  let array = new Array();
  const promises = data.map(async (element) => {
    const id = element.influencerId.toString();
    var data2 = await Influencer.findById(id).select("-tokens");
    array.push(data2);
  });

  Promise.all(promises).then(() => {
    return res.status(200).json({ success: true, data: array });
  });
};

exports.deleteBrandPendingRequest = async (req, res) => {
  const brandId = req.userId;
  const influencerId = req.body._id;

  const data = await Consignment.findOneAndDelete({ influencerId, brandId });
  if (!data) {
    return res
      .status(400)
      .json({ success: false, error: "Something went wrong" });
  }

  return res.status(200).json({ success: true, message: "Request Removed successfully!!" });
};

exports.getBrandConsignment = async (req, res) => {
  const brandId = req.userId;

  const data = await Consignment.find({
    brandId,
    shoprequest: 1,
    acceptstatus: false,
    influencerrequest: 1,
  });
  if (!data) {
    return res
      .status(400)
      .json({ success: false, error: "Something went wrong" });
  }

  let array = new Array();
  let array2 = new Array();

  const promises = data.map(async (element) => {
    const id = element.influencerId.toString();
    var data2 = await Influencer.findById(id).select("-tokens");
    array2.push(element);
    array.push(data2);
  });

  Promise.all(promises).then(() => {
    return res.status(200).json({
      success: true,
      message: "Request Sent",
      data: array,
      consignment: array2,
    });
  });
};



