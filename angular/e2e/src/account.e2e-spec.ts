import { AppAccountPage } from './account.po';
import { browser, logging } from 'protractor';

describe('project rvtr-app-campsite', () => {
    let page: AppAccountPage;

    beforeEach(() => {
        page = new AppAccountPage();
    });

    it('should display account page header', () => {
        page.navigateToAccount();
        expect(page.getAccountPageHeader()).toContain('account');
    });

    it('should display edit button', () => {
        page.navigateToAccount();
        expect(page.getEditButton()).toContain('Edit');
    });

    it('should route to account edit page', () => {
        page.navigateToAccount();
        page.clickEditButton();
        expect(page.getUpdateButton()).toContain('Add');
    });

    afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(
            jasmine.objectContaining({
                level: logging.Level.INFO,
            } as logging.Entry)
        );
    });
});
