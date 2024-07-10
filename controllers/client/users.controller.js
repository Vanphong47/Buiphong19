const User = require("../../models/user.model");
const usersSocket = require("../../sockets/client/users.socket");
// [Get] /users/not-friend
module.exports.notFriend = async (req, res) => {
    // socket 
    usersSocket(res);
    // end socket 
    const userId = res.locals.user.id;
    const accepFriends = res.locals.user.accepFriends;
    const requestFriends = res.locals.user.requestFriends;
    const friendListId = res.locals.user.friendsList.map(item => item.user_id);

    const users = await User.find({
        $and: [
            { _id: { $ne: userId } },
            { _id: { $nin: requestFriends } }, // $nin: tìm những user không chứa trong mảng...... $in :tìm những user chứa trong mảng,
            { _id: { $nin: accepFriends } },
            { _id: { $nin: friendListId } }
        ],
        // cú pháp $and : kết hợp nhiều điều kiện trong moogose 
        status: "active",
        deleted: false
    }).select("id fullName avatar");
    console.log(users);
    res.render("client/pages/users/not-friend", {
        pageTitle: "Danh sách người dùng",
        users: users
    });
}

//[Get] /users/request
module.exports.request = async (req, res) => {
    // socket 
    usersSocket(res);
    // end socket     
    const requestFriends = res.locals.user.requestFriends;
    const users = await User.find({
        _id: { $in: requestFriends },
        status: "active", 
        deleted: false
    }).select("id fullName avatar")
    res.render("client/pages/users/request", {
        pageTitle: "Lời mời đã gửi",
        users: users
    });
}

//[Get] /users/accept
module.exports.accept = async (req, res) => {
    // socket 
    usersSocket(res);
    // end socket     
    const accepFriends = res.locals.user.accepFriends;
    const users = await User.find({
        _id: { $in: accepFriends },
        status: "active", 
        deleted: false
    }).select("id fullName avatar")
    res.render("client/pages/users/accept", {
        pageTitle: "Lời mời kết bạn",
        users: users
    });
}
//[Get] /users/friends
module.exports.friends = async (req, res) => {
    // socket 
    usersSocket(res);
    // end socket
    const friendListId = res.locals.user.friendsList.map(item => item.user_id);
    const users = await User.find({
        _id: { $in: friendListId },
        status: "active", 
        deleted: false
    }).select("id fullName avatar statusOnline");
    
    res.render("client/pages/users/friends", {
        pageTitle: "Danh sách bạn bè",
        users: users
    });
}
