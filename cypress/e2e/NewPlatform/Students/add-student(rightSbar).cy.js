describe('Add student', () => {

    before('Очищаю предметы и студентов',() =>{
        cy.tempMailId(Cypress.env('addStudentMail'))
        cy.deleteTempMails(Cypress.env('addStudentMail'))
        cy.login()
        cy.getUser(Cypress.env('addStudentMail'))
        cy.getMySubjects('test_subject')
        cy.deleteAfterSubject('id_subject')
        cy.deleteUser()
    })

    beforeEach( () => {
        cy.login();
        cy.createSubject('test_subject', 'id_subject')
        cy.createGroup('test_group', 'id_subject', 'id_group')

        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl')+'/users/count',
          }).as('matchedUrl')     
          
          cy.intercept({
            method: 'POST',
            url: Cypress.env('newPlatformApiUrl')+'/groups/user',
          }).as('matchedStudentAdd') 

          cy.intercept({
            method: 'GET',
            url: '**/groups/**',
          }).as('matchedGroups')
          
          cy.intercept({
            method: 'POST',
            url: '**/groups/**',
          }).as('matchedPostGroups')  

          cy.visit(Cypress.env('newPlatformUrl'))

          cy.wait('@matchedUrl')

          cy.contains('Предметы')
          .parent().parent().parent()
          .contains('test_subject')
          .click()

          cy.get('span').contains('test_group')
          .click()

          cy.wait('@matchedGroups').then(({response})=>{
            expect(response.statusCode).to.eq(200)
          })

          cy.contains('Студенты')
          .parent()
          .find('button')
          .click()
          cy.wait(1000)

          cy.get('button')
          .contains('По Email')
          .click()

    })

    afterEach(()=>{
        cy.deleteGroup('id_group')
        cy.deleteSubject('id_subject')
        cy.getUser(Cypress.env('addStudentMail'))
        cy.deleteUser()
        cy.deleteTempMails(Cypress.env('addStudentMail'))
    })

    it('Основной сценарий', () => {
        cy.get('input[name="userEmail"]')
        .type(Cypress.env('addStudentMail'))
        .should('have.value', Cypress.env('addStudentMail'))

        cy.contains('Добавить студента по email')
        .parent('form')
        .find('button')
        .click()
    
        cy.contains('Студент успешно добавлен')
        .should('exist')
        cy.wait(1000)

        cy.tempMailId(Cypress.env('addStudentMail'))
        cy.tempMailCode()
        cy.loginNewStudent()

        cy.wait('@matchedStudentAdd').then(({response})=>{
            expect(response.statusCode).to.eq(201)
          })
    })

   
})