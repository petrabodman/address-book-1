const { setWorldConstructor } = require('cucumber')
const { expect } = require('chai')
const puppeteer = require('puppeteer')

const HOME_PAGE = 'http://localhost:3000'

class AddressBookWorld {
  constructor() {}


  //open the homepage using puppeteer
  //async/await
  async openHomePage() {
    this.browser = await puppeteer.launch()
    this.page = await this.browser.newPage()
    await this.page.goto(HOME_PAGE)
  }

  async closeHomePage() {
    await this.browser.close()
  }

  async pageHasTextContent(expectedContent) {
    const pageContent = await this.page.content()
    const actualContent = pageContent.match(expectedContent)[0]

    expect(actualContent).to.be.eq(expectedContent)
  }

  async clickOnButton(btnName){
    const btnSelector = this.btnSelectorFormName(btnName.toLowerCase())
    await this.page.waitForSelector(btnSelector)
    await this.page.click(btnSelector)
  }

  async fillFormField(field, content) {
    const inputSelector = `#contact-${field}`
    await this.page.waitForSelector(inputSelector)
    this.inputElement = await this.page.$(inputSelector)
    await this.inputElement.type(content)
  }

  async checkContactStorageCount(expectedCount) {
    const actualCount = await this.page.evaluate(
      () => {
         return JSON.parse(window.localStorage.getItem('contacts')).length
      }
    )
    console.log(">>>>>>>> " + actualCount)

    expect(actualCount).to.be.eq(expectedCount)
  }

  btnSelectorFormName(btnName) {
    switch (btnName) {
      case 'add contact':
      return '.add-contact'
      break
      case 'save contact':
      return '.save-contact'
      break
      default:
      throw `${btnName} button is not defined`
      break
    }
  }
}

setWorldConstructor(AddressBookWorld)
