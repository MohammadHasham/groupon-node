const puppeteer = require("puppeteer");
const Page = require('./helpers/page');
const io = require('socket.io-client');
const socket = io.connect('http://localhost:5000');
var app = require('express')();
var server = require('http').Server(app);
var ios = require('socket.io')(server);

let page;
beforeEach(async ()=>{
  page = await Page.build();
  await page.goto('localhost:3000');
});
afterEach(async ()=> {
  await page.close();
});
test('The header has the correct text',async ()=>{
  await page.login();
  await page.waitForSelector('a.navbar-brand');
  const text = await page.getContentsOf('a.navbar-brand');
  expect(text).toEqual('Groupon')
});
 test('render filter by interests',async ()=>{
   const text = await page.getContentsOf('.interest');
   expect(text).toEqual('Filter By Interests');
 });
describe('render groups',async ()=>{
  test('User can see a list of groups',async ()=>{
  const result = await page.evaluate(
    () =>{
      return fetch('/api/getgroups',{
        method: 'GET',
        credentials: 'same-origin',
        headers:{
          'Content-Type':'application/json'
        }
      }).then(res =>res.json());
    }
  )
  expect(result).not.toHaveLength(0);
 });
});

describe('creation of group',async ()=>{
  beforeEach(async () =>{
    await page.login();
   await page.goto('http://localhost:3000/creategroup');
    await page.waitForNavigation();
  });
  test('click create a group',async ()=>{
    await page.waitFor('h1');
    const text = await page.getContentsOf('h1');
    expect(text).toBe('Create a group');
  });
});

test('create a group',async ()=>{
  await page.login();
  const result = await page.evaluate(
    () =>{
      return fetch('/api/creategroup',{
        method: 'POST',
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          },
        body: JSON.stringify({name: "Cars", interest: "Sports",img:"http://www.lotuscars.com/sites/default/files/image_store/61827_Group-07_10_11_1n1a_1024x681.jpg"})
      }).then(res => res.json());
    }
  );
   expect(result).not.toBe("");
 });

 describe("explore a group and posts",async ()=>{
   beforeEach(async () =>{
     await page.waitFor(2000);
     await page.click('a.btn-primary');
   });
   test("clicking on button takes to a group",async ()=>{
     const title = await page.getContentsOf('label');
     expect(title).toBe('Enter Title');
   });
   test("group has a post",async ()=>{
     await page.waitFor('h5');
     const h5 = await page.getContentsOf('h5');
     expect(h5).not.toBe("");
   });
   test("click on create post,creates a post",async ()=>{
     await page.waitFor('input[name=title]');
     await page.$eval('input[name=title]', el => el.value = 'A new post.');
     await page.$eval('textarea', el => el.value = 'Post data');
     await page.click('.jumbotron button');
     await page.waitFor('p');
     const title = await page.getContentsOf('p');
     expect(title).toBe('A new post.');
   });
   test("clicking on button,shows comments",async ()=>{
     await page.waitFor('.card-body #comment');
     await page.click('.card-body #comment');
     await page.waitFor('h4');
     const text = await page.getContentsOf('h4');
     expect(text).toBe('A new comment');
   });
   test("clicking on add comment, adds a comment",async ()=>{
     await page.waitFor('input[name=commentadd]');
     await page.$eval('input[name=commentadd]',el => el.value = 'A new comment');
     await page.click('.card-body .btn-md');
     await page.waitFor('.card-body #comment');
     await page.click('.card-body #comment');
     await page.waitFor('h4');
     const text = await page.getContentsOf('h4');
     expect(text).toBe('A new comment');
   });
 });
 describe('explore members of a group',async ()=>{
   beforeEach(async ()=>{
     await page.login();
     await page.waitFor('a.btn-primary');
     await page.click('a.btn-primary');
     await page.waitFor('a#members');
   });
   test('renders members', async()=>{
     const member = await page.getContentsOf('a#members');
     expect(member).toBe("Members");
   });
 });

 describe('Socket.io test suite',async ()=>{
   let bool = false;
   beforeEach(async ()=>{
     Promise.resolve(socket.on('connect')).then(()=>{
         console.log('worked...');
         bool = true;
      });
  })
  test('socket is being connected',async()=>{
    expect(bool).toBe(true);
  });
  test('socket transmitting messages and should communicate',async()=>{
    ios.emit('echo','Hello World');
    socket.once("echo",(message)=>{
      expect(message).toBe('Hello World');
    });
  });
});
