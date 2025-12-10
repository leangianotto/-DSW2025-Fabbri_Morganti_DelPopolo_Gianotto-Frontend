/// <reference types="cypress" />

// Declaraciones de tipo para nuestros comandos personalizados de Cypress
declare namespace Cypress {
	interface Chainable<Subject = any> {
		/** Visita una página y stubea `grecaptcha` en la ventana AUT antes de que corra el código. */
		visitWithRecaptcha(url: string): Chainable<any>

		/** Adjunta una implementación fake de `grecaptcha` vía `window:before:load`. */
		mockRecaptcha(): Chainable<void>
	}
}

// Comandos personalizados mínimos para stubear grecaptcha en pruebas E2E.
const makeFakeGrecaptcha = () => ({
	ready: (cb: () => void) => {
		try {
			cb()
		} catch (e) {
			// ignorar
		}
	},
	execute: () => Promise.resolve('fake-recaptcha-token'),
	render: () => 0,
	reset: () => {},
})

// Adjunta un `grecaptcha` falso antes de que cargue la AUT
Cypress.Commands.add('mockRecaptcha', () => {
	cy.on('window:before:load', (win) => {
		;(win as any).grecaptcha = makeFakeGrecaptcha()
	})
})

// Visita con grecaptcha stubeado vía `onBeforeLoad`
Cypress.Commands.add('visitWithRecaptcha', (url: string) => {
	const fake = makeFakeGrecaptcha()
	return cy.visit(url, {
		onBeforeLoad(win) {
			;(win as any).grecaptcha = fake
		},
	})
})
