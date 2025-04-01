describe('Property Page Test', () => {
    beforeEach(() => {
        cy.visit('/property/38014212', { timeout: 10000 }); // Visit the property page
    });

    it('Should display the property is near Liverpool', () => {
        // Step 1: Verify that the text mentions Liverpool inside the <strong> tag
        cy.get('strong').contains('Liverpool').should('be.visible');
    });

    it('Should have the Select a location dropdown available', () => {
        // Step 2: Check if the dropdown for selecting a location is visible
        cy.get('select#destination').should('be.visible');
    });

    it('Should allow selecting a location from the dropdown', () => {
        // Step 3: Toggle the university switch to make the dropdown accessible
        cy.get('label.toggle-switch').first().click();

        // Step 4: Ensure dropdown is fully visible in the viewport
        cy.get('select#destination').scrollIntoView().should('be.visible');

        // Step 5: Select the "University of Liverpool" option from the dropdown
        cy.get('select#destination').select('University of Liverpool').should('have.value', 'University of Liverpool');

        // Step 6: Verify that "University of Liverpool" is listed
        cy.get('select#destination').should('contain', 'University of Liverpool');
        cy.get('select#destination').should('contain', 'Liverpool John Moores University');
    });

    it('Should click the question mark and navigate to the glossary page with highlighted definition', () => {
        // Step 1: Click on the question mark for EPC Rating
        cy.get('a.greenQuestionMark').first().click({ force: true }); // Ensure only the first question mark is clicked

        // Step 2: Verify that the glossary page URL contains the new search term
        cy.url().should('include', 'searchTerm=Multi%20Glaze%20Proportion'); // Verify glossary page is opened with correct search query

        // Step 3: Verify that the definition for "Multi Glaze Proportion" is highlighted
        cy.get('h4').should('contain.text', 'MULTI GLAZE PROPORTION'); // Verify that it has the heading for Multi Glaze Proportion
    });
});
