describe('Realización de Pedido - E2E', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('debería completar un flujo de compra básico', () => {
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

    // 2. ESPERAR A LLEGAR A PRODUCTOS
    cy.url().should('include', '/products', { timeout: 10000 });
    cy.contains('Todos', { timeout: 5000 }).should('exist');

    // 3. AGREGAR UN PRODUCTO AL CARRITO
    cy.get('[data-testid="add-to-cart-button"]', { timeout: 5000 }).first().click({ force: true });
    cy.contains('Producto agregado al carrito', { timeout: 5000 }).should('exist');

    // 4. IR AL CARRITO
    cy.get('[data-testid="cart-link"]', { timeout: 5000 }).click();
    cy.url().should('include', '/cart', { timeout: 10000 });

    // 5. VERIFICAR EL CARRITO NO ESTÁ VACÍO
    cy.get('table tbody tr', { timeout: 5000 }).should('have.length.greaterThan', 0);
  });

  it('debería permitir cambiar cantidades antes de realizar el pedido', () => {
    // 1. LOGIN
    (cy as any).visitWithRecaptcha('/login?e2e=true');
    cy.get('[data-testid="email-input"]').type('test@test.com');
    cy.get('[data-testid="password-input"]').type('123456');

    cy.intercept('POST', '/api/users/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        user: { id: 1, name: 'Test User', email: 'test@test.com' }
      }
    }).as('loginReq');

    cy.get('[data-testid="submit-button"]').click();
    cy.wait('@loginReq');

    // 2. ESPERAR A PRODUCTOS Y AGREGAR
    cy.url().should('include', '/products', { timeout: 10000 });
    cy.contains('Todos', { timeout: 5000 }).should('exist');
    
    cy.get('[data-testid="add-to-cart-button"]', { timeout: 5000 }).first().click({ force: true });
    cy.contains('Producto agregado al carrito', { timeout: 5000 }).should('exist');

    // 3. IR AL CARRITO
    cy.get('[data-testid="cart-link"]').click();
    cy.url().should('include', '/cart', { timeout: 10000 });

    // 4. AUMENTAR LA CANTIDAD
    cy.get('[data-testid="increase-quantity-button"]', { timeout: 5000 }).first().click({ force: true });
    cy.wait(300);

    // 5. REDUCIR LA CANTIDAD
    cy.get('[data-testid="decrease-quantity-button"]').first().click({ force: true });
    cy.wait(300);

    // Verificar que los botones aún existen después de cambios
    cy.get('[data-testid="increase-quantity-button"]').should('exist');
    cy.get('[data-testid="decrease-quantity-button"]').should('exist');
  });

  it('debería permitir eliminar un producto del carrito', () => {
    // 1. LOGIN
    (cy as any).visitWithRecaptcha('/login?e2e=true');
    cy.get('[data-testid="email-input"]').type('test@test.com');
    cy.get('[data-testid="password-input"]').type('123456');

    cy.intercept('POST', '/api/users/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        user: { id: 1, name: 'Test User', email: 'test@test.com' }
      }
    }).as('loginReq');

    cy.get('[data-testid="submit-button"]').click();
    cy.wait('@loginReq');

    // 2. ESPERAR A PRODUCTOS Y AGREGAR DOS
    cy.url().should('include', '/products', { timeout: 10000 });
    cy.contains('Todos', { timeout: 5000 }).should('exist');
    
    cy.get('[data-testid="add-to-cart-button"]', { timeout: 5000 }).first().click({ force: true });
    cy.contains('Producto agregado al carrito', { timeout: 5000 }).should('exist');
    cy.wait(500);
    
    cy.get('[data-testid="add-to-cart-button"]').eq(1).click({ force: true });
    cy.contains('Producto agregado al carrito', { timeout: 5000 }).should('exist');

    // 3. IR AL CARRITO
    cy.get('[data-testid="cart-link"]').click();
    cy.url().should('include', '/cart', { timeout: 10000 });

    // Verificar que hay 2 filas
    cy.get('table tbody tr', { timeout: 5000 }).should('have.length', 2);

    // 4. ELIMINAR UN PRODUCTO
    cy.get('button').contains('Eliminar').first().click({ force: true });
    cy.wait(300);
    
    // Confirmar en el modal
    cy.get('[data-testid="confirm-button"]', { timeout: 5000 }).click({ force: true });
    cy.wait(300);

    // Verificar que ahora solo hay 1 fila
    cy.get('table tbody tr', { timeout: 5000 }).should('have.length', 1);
  });

  it('debería mostrar carrito vacío al acceder sin productos', () => {
    // 1. LOGIN
    (cy as any).visitWithRecaptcha('/login?e2e=true');
    cy.get('[data-testid="email-input"]').type('test@test.com');
    cy.get('[data-testid="password-input"]').type('123456');

    cy.intercept('POST', '/api/users/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        user: { id: 1, name: 'Test User', email: 'test@test.com' }
      }
    }).as('loginReq');

    cy.get('[data-testid="submit-button"]').click();
    cy.wait('@loginReq');

    // Guardar el usuario en localStorage para que el CartService funcione
    cy.window().then((window) => {
      window.localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test User', email: 'test@test.com' }));
      window.localStorage.setItem('cart_1', JSON.stringify([]));
    });

    // 2. IR AL CARRITO VACÍO
    cy.get('[data-testid="cart-link"]').click();
    cy.url().should('include', '/cart', { timeout: 10000 });

    // Verificar mensaje de carrito vacío
    cy.contains('Tu carrito está vacío', { timeout: 5000 }).should('be.visible');

    // El botón pagar NO existe cuando el carrito está vacío porque está dentro de *ngIf
    cy.get('[data-testid="pagar-button"]').should('not.exist');
  });

  it('debería guardar el carrito en localStorage', () => {
    // LOGIN
    (cy as any).visitWithRecaptcha('/login?e2e=true');
    cy.get('[data-testid="email-input"]').type('test@test.com');
    cy.get('[data-testid="password-input"]').type('123456');

    cy.intercept('POST', '/api/users/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        user: { id: 1, name: 'Test User', email: 'test@test.com' }
      }
    }).as('loginReq');

    cy.get('[data-testid="submit-button"]').click();
    cy.wait('@loginReq');

    // Asegurarse que el usuario esté guardado en localStorage
    cy.window().then((window) => {
      window.localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test User', email: 'test@test.com' }));
    });

    // Agregar producto y capturar sus datos
    cy.url().should('include', '/products', { timeout: 10000 });
    cy.contains('Todos', { timeout: 5000 }).should('exist');

    // Obtener el nombre del primer producto antes de agregarlo
    let productName: string;
    cy.get('[data-testid="add-to-cart-button"]', { timeout: 5000 }).first().parent().then(($parent) => {
      productName = $parent.find('[data-testid="product-name"]').text() || 'Unknown';
    });

    cy.get('[data-testid="add-to-cart-button"]', { timeout: 5000 }).first().click({ force: true });
    cy.contains('Producto agregado al carrito', { timeout: 5000 }).should('exist');

    // Verificar que está en localStorage con la clave correcta (cart_1 para userId 1)
    cy.window().then((window) => {
      // Verificar que la clave exacta existe
      expect(window.localStorage.getItem('cart_1')).to.exist;
      
      const cart = JSON.parse(window.localStorage.getItem('cart_1') || '[]');
      expect(cart).to.be.an('array');
      expect(cart.length).to.equal(1);
      
      const cartItem = cart[0];
      expect(cartItem).to.have.all.keys('product', 'quantity');
      expect(cartItem.product).to.have.property('id');
      expect(cartItem.product).to.have.property('name');
      expect(cartItem.product).to.have.property('price');
      expect(cartItem.quantity).to.be.a('number');
      expect(cartItem.quantity).to.equal(1);
    });

    // IR AL CARRITO PARA VISUALIZARLO
    cy.get('[data-testid="cart-link"]').click();
    cy.url().should('include', '/cart', { timeout: 10000 });

    // Verificar que se muestra el producto en la tabla
    cy.get('table tbody tr', { timeout: 5000 }).should('have.length', 1);

    // Verificar que se ve la información del producto en la UI
    cy.get('table tbody tr').within(() => {
      cy.get('td').should('exist');
      cy.get('button').contains('Eliminar').should('exist');
    });

    // Verificar que al recargar la página, el carrito persiste
    cy.reload();
    cy.url().should('include', '/cart', { timeout: 10000 });
    cy.get('table tbody tr', { timeout: 5000 }).should('have.length', 1);
    cy.window().then((window) => {
      const cart = JSON.parse(window.localStorage.getItem('cart_1') || '[]');
      expect(cart.length).to.equal(1);
      expect(cart[0].product).to.have.property('id');
    });
  });
});
