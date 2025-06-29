class LoginActions {

  static goToLoginPage() {
    return {
      async performAs(actor) {
        await actor.page.goto('/login')
      }
    };
  }

  static submitUsername(username) {
    return {
      async performAs(actor) {
        await actor.page.fill('#username', username);
        await LoginActions.clickContinue(actor);
      }
    };
  }

  static submitPassword(password) {
    return {
      async performAs(actor) {
        await actor.page.fill('#password', password);
        await LoginActions.clickContinue(actor);
      }
    };
  }

  static clickToEditEmail() {
    return {
      async performAs(actor) {
        await actor.page.getByText('Edit').click();
      }
    };
  }

  static toggleShowPassword() {
    return {
      async performAs(actor) {
        await actor.page.getByRole('button', { name: /show password|hide password/i }).click();
      }
    };
  }

  static logout() {
    return {
      async performAs(actor) {
        await actor.page.goto('/logout', {
          timeout: 10000,
          waitUntil: 'domcontentloaded'
        });
      }
    };
  }

  static viewPrivacyPolicy() {
    return {
      async performAs(actor) {
        await actor.page.getByText('Privacy Policy').click();
      }
    };
  }

  static async clickContinue(actor) {
    await actor.page.getByText('Continue', { exact: true }).click();
    await actor.page.waitForLoadState('load');
  }

}

module.exports = LoginActions;