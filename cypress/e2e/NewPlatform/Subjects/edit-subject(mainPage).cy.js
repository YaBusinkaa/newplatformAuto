describe('Add group', () => {

    before(()=>{
        cy.login()
        cy.getMySubjects('test_subject')
        cy.deleteAfterSubject('id_subject')
    })

    beforeEach( () => {
        cy.login();
        cy.createSubject('test_subject', 'id_subject')
        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl')+'/users/count',
          }).as('matchedUrl')                           // Перехватываем get запрос auth me
        
        cy.intercept({
            method: 'PUT',
            url: '**/title**',
          }).as('matchedTitle')          
                   
        cy.visit(Cypress.env('newPlatformUrl'))

        cy.wait('@matchedUrl')

        cy.contains('test_subject')
        .parent().parent()
        .find('svg[data-testid="ModeEditIcon"]')
        .parent('button')
        .click()

        cy.contains('Переименовать')
        .should('exist')

    })

    afterEach(()=>{
        cy.deleteSubject('id_subject')
    })

    let abc = "abcdefghijklmnopqrstuvwxyz"; 
    let sub = "";
    while (sub.length < 6) {
        sub += abc[Math.floor(Math.random() * abc.length)]
    }
    

    it('Основной сценарий', () => {
        
        cy.get('input[name="subject"]')
        .clear()
        .type(sub)
        .should('have.value', sub)

        cy.get('button')
        .contains('Сохранить изменения')
        .click()

        cy.wait('@matchedTitle').then(({response}) =>{
            expect(response.statusCode).to.eq(200)
            expect(response.body.title).to.eq(sub)
            expect(response.body.id).to.eq(Cypress.env('id_subject'))
        })
    
        cy.contains('Изменения сохранены!')
        .should('exist')
        
    })

})