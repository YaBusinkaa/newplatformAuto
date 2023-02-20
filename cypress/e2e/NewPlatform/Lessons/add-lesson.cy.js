const d = new Date()
d.setDate(d.getDate() + 1);
describe('Add lesson', () => {

    before('Очищаю группы и предметы',() =>{
        cy.login()
        cy.getMySubjects('test_subject')
        cy.deleteAfterSubject('id_subject')
    })

    beforeEach( () => {
        cy.login();
        cy.createSubject('test_subject', 'id_subject')
        cy.createGroup('test_group', 'id_subject', 'id_group')
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
            url: '**/lessons**'
        }).as('matchedCreateLessons')                            

        cy.visitGroup('id_subject','id_group')
        cy.wait('@matchedAuth')
        cy.wait(1000)
        cy.get('svg[data-testid="AddCircleIcon"]')
        .parents('button')
        .click()
        cy.wait(2000)          
    })

    afterEach(()=>{
        cy.deleteSubject('id_subject')
    })


    it('Основной сценарий - создание урока', () => {

        cy.get('svg[data-testid="DateRangeIcon"]')
        .click({force: true})
        .wait(1000)
        
        cy.get('svg[data-testid="PenIcon"]')
        .click()
        .wait(1000)

        cy.get('input[placeholder="dd.mm.yyyy hh:mm"]')
        .clear()
        .type(d.toLocaleDateString()+' 12:000')

        cy.contains('Ок')
        .click()

        cy.get('input[name="title"]')
        .type('test_lesson')

        cy.contains('Создать новый урок')
        .parents('form')
        .find('button')
        .click()

        cy.wait('@matchedCreateLessons').then(({response})=>{
            expect(response.statusCode).to.eq(201)
            expect(response.body.title).to.eq('test_lesson')
        })

        cy.contains('Урок успешно создан')
        .should('exist')
    
    })
})