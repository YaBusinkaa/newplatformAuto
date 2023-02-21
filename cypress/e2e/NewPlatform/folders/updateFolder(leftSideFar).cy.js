describe('Update folder', () => {

    before (() => {
        cy.login()
        cy.getMyParentFolders('ParentFolder')
        cy.deleteParentFolder('id_parentFolder')
    })

    beforeEach(() => {
        cy.login();
        cy.createParentFolder('ParentFolder', 'id_parentFolder');
        cy.createFolder('Folder', 'id_folder', 'id_parentFolder');

        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl') + '/auth/me',
        }).as('matchedUrl')                           // Перехватываем get запрос auth me


        cy.intercept({
            method: 'PUT',
            url: '**/folders/**',
        }).as('matchedUpdateFolder')

        cy.intercept({
            method: 'DELETE',
            url: '**/folders/**',
        }).as('matchedDeleteFolders')   //для будущих поколений

        cy.visit(Cypress.env('newPlatformUrl'))

        cy.wait('@matchedUrl')

        cy.get('p')
            .contains('Моё')
            .click()
        cy.wait(1000)

        cy.get('p')
            .contains('ParentFolder')
            .click()
        cy.wait(1000)

        cy.contains(Cypress.env('Folder'))
            .parent()
            .parent()
            .find('[aria-haspopup="menu"]')
            .click()
            .then(($menu) => {
                let a = $menu.attr('aria-controls')
                cy.get('div[id="' + a + '"]')
                    .contains('Редактировать папку')
                    .click()
            });
    })

    afterEach(() => {
        cy.login()
        cy.getMyParentFolders('ParentFolder')
        cy.deleteParentFolder('id_parentFolder')
    })

    it('Основной сценарий - 2 символа', () => {

        cy.get('input[name="folderTitle"]')
            .clear()
            .type('fo')
            .should('have.value', 'fo')

        cy.get('button')
            .contains('Переименовать')
            .click()

        cy.wait('@matchedUpdateFolder').then(({ response }) => {
            expect(response.statusCode).to.eq(200)
        })

        cy.contains('Название папки успешно изменено')
            .should('exist')

    })
})