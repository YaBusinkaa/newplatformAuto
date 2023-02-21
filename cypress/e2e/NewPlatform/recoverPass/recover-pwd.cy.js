describe('Recover password validation testing', () => {

    before(()=>{
        cy.login()
        cy.getUser(Cypress.env('tempEmailTeacher'))
        cy.deleteUser()
        cy.createUser(Cypress.env('tempEmailTeacher'))
        cy.clearCookie('user')
    })

    beforeEach( () => {
        cy.intercept({
            method: 'POST',
            url: Cypress.env('newPlatformApiUrl')+'/auth/recover-pwd',
          }).as('matchedUrl')                           // Перехватываем post запрос login

        cy.visit(Cypress.env('newPlatformUrl'))

        cy.get('a').contains('Восстановить')
        .click()
    })

    after(()=>{
        cy.deleteUser()
    })

    it('Основной сценарий', () => {

        cy.get('input[name="email"]')
        .type(Cypress.env('tempEmailTeacher'))
        .should('have.value', Cypress.env('tempEmailTeacher'))

  
        cy.get('button').contains('ОТПРАВИТЬ ССЫЛКУ')
        .click()

        cy.wait('@matchedUrl').then(({response})=>{
            expect(response.statusCode).to.eq(201)
            expect(response.body.success).to.eq(true)
        })

        cy.contains('На указанный Email выслано письмо') 
        .should('exist')
    })

})