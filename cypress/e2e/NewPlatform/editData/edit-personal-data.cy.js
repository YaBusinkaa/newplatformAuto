describe('Edit personal data', () => {

    beforeEach( () => {
        cy.login();
        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl')+'/auth/me',
          }).as('matchedUrl')                           // Перехватываем get запрос auth me
        
        cy.intercept({
            method: 'PUT',
            url: Cypress.env('newPlatformApiUrl')+'/users/me/fio'      // Перехватываем запрос смены FIO
        }).as('matchedChangeFio')

        cy.visit(Cypress.env('newPlatformUrl'))

        cy.wait('@matchedUrl').then(({response}) => {   // пока не завершится запрос не переходим к следующему шагу
            expect(response.statusCode).to.eq(200)
        })

        cy.get('button[aria-controls="primary-search-account-menu"]')
        .click()

        cy.get('a')
        .contains('Профиль')
        .click()

        cy.wait('@matchedUrl').then(({response}) => {   // пока не завершится запрос не переходим к следующему шагу
            expect(response.statusCode).to.eq(200)
        })
    })

    let abc = "abcdefghijklmnopqrstuvwxyz"; 
    let name = "";
    while (name.length < 5) {
      name += abc[Math.floor(Math.random() * abc.length)]
    }

    it('Основной сценарий', () => {
        cy.get('input[name="lastName"]').clear()
        .type(name)
        .should('have.value', name)
    
        cy.get('input[name="firstName"]').clear()
        .type(name)
        .should('have.value', name)
  
        cy.get('input[name="middleName"]').clear()
        .type(name)
        .should('have.value', name)

        cy.get('button')
        .contains('Сохранить')
        .click()

        cy.wait('@matchedChangeFio').then(({response}) => {  // пока не завершится не переходим к следующему шагу
            expect(response.statusCode).to.eq(200)
            expect(response.body.firstName).to.eq(name)   // Проверка смены fio
            expect(response.body.lastName).to.eq(name) 
            expect(response.body.middleName).to.eq(name) 
        })
        
        cy.contains('Ваши данные изменены!')
        .should('exist')

        cy.get('input[name="lastName"]')
        .should('have.value', name)

        cy.get('input[name="firstName"]')
        .should('have.value', name)
  
        cy.get('input[name="middleName"]')
        .should('have.value', name)

        cy.request({    // ИЗМЕНЯЕМ ОБРАТНО ФИО 
            method: 'PUT',
            url: Cypress.env('newPlatformApiUrl')+"/users/me/fio", 
            failOnStatusCode: false,
            headers: { 
                'Authorization': 'Bearer '+ Cypress.env('accessToken'),       
              },
            body:{
              "firstName": Cypress.env("firstName"),              
              "lastName": Cypress.env("lastName"),
              "middleName": Cypress.env("middleName")   
            },
        }).as('changeFioAgain')


        cy.get('@changeFioAgain').should((response) =>{        // Проверяем фио
            expect(response.status).to.eq(200)
            expect(response.body.firstName).to.eq(Cypress.env("firstName"))
            expect(response.body.lastName).to.eq(Cypress.env("lastName"))
            expect(response.body.middleName).to.eq(Cypress.env("middleName"))
        })

        cy.reload()
        cy.wait('@matchedUrl')
        cy.get('input[name="lastName"]')
        .should('have.value', Cypress.env("lastName"))

        cy.get('input[name="firstName"]')
        .should('have.value', Cypress.env("firstName"))
  
        cy.get('input[name="middleName"]')
        .should('have.value', Cypress.env("middleName"))
    })
    
})