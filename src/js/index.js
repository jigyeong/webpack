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

window.addEventListener('beforeunload', e => {

    e.preventDefault();
    sessionStorage.setItem('users', JSON.stringify(users));
    sessionStorage.setItem('chatRooms', JSON.stringify(chatRooms));
});

window.addEventListener('DOMContentLoaded',()=>{
    
    if(sessionStorage.getItem('users')){
        users = JSON.parse(sessionStorage.getItem('users'));
        const jsonParseData = JSON.parse(sessionStorage.getItem('chatRooms'));

        let chatRoom;
        jsonParseData.forEach(data=>{
            chatRoom = new ChatRoom({
                user:data.owner, 
                messages:data.messages,
                callback:{sendMessage},
            });
            chatRoom.redrawing(users);
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

        const chatRoom = new ChatRoom({user, callback:{sendMessage}});
        chatRoom.drawNewRoom(users);
        chatRooms.push(chatRoom);

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

    sendMessage({ user, message:'enter' });

    users.forEach(i => {
        if(i!==user) document.getElementById(`divAttendees_${i}`).innerHTML += `${user}</br>`
    });
}

function sendMessage({user, message}){
    let messageObj = { user, message, time: new Date().getTime() }
    chatRooms.forEach(function(chatRoom) {
        chatRoom.getMessages().push(messageObj);
        chatRoom.drawMessage(messageObj);
    });
}