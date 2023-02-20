describe('Edit task testing', () => {

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
        cy.createTask('test_task', 'id_lesson','id_task')    

        
        cy.intercept({
            method: 'PUT',
            url: '**/task/**'
        }).as('matchedUpdateTask')                           

        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl')+'/auth/me',
        }).as('matchedAuth')  

        cy.visitGroup('id_subject','id_group')

        
        cy.wait('@matchedAuth') 

        // cy.contains('testLesson')
        // .parent().parent()
        // .find('label')
        // .wait(1000)
        // .click()
        // .wait(1000)

        cy.contains('testLesson')
        .parent().parent().parent()
        .find('svg[data-testid="KeyboardArrowDownIcon"]')
        .wait(1000)
        .click()
        .wait(1000)

        cy.contains('test_task')
        .parent()
        .parent()
        .find('[data-testid="EditIcon"]')
        .click()
        .wait(500)
    })

    afterEach(() =>{
        cy.login()
        cy.getMySubjects('testSubject')
        cy.deleteAfterSubject('id_subject')
    })

    it('Основной сценарий - редактирование классной работы', () => {

        cy.get('input[name="title"]')
        .clear()
        .type('test')
        .should('have.value', 'test')

        cy.contains('Классной работой')
            .click()

        cy.contains('Домашним заданием')
            .click()

        cy.contains('Сохранить изменения')
        .parents('form')
        .find('button')
        .click()

        cy.wait('@matchedUpdateTask').then(({response})=>{
            expect(response.statusCode).to.eq(200)
            expect(response.body.type).to.eq('homework')
        })

        cy.contains('Изменения сохранены')
        .should('exist')
    
    })

})