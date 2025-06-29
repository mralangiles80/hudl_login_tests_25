import { test } from '@playwright/test';
import { Actor } from '../screenplay/actors/actor';
import LoginActions from '../screenplay/tasks/loginActions';
import { LoginVerifications, PageVerifications } from '../screenplay/questions/question.js';
import { testData } from '../fixtures/test-data.js';

test.describe('Valid user login tests @valid', () => {

  test('Valid user logs in successfully and lands on the home page and can see their profile name @username @password', async ({ page }) => {
    const validUser = new Actor('ValidUser', page);

    await validUser.attemptsTo( 
      LoginActions.goToLoginPage(),
      LoginActions.submitUsername(testData.credentials.validUsername),
      LoginActions.toggleShowPassword(),
      LoginActions.submitPassword(testData.credentials.validPassword)
    );

    await validUser.asks(
      PageVerifications.pageTitleIs(testData.pageTitles.homePage)
    );
  });

  test('Valid user cannot see their profile name on the home page after logging out @username @password', async ({ page }) => {
    const validUser = new Actor('ValidUser', page);

    await validUser.attemptsTo( 
      LoginActions.goToLoginPage(),
      LoginActions.submitUsername(testData.credentials.validUsername),
      LoginActions.submitPassword(testData.credentials.validPassword),
      LoginActions.logout()
    );

    await validUser.attemptsTo(
      await page.goBack()
    );

    await validUser.asks(
      PageVerifications.pageTitleIs('Hudl'),
      PageVerifications.pageTitleIsNot(testData.pageTitles.homePage)
    );
  });
});

test('Compliance user assesses login page for accessibility issues @a11y', async ({ page }) => {
  const complianceUser = new Actor('ComplianceUser', page);

  await complianceUser.attemptsTo( 
    LoginActions.goToLoginPage()
  );

  await complianceUser.asks(
    PageVerifications.pageIsAccessible()
  );
});

test('Compliance user assesses login page for legal issues @a11y', async ({ page }) => {
  const complianceUser = new Actor('ComplianceUser', page);

  await complianceUser.attemptsTo( 
    LoginActions.goToLoginPage(),
    LoginActions.viewPrivacyPolicy()
  );

  await complianceUser.asks(
    PageVerifications.pageIsAccessible()
  );
});

test.describe('Invalid user login tests @invalid', () => {

  test('User attempts to access home page directly without logging in but is redirected to login page', async ({ page }) => {
    const invalidUser = new Actor('InvalidUser', page);

    await invalidUser.attemptsTo( 
      await page.goto('/home')
    );
    
    await invalidUser.asks(
      PageVerifications.pageTitleIs(testData.pageTitles.loginPage),
      PageVerifications.pageTitleIsNot(testData.pageTitles.homePage)
    );
  });

  test('User attempts to log in without username but sees validation message instead @username', async ({ page }) => {
    const invalidUser = new Actor('InvalidUser', page);
  
    await invalidUser.attemptsTo( 
      LoginActions.goToLoginPage(),
      LoginActions.submitUsername(''),
    );

    await invalidUser.asks(
      LoginVerifications.verifyFieldValidationFor('username', testData.errorMessages.fillFieldErrorMessage)
    );
  });

  test('User attempts to log in with unregistered username and password but sees validation message instead @username', async ({ page }) => {
    const invalidUser = new Actor('InvalidUser', page);
  
    await invalidUser.attemptsTo( 
      LoginActions.goToLoginPage(),
      LoginActions.submitUsername('ihavenot@registe.red'),
      LoginActions.submitPassword('unregistered-password'),
    );

    await invalidUser.asks(
      LoginVerifications.inputErrorMessageIs('Incorrect username or password.')
    );
  });

  test('User attempts to log in with unregistered username and no password but sees validation message instead @username', async ({ page }) => {
    const invalidUser = new Actor('InvalidUser', page);
  
    await invalidUser.attemptsTo( 
      LoginActions.goToLoginPage(),
      LoginActions.submitUsername('i.have.not@register.ed'),
      LoginActions.submitPassword('')
    );

    await invalidUser.asks(
      LoginVerifications.verifyFieldValidationFor('password', testData.errorMessages.fillFieldErrorMessage)
    );
  });

  test('User attempts to log in with username in invalid format but sees validation message instead @username', async ({ page }) => {
    const invalidUser = new Actor('InvalidUser', page);
  
    await invalidUser.attemptsTo( 
      LoginActions.goToLoginPage(),
      LoginActions.submitUsername('ihaventregistered'),
      LoginActions.submitUsername('verylongverylongverylongverylongverylongverylongverylongverylongverylongverylongverylongverylongverylongverylongverylongverylong@verylongverylongverylongverylong.very')
    );

    await invalidUser.asks(
      LoginVerifications.inputErrorMessageIs('Enter a valid email.')
    );
  });

  test('Malicious user attempts to use SQL injection in username field but sees validation message instead @username', async ({ page }) => {
    const maliciousUser = new Actor('MaliciousUser', page);
  
    await maliciousUser.attemptsTo( 
      LoginActions.goToLoginPage(),
      LoginActions.submitUsername("\' UNION SELECT database()--"),
      LoginActions.submitUsername("admin@hudl.com\' OR \'x\'=\'x\'--")
    );

    await maliciousUser.asks(
      LoginVerifications.inputErrorMessageIs('Enter a valid email.')
    );
  });

  test('User attempts to log in with registered username but without password so sees validation message instead @password', async ({ page }) => {
    const invalidUser = new Actor('InvalidUser', page);
  
    await invalidUser.attemptsTo( 
      LoginActions.goToLoginPage(),
      LoginActions.submitUsername(testData.credentials.validUsername),
      LoginActions.submitPassword('')
    );

    await invalidUser.asks(
      LoginVerifications.verifyFieldValidationFor('password', testData.errorMessages.fillFieldErrorMessage)
    );
  });

  test('User attempts to log in with registered username but wrong password so sees validation message instead @password', async ({ page }) => {
    const invalidUser = new Actor('InvalidUser', page);
  
    await invalidUser.attemptsTo( 
      LoginActions.goToLoginPage(),
      LoginActions.submitUsername(testData.credentials.validUsername),
      LoginActions.submitPassword('wrong-password')
    );

    await invalidUser.asks(
      LoginVerifications.inputErrorMessageIs('Your email or password is incorrect. Try again.')
    );
  });

  test('Malicious user attempts to use the username field to conduct a brute force attack @username @attack', async ({ page }) => {
    test.skip() // this test is skipped because it has inconsistent results but in the time spent it wasn't clear why (probably hit rate?)
    // the app appears to respond in 3 different ways (see below)
    const maliciousUser = new Actor('MaliciousUser', page);
  
    await maliciousUser.attemptsTo(
      LoginActions.goToLoginPage()
    );

    for (let i = 0; i < 30; i++) {
      const repeatFailedLoginActions = [
        LoginActions.submitUsername('ihavenot@register.ed'),
        LoginActions.submitPassword('wrongpw'),
        LoginActions.clickToEditEmail()
      ];
      await maliciousUser.attemptsTo(...repeatFailedLoginActions);
    };

    await maliciousUser.asks(
      // this is sometimes the result (red validation message on field)
      LoginVerifications.inputErrorMessageIs('You\'ve tried to log in too many times, so we\'ve temporarily blocked your account. To get help, contact support'),
      // this is also sometimes the result (http 429 page)
      PageVerifications.pageContainsText('rate limit has been reached'),
      // this is also sometimes the result (http 400 page)
      PageVerifications.pageContainsText('page unavailable')
    );
  });
  
});
