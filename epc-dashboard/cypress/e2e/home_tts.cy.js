describe('Text-to-Speech with Language Change Test', () => {
    beforeEach(() => {
        cy.visit('/', { timeout: 10000 });
    });

    it('Should switch to French and speak in the correct voice', () => {
        // Spy on the speechSynthesis API
        cy.window().then((win) => {
            cy.spy(win.speechSynthesis, 'speak').as('speakSpy');

            // Mock SpeechSynthesisUtterance to capture the language
            win.SpeechSynthesisUtterance = class extends win.SpeechSynthesisUtterance {
                constructor(text) {
                    super(text);
                    this.onend = () => console.log(`Speech ended in ${this.lang}`);
                }
            };
        });

        // Step 1: Click TTS button (English)
        cy.get('svg.lucide-volume-x').first().click();

        // Verify speech started in English
        cy.get('@speakSpy').should('have.been.called');
        cy.window().then((win) => {
            const utterance = win.speechSynthesis.speak.firstCall.args[0];
            expect(utterance.lang).to.equal('en-GB'); // Ensure initial speech is in English
        });

        // Step 2: Wait for speech to finish and 10-second delay
        cy.wait(5000); // Mocked speech duration
        cy.wait(10000);

        // Step 3: Change language to French
        cy.get('button.flag-button').click();
        cy.get('button[aria-label="French"]').click();

        // Step 4: Click TTS button again
        cy.get('svg.lucide-volume-x').first().click();

        // Verify speech started in French
        cy.get('@speakSpy').should('have.been.calledTwice');
        cy.window().then((win) => {
            const utterance = win.speechSynthesis.speak.secondCall.args[0];
            expect(utterance.lang).to.equal('fr-FR'); // Ensure speech is now in French
        });
    });
});
