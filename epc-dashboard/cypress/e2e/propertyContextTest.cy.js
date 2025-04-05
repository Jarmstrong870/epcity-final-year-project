describe('Property Context Tests', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should fetch and display properties', () => {
        // Check if properties are loaded
        cy.get('.property-card').should('exist');
        cy.get('.property-card').should('have.length.at.least', 1);
    });

    it('should filter properties by type', () => {
        // Open property search page
        cy.visit('/propertylist');
        
        // Select property type filter
        cy.get('.property-type-select').click();
        cy.contains('House').click();
        
        // Verify filtered results
        cy.get('.property-card').should('exist');
        cy.get('.property-card').each(($card) => {
            cy.wrap($card).should('contain', 'House');
        });
    });

    it('should filter by EPC rating', () => {
        cy.visit('/propertylist');
        
        // Select EPC rating filter
        cy.get('.epc-rating-select').click();
        cy.contains('B').click();
        
        // Verify filtered results
        cy.get('.property-card').each(($card) => {
            cy.wrap($card).should('contain', 'B');
        });
    });

    it('should sort properties', () => {
        cy.visit('/propertylist');
        
        // Test sorting by price
        cy.get('.sort-select').select('price_asc');
        
        // Verify sorting (you'll need to adapt this based on your data structure)
        cy.get('.property-card').should('exist');
    });

    it('should handle pagination', () => {
        cy.visit('/propertylist');
        
        // Get initial page
        cy.get('.property-card').should('exist');
        
        // Click next page
        cy.get('.pagination-next').click();
        
        // Verify new page loaded
        cy.get('.property-card').should('exist');
        cy.get('.current-page').should('contain', '2');
    });

    it('should fetch top rated properties', () => {
        // Check if top rated properties section exists
        cy.get('.top-rated-properties').should('exist');
        cy.get('.property-card').should('have.length.at.least', 1);
    });

    it('should handle search functionality', () => {
        cy.visit('/propertylist');
        
        // Perform search
        cy.get('.search-input').type('Liverpool');
        cy.get('.search-button').click();
        
        // Verify search results
        cy.get('.property-card').should('exist');
        cy.get('.property-card').should('contain', 'Liverpool');
    });

    it('should handle errors gracefully', () => {
        // Force an error by requesting invalid data
        cy.intercept('GET', '**/api/property/getPage*', {
            statusCode: 500,
            body: { error: 'Server error' }
        });

        cy.visit('/propertylist');
        
        // Verify error handling
        cy.get('.error-message').should('be.visible');
    });
});