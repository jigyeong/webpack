'use stric';

import '../style/style.css'

window.addEventListener('DOMContentLoaded',()=>{
    /*
     추후 localStorage 에서 data 뽑아옴
     */
    const btnJoinRoom = document.getElementById("btnJoinRoom");
    btnJoinRoom.addEventListener('click', joinRoom);

});

const users = [];
const chatRooms = [];

const joinRoom = function(){
    // 채팅 참가 버튼을 클릭하면 닉네임 입력 레이어가 나타납니다.
    let user = prompt('닉네임 설정');
    users.push(user);

    // 닉네임 입력 후 방이 생성되고 입장합니다.
    openNewRoom(user);

}

const openNewRoom = function(user){
    // 채팅 리스트 UI
    addChatList(user);

    // makeRoomObject
    let chatRoom = new ChatRoomObj(user);
    chatRooms.push(chatRoom);

    // 입장 메시지 전송
    const message = {
        name : user,
        message : 'enter',
        time : new Date().getTime()
    }
    sendMessage(message);
}

const addChatList = function(name){
    const chatList = document.getElementById('chatList');
    let node = document.createElement('div');
    node.innerHTML=`${name} 의 채팅방`
    chatList.appendChild(node);
}

const sendMessage = function(message){
    chatRooms.forEach(function(chatRoom) {
        chatRoom.messages.push(message);
    })
}

function ChatRoomObj(user){
    this.owner = user;
    this.messages = [];
}