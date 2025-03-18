describe('Property List Component', () => {
    beforeEach(() => {
        cy.visit('/propertylist'); // Ensure localhost is set up correctly
    });

    it('should render the property list component', () => {
        cy.get('.property-list').should('exist');
    });

    it('should display loading state', () => {
        cy.contains('Loading properties...').should('exist');
    });

    it('should switch between table and card view', () => {
        cy.get('.view-toggle button').contains('Table View').click();
        cy.get('.table-view').should('exist');
        
        cy.get('.view-toggle button').contains('Card View').click();
        cy.get('.property-cards-container').should('exist');
    });

    it('should sort properties correctly', () => {
        cy.get('.view-toggle button').contains('Card View').click(); // Ensure correct view mode
        cy.get('.sort-container').should('be.visible').within(() => {
            cy.get('select').first().select('number_bedrooms');
            cy.get('select').last().select('asc');
        });
        cy.get('.property-card').first().should('exist');
    });

    it('should allow selecting properties for comparison', () => {
        cy.get('.compare-checkbox input').first().check();
        cy.get('.compare-button').should('contain', '(1/4)');
    });

    it('should enable compare button when at least two properties are selected', () => {
        cy.get('.compare-checkbox input').eq(0).check();
        cy.get('.compare-checkbox input').eq(1).check();
        cy.get('.compare-button').should('not.be.disabled');
    });

    it('should navigate pages correctly', () => {
        cy.get('.paginationNext').click();
        cy.get('.paginationPrevious').should('not.be.disabled');
    });
});