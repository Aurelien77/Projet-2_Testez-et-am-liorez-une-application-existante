describe('template spec', () => {
  
  it('passes', () => {
    cy.visit('http://localhost:4200/')
  })

  it('devrait afficher le titre de connexion', () => {
    cy.visit('http://localhost:4200/')
    cy.contains('Connectez-vous pour plus d\'information')
  })

  it('devrait cliquer sur le bouton de connexion', () => {
    cy.visit('http://localhost:4200/')
    cy.contains('button', 'Se connecter').click()
  })

  it('devrait se connecter, modifier et se déconnecter', () => {
    cy.visit('http://localhost:4200/')
    
    cy.contains('button', 'Se connecter').click()
    cy.wait(500) 
    
    cy.get('input[formcontrolname="login"]').type('Cypres')
    cy.get('input[type="password"]').type('Cypres')
    cy.get('button[type="submit"]').click()
    
    // Attendre que la liste soit chargée
    cy.wait(1500)
    
    cy.contains('li', 'Cypres Tests').within(() => {
      cy.log('🔍 Je clique sur l\'input pour afficher le login')
      
      cy.get('input[title="Cliquez pour afficher le login"]')
        .should('be.visible')
        .click()
      
      cy.wait(2000)
      
      cy.log('✏️ Je clique sur le bouton Modifier')
      cy.get('button.btn-edit').click()
    })
    
    cy.wait(2000)
    
    // Se déconnecter
    cy.log('🚪 Je me déconnecte')
    cy.contains('button', 'Se déconnecter').click()
    
    // Vérifier qu'on est bien déconnecté (optionnel)
    cy.wait(1000)
    cy.contains('Connectez-vous pour plus d\'information').should('be.visible')
  })
})