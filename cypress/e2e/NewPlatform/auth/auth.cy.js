describe('Authorization validation testing', () => {

    beforeEach( () => {
        cy.intercept({
            method: 'POST',
            url: Cypress.env('newPlatformApiUrl')+'/auth/login',
          }).as('matchedUrl')                           // Перехватываем post запрос login

        cy.visit(Cypress.env('newPlatformUrl'))
    })

    it('Основной сценарий', () => {
        cy.get('input[name="email"]')
        .type(Cypress.env('email'))
        .should('have.value', Cypress.env('email'))

        cy.get('input[name="password"]')
        .type(Cypress.env('pass'))
        .should('have.value', Cypress.env('pass'))

        cy.get('[data-testid="VisibilityOffIcon"]')
        .click()
        
        cy.get('input[name="password"]')  
        .invoke('attr', 'type')
        .should('eq', 'text')

        cy.get('button')
        .find('span').contains('Войти')
        .click()

        cy.wait('@matchedUrl').then(({response}) => {           // пока не завершится запрос не переходим к следующему шагу
            expect(response.statusCode).to.eq(201)
        })

        cy.contains('Здравствуйте, Ivan') 
        .should('exist')

    })

})
