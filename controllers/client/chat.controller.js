const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const chatSocket = require("../../sockets/client/chat.socket");
// [get] /chat 
module.exports.index = async (req, res) => {

    // socketIo 
    chatSocket(res);
    // end socketIo
    // lấy data in ra giao diện 
    const chats = await Chat.find({
        deleted: false,
    });
    for (const chat of chats) {
        const infoUser = await User.findOne({
            _id: chat.user_id,
        }).select("fullName");
        chat.infoUser=infoUser;
        
    }
    // hết lấy data in ra giao diện 
    console.log(chats);
    res.render("client/pages/chat/index", {
        pageTitle: "Chat",
        chats: chats
    })
}