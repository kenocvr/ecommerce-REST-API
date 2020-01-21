import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import WishListComponentsPage, { WishListDeleteDialog } from './wish-list.page-object';
import WishListUpdatePage from './wish-list-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('WishList e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let wishListComponentsPage: WishListComponentsPage;
  let wishListUpdatePage: WishListUpdatePage;
  let wishListDeleteDialog: WishListDeleteDialog;

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

  it('should load WishLists', async () => {
    await navBarPage.getEntityPage('wish-list');
    wishListComponentsPage = new WishListComponentsPage();
    expect(await wishListComponentsPage.getTitle().getText()).to.match(/Wish Lists/);
  });

  it('should load create WishList page', async () => {
    await wishListComponentsPage.clickOnCreateButton();
    wishListUpdatePage = new WishListUpdatePage();
    expect(await wishListUpdatePage.getPageTitle().getText()).to.match(/Create or edit a WishList/);
    await wishListUpdatePage.cancel();
  });

  it('should create and save WishLists', async () => {
    async function createWishList() {
      await wishListComponentsPage.clickOnCreateButton();
      await wishListUpdatePage.setTitleInput('title');
      expect(await wishListUpdatePage.getTitleInput()).to.match(/title/);
      const selectedRestricted = await wishListUpdatePage.getRestrictedInput().isSelected();
      if (selectedRestricted) {
        await wishListUpdatePage.getRestrictedInput().click();
        expect(await wishListUpdatePage.getRestrictedInput().isSelected()).to.be.false;
      } else {
        await wishListUpdatePage.getRestrictedInput().click();
        expect(await wishListUpdatePage.getRestrictedInput().isSelected()).to.be.true;
      }
      await wishListUpdatePage.customerSelectLastOption();
      await waitUntilDisplayed(wishListUpdatePage.getSaveButton());
      await wishListUpdatePage.save();
      await waitUntilHidden(wishListUpdatePage.getSaveButton());
      expect(await wishListUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createWishList();
    await wishListComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await wishListComponentsPage.countDeleteButtons();
    await createWishList();
    await wishListComponentsPage.waitUntilLoaded();

    await wishListComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await wishListComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last WishList', async () => {
    await wishListComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await wishListComponentsPage.countDeleteButtons();
    await wishListComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    wishListDeleteDialog = new WishListDeleteDialog();
    expect(await wishListDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/ecommerceApp.wishList.delete.question/);
    await wishListDeleteDialog.clickOnConfirmButton();

    await wishListComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await wishListComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
