const pupeteer = require('puppeteer');
const userFactory = require("../factories/userFactory");
const sessionFactory = require("../factories/sessionFactory");

class CustomPage{
  static async build(){
    const browser = await pupeteer.launch({
      headless:false
    });
    const page = await browser.newPage();
    const customPage = new CustomPage(page);

    return new Proxy(customPage,{
      get: function(target,property){
        return target[property] || browser[property] || page[property];
      }
    });
  }
  constructor(page){
    this.page = page;
  }
  async login(){
    const user = await userFactory();
    const {session,sig} = sessionFactory(user);
    await this.page.setCookie({name:'session',value:session});
    await this.page.setCookie({name:'session.sig',value:sig});
    await this.page.goto('http://localhost:3000');
  }
  async getContentsOf(selector){
    return this.page.$eval(selector,el => el.innerHTML);
  }
}
module.exports = CustomPage;
