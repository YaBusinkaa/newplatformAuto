const d = new Date()
d.setDate(d.getDate() + 1);
describe('Edit Lesson', () => {

    before('Очищаю предметы',() =>{
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
            url: Cypress.env('newPlatformApiUrl')+'/auth/me',
        }).as('matchedAuth') 

        cy.intercept({
            method: 'PUT',
            url: '**/lessons/**'
        }).as('matchedEditLesson')                            

        cy.visitGroup('id_subject', 'id_group')
        cy.wait('@matchedAuth')


        cy.contains('test_lesson')
        .parent().parent()
        .find('svg[data-testid="EditIcon"]')
        .wait(1000)
        .click()
        .wait(1000)          
    })

    afterEach(()=>{
        cy.deleteSubject('id_subject')
    })


    it('Основной сценарий - редактирование урока', () => {

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
        .clear()
        .wait(1000)
        .type('edit_lesson')
        .should('have.value', 'edit_lesson')

        cy.contains('Сохранить изменения')
        .parents('form')
        .find('button')
        .click()

        cy.wait('@matchedEditLesson').then(({response})=>{
            expect(response.statusCode).to.eq(200)
            expect(response.body.title).to.eq('edit_lesson')
        })

        cy.contains('Изменения сохранены!')
        .should('exist')
    
    })

  
})