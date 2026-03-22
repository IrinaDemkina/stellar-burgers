describe('Проверка работы конструктора бургера', () => {
  const BUN_ID = '643d69a5c3f7b9001cfa093c';
  const MAIN_ID = '643d69a5c3f7b9001cfa0941';

  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('postOrder');

    cy.visit('/');
    cy.wait('@getIngredients');

    cy.get(`[data-cy="${BUN_ID}"]`).as('bun');
    cy.get(`[data-cy="${MAIN_ID}"]`).as('main');
  });

  describe('Тестирование модальных окон', () => {
    it('открытие и закрытие модалки ингредиента', () => {
      cy.get('@bun').click();
      cy.get('[data-cy="modal"]').should('be.visible').contains('Краторная булка N-200i');

      cy.get('[data-cy="modal-close-button"]').click();
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('закрытие по клику на оверлей', () => {
      cy.get('@bun').click();
      cy.get('[data-cy="modal-overlay"]').click({ force: true });
      cy.get('[data-cy="modal"]').should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    it('сборка бургера, оформление и очистка', () => {

      cy.setCookie('accessToken', 'test-token');
      localStorage.setItem('refreshToken', 'test-refresh-token');

      cy.get('[data-cy="top-bun-empty"]').should('exist');

      cy.get('@bun').find('button').contains('Добавить').click();
      cy.get('@main').find('button').contains('Добавить').click();

      cy.get('[data-cy="constructor-bun-top"]').should('contain', 'Краторная булка N-200i');
      cy.get('[data-cy="constructor-bun-bottom"]').should('contain', 'Краторная булка N-200i');

      cy.get('[data-cy="order-button"]').click();

      cy.wait('@postOrder');
      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('[data-cy="order-number"]').should('contain', '103169');

      cy.get('[data-cy="modal-close-button"]').click();
      cy.get('[data-cy="modal"]').should('not.exist');

      cy.get('[data-cy="top-bun-empty"]').should('exist');
      cy.get('[data-cy="ingredients-empty"]').should('exist');
    });
  });
});