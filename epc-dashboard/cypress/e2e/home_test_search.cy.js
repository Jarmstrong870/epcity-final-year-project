describe('Dashboard Performance and Functionality Tests', () => {
    beforeEach(() => {
        Cypress.config('defaultCommandTimeout', 3000);  // Slows down each command
        cy.visit('/', { timeout: 10000 }); 
    });

    it('Should load the dashboard in under 10 seconds', () => {
        const startTime = performance.now();

        cy.visit('/', { timeout: 10000 });

        cy.then(() => {
            const endTime = performance.now();
            const loadTime = endTime - startTime;
            expect(loadTime).to.be.lessThan(10000);
            cy.log(`Page loaded in ${loadTime.toFixed(2)} ms`);
        });

        // Verify essential page elements with slight delays
        cy.contains('Welcome to Liverpool', { timeout: 10000 }).should('be.visible');
        cy.wait(2000);  // Pause to observe
        cy.get('input.stylingSearchInput').should('be.visible');
        cy.wait(2000);
        cy.get('button.stylingSearchButton').should('be.visible');
    });

    it('Should search for properties when the search button is clicked', () => {
        cy.get('input.stylingSearchInput').type('Liverpool');
        cy.wait(2000);  // Pause to observe
        cy.get('button.stylingSearchButton').click();

        cy.url().should('include', '/propertylist?search=Liverpool');
    });
});
