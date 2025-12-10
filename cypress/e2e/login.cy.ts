describe('Inicio de Sesión - E2E', () => {
  it('debería iniciar sesión correctamente y redirigir al home', () => {
    // Ir a la página de login (stubear captcha para entorno de tests). Añadimos
    // `?e2e=true` para que el componente active su modo E2E y ponga el token.
    (cy as any).visitWithRecaptcha('/login?e2e=true');

    // Completar el formulario
    cy.get('[data-testid="email-input"]').type('test@test.com');
    cy.get('[data-testid="password-input"]').type('123456');

    // Interceptar el login para no usar el backend real
    cy.intercept('POST', '/api/users/login', {
      statusCode: 200,
      body: { 
        token: 'fake-jwt-token', 
        user: { 
          id: 1, 
          name: 'Test User', 
          email: 'test@test.com'  
         } 
        }
    }).as('loginReq');

    // Ahora el componente debería tener `captchaToken` del modo E2E y el
    // submit button se habilitará normalmente.
    cy.get('[data-testid="submit-button"]').should('not.be.disabled').click();

    // Esperar que responda la API
    cy.wait('@loginReq');

    // Verificar que vaya al Home
    cy.url().should('include', '/products');

    // Verificar que se muestre algo del home
    cy.contains('Todos').should('exist'); 
  });
});
