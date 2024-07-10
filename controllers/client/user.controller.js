const md5 = require("md5");
const User = require("../../models/user.model");
const Cart = require("../../models/cart.model");
const forgotPassword = require("../../models/forgot-password.model");
const generateHelpers = require("../../helpers/generate.helper");
const ForgotPassword = require("../../models/forgot-password.model");
const sendMailHelper = require("../../helpers/send-mail.helper");
// [Get] /user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng kí tài khoản"
    });
}
// [post] /user/register
module.exports.registerPost = async (req, res) => {
    const exitUser = await User.findOne({
        email: req.body.email,
    });
    if(exitUser){
        req.flash("error", "Email đã tồn tại!");
        res.redirect("back");
        return;
    }
    const infoUser = {
        fullName: req.body.fullName,
        email: req.body.email,
        avatar: req.body.avatar,
        password: md5(req.body.password),
        tokenUser: generateHelpers.generateRandomString(30)
    };
    console.log(infoUser);
    const user = new User(infoUser);
    await user.save();
    res.cookie("tokenUser", user.tokenUser);
    req.flash("success", "Tạo tài khoản thành công!");
    res.redirect("/");
}
// [Get] /user/login
module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập tài khoản"
    });
}
// [Get] /user/loginPost
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    const user = await User.findOne({
      email: email,
      deleted: false
    });
  
    if(!user) {
      req.flash("error", "Email không tồn tại!");
      res.redirect("back");
      return;
    }
  
    if(md5(password) != user.password) {
      req.flash("error", "Sai mật khẩu!");
      res.redirect("back");
      return;
    }
  
    if(user.status != "active") {
      req.flash("error", "Tài khoản đang bị khóa!");
      res.redirect("back");
      return;
    }
  
    res.cookie("tokenUser", user.tokenUser);
    await Cart.updateOne({
        _id: req.cookies.cartId,
    }, {
        user_id: user.id,
    })
    req.flash("success", "Đăng nhập thành công!");
    await User.updateOne({
        statusOnline: "online",
    });
    res.redirect("/");
  };
// [Get] /user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    req.flash("success", "Đăng xuất thành công!");
    await User.updateOne({
        _id: res.locals.user.id
    }, {
        statusOnline: "offline",
    });
    res.redirect("/");
}
// [Get] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Lấy lại mật khẩu"
    });
}
// [post] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;
    const user = User.findOne({
        email: email,
        deleted: false
    });
    if(!user) {
        req.flash("error", "Email không tồn tại!");
        res.redirect("back");
        return;
    }
    const otp = generateHelpers.generateRandomNumber(8);
    // cv1: lưu thông tin vào database
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now(),
    }
    const record = new forgotPassword(objectForgotPassword);
    await record.save();
    // cv2: gửi mã otp qua gmail
    const subject = `Mã OTP lấy lại mật khẩu`;
    const content = `Mã OTP của bạn là <b>${otp}</b>. Không chia sẻ với bất kì ai`;
    sendMailHelper.sendMail(email, subject, content);
    res.redirect(`/user/password/otp?email=${email}`); 
}
// [get] /user/password/otp 
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;
    res.render("client/pages/user/otp-password", {
        pageTitle: "Nhập mã OTP",
        email: email
    })
}
// [post] /user/password/otp 
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    const find = {
        email: email,
        otp: otp,
    };
    const result = await ForgotPassword.findOne(find);
    if(!result){
        req.flash("error", "OTP không hợp lệ!");
        res.redirect("back");
        return;
    }
    const user = await User.findOne({
        email: email,
    });
    res.cookie("tokenUser", user.tokenUser);
    res.redirect(`/user/password/reset`);
};
// [get] /user/password/reset 
module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/user/reset-password", {
        pageTitle: "Đổi mật khẩu",
    })
}
// [post] /user/password/reset 
module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;
    try {
        await User.updateOne({
            tokenUser: tokenUser,
        }, {
            password: md5(password),
        })
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }    
}
// [get] /user/info
module.exports.info = async (req, res) => {
    res.render("client/pages/user/info", {
        pageTitle: "Thông tin tài khoản",
    })
}     