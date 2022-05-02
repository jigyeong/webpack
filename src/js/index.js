'use stric';

import '../style/style.css'
import ChatRoom from './ChatRoom'

let elements = {};
let users = [];
let chatRooms = [];

['btnJoinRoom', 'inputUserName', 'btnEnter'].forEach(item => elements = {
    ...elements,
    [item]: document.getElementById(item)
})
const {btnJoinRoom, inputUserName, btnEnter} = elements;

window.addEventListener('beforeunload', (event) => {

    event.preventDefault();
    sessionStorage.setItem('users', JSON.stringify(users));
    sessionStorage.setItem('chatRooms', JSON.stringify(chatRooms));
});

window.addEventListener('DOMContentLoaded',()=>{
    
    if(sessionStorage.getItem('users')){
        users = JSON.parse(sessionStorage.getItem('users'));
        let jsonParseData = JSON.parse(sessionStorage.getItem('chatRooms'));

        let chatRoom;
        jsonParseData.forEach(data=>{
            chatRoom = new ChatRoom(data.owner, {sendMessage});
            chatRoom.setMessages(data.messages);
            chatRoom.drawNewRoom(users);
            chatRoom.getMessages().forEach(message => {
                chatRoom.drawMessage(message);
            });
            chatRooms.push(chatRoom);
        })
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

function joinRoom(){
    const user = inputUserName.value.trim();

    if(checkNameValiable(user)){
        
        document.querySelector('.modal').style.display='none';
        inputUserName.value='';
        
        users.push(user);
        const chatRoom = new ChatRoom(user, {sendMessage});
        chatRooms.push(chatRoom);

        chatRoom.drawNewRoom(users);
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
        time : new Date().getTime()
    }
    sendMessage(messageObj);

    users.forEach(i => {
        if(i!==user) document.getElementById(`divAttendees_${i}`).innerHTML += `${user}</br>`
    });
}

const sendMessage = function(messageObj){
    chatRooms.forEach(function(chatRoom) {
        chatRoom.getMessages().push(messageObj);
        chatRoom.drawMessage(messageObj);
    });
}