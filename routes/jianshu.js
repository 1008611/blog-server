var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer')

let Crawler = require('crawler')
let cheerio = require('cheerio')
let superagent = require('superagent')
const Promise = require("promise");

let base_url = 'https://www.jianshu.com'


router.get('/', (req, res, next) => {
    // Promise.all(arr).then(data => {
    //     console.log(data)
    //     console.log(data.length)
    //
    //     let items = []
    //     data.forEach(item => {
    //         // getPageAsync(item).then(data2 => {
    //         //     items.push(data2)
    //         //     res.send(items)
    //         //
    //         //     console.log(data2)
    //         // })
    //     })
    //
    // })
    getPageAsyncgetNextPage(2).then(data=>{
        res.send(data)
    })

});

function getNextPage(data, page) {
    return new Promise((resolve, reject) => {
        let arr = []
        let url = ''

        data.forEach(item => {
            arr.push(item.id)
        })
        arr.forEach(item => {
            url += 'seen_snote_ids=' + item + '&'
        })
        url = base_url + '?' + url + 'page=' + page
        resolve(url)
    })
}

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
                    $('#list-container .note-list li').each((ids, response) => {
                        let $element = $(response)
                        items.push({
                            avatar_img: 'http:' + $element.find('.avatar img').attr('src'),
                            avatar_name: $element.find('.info .nickname').text().trim(),
                            avatar_url: base_url + $element.find('.avatar').attr('href'),
                            publishTime: $element.attr('data-shared-at'),

                            id: $element.attr('data-note-id'),
                            title: $element.find('.title').text(),
                            abstract: $element.find('.abstract').text().trim(),

                            slug: $element.find('.title').attr('href').replace('/p/', ""),
                            article_url: base_url + $element.find('.title').attr('href'),

                            img: 'http:' + $element.find('.wrap-img img').attr('src'),
                            collection_tag: $element.find('.mate .collection-tag').text().trim()
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
for (let i = 1; i < 4; i++) {

    arr.push(getNextPage(i))
}

module.exports = router;
