var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer')

let cheerio = require('cheerio')
let superagent = require('superagent')

/* GET users listing. */
router.get('/jianshu', function (req, res, next) {
    superagent.get('https://www.jianshu.com/')
        .end((err, result) => {
            if (err) {
                return next(err)
            } else {
                let $ = cheerio.load(result.text)
                let items = []
                $('#list-container .note-list li').each((ids, ele) => {
                    let $element = $(ele)
                    items.push({
                        id: $element.attr('data-note-id'),
                        slug: $element.find('.title').attr('href').replace('/p/',""),
                        title:$element.find('.title').text(),
                        abstract:$element.find('.abstract').text(),
                        img:$element.find('.wrap-img img').attr('src'),
                        collection_tag:$element.find('.mate .collection-tag').text()
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

// 授权码  rnyadjtmpvisjejb
// var mailTransport = nodemailer.createTransport({
//     service:'qq',
//     auth:{
//       user:'1207430398@qq.com',
//       pass:'rnyadjtmpvisjejb'
//     },
// })
// var mailOptions = {
//     from:'1207430398@qq.com',
//     to:'1121171140@qq.com',
//     subject:'测试邮件',
//     html:`<h2>连接 <a href="http://www.baidu.com">点击</a></h2>    `
// }
//
// mailTransport.sendMail(mailOptions,(err,info)=>{
//     if(err){
//         console.log(err)
//         return
//     }
//     console.log('发送成功')
// })

module.exports = router;
