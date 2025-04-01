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
        cy.wait(2000);  // Wait for the page to load completely
        cy.get('input.stylingSearchInput[placeholder="Search for properties..."]').should('be.visible');
        cy.get('button.stylingSearchButton').should('be.visible');
    });

    it('Should search for properties when the search button is clicked', () => {
        cy.get('input.stylingSearchInput[placeholder="Search for properties..."]').type('Liverpool');
        cy.wait(2000);  // Pause to observe

        // Force click to bypass the overlay issue
        cy.get('button.stylingSearchButton').click({ force: true });

        // Wait for the page with the search results to load and the header to appear
        cy.get('h2.searchTitle', { timeout: 10000 }).contains('Find Your Property').should('be.visible');
        cy.url().should('include', '/propertylist?search=Liverpool');
    });

    it('Should change the language to French when the French language option is selected', () => {
        // Open language dropdown
        cy.get('.flag-button').click(); // Click the language flag button to open the dropdown

        // Click on French language option
        cy.get('.dropdown-item').contains('French').click();

        // Verify that the page content is in French
        cy.get('h1').contains('Bienvenue à Liverpool').should('be.visible');
        
        // Verify the main message is in French
        cy.get('.subMessage').should('contain.text', 'Il est temps de trouver un endroit que vous pouvez appeler chez vous.');
    });

    it('Should change the language to Spanish when the Spanish language option is selected', () => {
        // Open language dropdown
        cy.get('.flag-button').click(); // Click the language flag button to open the dropdown

        // Click on Spanish language option
        cy.get('.dropdown-item').contains('Spanish').click();

        // Verify that the page content is in Spanish
        cy.get('h1').contains('Bienvenido a Liverpool').should('be.visible');
        
        // Verify the main message is in Spanish
        cy.get('.subMessage').should('contain.text', 'Ahora, es hora de encontrar un lugar que puedas llamar hogar.');
    });

    it('Should change the language to Polish when the Polish language option is selected', () => {
        // Open language dropdown
        cy.get('.flag-button').click(); // Click the language flag button to open the dropdown

        // Click on Polish language option
        cy.get('.dropdown-item').contains('Polish').click();

        // Verify that the page content is in Polish
        cy.get('h1').contains('Witamy w Liverpoolu').should('be.visible');
        
        // Verify the main message is in Polish
        cy.get('.subMessage').should('contain.text', 'Czas znaleźć miejsce, które będziesz mógł nazwać domem.');
    });

    it('Should change the language to Mandarin when the Mandarin language option is selected', () => {
        // Open language dropdown
        cy.get('.flag-button').click(); // Click the language flag button to open the dropdown

        // Click on Mandarin language option
        cy.get('.dropdown-item').contains('Mandarin').click();

        // Verify that the page content is in Mandarin
        cy.get('h1').contains('欢迎来到利物浦').should('be.visible');
        
        // Verify the main message is in Mandarin
        cy.get('.subMessage').should('contain.text', '现在，是时候找到一个可以称之为家的地方了。');
    });
});
