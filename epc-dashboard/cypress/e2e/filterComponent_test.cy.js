describe('Property Filter Component', () => {
    beforeEach(() => {
        cy.visit('/propertylist'); // Ensure localhost is set up correctly
    });

    it('should render the filter component', () => {
        cy.get('.filterSection').should('exist');
    });

    it('should allow typing in the search bar', () => {
        cy.get('.searchAddress').type('Abbey Road');
        cy.get('.searchAddress').should('have.value', 'Abbey Road');
    });

    it('should allow selecting a city from the dropdown', () => {
        cy.get('.cityDropDown select').select('Liverpool');
        cy.get('.cityDropDown select').should('have.value', 'E08000012');
    });

    it('should allow selecting multiple property types', () => {
        cy.get('.dropdown').eq(0).click();
        cy.get("div[id$='-option-0']").click(); // Select first option
        cy.get("div[id$='-option-1']").click(); // Select second option
        cy.get('.dropdown').should('contain', '');
    });

    it('should allow selecting EPC ratings', () => {
        cy.get('.dropdown').eq(1).click();
        cy.get("div[id$='-option-0']").click(); // Select first EPC rating
        cy.get("div[id$='-option-1']").click(); // Select second EPC rating
        cy.get('.dropdown').should('contain', '');
    });
});