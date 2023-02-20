describe('Add Task', () => {

    before('Очищаю группы и предметы',() =>{
        cy.login()
        cy.getMySubjects('test_subject')
        cy.deleteAfterSubject('id_subject')
    })

    beforeEach( () => {
        cy.login();
        cy.createSubject('test_subject', 'id_subject')
        cy.createGroup('test_group', 'id_subject', 'id_group')
        cy.createLesson('test_lesson', 'id_group', 'id_lesson')

        cy.intercept({
            method: 'GET',
            url: '**/groups/**',
        }).as('matchedUrl')
          
        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl')+'/auth/me',
        }).as('matchedAuth')

        cy.intercept({
            method: 'POST',
            url: '**/task**'
        }).as('matchedCreateTask')                            

        cy.visitGroup('id_subject','id_group')
        
        /*.then(({response})=> {
            expect(response.statusCode).to.eq(200)
        })*/
        
        cy.wait('@matchedAuth')
        cy.wait(1000)

        cy.contains('test_lesson')
        .parent().parent()
        .find('label')
        .wait(1000)
        .click()
        .wait(1000)

        cy.contains('test_lesson')
        .parent().parent().parent()
        .find('svg[data-testid="AddCircleIcon"]')
        .wait(1000)
        .click()
        .wait(1000)
    
    })

    afterEach(()=>{
        cy.deleteSubject('id_subject')
    })


    it('Основной сценарий - создание классной работы', () => {

        cy.get('input[name="title"]')
        .type('test_task')
        .should('have.value', 'test_task')

        cy.contains('Создать задание')
        .parents('form')
        .find('button')
        .click()

        cy.wait('@matchedCreateTask').then(({response})=>{
            expect(response.statusCode).to.eq(201)
            expect(response.body.title).to.eq('test_task')
            expect(response.body.type).to.eq('classwork')
        })

        cy.contains('Задание test_task успешно добавлено')
        .should('exist')
    
    })

    it('Основной сценарий - создание домашней работы', () => {

        cy.get('input[name="title"]')
        .type('test_task')
        .should('have.value', 'test_task')

        cy.contains('Классной работой')
        .click()
        .wait(1000)

        cy.contains('Домашним заданием')
        .click()
        .wait(1000)

        cy.contains('Создать задание')
        .parents('form')
        .find('button')
        .click()

        cy.wait('@matchedCreateTask').then(({response})=>{
            expect(response.statusCode).to.eq(201)
            expect(response.body.title).to.eq('test_task')
            expect(response.body.type).to.eq('homework')
        })

        cy.contains('Задание test_task успешно добавлено')
        .should('exist')
    
    })

})