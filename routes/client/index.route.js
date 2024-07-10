const productRoutes = require("./product.route.js");
const homeRoutes = require("./home.route.js");
const searchRoutes = require("./search.route.js");
const categoryMiddleware = require("../../middlewares/client/category.middleware.js");
const cartMiddleware = require("../../middlewares/client/cart.milddleware.js");
const userMiddleware = require("../../middlewares/client/user.milddleware.js");
const cartRoute = require("./cart.route.js");
const checkoutRoute = require("./checkout.route.js");
const userRoute = require("./user.route.js");
const settingMiddleware = require("../../middlewares/client/setting.middleware");
const chatRoute = require("./chat.route.js");
const authMiddleware = require("../../middlewares/client/auth.middleware.js");
const usersRoute = require("./users.route.js");

module.exports = (app) => {
    app.use(userMiddleware.infoUser);

    app.use(categoryMiddleware.category);

    app.use(cartMiddleware.cart);

    app.use(settingMiddleware.settingGeneral);

    app.use("/", homeRoutes);
    
    app.use("/products", productRoutes);

    app.use("/search", searchRoutes);
    
    app.use("/cart", cartRoute);

    app.use("/checkout", checkoutRoute);

    app.use("/user", userRoute);

    app.use("/chat",authMiddleware.requireAuth, chatRoute);

    app.use("/users",authMiddleware.requireAuth, usersRoute);
}