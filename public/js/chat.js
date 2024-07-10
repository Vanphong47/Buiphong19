import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'


// upload images 
const upload = new FileUploadWithPreview.FileUploadWithPreview("upload-images", {
    multiple: true,
    maxFileCount: 6
});

// end upload images 

// client send message 
const formSendData = document.querySelector(".chat .inner-foot .inner-form");
console.log(formSendData);
if(formSendData){
    const input = formSendData.querySelector("input[name='content']");
    // console.log(input);
    formSendData.addEventListener("submit", (event) => {
        event.preventDefault();
        const contentData = input.value;
        const images = upload.cachedFileArray || [];
        // || images.length > 0 
        if(contentData|| images.length > 0  ){
            socket.emit("CLIENT_SEND_MESAGE", {
                content: contentData,
                images: images
            });
            input.value="";
            socket.emit("CLIENT_SEND_TYPING", "hidden");
            upload.resetPreviewPanel();
        }
    });
}

// end client send message 

// sever send message hiển thị realtime

socket.on("SEVER_SEND_MESSAGE", (data)=>{
    const body = document.querySelector(".chat .inner-body");
    const elementListTyping = body.querySelector(".inner-list-typing");
    const myId = document.querySelector("[my-id]").getAttribute("my-id");

    const div = document.createElement("div");
    let htmlFullName = "";
    let htmlContent = "";
    let htmlImage = ""; 

    if(myId!=data.userId){
        div.classList.add("inner-incoming");
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
    }else{
        div.classList.add("inner-outgoing");
    }
    if(data.content){
        htmlContent=`
            <div class="inner-content">${data.content}</div>
        `;
    }
    if(data.images.length > 0 ) {
        htmlImage += `<div class="inner-images">`
        for (const image of data.images) {
            htmlImage += `
            <img src=${image}>
        `;
        }
        htmlImage += `</div>`;
    }
    div.innerHTML = `
        ${htmlFullName}
        ${htmlContent}
        ${htmlImage}
    `;
    body.insertBefore(div, elementListTyping);
    body.scrollTop = body.scrollHeight;

    const gallery = new Viewer(div);
})
// end sever send message

// sử lí phần chát cuộn xg cuối cùng 
const bodyChat = document.querySelector(".chat .inner-body");
if(bodyChat){
    bodyChat.scrollTop = bodyChat.scrollHeight;
}

// show icon Chat


const buttonIcon = document.querySelector(".button-icon");
if(buttonIcon) {
    const tooltip = document.querySelector('.tooltip');
    Popper.createPopper(buttonIcon, tooltip)

    // show tooltit
    buttonIcon.addEventListener("click", () => {
        tooltip.classList.toggle('shown');
    })

    // insert icon to input 
    const emojiPicker = document.querySelector("emoji-picker");
    const inputChat = document.querySelector(".chat .inner-form input[name='content']");

    // insert icon 
    emojiPicker.addEventListener('emoji-click', event =>{
        const icon = event.detail.unicode;
        inputChat.value = inputChat.value + icon;
    });
    // show typing 
    var timeOut;
    inputChat.addEventListener("keyup", () => {
        socket.emit("CLIENT_SEND_TYPING", "show");

        clearTimeout(timeOut);
        
        timeOut= setTimeout(() => {
            socket.emit("CLIENT_SEND_TYPING", "hidden");
        }, 3000);
    });
}
// end show icon chat 


// "SEVER_RETURN_TYPING"
const elementListTyping = document.querySelector(".chat .inner-body .inner-list-typing");

socket.on("SEVER_RETURN_TYPING", (data) => {

    if(data.type == "show"){

        const existTyping = elementListTyping.querySelector(`.box-typing[user-id="${data.userId}"]`);


        if(!existTyping){
            const boxTyping = document.createElement("div");
            boxTyping.classList.add("box-typing");
            boxTyping.setAttribute("user-id", data.userId);
            boxTyping.innerHTML = `
                <div class="inner-name">${data.fullName}</div>
                <div class="inner-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;
            elementListTyping.appendChild(boxTyping);

        }
    }else {
        const boxTypingRemove = elementListTyping.querySelector(`.box-typing[user-id="${data.userId}"]`);
        if(boxTypingRemove) {
            elementListTyping.removeChild(boxTypingRemove);
        }
    }
})
// end "SEVER_RETURN_TYPING"

// preview image 
if(bodyChat){
    const gallery = new Viewer(bodyChat);
}
//end preview image 