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
    // 채팅 참가 버튼을 클릭하면 닉네임 입력 레이어가 나타납니다.
    let user = prompt('닉네임 설정');
    users.push(user);

    // 닉네임 입력 후 방이 생성되고 입장합니다.
    openNewRoom(user);

}

const openNewRoom = function(user){
    // makeRoomObject
    let chatRoom = new ChatRoomObj(user);
    chatRooms.push(chatRoom);

    // 새 User의 채팅방을 그린다
    drawingNewRoom(user);

    // 새 User의 입장 메시지를 모두에게 전송
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
    })
}

const drawingNewRoom = function(user){
    const rootNode = document.getElementById('app');
    const roomNode = `
    <div class="chatRoom" id="chatRoom_${user}">
            <div id="header" style="display: flex; text-align: center;">
                <p>${user}</p>
                <button style="right: 10px; position:absolute; height: 40px;">참가자</button>
            </div>
            <div id="messages_${user}">
            </div>
            <div id="bottom_${user}" style="bottom: 10px; position: absolute; width:100%; text-align:center;">
                <input id="inputbox" type="text" placeholder="내용을 입력해주세요" style="width:60%"/>
            </div>
        </div>
    `

    // send button + onclickListner  별도 추가
    rootNode.insertAdjacentHTML('beforeend',roomNode);
    let btnNode = document.createElement('button');
    let btnTextNode = document.createTextNode('전송');
    btnNode.appendChild(btnTextNode);
    btnNode.addEventListener('click', clickSendBtn);

    let bottomNode = document.getElementById('bottom_'+user);
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
}

function ChatRoomObj(user){
    this.owner = user;
    this.messages = [];
}