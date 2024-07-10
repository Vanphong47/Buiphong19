const User = require("../../models/user.model");
module.exports = (res) => {
    _io.once('connection', (socket) => {
        // khi a gửi yêu cầu cho b 
        socket.on("CLIENT_ADD_FRIEND", async (userIdB) => {
            const userIdA = res.locals.user.id;
            // thêm id của A vào acceptFriend của B 
            const existUserA = await User.findOne({
                _id: userIdB,
                accepFriends: userIdA
            });
            if(!existUserA){
                await User.updateOne({
                    _id: userIdB,
                },{
                    $push: { accepFriends: userIdA }
                });
            }
            // thêm id của B vào requestFriend của A
            const existUserB = await User.findOne({
                _id: userIdA,
                requestFriends: userIdB
            });
            if(!existUserB){
                await User.updateOne({
                    _id: userIdA,
                },{
                    $push: { requestFriends: userIdB }
                });
            }
            // lấy ra được độ dài của  acceptFriends của B để trả về cho B
            const infoUserB = await User.findOne({
                _id: userIdB
            }).select("accepFriends");
            const lengthAccepFriendsB = infoUserB.accepFriends.length;
            socket.broadcast.emit("SEVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userIdB,
                lengthAccepFriends: lengthAccepFriendsB
            });
            // khi a gửi kban cho b thi hiển thị thông tin lời mời kết bạn cho b 
            const infoUserA = await User.findOne({
                _id: userIdA,
            }).select("id fullName avatar");
            socket.broadcast.emit("SEVER_RETURN_INFO_LENGTH_ACCEPT_FRIEND", {
                userId: userIdB,
                infoUserA: infoUserA
            });

            
        });
        // khi a hủy gửi yêu cầu cho b 
        socket.on("CLIENT_CANCEL_FRIEND", async (userIdB) => {
            const userIdA = res.locals.user.id;
            // xóa id của A trong acceptFriend của B 
            await User.updateOne({
                _id: userIdB,
            },{
                $pull: { accepFriends: userIdA }
            });
            // hàm $pull là xóa user trong mảng; $push là thêm user trong mảng
            // xóa id của B trong requestFriend của A
            await User.updateOne({
                _id: userIdA,
            },{
                $pull: { requestFriends: userIdB }
            });
            // lấy ra được độ dài của  acceptFriends của B để trả về cho B
            const infoUserB = await User.findOne({
                _id: userIdB
            }).select("accepFriends");
            const lengthAccepFriendsB = infoUserB.accepFriends.length;
            socket.broadcast.emit("SEVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userIdB,
                lengthAccepFriends: lengthAccepFriendsB
            });
            // lấy ra user id của a trả về cho b
            socket.broadcast.emit("SEVER_RETURN_ID_CANCEL_FRIEND", {
                userIdA: userIdA,
                userIdB: userIdB,
            });                        
        });
        
        // khi a từ chối kết bạn b
        socket.on("CLIENT_REFUSE_FRIEND", async (userIdA) => {
            const userIdB = res.locals.user.id;
            // xóa id của B trong acceptFriend của A 
            await User.updateOne({
                _id: userIdB,
            },{
                $pull: { accepFriends: userIdA }
            });
            // hàm $pull là xóa user trong mảng; $push là thêm user trong mảng
            // xóa id của A trong requestFriend của B
            await User.updateOne({
                _id: userIdA,
            },{
                $pull: { requestFriends: userIdB }
            });
        });
        //khi a chấp nhận lời mời kết bạn b
        socket.on("CLIENT_ACCEPT_FRIEND", async (userIdA) => {
            const userIdB = res.locals.user.id;
            // thêm {user_id, room_chat_id} của A vào friendsList của B
            // xóa id của A trong accepFriends của B
            await User.updateOne({
                _id: userIdB,
            },{
                $push: { 
                    friendsList: {
                        user_id: userIdA,
                        room_chat_id: ""
                    },
                },
                $pull: { accepFriends: userIdA }
            });
            // thêm {user_id, room_chat_id} của B vào friendsList của A
            // xóa id của B trong requestFriends của A 
            await User.updateOne({
                _id: userIdA,
            },{
                $push: { 
                    friendsList: {
                        user_id: userIdB,
                        room_chat_id: ""
                    },
                },
                $pull: { requestFriends: userIdB }
            });                       
        });
        //Khi a hủy kết bạn với b
        socket.on("CLIENT_UNFRIEND_FRIEND", async (userIdA) => {
            const userIdB = res.locals.user.id;
            // xóa {user_id, room_chat_id} của A vào friendsList của B
            // xóa id của A trong accepFriends của B
            await User.updateOne({
                _id: userIdB,
            },{
                $pull: { 
                    friendsList: {
                        user_id: userIdA,
                        room_chat_id: ""
                    },
                },
                // $pull: { accepFriends: userIdA }
            });
            // thêm {user_id, room_chat_id} của B vào friendsList của A
            // xóa id của B trong requestFriends của A 
            await User.updateOne({
                _id: userIdA,
            },{
                $pull: { 
                    friendsList: {
                        user_id: userIdB,
                        room_chat_id: ""
                    },
                },
                // $pull: { requestFriends: userIdB }
            });                       
        });                                
    });
}
