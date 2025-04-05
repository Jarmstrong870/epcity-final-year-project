describe('PropertyCard Component Tests', () => {
    // ...existing code...

    describe('Favorite functionality for signed-in users', () => {
        beforeEach(() => {
            // Login before tests
            cy.visit('/');
            // Click profile icon
            cy.get('img[alt="Profile"]').click();
            // Click login in dropdown
            cy.get('.dropdown-menu').contains('Login').click();
            // Fill in login form
            cy.get('input[placeholder="Email"]').type('carlkennedy03@gmail.com');
            cy.get('input[placeholder="Password"]').type('password');
            cy.get('button[class="login-button"]').click();
            // Verify login
            cy.url().should('eq', 'http://localhost:3000/login');
            // Navigate to property list using button
            cy.contains('View All Properties').click();
        });

        it('should allow favoriting a property', () => {
            
            cy.get('.property-card').first().within(() => {
                cy.get('.heart-emoji').click({ force: true });
                // Check heart is filled
                
                
            });
        });

        it('should allow unfavoriting a property', () => {
            cy.get('.property-card').first().within(() => {
                // First favorite it
                cy.get('.heart-emoji').click();
                // Then unfavorite
                cy.get('.starBase').click();
                // Check star is unfilled
                cy.get('.starBase[title="click to unfavourite"]').should('not.exist');
                
            });
        });

        it('should persist favorites after page reload', () => {
            cy.get('.property-card').first().within(() => {
                cy.get('.starBase[title="click to unfavourite"]').should('exist');
            });

            cy.reload();

            cy.get('.property-card').first().within(() => {
                cy.get('.starBase[title="click to unfavourite"]').should('exist');
            });
        });
    });

    describe('Favorite functionality for non-signed-in users', () => {
        beforeEach(() => {
            // Ensure user is logged out
            cy.visit('/logout');
            cy.visit('/propertylist');
        });

        it('should prompt login when trying to favorite', () => {
            cy.get('.property-card').first().within(() => {
                cy.get('.heart-emoji').click();
                
                // Check for login prompt
                cy.get('.popup')
                    
            });
        });

        

        it('should not show filled stars for any properties', () => {
            cy.get('.property-card').each(($card) => {
                cy.wrap($card)
                    .find('.property-card__star.favorited')
                    .should('not.exist');
            });
        });
    });
});