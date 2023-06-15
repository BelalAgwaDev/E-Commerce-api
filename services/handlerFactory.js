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

exports.updateOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const document = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }

    res.status(201).json({ data: document });
  });

exports.createOne = (model) =>
  asyncHandler(async (req, res) => {
    const document = await model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.getOne = (model, populateOpt) =>

  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let quary = model.findById(id);
    //build query
    if (populateOpt) {
      quary = quary.populate(populateOpt);
    }

    //execute query
    const document = await quary;

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }

    res.status(201).json({ data: document });
  });



exports.getAll = (model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObject) {
      filter = req.filterObject;
    }
    // build quary
    const apiFeatures = new ApiFeatures(model.find(filter), req.query)
      .pagination()
      .sorting()
      .Limitfields()
      .filterData()
      .search(modelName);

    //   execute mongose quary
    const { mongooseQuery, paginationRuslt } = apiFeatures;
    const document = await mongooseQuery;
    res.status(201).json({
      results: document.length,
      page: paginationRuslt.currentPage,
      data: document,
    });
  });
