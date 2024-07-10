// gửi yêu cầu kết bạn 
const listBtnAddfriend = document.querySelectorAll("[btn-add-friend]");
if(listBtnAddfriend) {
    listBtnAddfriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("add");
            // hàm closest là để truy vấn ra ptu cha 
            const userId = button.getAttribute("btn-add-friend");

            socket.emit("CLIENT_ADD_FRIEND", userId);
        });
    });
}
//hết gửi yêu cầu kết bạn 

// hủy kết bạn
const listBtnCancelfriend = document.querySelectorAll("[btn-cancel-friend]");
if(listBtnCancelfriend) {
    listBtnCancelfriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.remove("add");
            // hàm closest là để truy vấn ra ptu cha 
            const userId = button.getAttribute("btn-cancel-friend");

            socket.emit("CLIENT_CANCEL_FRIEND", userId);
        });
    });
}
// hết hủy kết bạn

//từ chối kết bạn
const listBtnRefusefriend = document.querySelectorAll("[btn-refuse-friend]");
if(listBtnRefusefriend) {
    listBtnRefusefriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("refuse");
            // hàm closest là để truy vấn ra ptu cha 
            const userId = button.getAttribute("btn-refuse-friend");

            socket.emit("CLIENT_REFUSE_FRIEND", userId);
        });
    });
}
//hết từ chối kết bạn

// chấp nhận lời mời kết bạn 
const listBtnAcceptfriend = document.querySelectorAll("[btn-accept-friend]");
if(listBtnAcceptfriend) {
    listBtnAcceptfriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("accepted");
            // hàm closest là để truy vấn ra ptu cha 
            const userId = button.getAttribute("btn-accept-friend");

            socket.emit("CLIENT_ACCEPT_FRIEND", userId);
        });
    });
}
//hết chấp nhận lời mời kết bạn 

// hủy kết bạn

const listBtnUnfriend = document.querySelectorAll("[btn-unfriend-friend]");
if(listBtnUnfriend) {
    listBtnUnfriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("unfriend");
            const userId = button.getAttribute("btn-unfriend-friend");
            socket.emit("CLIENT_UNFRIEND_FRIEND", userId);
        });
    });
}

// "SEVER_RETURN_LENGTH_ACCEPT_FRIEND" 
socket.on("SEVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
    const badgeUsersAccept = document.querySelector(`[badge-users-accept="${data.userId}"]`);
    badgeUsersAccept.innerHTML=data.lengthAccepFriends;
})
// end "SEVER_RETURN_LENGTH_ACCEPT_FRIEND"

// "SEVER_RETURN_INFO_LENGTH_ACCEPT_FRIEND"
socket.on("SEVER_RETURN_INFO_LENGTH_ACCEPT_FRIEND", (data) => {
    const dataUsersAccept = document.querySelector(`[data-users-accept="${data.userId}"]`);
    const newBoxUser = document.createElement("div");
    newBoxUser.classList.add("col-6");
    newBoxUser.setAttribute("user-id", data.infoUserA._id);
    newBoxUser.innerHTML=`
        <div class="box-user">
          <div class="inner-avatar">
            <img src="https://robohash.org/hicveldicta.png" alt="${data.infoUserA.fullName}">
        </div>
        <div class="inner-info">
            <div class="inner-name"> ${data.infoUserA.fullName}
        </div>
        <div class="inner-buttons">
            <button 
                class="btn btn-sm btn-primary mr-1" 
                btn-accept-friend="${data.infoUserA._id}" 
                >
                Chấp nhận
                </button>
                <button class="btn btn-sm btn-secondary mr-1" 
                    btn-refuse-friend="${data.infoUserA._id}" 
                >
                    Xóa
                </button>
                <button 
                    class="btn btn-sm btn-secondary mr-1" 
                    btn-deleted-friend="btn-deleted-friend" 
                    disabled="disabled"
                >   
                    Đã xóa
                </button>
                <button 
                    class="btn btn-sm btn-primary mr-1" 
                    btn-accepted-friend="btn-accepted-friend" 
                    disabled="disabled"
                >
                    Đã chấp nhận                                
                </button>
                </div>
            </div>
        </div>
    `
    dataUsersAccept.appendChild(newBoxUser);
    // nút xóa lời mời kết bạn  
    const buttonRefuse = newBoxUser.querySelector("[btn-refuse-friend]")
    buttonRefuse.addEventListener("click", () => {
        buttonRefuse.closest(".box-user").classList.add("refuse");
        // hàm closest là để truy vấn ra ptu cha 
        const userId = buttonRefuse.getAttribute("btn-refuse-friend");

        socket.emit("CLIENT_REFUSE_FRIEND", userId);
    });
    // nút chấp nhận lời mời kết bạn
    const buttonAccepted = newBoxUser.querySelector("[btn-accept-friend]");
    buttonAccepted.addEventListener("click", () => {
        buttonAccepted.closest(".box-user").classList.add("accepted");
        // hàm closest là để truy vấn ra ptu cha 
        const userId = buttonAccepted.getAttribute("btn-accept-friend");

        socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    });
    // khi a gửi kết bạn cho b thì danh sách người dùng của b xóa đi a 
    // const dataUserNotFriend = document.querySelector(`[data-users-not-friend="${data.userIdB}"]`);
    // if(dataUserNotFriend){
    //     const boxUserDelete = dataUserNotFriend.querySelector(`[user-id="${data.infoUserA._id}"]`);
    //     console.log(boxUserDelete);
    //     dataUserNotFriend.removeChild(boxUserDelete);
    // }

})
// end "SEVER_RETURN_INFO_LENGTH_ACCEPT_FRIEND" 

// SEVER_RETURN_ID_CANCEL_FRIEND 
socket.on("SEVER_RETURN_ID_CANCEL_FRIEND", (data) => {
    const dataUsersAccept = document.querySelector(`[data-users-accept="${data.userIdB}"]`);
    const boxUserIdA = dataUsersAccept.querySelector(`[user-id="${data.userIdA}"]`);
    dataUsersAccept.removeChild(boxUserIdA);
})
// end SEVER_RETURN_ID_CANCEL_FRIEND 


