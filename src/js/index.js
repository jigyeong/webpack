'use stric';

import '../style/style.css'

window.addEventListener('DOMContentLoaded',()=>{
    /*
     추후 localStorage 에서 data 뽑아옴
     */
    
});
const btnJoinRoom = document.getElementById("btnJoinRoom");
btnJoinRoom.addEventListener('click', joinRoom);

const users = [];
const chatRooms = [];

function joinRoom(){
    let user = prompt('닉네임 설정');
    users.push(user);
    openNewRoom(user);
}

const openNewRoom = function(user){

    let chatRoom = new ChatRoomObj(user);
    chatRooms.push(chatRoom);

    drawNewRoom(user);

    const messageObj = {
        user : user,
        message : 'enter',
        time : new Date().getDate()
    }
    sendMessage(messageObj);
}

const sendMessage = function(messageObj){
    // 현재 존재하는 채팅방 foreach
    chatRooms.forEach(function(chatRoom) {
        // 각 채팅방마다 push new message
        chatRoom.messages.push(messageObj);
        // 각 채팅방마다 drawing new message
        drawMessage(chatRoom.owner, messageObj);
    });
}

const drawNewRoom = function(user){
    const rootNode = document.getElementById('app');
    const roomNode = `
    <div class="chatRoom" id="chatRoom_${user}">
            <div id="header_${user}" style="display: flex; text-align: center;">
                <p>${user}</p>
                <div class="divUsers" id="divUsers_${user}"></div>
            </div>
            <div id="messages_${user}" class="messageBox">
            </div>
            <div id="bottom_${user}" class="bottomBox">
                <input id="inputbox" type="text" placeholder="내용을 입력해주세요" style="width:60%"/>
            </div>
        </div>
        `
    rootNode.insertAdjacentHTML('beforeend',roomNode);
   
    // Users Button
    let btnNode = document.createElement('button');
    let btnTextNode = document.createTextNode('참가자');
    btnNode.className = 'btnUsers';
    // btnNode.addEventListener('click', clickUsersBtn);
    btnNode.appendChild(btnTextNode);
    const headerNode = document.getElementById('header_'+user);
    headerNode.appendChild(btnNode);
    
    let divUsersNode = document.getElementById('divUsers_'+user);
    let clickUsersBtn = (function(){
        let isOpen = false;
        return function(){
            alert();
            isOpen = !isOpen;
            divUsersNode.style.display = isOpen ? 'block' : 'none';
        }
    })();
    btnNode.onclick = clickUsersBtn;

    // Send Button
    btnNode = document.createElement('button');
    btnTextNode = document.createTextNode('전송');
    btnNode.appendChild(btnTextNode);
    btnNode.addEventListener('click', clickSendBtn);

    const bottomNode = document.getElementById('bottom_'+user);
    bottomNode.appendChild(btnNode);
    bottomNode.children.inputbox.addEventListener('keyup', function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            btnNode.click();
        }
    });
}

function clickSendBtn(e){
    let sendUserId = e.target.parentNode.id.split('_')[1];
    let sendMessageNode = e.target.parentElement.children.inputbox;
    let message = sendMessageNode.value;

    const messageObj = {
        user : sendUserId,
        message : message,
        time : new Date().getTime()
    }
    sendMessage(messageObj);
    sendMessageNode.value='';
}

const drawMessage = function(chatRoomOwner, messageObj){
    let chatRoomMessagesId = `messages_${chatRoomOwner}`;
    let chatRoomNode = document.getElementById(chatRoomMessagesId);
    let messageDiv;

    if(messageObj.message=='enter') {
        messageDiv=`<div class="enter">${messageObj.user} 님이 입장하셨습니다.</div>`
    }
    else if(chatRoomOwner!==messageObj.user){
        messageDiv=`<div style="float: left;width:50%;">${messageObj.user}</div><br/><div class="audience">${messageObj.message}</div>`;
    }
    else {
        messageDiv=`<div class="me">${messageObj.message}</div>`;
    }
    chatRoomNode.insertAdjacentHTML('beforeend',messageDiv);
    chatRoomNode.scrollTop = chatRoomNode.scrollHeight;
}

function ChatRoomObj(user){
    this.owner = user;
    this.messages = [];
}