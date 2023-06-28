const assert = require("assert");
const testWidth = 575;

describe('Общие требования: \n', async function () {

    const bugObj = process.env.BUG_ID ? {'bug_id': process.env.BUG_ID} : null;
    const bugParams = bugObj ?  '?' + new URLSearchParams(bugObj).toString() : ''
    const ignoreElements = ['.Application-Menu', '.lead', 'h1', 'p']
    it('Вёрстка должна адаптироваться под ширину экрана 320', async ({browser})=>{
        await browser.url('http://localhost:3000/hw/store' + bugParams);
        await browser.setWindowSize( 320,  1350);
        await browser.pause(300);
        await browser.assertView('plain', 'body', {ignoreElements});
    })
    it('Вёрстка должна адаптироваться под ширину экрана 1920', async ({browser})=>{
        await browser.url('http://localhost:3000/hw/store' + bugParams );

        await browser.setWindowSize( 1920,  1080);

        await browser.pause(300);
        await browser.assertView('plain', 'body', {ignoreElements});
    })
    it('Fails for sm reson' , async function({browser}){
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.setViewport({width: testWidth, height: 699})
    })
    it('На ширине меньше 576px навигационное меню должно скрываться за "гамбургер"', async function ({browser}) {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.setViewport({width: testWidth, height: 699})
        await page.goto('http://localhost:3000/hw/store/catalog'+ bugParams);
        const navBar = await page.$('.Application-Menu');

        const navBarDisplayStyle = await page.evaluate((element) => {
            return window.getComputedStyle(element).getPropertyValue('display');
        }, navBar);
        await page.waitForSelector('.Application-Toggler');

        assert.equal(navBarDisplayStyle, 'none', 'Меню видно на ширине ' + testWidth);
    });
    it('При выборе элемента из меню "гамбургера", меню должно закрываться', async function ({browser}) {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        browser.pause(1000)

        await page.setViewport({width: testWidth, height: 699})
        browser.pause(1000)

        await page.goto('http://localhost:3000/hw/store/catalog' + bugParams);
        await (await page.$('.Application-Toggler')).click();

        await (await page.$('.nav-link')).click();

        const navBar = await page.$('.Application-Menu');

        const navBarDisplayStyle = await page.evaluate((element) => {
            return window.getComputedStyle(element).getPropertyValue('display');
        }, navBar);
        assert.equal(navBarDisplayStyle, 'none', 'виден даже при нажатии')
    });


});
