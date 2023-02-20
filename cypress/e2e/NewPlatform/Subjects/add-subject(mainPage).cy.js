describe('Add group', () => {

    beforeEach( () => {
        cy.login();
        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl')+'/users/count',
          }).as('matchedUrl')                           // Перехватываем get запрос auth me
        

        cy.intercept({
            method: 'POST',
            url: Cypress.env('newPlatformApiUrl')+'/subjects',
          }).as('matchedSubject')          
          
        cy.intercept({
            method: 'DELETE',
            url: '**/subjects/**',
          }).as('matchedDeleteSubject')   
          
        cy.visit(Cypress.env('newPlatformUrl'))

        cy.wait('@matchedUrl')

        cy.get('span')
        .contains('Создать предмет')
        .click()
        cy.wait(1000)

    })

    let abc = "abcdefghijklmnopqrstuvwxyz"; 
    let sub = "";
    while (sub.length < 6) {
        sub += abc[Math.floor(Math.random() * abc.length)]
    }
    

    it('Основной сценарий', () => {
        
        cy.get('input[name="newSubject"]')
        .type(sub)
        .should('have.value', sub)

        cy.get('button')
        .contains('Добавить предмет')
        .click()

        cy.wait('@matchedSubject').then(({response}) =>{
            expect(response.statusCode).to.eq(201)
            expect(response.body.title).to.eq(sub)
        })
    
        cy.contains('Предмет успешно создан!')
        .should('exist')
    })

})