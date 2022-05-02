'use stric';

import '../style/style.css'

let elements = {};
let users, chatRooms;

['app', 'btnJoinRoom', 'inputUserName', 'btnEnter'].forEach(item => elements = {
    ...elements,
    [item]: document.getElementById(item)
})
const {app, btnJoinRoom, inputUserName, btnEnter} = elements;

window.addEventListener('beforeunload', (event) => {

    event.preventDefault();

    if(users!==null){
        sessionStorage.setItem('users', JSON.stringify(users));
        sessionStorage.setItem('chatRooms', JSON.stringify(chatRooms));
    }
});

window.addEventListener('DOMContentLoaded',(event)=>{
    
    if(sessionStorage.getItem('users')){
        users = JSON.parse(sessionStorage.getItem('users'));
        chatRooms = JSON.parse(sessionStorage.getItem('chatRooms'));
        rePaintData();
    }
    else {
        users = [];
        chatRooms = [];
    }

    btnJoinRoom.addEventListener('click', function(){
        document.querySelector('.modal').style.display='block';
        inputUserName.focus();
    });
    
    btnEnter.addEventListener('click',joinRoom);
    
    inputUserName.addEventListener('keypress', function(event) {
        let key = event.key || event.keyCode;;
        if (key === 'Enter' || key === 13) {
            joinRoom();
        }
    });
});

function rePaintData(){
    chatRooms.forEach(chatRoom => {
        drawNewRoom(chatRoom.owner);
        chatRoom.messages.forEach(message => {
            drawMessage(chatRoom.owner, message);
        });
    });
}

function joinRoom(){
    const user = inputUserName.value.trim();

    if(checkNameValiable(user)){
        document.querySelector('.modal').style.display='none';
        inputUserName.value='';
    
        users.push(user);
        openNewRoom(user);
    }
}

function checkNameValiable(user){
    if(users.includes(user)){
        alert('이미 존재하는 닉네임 입니다.')
        inputUserName.value='';
        return false;
    }
    if(!user){
        alert('닉네임을 입력해주세요.')
        inputUserName.value='';
        return false;
    }
    return true;
}

function openNewRoom(user){
    const chatRoom = new ChatRoomObj(user);
    chatRooms.push(chatRoom);

    drawNewRoom(user);
    noticeNewUser(user);
}

function noticeNewUser(user){
    const messageObj = {
        user : user,
        message : 'enter',
        time : new Date().getDate()
    }
    sendMessage(messageObj);

    users.forEach(i => {
        if(i!==user) document.getElementById(`divAttendees_${i}`).innerHTML += `${user}</br>`
    });
}

function sendMessage(messageObj){
    chatRooms.forEach(function(chatRoom) {
        chatRoom.messages.push(messageObj);
        drawMessage(chatRoom.owner, messageObj);
    });
}

function drawNewRoom(user){
    const roomNode = `
        <div class="chatRoom" id="chatRoom_${user}">
            <div id="header_${user}" style="display: flex;">
                <p style="padding-left:20px">${user}</p>
               
            </div>
            <div id="messages_${user}" class="messageBox">
            </div>
            <div id="bottom_${user}" class="bottomBox">
                <input id="inputbox" type="text" placeholder="내용을 입력해주세요" style="width:60%"/>
            </div>
        </div>
        `
    app.insertAdjacentHTML('beforeend',roomNode);
   
    const headerNode = document.getElementById('header_'+user);
    const bottomNode = document.getElementById('bottom_'+user);
    
    const divAttendees = makeDivAttendees(user);
    const btnUsers = makeUsersButton(divAttendees);
    const btnSend = makeSendButton();

    headerNode.appendChild(divAttendees);
    headerNode.appendChild(btnUsers);
    bottomNode.appendChild(btnSend);

    bottomNode.children.inputbox.addEventListener('keypress', function(e) {
        let key = e.key || e.keyCode;;
        if (key === 'Enter' || key === 13) {
            clickSendBtn(e);
        }
    });
}

function makeDivAttendees(roomOwner){
    const divAttendees = document.createElement('div');
    divAttendees.className = 'divAttendees';
    divAttendees.id = `divAttendees_${roomOwner}`;
    divAttendees.innerHTML = `<p style="font-weight:bold">참여자 목록</p>`
    let userText;
    users.forEach(user => {
        if(user==roomOwner) userText = user + '(나)</br>'
        else userText = user+'</br>'
        divAttendees.innerHTML += userText
    });

    return divAttendees;
}

function makeUsersButton(divAttendees){
    const btnNode = document.createElement('button');
    const btnTextNode = document.createTextNode('참여자');
    btnNode.className = 'btnUsers';
    btnNode.appendChild(btnTextNode);

    let clickUsersBtn = (function(){
        let isOpen = false;
        return function(){
            isOpen = !isOpen;
            divAttendees.style.display = isOpen ? 'block' : 'none';
        }
    })();
    btnNode.onclick = clickUsersBtn;

    return btnNode;
}

function makeSendButton(){
    const btnNode = document.createElement('button');
    const btnTextNode = document.createTextNode('전송');
    btnNode.appendChild(btnTextNode);
    btnNode.id='send';
    btnNode.addEventListener('click', clickSendBtn);

    return btnNode;
}

function clickSendBtn(e){
    const sendUserId = e.target.parentNode.id.split('_')[1];
    const sendMessageNode = e.target.parentElement.children.inputbox;
    const message = sendMessageNode.value.trim();

    if(!message) return;

    const messageObj = {
        user : sendUserId,
        message : message,
        time : new Date().getTime()
    }
    sendMessage(messageObj);
    sendMessageNode.value='';
}

function drawMessage(chatRoomOwner, messageObj){
    const chatRoomMessagesId = `messages_${chatRoomOwner}`;
    const chatRoomNode = document.getElementById(chatRoomMessagesId);
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