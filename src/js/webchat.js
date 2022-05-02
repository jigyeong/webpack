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
    sessionStorage.setItem('users', JSON.stringify(users));
    sessionStorage.setItem('chatRooms', JSON.stringify(chatRooms));
});

window.addEventListener('DOMContentLoaded',(event)=>{
    
    if(sessionStorage.getItem('users')){
        users = JSON.parse(sessionStorage.getItem('users'));
        chatRooms = JSON.parse(sessionStorage.getItem('chatRooms'));
        rePaintData(chatRooms);
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
    
    inputUserName.addEventListener('keypress', function(e) {
        let key = e.key || e.keyCode;;
        if (key === 'Enter' || key === 13) {
            joinRoom();
        }
    });
});

function rePaintData(chatRooms){
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
        const chatRoom = new ChatRoom(user);
        chatRooms.push(chatRoom);

        drawNewRoom(user);
        noticeNewUser(user);
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
            <div id="footer_${user}" class="footerBox">
                <input id="inputbox" type="text" placeholder="내용을 입력해주세요" style="width:60%"/>
            </div>
        </div>
        `
    app.insertAdjacentHTML('beforeend',roomNode);
   
    const divAttendees = makeDivAttendees(user);
    const btnUsers = makeUsersButton(divAttendees);
    const btnSend = makeSendButton();
    const headerNode = document.getElementById('header_'+user);
    const footerNode = document.getElementById('footer_'+user);
    
    headerNode.appendChild(divAttendees);
    headerNode.appendChild(btnUsers);
    footerNode.appendChild(btnSend);
    
    btnSend.addEventListener('click', (e) => clickSendBtn(e));
    footerNode.children.inputbox.addEventListener('keypress', (e) => {
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
    users.forEach(user => divAttendees.innerHTML += user===roomOwner ? `${user}(나)</br>` : `${user}</br>` );

    return divAttendees;
}

function makeUsersButton(divAttendees){
    const btnNode = document.createElement('button');
    const btnTextNode = document.createTextNode('참여자');
    btnNode.className = 'btnUsers';
    btnNode.appendChild(btnTextNode);

    btnNode.onclick = (()=>{
        let isOpen = false;
        return function(){
            isOpen = !isOpen;
            divAttendees.style.display = isOpen ? 'block' : 'none';
        }
    })();

    return btnNode;
}

function makeSendButton(){
    const btnNode = document.createElement('button');
    const btnTextNode = document.createTextNode('전송');
    btnNode.appendChild(btnTextNode);
    btnNode.id='send';

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

class ChatRoom{
    constructor(user){
        this.owner = user;
        this.messages = [];
    }
}