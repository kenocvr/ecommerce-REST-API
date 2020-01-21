import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import CategoryComponentsPage, { CategoryDeleteDialog } from './category.page-object';
import CategoryUpdatePage from './category-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('Category e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let categoryComponentsPage: CategoryComponentsPage;
  let categoryUpdatePage: CategoryUpdatePage;
  let categoryDeleteDialog: CategoryDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();

    await signInPage.username.sendKeys('admin');
    await signInPage.password.sendKeys('admin');
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
    await waitUntilDisplayed(navBarPage.adminMenu);
    await waitUntilDisplayed(navBarPage.accountMenu);
  });

  it('should load Categories', async () => {
    await navBarPage.getEntityPage('category');
    categoryComponentsPage = new CategoryComponentsPage();
    expect(await categoryComponentsPage.getTitle().getText()).to.match(/Categories/);
  });

  it('should load create Category page', async () => {
    await categoryComponentsPage.clickOnCreateButton();
    categoryUpdatePage = new CategoryUpdatePage();
    expect(await categoryUpdatePage.getPageTitle().getText()).to.match(/Create or edit a Category/);
    await categoryUpdatePage.cancel();
  });

  it('should create and save Categories', async () => {
    async function createCategory() {
      await categoryComponentsPage.clickOnCreateButton();
      await categoryUpdatePage.setDescriptionInput('description');
      expect(await categoryUpdatePage.getDescriptionInput()).to.match(/description/);
      await categoryUpdatePage.setSortOrderInput('5');
      expect(await categoryUpdatePage.getSortOrderInput()).to.eq('5');
      await categoryUpdatePage.setDateAddedInput('01-01-2001');
      expect(await categoryUpdatePage.getDateAddedInput()).to.eq('2001-01-01');
      await categoryUpdatePage.setDateModifiedInput('01-01-2001');
      expect(await categoryUpdatePage.getDateModifiedInput()).to.eq('2001-01-01');
      await categoryUpdatePage.statusSelectLastOption();
      await categoryUpdatePage.parentSelectLastOption();
      // categoryUpdatePage.productSelectLastOption();
      await waitUntilDisplayed(categoryUpdatePage.getSaveButton());
      await categoryUpdatePage.save();
      await waitUntilHidden(categoryUpdatePage.getSaveButton());
      expect(await categoryUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createCategory();
    await categoryComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await categoryComponentsPage.countDeleteButtons();
    await createCategory();
    await categoryComponentsPage.waitUntilLoaded();

    await categoryComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await categoryComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Category', async () => {
    await categoryComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await categoryComponentsPage.countDeleteButtons();
    await categoryComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    categoryDeleteDialog = new CategoryDeleteDialog();
    expect(await categoryDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/ecommerceApp.category.delete.question/);
    await categoryDeleteDialog.clickOnConfirmButton();

    await categoryComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await categoryComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
