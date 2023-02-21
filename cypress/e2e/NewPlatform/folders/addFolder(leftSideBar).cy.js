describe('Add folder', () => {

    before (() => {

        cy.login()
        cy.getMyParentFolders('testParent')
        cy.deleteParentFolder('id_parentFolder')
    })


    beforeEach( () => {
        cy.login();

        cy.createParentFolder('testParent', 'id_parent_folder')

        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl')+'/auth/me',
          }).as('matchedUrl')                           // Перехватываем get запрос auth me
        

        cy.intercept({
            method: 'POST',
            url: Cypress.env('newPlatformApiUrl')+'/folders',
          }).as('matchedFolder')          
          
        // cy.intercept({
        //     method: 'DELETE',
        //     url: '**/folders/**',
        //   }).as('matchedDeleteFolders')   //для будущих поколений
          
        cy.visit(Cypress.env('newPlatformUrl'))

        cy.wait('@matchedUrl')

        cy.get('p')
        .contains('Моё')
        .click()
        cy.wait(1000)

        cy.contains('testParent')
        .parent()
        .find('[data-testid="AddIcon"]')
        .click()

    })

    afterEach(() => {
        cy.login()
        cy.getMyParentFolders('testParent')
        cy.deleteParentFolder('id_parentFolder')
    })
    

    it('Основной сценарий - 2 символа', () => {
        
        cy.get('input[name="folderTitle"]')
        .type('fo')
        .should('have.value', 'fo')

        cy.get('button')
        .contains('Создать папку')
        .click()

        cy.wait('@matchedFolder').then(({response}) =>{
            expect(response.statusCode).to.eq(201)
        })
    
        cy.contains('Папка fo сохранена')
        .should('exist')
        
    })

})