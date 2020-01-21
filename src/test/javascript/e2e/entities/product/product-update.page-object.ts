import { element, by, ElementFinder } from 'protractor';

export default class ProductUpdatePage {
  pageTitle: ElementFinder = element(by.id('ecommerceApp.product.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  titleInput: ElementFinder = element(by.css('input#product-title'));
  keywordsInput: ElementFinder = element(by.css('input#product-keywords'));
  descriptionInput: ElementFinder = element(by.css('input#product-description'));
  ratingInput: ElementFinder = element(by.css('input#product-rating'));
  dateAddedInput: ElementFinder = element(by.css('input#product-dateAdded'));
  dateModifiedInput: ElementFinder = element(by.css('input#product-dateModified'));
  wishListSelect: ElementFinder = element(by.css('select#product-wishList'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setTitleInput(title) {
    await this.titleInput.sendKeys(title);
  }

  async getTitleInput() {
    return this.titleInput.getAttribute('value');
  }

  async setKeywordsInput(keywords) {
    await this.keywordsInput.sendKeys(keywords);
  }

  async getKeywordsInput() {
    return this.keywordsInput.getAttribute('value');
  }

  async setDescriptionInput(description) {
    await this.descriptionInput.sendKeys(description);
  }

  async getDescriptionInput() {
    return this.descriptionInput.getAttribute('value');
  }

  async setRatingInput(rating) {
    await this.ratingInput.sendKeys(rating);
  }

  async getRatingInput() {
    return this.ratingInput.getAttribute('value');
  }

  async setDateAddedInput(dateAdded) {
    await this.dateAddedInput.sendKeys(dateAdded);
  }

  async getDateAddedInput() {
    return this.dateAddedInput.getAttribute('value');
  }

  async setDateModifiedInput(dateModified) {
    await this.dateModifiedInput.sendKeys(dateModified);
  }

  async getDateModifiedInput() {
    return this.dateModifiedInput.getAttribute('value');
  }

  async wishListSelectLastOption() {
    await this.wishListSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async wishListSelectOption(option) {
    await this.wishListSelect.sendKeys(option);
  }

  getWishListSelect() {
    return this.wishListSelect;
  }

  async getWishListSelectedOption() {
    return this.wishListSelect.element(by.css('option:checked')).getText();
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  getSaveButton() {
    return this.saveButton;
  }
}
