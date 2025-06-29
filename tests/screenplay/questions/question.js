import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

class LoginVerifications {

  static inputErrorMessageIs(expectedText) {
    return {
      answeredBy: async (actor) => {
        const errorElement = actor.page.locator('.ulp-input-error-message');
        await expect(errorElement).toHaveText(expectedText);
      }
    };
  }

  // this is a browser validation tooltip not visible on the DOM so needs a JS eval
  static verifyFieldValidationFor(fieldId, expectedMessage) {
    return {
      answeredBy: async (actor) => {
        const fieldProps = await actor.page.evaluate((id) => {
          const element = document.getElementById(id);
          return {
            validationMessage: element.validationMessage,
            valueMissing: element.validity.valueMissing
          };
        }, fieldId);

        expect(fieldProps.valueMissing).toBeTruthy();
        expect(fieldProps.validationMessage).toMatch(expectedMessage);
      }
    };
  }
}

class PageVerifications {

  static pageTitleIs(expectedTitle) {
    return {
      answeredBy: async (actor) => {
        await expect(actor.page).toHaveTitle(expectedTitle);
      }
    };
  }

  static pageTitleIsNot(unexpectedTitle) {
    return {
      answeredBy: async (actor) => {
        await expect(actor.page).not.toHaveTitle(unexpectedTitle);
      }
    };
  }

  static pageContainsText(expectedText) {
    return {
      answeredBy: async (actor) => {
        await expect(actor.page).toContainText(expectedText);
      }
    };
  }

  static pageIsAccessible() {
    return {
      answeredBy: async (actor) => {
        const accessibilityScanResults = await new AxeBuilder({ page: actor.page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
    
        const criticalViolations = accessibilityScanResults.violations.filter(
        (violation) => violation.impact === 'critical' || violation.impact === 'serious'
        );
    
        expect(criticalViolations).toEqual([]);
      }
    };
  }
}

export { LoginVerifications, PageVerifications };