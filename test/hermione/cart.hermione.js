describe('Корзина: \n', async () => {
    const bugObj = process.env.BUG_ID ? {'bug_id': process.env.BUG_ID} : null;
    const bugParams = bugObj ?  '?' + new URLSearchParams(bugObj).toString() : ''

    it('workaround first time fails to start', async ({browser})=>{
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto('http://localhost:3000/hw/store/cart' + bugParams)

    })
    it('В корзине должна отображаться таблица с добавленными в нее товарами', async ({browser}) => {
        console.log(process.env)

        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.setViewport({width: 1920, height: 1080})
        browser.pause(1000);

        let error = false;
        try{
            await page.goto('http://localhost:3000/hw/store/cart' )
        } catch (e){
            error = e;
            console.log(e);
            process.exit(1)
        }
        if (error){
            browser.pause(1000);
            await page.goto('http://localhost:3000/hw/store/cart' );
        }
        await page.evaluate(() => {
            localStorage.setItem('example-store-cart', JSON.stringify({
                    "0": {"name": "Gorgeous Hat", "count": 4, "price": 68},
                    "1": {"name": "Unbranded Bacon", "count": 5, "price": 705},
                    "2": {"name": "Licensed Mouse", "count": 6, "price": 61}
                }
            ));
        });
        await page.goto('http://localhost:3000/hw/store/cart'  + bugParams)

        await browser.assertView('plain', '.Cart-Table')
        await page.evaluate(() => {
            localStorage.clear();
        })
    })
    it('Пользователь видеть подтверждение выполненого заказа', async ({browser})=>{

        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.setViewport({width: 1920, height: 1080})
        await page.goto('http://localhost:3000/hw/store/cart'  + bugParams)

        browser.pause(1000);

        await page.evaluate(() => {
            localStorage.setItem('example-store-cart', JSON.stringify({
                    "0": {"name": "Gorgeous Hat", "count": 4, "price": 68},
                    "1": {"name": "Unbranded Bacon", "count": 5, "price": 705},
                    "2": {"name": "Licensed Mouse", "count": 6, "price": 61}
                }
            ));
        });
        await page.goto('http://localhost:3000/hw/store/cart'  + bugParams)

        const nameInput =  await page.waitForSelector('#f-name');
        const phoneInput =  await page.waitForSelector('#f-phone');
        const addressInput =  await page.waitForSelector('#f-address');

        await nameInput.type('Grzegorz Brzęczyszczykiewicz');
        await addressInput.type('al. Jana Pawla II');
        await phoneInput.type('1231231231');

        await page.click('#root > div > div > div > div:nth-child(3) > div > div > button');
        const ignoreElements = ['.Cart-SuccessMessage > p']
        await browser.assertView('plain', 'body', {ignoreElements});
    })

})