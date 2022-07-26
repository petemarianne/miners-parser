import puppeteer from 'puppeteer';

const parseMiners = async () => {
    const miners = [];

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://moonarch.app/miners', {waitUntil: 'load', timeout: 0});
    await page.waitForSelector('#__BVID__43 > tbody > tr.last.table-pin.table-superpin');
    await page.click('#app > div.page > div.mainContent > div > div.miners-body > div.card.miners-card > div.action-bar.bottom-action-bar > button');
    await page.waitForSelector('#__BVID__43 > tbody > tr.last.table-pin.table-superpin');

    let array = [];
    for (let i = 1; i < 11; i++) {
        switch (i) {
            case 1:
                array = await page.evaluate(() => Array.from(document.querySelectorAll(`#__BVID__43 > tbody > tr > td[aria-colindex="1"]`), element => {
                    const a = element.querySelector('a');
                    return a ? a.getAttribute('href') : '';
                }));
                array.forEach((value, index) => {
                    if (!miners[index]) miners.push({});
                    miners[index].telegram = value;
                });
                break;
            case 2:
                array = await page.evaluate(() => Array.from(document.querySelectorAll(`#__BVID__43 > tbody > tr > td[aria-colindex="2"]`), element => {
                    const link = element.querySelector('a').getAttribute('href');
                    return {link : link ? link : '', name: element.innerText};
                }));
                array.forEach((value, index) => {
                    miners[index].link = value.link;
                    miners[index].name = value.name;
                });
                break;
            case 3:
                array = await page.evaluate(() => Array.from(document.querySelectorAll(`#__BVID__43 > tbody > tr > td[aria-colindex="3"] > img`), element => element.getAttribute('alt').substr(7)));
                array.forEach((value, index) => miners[index].chain = value);
                break;
            case 4:
                array = await page.evaluate(() => Array.from(document.querySelectorAll(`#__BVID__43 > tbody > tr > td[aria-colindex="4"] > span`), element => element.innerText));
                array.forEach((value, index) => miners[index].token = value);
                break;
            case 5:
                array = await page.evaluate(() => Array.from(document.querySelectorAll(`#__BVID__43 > tbody > tr > td[aria-colindex="5"] > span`), element => {
                    const as = element.querySelectorAll('a');
                    const chart = as[0].getAttribute('href');
                    const code = as[1].getAttribute('href');
                    return {'balance chart': chart, code};
                }));
                array.forEach((value, index) => miners[index].contract = value);
                break;
            case 6:
                array = await page.evaluate(() => Array.from(document.querySelectorAll(`#__BVID__43 > tbody > tr > td[aria-colindex="6"]`), element => {
                    const result = {};
                    const spans = element.querySelectorAll('span');
                    result[spans[0].getAttribute('title').toLowerCase()] = spans[0].innerText
                    if (spans[1]) result[spans[1].getAttribute('title').toLowerCase()] = spans[2].innerText;
                    return result;
                }));
                array.forEach((value, index) => miners[index].fees = value);
                break;
            case 7:
                array = await page.evaluate(() => Array.from(document.querySelectorAll(`#__BVID__43 > tbody > tr > td[aria-colindex="7"] > span`), element => element.innerText.trim()));
                array.forEach((value, index) => miners[index].age = value);
                break;
            case 8:
                array = await page.evaluate(() => Array.from(document.querySelectorAll(`#__BVID__43 > tbody > tr > td[aria-colindex="8"] > span`), element => element.innerText.trim()));
                array.forEach((value, index) => miners[index]['daily %'] = value);
                break;
            case 9:
                array = await page.evaluate(() => Array.from(document.querySelectorAll(`#__BVID__43 > tbody > tr > td[aria-colindex="9"] > span`), element => element.innerText.trim()));
                array.forEach((value, index) => miners[index].TVL = value);
                break;
            case 10:
                array = await page.evaluate(() => Array.from(document.querySelectorAll(`#__BVID__43 > tbody > tr > td[aria-colindex="10"]`), element => {
                    const span = element.querySelector('span');
                    return span ? span.innerText.trim() : '';
                }));
                array.forEach((value, index) => miners[index]['Evol TVL'] = value);
                break;
            default:
                break;
        }
        array.length = 0;
    }

    await browser.close();

    return miners;
}