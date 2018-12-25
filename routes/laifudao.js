var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer')

let Crawler = require('crawler')
let cheerio = require('cheerio')
let superagent = require('superagent')
const Promise = require("promise");

let base_url = 'http://www.laifudao.com/'


router.get('/', (req, res, next) => {
    Promise.all(arr).then(data => {

        res.send(data)
    })
});

function getPageAsync(url) {
    return new Promise((resolve, reject) => {
        let crawler = new Crawler({
            maxConnections: 10,
            callback: function (err, data, done) {
                if (err) {
                    console.log(err)
                } else {
                    let $ = data.$
                    let items = []
                    $('article').each((ids, response) => {
                        let $element = $(response)
                        items.push({
                            title: $element.find('h1').text().trim(),
                            image: $element.find('.post-content img').attr('src'),
                            time: $element.find('.post-header time').text(),
                            content: $element.find('.article-content').find('p').text(),
                        })
                    })
                    resolve(items)
                }
            }
        })
        crawler.queue(url)
    })
}

let arr = []
for (let i = 1; i < 8; i++) {
    arr.push(getPageAsync(base_url + 'index_' + i + '.htm'))
}

module.exports = router;
