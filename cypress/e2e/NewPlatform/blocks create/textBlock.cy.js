describe('Text block testing', () => {

    before('Очищаю группы и предметы',() =>{
        cy.login()
        cy.getMySubjects('testSubject')
        cy.deleteAfterSubject('id_subject')
    }) 


    beforeEach( () => {
        cy.login()
        cy.createSubject('testSubject','id_subject')
        cy.createGroup('testGroup','id_subject','id_group')
        cy.createLesson('testLesson','id_group','id_lesson')
        cy.createTask('testTask', 'id_lesson','id_task')

        
        cy.intercept({
            method: 'POST',
            url: '**/block/text**',
        }).as('matchedCreateText')                           

        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl')+'/auth/me',
        }).as('matchedAuth')  

        cy.visitGroup('id_subject','id_group')

        
        cy.wait('@matchedAuth') 

        cy.contains('testLesson')
        .parent()
        .parent()
        .find('[data-testid="KeyboardArrowDownIcon"]')
        .click()
        .wait(500)

        cy.contains('testTask')
        .parent()
        .parent()
        .find('[data-testid="KeyboardArrowDownIcon"]')
        .click()
        .wait(500)

        cy.contains('Для создания блока добавьте материал из меню слева или нажмите на кнопку')
        .click()
        .wait(500)

        cy.contains('Текст')
        .click()
        .wait(500)

        // cy.wait('@matchedUrlCount').then(({response}) =>{
        //     expect(response.statusCode).to.eq(200)
        // })*/

    })

    afterEach(() =>{
        cy.login()
        cy.getMySubjects('testSubject')
        cy.deleteAfterSubject('id_subject')
    })


    it('Основной сценарий - создание текстового блока', () => {
        cy.get('input[name="title"]')
        .type('Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex')


        cy.get('[role="textbox"]')
        .type('Lorem ipsum dolor sit amet,')

        cy.contains('Сохранить')
        .click()

        cy.wait('@matchedCreateText').then(({response}) =>{
            expect(response.statusCode).to.eq(201)
        })

        cy.contains('Ваш текст успешно добавлен')
        .should('exist')
    })

   
})