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
        time : new Date().getTime()
    }
    sendMessage(messageObj);
}

const sendMessage = function(messageObj){
    // 현재 존재하는 채팅방 foreach
    chatRooms.forEach(function(chatRoom) {
        // 각 채팅방마다 push new message
        chatRoom.messages.push(messageObj);
        // 각 채팅방마다 drawing new message
        drawingMessage(chatRoom.owner, messageObj);
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
                <div style="border-radius: 0px 20px 20px 50px; background-color:lightgray; left:0; width: 50%; margin-bottom: 10px;">
                    dd
                </div>
                <div style="border-radius: 20px 0px 50px 20px; background-color:pink; right: 0px; width: 50%; margin-bottom: 10px;">
                    나의말
                </div>
            </div>
            <div id="bottom" style="bottom: 10px; position: absolute; width:100%; text-align:center;">
                <input type="text" placeholder="내용을 입력해주세요" style="width:60%"/>
                <button>전송</button>
            </div>
        </div>
    
    `
    rootNode.insertAdjacentHTML('beforeend',roomNode);
}

const drawingMessage = function(chatRoomOwner, messageObj){
    let chatRoomMessagesId = `messages_${chatRoomOwner}`;
    let chatRoomNode = document.getElementById(chatRoomMessagesId);
    let messageDiv;
    if(messageObj.message=='enter') messageDiv=`<div>${messageObj.user} 님이 입장하셨습니다.</div>`
    chatRoomNode.insertAdjacentHTML('beforeend',messageDiv);
}

function ChatRoomObj(user){
    this.owner = user;
    this.messages = [];
}