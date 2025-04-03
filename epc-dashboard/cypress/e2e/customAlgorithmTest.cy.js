describe('Custom Algorithm Component Tests', () => {
    beforeEach(() => {
        cy.visit('/');
        // Click button/link that opens the custom algorithm
        cy.get('.custom-algorithm-button').contains('Start Now and Find Your Match!').click();
    });

    it('should render the custom algorithm form', () => {
        // Check main container exists
        cy.get('.custom-algorithm-container').should('exist');
        
        // Verify progress bar
        cy.get('.custom-algorithm-progress').should('exist');
        cy.contains('Step 0 of 6').should('be.visible');
    });

    it('should complete all form steps', () => {
        // Select city
        cy.get('#local-authority').select('Liverpool');
        cy.contains('Step 1 of 6').should('be.visible');

        // Select number of bedrooms
        cy.get('.number-of-bedrooms-grid').contains('2').click();
        cy.contains('Step 2 of 6').should('be.visible');

        // Select EPC rating
        cy.get('.epc-rating-card').contains('B').click();
        cy.contains('Step 3 of 6').should('be.visible');

        // Select property type
        cy.get('.property-type-option').contains('House').click();
        cy.contains('Step 4 of 6').should('be.visible');

        // Select university
        cy.get('.university-option').first().click();
        cy.contains('Step 5 of 6').should('be.visible');

        // Adjust distance
        
        cy.get('.distance-slider input[type="range"]')
        .as('rangeInput')
        .should('exist')
        .then(($input) => {
        const input = $input[0];
        input.stepUp(5); // Increase by 5 steps
        cy.wrap(input)
            .trigger('input', { force: true })
            .trigger('change', { force: true });
});
  
        cy.contains('Step 6 of 6').should('be.visible');
    });

    it('should submit form and display results', () => {
        // Fill form
        cy.get('#local-authority').select('E08000012');
        cy.get('.number-of-bedrooms-card').contains('2').click();
        cy.get('.epc-rating-card').contains('B').click();
        cy.get('.property-type-option').contains('House').click();
        cy.get('.university-option').first().click();
        cy.get('.distance-slider input[type="range"]')
            .invoke('val', 15)
            .trigger('change');

        // Submit form
        cy.get('button[type="submit"]').click();

        // Check loading state
        cy.get('.loading-indicator').should('exist');

        // Wait for results
        cy.get('.property-cards-container', { timeout: 10000 }).should('exist');
        cy.get('.property-card').should('have.length.at.least', 1);
    });

    it('should handle no results found', () => {
        // Fill form with criteria unlikely to match
        
        
        // Submit form
        cy.get('button[type="submit"]').click();

        // Check for no results message
        cy.get('.no-properties-message', { timeout: 10000 })
        .should('exist')
        .and('be.visible')
        .and('have.css', 'display', 'block');
    });

    it('should close custom algorithm popup', () => {
        cy.get('.cancel-button').click();
        cy.get('.custom-algorithm-container', { timeout: 15000 }).should('not.exist');
    });

    it('should increment the step counter no matter the order of form completion', () => {

        // Select EPC rating
        cy.get('.epc-rating-card').contains('B').click();
        cy.contains('Step 1 of 6').should('be.visible');
  
    });
});