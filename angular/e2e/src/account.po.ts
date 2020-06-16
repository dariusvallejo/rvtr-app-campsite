import { browser, by, element } from 'protractor';

export class AppAccountPage {

  navigateToAccount(): Promise<unknown> {
    return browser.get('/account/1') as Promise<unknown>;
  }

   getAccountPageHeader() : Promise<string> { 
    return element(by.css('h1')).getText() as Promise<string>;
   }

   getEditButton() : Promise<string> { 
    return element(by.css('.is-pulled-right')).getText() as Promise<string>;
   }

   clickEditButton() : Promise<unknown> { 
    return element(by.css('.is-pulled-right')).click() as Promise<unknown>;
   }

   getUpdateButton() : Promise<string> { 
    return element(by.css('button')).getText() as Promise<string>;
   }
}
