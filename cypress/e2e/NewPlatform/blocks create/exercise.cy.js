describe('Exercise block testing', () => {

    before('Очищаю группы и предметы', () => {
        cy.login()
        cy.getMySubjects('testSubject')
        cy.deleteAfterSubject('id_subject')
    })


    beforeEach(() => {
        cy.login()
        cy.createSubject('testSubject', 'id_subject')
        cy.createGroup('testGroup', 'id_subject', 'id_group')
        cy.createLesson('testLesson', 'id_group', 'id_lesson')
        cy.createTask('testTask', 'id_lesson', 'id_task')


        cy.intercept({
            method: 'POST',
            url: '**/block/exercise**',
        }).as('matchedCreateExercise')

        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl') + '/auth/me',
        }).as('matchedAuth')

        cy.intercept({
            method: 'POST',
            url: 'https://uploader.ipst-dev.com/audio/upload',
        }).as('matchedUploaderAudio')

        cy.intercept({
            method: 'POST',
            url: 'https://uploader.ipst-dev.com/image/upload',
        }).as('matchedUploaderImage')

        cy.visitGroup('id_subject', 'id_group')


        cy.wait('@matchedAuth')

        cy.contains('testLesson')
            .parent()
            .parent()
            .find('[data-testid="KeyboardArrowDownIcon"]')
            .click()
            .wait(500)

        cy.contains('testTask')
            .parent()
            .parent()
            .find('[data-testid="KeyboardArrowDownIcon"]')
            .click()
            .wait(500)

        cy.contains('Для создания блока добавьте материал из меню слева или нажмите на кнопку')
            .click()
            .wait(500)

        cy.contains('Упражнение')
            .click()
            .wait(500)

        // cy.wait('@matchedUrlCount').then(({response}) =>{
        //     expect(response.statusCode).to.eq(200)
        // })*/

    })

    afterEach(() => {
        cy.login()
        cy.getMySubjects('testSubject')
        cy.deleteAfterSubject('id_subject')
    })


    it.skip('Основной сценарий - создание упражнения одиночный выбор', () => {

        //добавление общей информации
        cy.get('input[name="title"]')
            .type('aa')

        cy.get('textarea[name="text"]')
            .type('aa')

        cy.get('textarea[name="task"]')
            .type('aa')

        cy.contains('ДАЛЕЕ')
            .click()

        //добавление медиафайла

        cy.contains('Продолжить без медиафайла')
            .click()
        //добавление задания

        cy.get('textarea[name="text"]')
            .type('aa')

        cy.get('textarea[name="answer"]')
            .eq(0)
            .type('aa')

        cy.get('textarea[name="answer"]')
            .eq(1)
            .type('aa')

        cy.get('input[name="hint"]')
            .eq(0)
            .type('aa')

        cy.contains('СОХРАНИТЬ')
            .click()

        cy.wait('@matchedCreateExercise')

        cy.wait(1000)

        cy.contains('Выберите один правильный ответ:')
            .should('exist')

        cy.contains('Упражнение aa успешно создано')
            .should('exist')

    })

    it.skip('Основной сценарий - создание упражнения множественный выбор', () => {

        //добавление общей информации
        cy.get('input[name="title"]')
            .type('aa')

        cy.get('textarea[name="text"]')
            .type('aa')

        cy.get('textarea[name="task"]')
            .type('aa')

        cy.contains('ДАЛЕЕ')
            .click()

        //добавление медиафайла

        cy.contains('Продолжить без медиафайла')
            .click()

        //добавление задания
        cy.contains('Множественный выбор')
            .click()

        cy.get('textarea[name="text"]')
            .type('aa')

        cy.get('textarea[name="answer"]')
            .eq(0)
            .type('aa')

        cy.get('textarea[name="answer"]')
            .eq(1)
            .type('aa')

        cy.get('input[name="hint"]')
            .eq(0)
            .type('aa')

        cy.contains('СОХРАНИТЬ')
            .click()

        cy.wait('@matchedCreateExercise')

        cy.wait(1000)

        cy.contains('Выберите один или несколько правильных ответов:')
            .should('exist')

        cy.contains('Упражнение aa успешно создано')
            .should('exist')

    })

    it.skip('Основной сценарий - создание упражнения ввод текста', () => {

        //добавление общей информации
        cy.get('input[name="title"]')
            .type('aa')

        cy.get('textarea[name="text"]')
            .type('aa')

        cy.get('textarea[name="task"]')
            .type('aa')

        cy.contains('ДАЛЕЕ')
            .click()

        //добавление медиафайла

        cy.contains('Продолжить без медиафайла')
            .click()

        //добавление задания
        cy.contains('Ввод текста')
            .click()

        cy.get('textarea[name="text"]')
            .type('aa')

        cy.get('textarea[name="answer"]')
            .type('aa')

        cy.get('input[name="hint"]')
            .eq(0)
            .type('aa')

        cy.contains('СОХРАНИТЬ')
            .click()

        cy.wait('@matchedCreateExercise')

        cy.wait(1000)

        cy.contains('Введите ответ в текстовое поле:')
            .should('exist')

        cy.contains('Упражнение aa успешно создано')
            .should('exist')

    })

    it('Основной сценарий - создание упражнения упорядочивание', () => {

        //добавление общей информации
        cy.get('input[name="title"]')
            .type('aa')

        cy.get('textarea[name="text"]')
            .type('aa')

        cy.get('textarea[name="task"]')
            .type('aa')

        cy.contains('ДАЛЕЕ')
            .click()

        //добавление медиафайла

        cy.contains('Продолжить без медиафайла')
            .click()

        //добавление задания
        cy.contains('Упорядочивание')
            .click()

        cy.get('textarea[name="text"]')
            .type('aa')

        cy.get('textarea[name="answer"]')
            .eq(0)
            .type('1')

        cy.get('textarea[name="answer"]')
            .eq(1)
            .type('2')

        cy.get('textarea[name="answer"]')
            .eq(2)
            .type('3')
        
        cy.contains('добавить')
        .click()

        cy.get('textarea[name="answer"]')
            .eq(3)
            .type('4')

        cy.get('input[name="hint"]')
            .eq(0)
            .type('aa')

        cy.contains('СОХРАНИТЬ')
            .click()

        cy.wait('@matchedCreateExercise')

        cy.wait(1000)

        cy.contains('Расположите в правильном порядке:')
            .should('exist')

        cy.contains('Упражнение aa успешно создано')
            .should('exist')

    })

    it('Основной сценарий - создание упражнения с заполнением пропусков', () => {

        //добавление общей информации
        cy.get('input[name="title"]')
            .type('aa')

        cy.get('textarea[name="text"]')
            .type('aa')

        cy.get('textarea[name="task"]')
            .type('aa')

        cy.contains('ДАЛЕЕ')
            .click()

        //добавление медиафайла

        cy.contains('Продолжить без медиафайла')
            .click()

        //добавление задания

        cy.get('textarea[name="text"]')
            .type('aa')

        cy.contains('Заполнение пропусков')
            .click()

        cy.get('textarea[placeholder="Введите текст"]')
            .type('Выбор из списка: Helen and Barbara [is; are*; was] sisters Вставка слов без прав.ответа: Helen and Barbara {{}} sisters Вставка слов с прав.ответом: {{}They are; They`re{}} sisters')
            .wait(2000)

        cy.contains('СОХРАНИТЬ')
            .click()

        cy.wait('@matchedCreateExercise')

        cy.wait(1000)

        cy.contains('Заполните пропуски:')
            .should('exist')

        cy.contains('Упражнение aa успешно создано')
            .should('exist')

    })

    it('Основной сценарий - создание упражнения с записью микрофона', () => {

        //добавление общей информации
        cy.get('input[name="title"]')
            .type('aa')

        cy.get('textarea[name="text"]')
            .type('aa')

        cy.get('textarea[name="task"]')
            .type('aa')

        cy.contains('ДАЛЕЕ')
            .click()

        //добавление медиафайла

        cy.contains('Продолжить без медиафайла')
            .click()

        //добавление задания

        cy.get('textarea[name="text"]')
            .type('aa')

        cy.contains('Запись с микрофона')
            .click()

        cy.contains('СОХРАНИТЬ')
            .click()

        cy.wait('@matchedCreateExercise')

        cy.wait(1000)

        cy.contains('Запишите ответ с помощью микрофона:')
            .should('exist')

        cy.contains('Упражнение aa успешно создано')
            .should('exist')

    })

})