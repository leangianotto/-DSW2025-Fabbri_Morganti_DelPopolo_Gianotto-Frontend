describe('Catálogo de Productos - E2E', () => {

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });


  it('debería permitir buscar productos', () => {

    // 1. LOGIN
    (cy as any).visitWithRecaptcha('/login?e2e=true');

    cy.get('[data-testid="email-input"]').type('test@test.com');
    cy.get('[data-testid="password-input"]').type('123456');

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

    cy.get('[data-testid="submit-button"]').click();
    cy.wait('@loginReq');

    // 2. IR A PRODUCTOS
    cy.url().should('include', '/products', { timeout: 10000 });
    cy.contains('Todos', { timeout: 5000 }).should('exist');

    // 3. BUSCAR
    cy.get('input[placeholder="Buscar productos..."]')
      .should('be.visible')
      .type('a');

    // 4. VERIFICAR RESULTADOS
    cy.get('.card', { timeout: 5000 })
      .should('have.length.greaterThan', 0);
  });


  it('debería permitir ordenar productos por precio', () => {

    // 1. LOGIN
    (cy as any).visitWithRecaptcha('/login?e2e=true');

    cy.get('[data-testid="email-input"]').type('test@test.com');
    cy.get('[data-testid="password-input"]').type('123456');

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

    cy.get('[data-testid="submit-button"]').click();
    cy.wait('@loginReq');

    // 2. IR A PRODUCTOS
    cy.url().should('include', '/products', { timeout: 10000 });
    cy.contains('Todos', { timeout: 5000 }).should('exist');

    // 3. ORDENAR DE MENOR A MAYOR
    cy.get('select.form-select')
      .should('be.visible')
      .select('asc');

    // 4. VERIFICAR QUE HAY PRODUCTOS
    cy.get('.card', { timeout: 5000 })
      .should('have.length.greaterThan', 0);
  });


  it('debería permitir acceder al detalle de un producto', () => {

    // 1. LOGIN
    (cy as any).visitWithRecaptcha('/login?e2e=true');

    cy.get('[data-testid="email-input"]').type('test@test.com');
    cy.get('[data-testid="password-input"]').type('123456');

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

    cy.get('[data-testid="submit-button"]').click();
    cy.wait('@loginReq');

    // 2. IR A PRODUCTOS
    cy.url().should('include', '/products', { timeout: 10000 });
    cy.contains('Todos', { timeout: 5000 }).should('exist');

    // 3. SELECCIONAR PRODUCTO
    cy.get('.card')
      .first()
      .within(() => {
        cy.get('.card-title')
          .should('be.visible');

        cy.contains('Ver Detalles')
          .click();
      });

    // 4. VERIFICAR DETALLE
    cy.url()
      .should('match', /\/products\/\d+$/);

    cy.get('h2')
      .should('be.visible');

    cy.contains('Precio:')
      .should('be.visible');

    cy.contains('Stock:')
      .should('be.visible');

    cy.get('img')
      .should('be.visible');
  });


  it('debería permitir agregar un producto al carrito desde el detalle', () => {

    // 1. LOGIN
    (cy as any).visitWithRecaptcha('/login?e2e=true');

    cy.get('[data-testid="email-input"]').type('test@test.com');
    cy.get('[data-testid="password-input"]').type('123456');

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

    cy.get('[data-testid="submit-button"]').click();
    cy.wait('@loginReq');

    // 2. IR A PRODUCTOS
    cy.url().should('include', '/products', { timeout: 10000 });
    cy.contains('Todos', { timeout: 5000 }).should('exist');

    // 3. ENTRAR AL DETALLE
    cy.get('.card')
      .first()
      .contains('Ver Detalles')
      .click();

    cy.url()
      .should('match', /\/products\/\d+$/);

    // 4. AGREGAR AL CARRITO
    cy.contains('button', 'Agregar al carrito')
      .should('be.visible')
      .and('not.be.disabled')
      .click();

    // 5. VERIFICAR
    cy.contains('Producto agregado al carrito', {
      timeout: 5000
    }).should('exist');
  });

});