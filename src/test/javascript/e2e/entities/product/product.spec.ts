import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import ProductComponentsPage, { ProductDeleteDialog } from './product.page-object';
import ProductUpdatePage from './product-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('Product e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let productComponentsPage: ProductComponentsPage;
  let productUpdatePage: ProductUpdatePage;
  let productDeleteDialog: ProductDeleteDialog;

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

  it('should load Products', async () => {
    await navBarPage.getEntityPage('product');
    productComponentsPage = new ProductComponentsPage();
    expect(await productComponentsPage.getTitle().getText()).to.match(/Products/);
  });

  it('should load create Product page', async () => {
    await productComponentsPage.clickOnCreateButton();
    productUpdatePage = new ProductUpdatePage();
    expect(await productUpdatePage.getPageTitle().getText()).to.match(/Create or edit a Product/);
    await productUpdatePage.cancel();
  });

  it('should create and save Products', async () => {
    async function createProduct() {
      await productComponentsPage.clickOnCreateButton();
      await productUpdatePage.setTitleInput('title');
      expect(await productUpdatePage.getTitleInput()).to.match(/title/);
      await productUpdatePage.setKeywordsInput('keywords');
      expect(await productUpdatePage.getKeywordsInput()).to.match(/keywords/);
      await productUpdatePage.setDescriptionInput('description');
      expect(await productUpdatePage.getDescriptionInput()).to.match(/description/);
      await productUpdatePage.setRatingInput('5');
      expect(await productUpdatePage.getRatingInput()).to.eq('5');
      await productUpdatePage.setDateAddedInput('01-01-2001');
      expect(await productUpdatePage.getDateAddedInput()).to.eq('2001-01-01');
      await productUpdatePage.setDateModifiedInput('01-01-2001');
      expect(await productUpdatePage.getDateModifiedInput()).to.eq('2001-01-01');
      await productUpdatePage.wishListSelectLastOption();
      await waitUntilDisplayed(productUpdatePage.getSaveButton());
      await productUpdatePage.save();
      await waitUntilHidden(productUpdatePage.getSaveButton());
      expect(await productUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createProduct();
    await productComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await productComponentsPage.countDeleteButtons();
    await createProduct();
    await productComponentsPage.waitUntilLoaded();

    await productComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await productComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Product', async () => {
    await productComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await productComponentsPage.countDeleteButtons();
    await productComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    productDeleteDialog = new ProductDeleteDialog();
    expect(await productDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/ecommerceApp.product.delete.question/);
    await productDeleteDialog.clickOnConfirmButton();

    await productComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await productComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
