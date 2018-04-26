var express = require('express');
var router = express.Router();
let Crawler = require('crawler')

let http = require('http')
let fs = require('fs')
let request = require('request')
let cheerio = require('cheerio')
let superagent = require('superagent')
const Promise = require("promise");

let base_url = 'https://www.huxiu.com/'

router.get('/', (req, res, next) => {
    Promise.all(arr).then(data => {
        console.log(data)
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
                    $('.mod-b').each((ids, response) => {
                        let $element = $(response)
                        items.push({
                            avatar_img: $element.find('.mob-author img').attr('src'),
                            avatar_name: $element.find('.author-name ').text().trim(),
                            publishTime: $element.find('.time').text().trim(),

                            title: $element.find('.mob-ctt h2').text(),
                            abstract: $element.find('.mob-sub').text().trim(),

                            img: $element.find('.mod-thumb img').attr('data-original'),
                            tags: $element.find('.column-link-box').text().trim(),
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
for (let i = 1; i < 5; i++) {
    arr.push(getPageAsync(base_url + '?huxiu_hash_code=7cc405c0fa605382206a50c6cb7b25cb&page=' + i + '&last_dateline=' + new Date().getTime()))
}


module.exports = router;
