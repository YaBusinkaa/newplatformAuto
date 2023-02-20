describe('Create template lesson', () => {


    beforeEach(() => {
        cy.login();
        cy.createParentFolder('ParentFolder', 'id_parentFolder');
        cy.createFolder('Folder', 'id_folder', 'id_parentFolder');
        cy.createForTemplateLesson('LessonForTemplate', 'id_lessonForTemplate');

        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl') + '/auth/me',
        }).as('matchedUrl')                           // Перехватываем get запрос auth me


        cy.intercept({
            method: 'POST',
            url: Cypress.env('newPlatformApiUrl') + '/material-templates',
        }).as('matchedTemplate')

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
                    .contains('Создать шаблон')
                    .click()
            })
        cy.get('ul>li[role="menuitem"]')
            .eq(5)
            .click()


    })

    afterEach(() => {
        cy.login()
        cy.deleteParentFolder('id_parentFolder')
    })

    it('Основной сценарий - 2 символа', () => {

        cy.get('input[name="title"]')
            .type('fo')
            .should('have.value', 'fo')

        cy.get('button[type="submit"]')
            .click()

        cy.wait('@matchedTemplate').then(({ response }) => {
            expect(response.statusCode).to.eq(201)
        })

        cy.contains('Шаблон fo создан')
            .should('exist')

    })

})