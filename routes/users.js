var express = require('express');
var router = express.Router();


let cheerio = require('cheerio')
let superagent = require('superagent')


/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
/* GET users listing. */
router.get('/aa', function (req, res, next) {


    let $ = cheerio.load(htmlText)
    let items = []
    let arr = $('#dl1').nextAll()
    // $('#dl1').each((ids, ele) => {
    //     console.log($(ele))
    //     let $element = $(ele);
    //     items.push({
    //         avatar_img: $element.nextAll() + "",
    //     })
    // })
    res.send(arr)

});


module.exports = router;
