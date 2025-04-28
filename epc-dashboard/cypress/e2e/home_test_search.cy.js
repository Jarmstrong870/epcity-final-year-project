describe('Dashboard Performance and Functionality Tests', () => {
    beforeEach(() => {
        Cypress.config('defaultCommandTimeout', 3000);  // Set command timeout
        cy.visit('/', { timeout: 10000 });
    });

    it('Should load the dashboard and display key elements quickly', () => {
        cy.visit('/', { timeout: 10000 });

        cy.get('input.stylingSearchInput[placeholder="Search for properties..."]', { timeout: 10000 })
          .should('be.visible');

        cy.get('button.stylingSearchButton', { timeout: 10000 })
          .should('be.visible');
    });

    it('Should search for properties when the search button is clicked', () => {
        cy.get('input.stylingSearchInput[placeholder="Search for properties..."]').type('Liverpool');
        cy.get('button.stylingSearchButton').click({ force: true });

        cy.get('h2.searchTitle', { timeout: 10000 })
          .contains('Find Your Property')
          .should('be.visible');

        cy.url().should('include', '/propertylist?search=Liverpool');
    });

    it('Should change the language to French', () => {
        cy.get('.flag-button').click();
        cy.get('.dropdown-item').contains('French').click();

        cy.get('h1', { timeout: 10000 })
          .contains('EPCity – Découvrez votre logement')
          .should('be.visible');

        cy.get('.subMessage', { timeout: 10000 })
          .should('contain.text', 'Réduisez les coûts, pas le confort – Trouvez un logement économe');
    });

    it('Should change the language to Spanish', () => {
        cy.get('.flag-button').click();
        cy.get('.dropdown-item').contains('Spanish').click();

        cy.get('h1', { timeout: 10000 })
          .contains('EPCity – Infórmate sobre tu vivienda')
          .should('be.visible');

        cy.get('.subMessage', { timeout: 10000 })
          .should('contain.text', 'Reduce costos, no comodidad: encuentra una propiedad eficiente');
    });

    it('Should change the language to Polish', () => {
        cy.get('.flag-button').click();
        cy.get('.dropdown-item').contains('Polish').click();

        cy.get('h1', { timeout: 10000 })
          .contains('EPCity – Dowiedz się więcej o swojej nieruchomości')
          .should('be.visible');

        cy.get('.subMessage', { timeout: 10000 })
          .should('contain.text', 'Obniż koszty, nie komfort – znajdź efektywną nieruchomość');
    });

    it('Should change the language to Mandarin', () => {
        cy.get('.flag-button').click();
        cy.get('.dropdown-item').contains('Mandarin').click();

        cy.get('h1', { timeout: 10000 })
          .contains('EPCity – 了解您的房产信息')
          .should('be.visible');

        cy.get('.subMessage', { timeout: 10000 })
          .should('contain.text', '节省成本，不牺牲舒适——寻找高效物业');
    });
});
