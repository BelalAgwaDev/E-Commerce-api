const categoryRoute = require("./categoryRoute");
const subCategoryRoute = require("./subCategoryRoute");
const brandRoute = require("./brandRoute");
const productRoute = require("./productRoute");
const UserRoute = require("./userRoute");
const AuthRoute = require("./authRoute");
const ReviewRoute = require("./reviewRoute");
const WishListRoute = require("./wishListRoute");
const AddressRoute = require("./addressRoute");
const CouponRoute = require("./couponRoute");
const CartRoute = require("./CartRoute");
const OrderRoute = require("./orderRoute");

const mountRoute = (app) => {
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/subCategories", subCategoryRoute);
  app.use("/api/v1/brands", brandRoute);
  app.use("/api/v1/products", productRoute);
  app.use("/api/v1/users", UserRoute);
  app.use("/api/v1/auth", AuthRoute);
  app.use("/api/v1/reviews", ReviewRoute);
  app.use("/api/v1/wishList", WishListRoute);
  app.use("/api/v1/address", AddressRoute);
  app.use("/api/v1/coupon", CouponRoute);
  app.use("/api/v1/cart", CartRoute);
  app.use("/api/v1/order", OrderRoute);
};

module.exports = mountRoute;
