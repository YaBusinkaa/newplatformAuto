describe('Delete template lesson', () => {

    before (() => {

        cy.login()
        cy.getMyParentFolders('ParentFolder')
        cy.deleteParentFolder('id_parentFolder')
    })


    beforeEach(() => {
        cy.login();
        cy.createParentFolder('ParentFolder', 'id_parentFolder');
        cy.createFolder('folder', 'id_folder', 'id_parentFolder');
        cy.createForTemplateLesson('LessonForTemplate','id_lessonForTemplate')
        cy.createTemplateLesson('TemplateLesson',  'id_folder', 'id_lessonForTemplate', 'id_templateLesson');

        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl') + '/auth/me',
        }).as('matchedUrl')                           // Перехватываем get запрос auth me


        cy.intercept({
            method: 'DELETE',
            url: '**/material-templates/**',
        }).as('matchedTemplateDelete')

        cy.intercept({
            method: 'DELETE',
            url: '**/folders/**',
        }).as('matchedDeleteFolders')   

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

        cy.get('p')
            .contains('folder')
            .click()
        cy.wait(1000)

        cy.contains(Cypress.env('Folder'))
            .parent()
            .parent()
            .find('[aria-haspopup="menu"]')
            .eq(1)
            .click()
            .then(($menu) => {
                let a = $menu.attr('aria-controls')
                cy.get('div[id="' + a + '"]')
                    .contains('Удалить шаблон')
                    .click()
            })  
    })

    afterEach(() => {
        cy.login()
        cy.getMyParentFolders('testParent')
        cy.deleteParentFolder('id_parentFolder')
    })
    
    it('Основной сценарий - удаление шаблона', () => {

        cy.get('button[type="submit"]')
            .click()

        cy.wait('@matchedTemplateDelete').then(({ response }) => {
            expect(response.statusCode).to.eq(200)
        })

        cy.contains('Шаблон успешно удален')
            .should('exist')
    })


})