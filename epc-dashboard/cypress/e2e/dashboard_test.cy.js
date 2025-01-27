describe('Dashboard Tests', () => {
    // Test case: Check if the dashboard loads open with npx cypress open
    it('Should load the dashboard', () => {
      // Visit the base URL (http://localhost:3000/)
      cy.visit('/');
  
      // Assert that the page contains the "View All Properties" button
      cy.contains('View All Properties').should('be.visible');
    });
  
    // Test case: Click the "View All Properties" button and verify navigation
    it('Should navigate to the property list when "View All Properties" is clicked', () => {
      cy.visit('/'); // Relative path to the base URL
  
      // Click the "View All Properties" button by its text
      cy.contains('View All Properties').click();
  
      // Assert that the URL changes to /propertylist
      cy.url().should('include', '/propertylist');
  
      // Verify the page contains an expected element (e.g., "Search for Properties")
      cy.contains('Search for Properties').should('be.visible'); // Adjust based on the actual content on the property list page
    });
  });
  