import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import AddressComponentsPage, { AddressDeleteDialog } from './address.page-object';
import AddressUpdatePage from './address-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('Address e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let addressComponentsPage: AddressComponentsPage;
  let addressUpdatePage: AddressUpdatePage;
  let addressDeleteDialog: AddressDeleteDialog;

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

  it('should load Addresses', async () => {
    await navBarPage.getEntityPage('address');
    addressComponentsPage = new AddressComponentsPage();
    expect(await addressComponentsPage.getTitle().getText()).to.match(/Addresses/);
  });

  it('should load create Address page', async () => {
    await addressComponentsPage.clickOnCreateButton();
    addressUpdatePage = new AddressUpdatePage();
    expect(await addressUpdatePage.getPageTitle().getText()).to.match(/Create or edit a Address/);
    await addressUpdatePage.cancel();
  });

  it('should create and save Addresses', async () => {
    async function createAddress() {
      await addressComponentsPage.clickOnCreateButton();
      await addressUpdatePage.setAddress1Input('address1');
      expect(await addressUpdatePage.getAddress1Input()).to.match(/address1/);
      await addressUpdatePage.setAddress2Input('address2');
      expect(await addressUpdatePage.getAddress2Input()).to.match(/address2/);
      await addressUpdatePage.setCityInput('city');
      expect(await addressUpdatePage.getCityInput()).to.match(/city/);
      await addressUpdatePage.setPostcodeInput('postcode');
      expect(await addressUpdatePage.getPostcodeInput()).to.match(/postcode/);
      await addressUpdatePage.setCountryInput('country');
      expect(await addressUpdatePage.getCountryInput()).to.match(/country/);
      await addressUpdatePage.customerSelectLastOption();
      await waitUntilDisplayed(addressUpdatePage.getSaveButton());
      await addressUpdatePage.save();
      await waitUntilHidden(addressUpdatePage.getSaveButton());
      expect(await addressUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createAddress();
    await addressComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await addressComponentsPage.countDeleteButtons();
    await createAddress();
    await addressComponentsPage.waitUntilLoaded();

    await addressComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await addressComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Address', async () => {
    await addressComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await addressComponentsPage.countDeleteButtons();
    await addressComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    addressDeleteDialog = new AddressDeleteDialog();
    expect(await addressDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/ecommerceApp.address.delete.question/);
    await addressDeleteDialog.clickOnConfirmButton();

    await addressComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await addressComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
