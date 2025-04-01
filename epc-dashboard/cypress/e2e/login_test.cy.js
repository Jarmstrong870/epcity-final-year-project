describe('User Login Test - Incorrect Password', () => {
    beforeEach(() => {
        cy.visit('/', { timeout: 10000 }); // Visit the homepage
    });

    it('Should show error for incorrect password', () => {
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
    });
});

describe('User Login Test - Correct Password', () => {
    beforeEach(() => {
        cy.visit('/', { timeout: 10000 }); // Visit the homepage
    });

    it('Should login successfully with correct password', () => {
        // Step 1: Click the profile icon to open the dropdown
        cy.get('img[alt="Profile"]').click();
        cy.wait(1000); // Wait for dropdown to appear

        // Step 2: Click the Login link inside the dropdown
        cy.get('div.dropdown-menu').contains('Login').click();
        cy.wait(2000); // Wait for login page to load

        // Step 3: Verify that the login page is displayed
        cy.url().should('include', '/login');

        // Step 4: Enter email and correct password
        cy.get('input[type="email"]').type('jaa07102002@gmail.com');
        cy.get('input[type="password"]').type('Fishingboy1');
        cy.contains('Login').click();

        // Step 5: Wait for redirection to homepage
        cy.url().should('eq', 'http://localhost:3000/'); // Adjust if baseUrl differs

        // Step 6: Verify successful login by checking for authenticated content
        cy.get('img[alt="Profile"]').should('be.visible'); // Ensure profile icon shows after login
    });
});

describe('Text to Speech Toggle After Login', () => {
    beforeEach(() => {
        cy.visit('/', { timeout: 10000 }); // Visit the homepage
    });

    it('Should toggle Text to Speech on after login', () => {
        // Step 1: Click the profile icon to open the dropdown
        cy.get('img[alt="Profile"]').click();
        cy.wait(1000); // Wait for dropdown to appear

        // Step 2: Click the Login link inside the dropdown
        cy.get('div.dropdown-menu').contains('Login').click();
        cy.wait(2000); // Wait for login page to load

        // Step 3: Verify that the login page is displayed
        cy.url().should('include', '/login');

        // Step 4: Enter email and correct password
        cy.get('input[type="email"]').type('jaa07102002@gmail.com');
        cy.get('input[type="password"]').type('Fishingboy1');
        cy.contains('Login').click();

        // Step 5: Wait for redirection to homepage
        cy.url().should('eq', 'http://localhost:3000/'); // Adjust if baseUrl differs

        // Step 6: Verify successful login by checking for authenticated content
        cy.get('img[alt="Profile"]').should('be.visible'); // Ensure profile icon shows after login

        // Step 7: Click the profile icon again to open the dropdown after login
        cy.get('img[alt="Profile"]').click();
        cy.wait(1000); // Wait for dropdown to appear

        // Step 8: Toggle Text to Speech on after login
        cy.get('div.react-switch').click();  // Click the switch to toggle Text to Speech
        cy.wait(1000); // Wait for the toggle to react

        

        // Step 10: Simulate text selection to test the "Text to Speech" functionality
        cy.get('p').first().then((element) => {
            const text = element.text();
            // Here you would need to use a plugin or custom logic to verify that speech is triggered
            cy.log(`Highlighted text: ${text}`);
            // You might need additional logic here to test speech playback if supported
        });
    });
});
