describe('Каталог: \n', async () => {
    const bugObj = process.env.BUG_ID ? {'bug_id': process.env.BUG_ID} : null;
    const bugParams = bugObj ? '?' + new URLSearchParams(bugObj).toString() : ''
    it('Карточка товара рендерится согласно макету', async ({browser}) => {
        const ignoreElements = ['.ProductDetails-Name', '.ProductDetails-Price', '.ProductDetails-Color', '.ProductDetails-Material']
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.goto('http://localhost:3000/hw/store/catalog/2' + bugParams);
        // const descriptionElement =   page.$('.ProductDetails-Description')
        await page.waitForSelector('.ProductDetails-Description')
        await page.evaluate(()=>{
            let dom = document.querySelector('.ProductDetails-Description');
            dom.innerHTML = 'test';
        }, )

        await browser.assertView('plain', '.Product', {ignoreElements});

    })

})