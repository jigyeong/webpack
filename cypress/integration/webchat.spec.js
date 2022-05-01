describe('webchat client test', ()=>{

    before(()=>{
        cy.window().then((win) => {
            win.sessionStorage.clear()
        })
    })

    it('successfully loads', () => {
        cy.visit('/');
    })
    
    it("브라우저 동일한 페이지 내에서 두 개 이상 채팅창을 동작시킬 수 있습니다.", ()=>{
        cy.get('#btnJoinRoom').click();
        cy.get('#inputUserName').type('대화상대1');
        cy.get('#btnEnter').click();
        cy.get('#btnJoinRoom').click();
        cy.get('#inputUserName').type('대화상대2');
        cy.get('#btnEnter').click();
        cy.get('.chatRoom').should('have.length',2)
    });

    it("채팅 참가 버튼을 클릭하면 닉네임 입력 레이어가 나타납니다.", ()=>{
        cy.get('#btnJoinRoom').click();
        cy.get('.modal').should('have.css', 'display', 'block');
    });

    it("닉네임 입력 후 방이 생성되고 입장합니다.", ()=>{
        cy.get('#inputUserName').type('대화상대3');
        cy.get('#btnEnter').click();
        cy.get('.chatRoom').should('have.length',3);
    })

    it("채팅방 1 에서 입력을 하면 다른방(ex.채팅방 2, 채팅방 3)도 같이 업데이트를 해줍니다.", ()=>{
        let message = '안녕하세요!';
        cy.get('#chatRoom_대화상대1').get('#inputbox').type(message);
        cy.get('#chatRoom_대화상대1').get('#send').click();
        cy.get('#app').find('.audience').should($=>{
            $.map((i,el)=>{
                expect(el.innerHTML).equal(message);
            })
        })
    })

    it("채팅방 사용자(본인)에 맞게 색상 등으로 메시지를 구분해서 표현해 줍니다.", ()=>{
        cy.get('.me')
        .invoke('css','background-color')
        .should('not.equal',
            cy.get('.audience').invoke('css','background-color')
        )
    })

    it("참여자가 추가될 때 메시지로 알려주고 참여자 목록을 업데이트 합니다.", ()=>{
        let newUser = '대화상대4'
        cy.get('#btnJoinRoom').click();
        cy.get('#inputUserName').type(newUser);
        cy.get('#btnEnter').click();
        cy.get('#messages_대화상대1').get('.enter').contains(newUser+' 님이 입장하셨습니다.');
        cy.get('#header_대화상대1').find('.btnUsers').click();
        cy.get('#divUsers_대화상대1').contains(newUser);
    });

    it("새로 참여한 사용자는 참여한 순간 이후부터 채팅을 보게 됩니다.", ()=>{
        cy.get('#messages_대화상대4').find('.audience').should('not.exist')
    })

    it("채팅내용은 브라우저에 저장되고 리로드하면 동일한 상태로 복구 해줍니다.", ()=>{
        cy.reload();
        cy.get('.chatRoom').should('have.length',4);
    })
});