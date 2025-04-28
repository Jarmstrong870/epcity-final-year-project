describe('Property Page - Compare Checkboxes and Open Dropdowns, and Check Graph', () => {
    beforeEach(() => {
        cy.visit('/propertylist', { timeout: 10000 }); // Visit property list page
    });

    it('Should select checkboxes, click compare, open dropdowns, and check graph', () => {
        // Select the second checkbox
        cy.get('input[type="checkbox"]').eq(1).check(); // 0-based index, 1 for second checkbox

        // Select the third checkbox
        cy.get('input[type="checkbox"]').eq(2).check(); // 0-based index, 2 for third checkbox

        // Wait for the compare button to appear
        cy.wait(1000); // Optional: Increase wait time if necessary

        // Click the compare button
        cy.get('.compare-button-container .compare-button').click();

        // Verify that the compare page has loaded
        cy.url().should('include', '/compare-results');

        // Wait for the dropdown headers to appear
        cy.get('.accordion-header', { timeout: 10000 }).should('exist');

        // Step 1: Open the first dropdown (for EPC Information)
        cy.get('.accordion-header').first().click();

        // Verify that the first dropdown content is visible
        cy.get('.accordion-content').first().should('be.visible');

        // Step 2: Open the second dropdown (for Property Information)
        cy.get('.accordion-header').eq(1).click();

        // Verify that the second dropdown content is visible
        cy.get('.accordion-content').eq(1).should('be.visible');

        // Step 3: Click the "Hot Water Costs" button to change the graph
        cy.get('.toggle-buttons button').eq(1).click();

        // Step 4: Verify that the graph name in the legend is correct
        cy.get('span.recharts-legend-item-text')
            .should('contain.text', 'Hot Water');
    });
});

describe('Property Page - Compare Checkboxes and Click Compare Button (Test 2)', () => {
    beforeEach(() => {
        cy.visit('/propertylist', { timeout: 10000 }); // Visit property list page
    });

    it('Should select checkboxes and click compare for test 2', () => {
        // Select the second checkbox
        cy.get('input[type="checkbox"]').eq(1).check(); // 0-based index, 1 for second checkbox

        // Select the third checkbox
        cy.get('input[type="checkbox"]').eq(2).check(); // 0-based index, 2 for third checkbox

        // Select the fourth checkbox
        cy.get('input[type="checkbox"]').eq(3).check(); // 0-based index, 3 for fourth checkbox

        // Wait for the compare button to appear
        cy.wait(1000); // Optional: Increase wait time if necessary

        // Click the compare button
        cy.get('.compare-button-container .compare-button').click();

        // Verify that the compare page has loaded
        cy.url().should('include', '/compare-results');
    });
});

describe('Property Page - Compare Checkboxes and Click Compare Button (Test 3)', () => {
    beforeEach(() => {
        cy.visit('/propertylist', { timeout: 10000 }); // Visit property list page
    });

    it('Should select checkboxes and click compare for test 3', () => {
        // Select the second checkbox
        cy.get('input[type="checkbox"]').eq(1).check(); // 0-based index, 1 for second checkbox

        // Select the third checkbox
        cy.get('input[type="checkbox"]').eq(2).check(); // 0-based index, 2 for third checkbox

        // Select the fourth checkbox
        cy.get('input[type="checkbox"]').eq(3).check(); // 0-based index, 3 for fourth checkbox

        // Select the fifth checkbox
        cy.get('input[type="checkbox"]').eq(4).check(); // 0-based index, 4 for fifth checkbox

        // Wait for the compare button to appear
        cy.wait(1000); // Optional: Increase wait time if necessary

        // Click the compare button
        cy.get('.compare-button-container .compare-button').click();

        // Verify that the compare page has loaded
        cy.url().should('include', '/compare-results');
    });
});
