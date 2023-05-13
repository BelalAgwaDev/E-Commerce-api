const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError/apiError");
const ApiFeatures = require("../utils/apiFeatures/apiFeatures");

exports.deleteOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }

    res
      .status(201)
      .json({ status: 201, message: `sucess to delete this document` });
  });


  exports.updateOne = (model) => asyncHandler(async (req, res, next) => {

    const document = await model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!document) {
      return next(new ApiError(`No document for this id ${req.params.id}`, 404));
    }
  
    res.status(201).json({ data: document });
  });