const Chat = require("../../models/chat.model");
const uploaToCloudinary = require("../../helpers/upload-to-cloudinary.helper");
module.exports = (res) => {
    const userID = res.locals.user.id;
    const userFullName = res.locals.user.fullName;
    _io.once('connection', (socket) => {
        // người dùng gửi tin nhắn nên sever 
        socket.on("CLIENT_SEND_MESAGE", async (data) => {
            const images = [];
            for (const image of data.images) {
                const url = await uploaToCloudinary(image);
                images.push(url);
            }
            // lưu vào data 
            const chat = new Chat({
                user_id: userID,
                content: data.content,
                images: images
            });
            await chat.save();
            // trả data ra giao diện realtime
            _io.emit("SEVER_SEND_MESSAGE", {
                userId: userID,
                fullName: userFullName,
                content: data.content,
                images: images
            });
        });

        // typing 
        socket.on("CLIENT_SEND_TYPING", (type) => {
            socket.broadcast.emit("SEVER_RETURN_TYPING", {
                userId: userID,
                fullName: userFullName,
                type: type
            });
        });
    });
}