var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer')

let cheerio = require('cheerio')
let superagent = require('superagent')
let Crawler = require('crawler')
/* GET home page. */
router.get('/', function (req, res, next) {
    // res.render('index', { title: 'Express' });
    res.send('book api');
});

/* GET users listing. */
router.get('/jianshu', function (req, res, next) {
    let base_url = 'https://www.jianshu.com'
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
                res.send(items)
            }
        }
    })
    crawler.queue(base_url)
});

router.get('/huxiu', function (req, res, next) {
    let base_url = 'https://www.huxiu.com/'
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
                res.send(items)
            }
        }
    })
    crawler.queue(base_url)
});

router.get('/bs', function (req, res, next) {
    let base_url = 'http://www.budejie.com/'
    superagent.get(base_url)
        .end((err, result) => {
            if (err) {
                return next(err)
            } else {
                let $ = cheerio.load(result.text)
                let items = []

                $('.j-r-list li').each((ids, ele) => {
                    console.log($(ele))
                    let $element = $(ele);
                    items.push({

                        avatar_img: $element.find('.j-list-user .u-img a').attr('href'),
                        avatar_name: $element.find('.j-list-user .u-txt a').text().trim(),
                        publishTime: $element.find('.j-list-user .u-txt span').text().trim(),

                    })
                })
                res.send(items)
            }
        })
});

/* GET users listing. */
router.get('/zhihu', function (req, res, next) {
    // superagent.get('https://www.zhihu.com/')
    superagent.get('https://www.zhihu.com/question/264331588/answer/288579283')
        .end((err, result) => {
            if (err) {
                return next(err)
            } else {
                let $ = cheerio.load(result.text)
                let items = []

                $('.AnswerCard').each((ids, ele) => {
                    console.log($(ele))
                    let _this = $(ele);
                    items.push({
                        title: _this.find('a').text(),
                        title2: _this.find('.RichContent-inner span').text()
                    })
                })
                res.send(items)
            }
        })
});

/* GET users listing. */
router.get('/send', function (req, res, next) {
    mailTransport.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err)
            return
        }
        console.log('发送成功')
        res.send('发送成功')
    })
});


//授权码  rnyadjtmpvisjejb
var mailTransport = nodemailer.createTransport({
    service: 'qq',
    auth: {
        user: '1207430398@qq.com',
        pass: 'rnyadjtmpvisjejb'
    },
})
var mailOptions = {
    from: '1207430398@qq.com',
    to: '1121171140@qq.com',
    subject: '测试邮件',
    html: `<h2>连接 <a href="http://www.baidu.com">点击</a></h2>    `
}


module.exports = router;
