export default class ChatRoom{

    constructor({user, messages=[], callback={}}){
        this.owner = user;
        this.messages = messages;
        this.callback = callback;
    }

    setMessages(messages){
        this.messages = messages;
    }

    getMessages(){
        return this.messages;
    }

    getOwner(){
        return this.owner;
    }

    drawMessage(messageObj){
        const chatRoomMessagesId = `messages_${this.owner}`;
        const chatRoomNode = document.getElementById(chatRoomMessagesId);
        let messageDiv;
    
        if(messageObj.message=='enter') {
            messageDiv=`<div class="enter">${messageObj.user} 님이 입장하셨습니다.</div>`
        }
        else if(this.owner!==messageObj.user){
            messageDiv=`<div style="float: left;width:50%;">${messageObj.user}</div><br/><div class="audience">${messageObj.message}</div>`;
        }
        else {
            messageDiv=`<div class="me">${messageObj.message}</div>`;
        }
        chatRoomNode.insertAdjacentHTML('beforeend',messageDiv);
        chatRoomNode.scrollTop = chatRoomNode.scrollHeight;
    }

    drawNewRoom(users){
        const roomNode = `
            <div class="chatRoom" id="chatRoom_${this.owner}">
                <div id="header_${this.owner}" style="display: flex;">
                    <p style="padding-left:20px">${this.owner}</p>
                   
                </div>
                <div id="messages_${this.owner}" class="messageBox">
                </div>
                <div id="footer_${this.owner}" class="footerBox">
                    <input id="inputbox" type="text" placeholder="내용을 입력해주세요" style="width:60%"/>
                </div>
            </div>
            `
        document.getElementById('app').insertAdjacentHTML('beforeend',roomNode);
       
        const divAttendees = this.makeDivAttendees(users);
        const btnUsers = this.makeUsersButton(divAttendees);
        const btnSend = this.makeSendButton();
        const headerNode = document.getElementById('header_'+this.owner);
        const footerNode = document.getElementById('footer_'+this.owner);
        
        headerNode.appendChild(divAttendees);
        headerNode.appendChild(btnUsers);
        footerNode.appendChild(btnSend);
        
        btnSend.addEventListener('click', (e) => this.clickSendBtn(e));
        footerNode.children.inputbox.addEventListener('keypress', (e) => {
            let key = e.key || e.keyCode;;
            if (key === 'Enter' || key === 13) {
                this.clickSendBtn(e);
            }
        });
    }
    
    makeDivAttendees(users){
        const divAttendees = document.createElement('div');
        divAttendees.className = 'divAttendees';
        divAttendees.id = `divAttendees_${this.owner}`;
        divAttendees.innerHTML = `<p style="font-weight:bold">참여자 목록</p>`
        users.forEach(user => divAttendees.innerHTML += user===this.owner ? `${user}(나)</br>` : `${user}</br>` );
    
        return divAttendees;
    }
    
    makeUsersButton(divAttendees){
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
    
    makeSendButton(){
        const btnNode = document.createElement('button');
        const btnTextNode = document.createTextNode('전송');
        btnNode.appendChild(btnTextNode);
        btnNode.id='send';
    
        return btnNode;
    }
    
    clickSendBtn(e){
        const sendUserId = e.target.parentNode.id.split('_')[1];
        const sendMessageNode = e.target.parentElement.children.inputbox;
        const message = sendMessageNode.value.trim();
    
        if(!message) return;

        this.callback.sendMessage({user : sendUserId, message});
        
        sendMessageNode.value='';
    }

    redrawing(users){
        this.drawNewRoom(users);
        this.getMessages().forEach(message => {
            this.drawMessage(message);
        });
    }
}