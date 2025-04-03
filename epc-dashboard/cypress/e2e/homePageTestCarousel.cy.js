describe('Property Carousel Tests', () => {
    beforeEach(() => {
        cy.visit('/'); // Visit homepage where carousel exists
    });

    it('should render the carousel component', () => {
        cy.get('.property-carousel').should('exist');
        cy.get('.carousel-title').should('be.visible');
        cy.get('.carousel-container').should('be.visible');
    });

    it('should display initial properties', () => {
        cy.get('.carousel-item').should('have.length.at.least', 1);
        cy.get('.property-card').should('be.visible');
    });

    it('should navigate through properties using arrows', () => {
        // Check if next button is enabled initially
        cy.get('.carousel-button.next').should('not.be.disabled');

        // Click next button and verify slide
        cy.get('.carousel-button.next').click();
        cy.get('.carousel-content')
            .should('have.css', 'transform')
            .and('not.equal', 'none');

        // Previous button should now be enabled
        cy.get('.carousel-button.prev').should('not.be.disabled');

        // Click previous button and verify slide back
        cy.get('.carousel-button.prev').click();
    });

    it('should disable prev button at start', () => {
        cy.get('.carousel-button.prev').should('be.disabled');
    });

    

    it('should allow clicking on property cards', () => {
        cy.get('.carousel-item').first()
            .find('.property-card')
            .click();
        
        // Should navigate to property page
        cy.url().should('include', '/property/');
    });
});