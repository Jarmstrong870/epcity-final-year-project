describe('Top Rated Properties Navigation Test', () => {
    const googleMapsApiKey = 'your_actual_google_maps_api_key_here';

    beforeEach(() => {
        cy.visit(`/?googleMapsApiKey=${googleMapsApiKey}`, { timeout: 10000 });
    });

    it('Should navigate to the property page and verify key information', () => {
        // Verify that the Top Rated Properties section is visible
        cy.contains('Most Efficient Properties', { timeout: 10000 }).should('be.visible');

        // Click the first top-rated property card
        cy.contains('40, Ridgeside Avenue').click();

        // Verify navigation to the property page
        cy.url().should('match', /\/property\/\d+/);

        // Verify key elements on the property page
        cy.contains('Energy Information').should('be.visible');

        // Heating Information
        cy.contains('Heating').should('be.visible');
        cy.contains('Current Annual Cost: £169.59').should('be.visible');
        cy.contains('Potential Annual Cost: £169.59 (Savings: £0.00)').should('be.visible');

        // Lighting Information
        cy.contains('Lighting').should('be.visible');
        cy.contains('Current Annual Cost: £18.99').should('be.visible');
        cy.contains('Potential Annual Cost: £18.99 (Savings: £0.00)').should('be.visible');

        // Cost Comparison Graph
        cy.contains('Cost Comparison Graph').should('be.visible');
        cy.contains('Flat 5, 69 Monton Street').should('be.visible');

        // Windows Information
        cy.contains('Windows Information').should('be.visible');
        cy.contains('Multi Glaze Proportion:').should('be.visible');
        cy.contains('100%').should('be.visible');
        cy.contains('Windows Energy Efficiency: Good').should('be.visible');

        // Floor Information
        cy.contains('Floor Information').should('be.visible');
        cy.contains('Total Floor Area: 14.0 m²').should('be.visible');
        cy.contains('Floor Level: 1st').should('be.visible');

        // Roof Information
        cy.contains('Roof Information').should('be.visible');
        cy.contains('Roof Description: (another dwelling above)').should('be.visible');
        cy.contains('Roof Energy Efficiency: N/A').should('be.visible');

        // Walls Information
        cy.contains('Walls Information').should('be.visible');
        cy.contains('Cavity wall, as built, insulated (assumed)').should('be.visible');
        cy.contains('Walls Energy Efficiency: Good').should('be.visible');

        // EPC Rating Graph
        cy.contains('EPC Rating Graph').should('be.visible');
        cy.contains('Potential').should('be.visible');
        cy.contains('Current').should('be.visible');

        // Nearby Locations
        cy.contains('Nearby Locations').should('be.visible');
        cy.contains('Universities').should('be.visible');
        cy.contains('Train Stations').should('be.visible');
        cy.contains('Bus Stations').should('be.visible');
        cy.contains('Points of Interest').should('be.visible');
        cy.contains('Gyms & Leisure').should('be.visible');
        cy.contains('Libraries').should('be.visible');

        //  Verify Google Maps container is visible
        cy.get('.gm-style', { timeout: 10000 }).should('be.visible');
    });
});
