import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

const parseMiners = async () => {
    const miners = [];

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://moonarch.app/miners', {waitUntil: 'load', timeout: 0});
    await page.waitForSelector('#__BVID__43 > tbody > tr.last.table-pin.table-superpin');
    await page.click('#app > div.page > div.mainContent > div > div.miners-body > div.card.miners-card > div.action-bar.bottom-action-bar > button');
    await page.waitForSelector('#__BVID__43 > tbody > tr.last.table-pin.table-superpin');
    const content = await page.content();

    const $ = cheerio.load(content);

    let array;
    array = await page.evaluate(() => Array.from(document.querySelectorAll(`#__BVID__43 > tbody > tr > td[aria-colindex="1"]`), element => {
        const a = element.querySelector('a');
        return a ? a.getAttribute('href') : '';
    }));
    array.forEach((value, index) => {
        if (!miners[index]) miners.push({});
        miners[index].telegram = value;
    });
    array = await page.evaluate(() => Array.from(document.querySelectorAll(`#__BVID__43 > tbody > tr > td[aria-colindex="2"]`), element => {
        const link = element.querySelector('a').getAttribute('href');
        return {link : link ? link : '', name: element.innerText};
    }));
    array.forEach((value, index) => {
        miners[index].link = value.link;
        miners[index].name = value.name;
    });
    array = await page.evaluate(() => Array.from(document.querySelectorAll(`#__BVID__43 > tbody > tr > td[aria-colindex="3"] > img`), element => element.getAttribute('alt').substr(7)));
    array.forEach((value, index) => miners[index].chain = value);
    $(`#__BVID__43 > tbody > tr > td[aria-colindex="4"] > span`).each((index, element) => {miners[index].token = $(element).text()});
    array = await page.evaluate(() => Array.from(document.querySelectorAll(`#__BVID__43 > tbody > tr > td[aria-colindex="5"] > span`), element => {
        const as = element.querySelectorAll('a');
        const chart = as[0].getAttribute('href');
        const code = as[1].getAttribute('href');
        return {'balance chart': chart, code};
    }));
    array.forEach((value, index) => miners[index].contract = value);
    array = await page.evaluate(() => Array.from(document.querySelectorAll(`#__BVID__43 > tbody > tr > td[aria-colindex="6"]`), element => {
        const result = {};
        const spans = element.querySelectorAll('span');
        result[spans[0].getAttribute('title').toLowerCase()] = spans[0].innerText
        if (spans[1]) result[spans[1].getAttribute('title').toLowerCase()] = spans[2].innerText;
        return result;
    }));
    array.forEach((value, index) => miners[index].fees = value);
    $(`#__BVID__43 > tbody > tr > td[aria-colindex="7"] > span`).each((index, element) => {miners[index].age = $(element).text().trim()});
    $(`#__BVID__43 > tbody > tr > td[aria-colindex="8"] > span`).each((index, element) => {miners[index]['daily %'] = $(element).text().trim()});
    $(`#__BVID__43 > tbody > tr > td[aria-colindex="9"] > span`).each((index, element) => {miners[index].TVL = $(element).text().trim()});
    array = await page.evaluate(() => Array.from(document.querySelectorAll(`#__BVID__43 > tbody > tr > td[aria-colindex="10"]`), element => {
        const span = element.querySelector('span');
        return span ? span.innerText.trim() : '';
    }));
    array.forEach((value, index) => miners[index]['Evol TVL'] = value);

    await browser.close();

    return miners;
}
