describe('User Login Test - Incorrect and Correct Password', () => {
    beforeEach(() => {
        cy.visit('/', { timeout: 10000 }); // Visit the homepage
    });

    it('Should show error for incorrect password and success for correct password', () => {
        // Step 1: Click the profile icon to open the dropdown
        cy.get('img[alt="Profile"]').click();
        cy.wait(1000); // Wait for dropdown to appear

        // Step 2: Click the Login link inside the dropdown
        cy.get('div.dropdown-menu').contains('Login').click();
        cy.wait(2000); // Wait for login page to load

        // Step 3: Verify that the login page is displayed
        cy.url().should('include', '/login');

        // Step 4: Enter email and incorrect password
        cy.get('input[type="email"]').type('jaa07102002@gmail.com');
        cy.get('input[type="password"]').type('wrongpassword');
        cy.contains('Login').click();
        cy.wait(2000);

        // Step 5: Verify incorrect password message
        cy.contains('Incorrect password. Please try again.').should('be.visible');

        // Step 6: Enter correct password
        cy.get('input[type="password"]').clear().type('Fishingboy1');
        cy.contains('Login').click();

        // Step 7: Wait for redirection to homepage
        cy.url().should('eq', 'http://localhost:3000/'); // Adjust if baseUrl differs

        // Step 8: Verify successful login by checking for authenticated content
        cy.get('img[alt="Profile"]').should('be.visible'); // Ensure profile icon shows after login
    });
});
