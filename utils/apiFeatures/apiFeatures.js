class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filterData() {
    const quaryStringObj = { ...this.queryString };
    const excludesFields = ["page", "sort", "limit", "fields", "keyword"];
    excludesFields.forEach((field) => delete quaryStringObj[field]);

    //apply filteration using [gte,gt,lte,lt]
    let quaryStr = JSON.stringify(quaryStringObj);
    quaryStr = quaryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(quaryStr));
    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  Limitfields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(modelName) {
    if (this.queryString.keyword) {
      const queryKeyword = {};
    if(modelName==="product"){
      queryKeyword.$or = [
        {
          title: {
            $regex: this.queryString.keyword,
            $options: "i",
          },
        },
        {
          description: {
            $regex: this.queryString.keyword,
            $options: "i",
          },
        },
      ];
    }else{
      queryKeyword.$or=  [{
        name: {
          $regex: this.queryString.keyword,
          $options: "i",
        },
      }]
    }
      this.mongooseQuery = this.mongooseQuery.find(queryKeyword);
    }
    return this;
  }

  pagination() {
    const paginate = {};
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = (page - 1) * limit;

    //paginate result
    paginate.currentPage = page;
    paginate.limit = limit;
    paginate.skip = skip;

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationRuslt = paginate;
    return this;
  }
}

module.exports = ApiFeatures;
