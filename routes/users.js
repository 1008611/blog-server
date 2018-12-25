var express = require('express');
var router = express.Router();


let cheerio = require('cheerio')
let superagent = require('superagent')

let htmlText = '<DL id="dl1">\n' +
    '  <DT><H3 ADD_DATE="1527554646" LAST_MODIFIED="0" PERSONAL_TOOLBAR_FOLDER="true">收藏栏</H3>\n' +
    '    <DL>\n' +
    '    </DL>\n' +
    '  <DT><H3 ADD_DATE="1527554698" LAST_MODIFIED="1527554698">开发</H3>\n' +
    '    <DL>\n' +
    '      <DT><H3 ADD_DATE="1527554698" LAST_MODIFIED="1527554753">前端</H3>\n' +
    '        <DL>\n' +
    '          <DT><H3 ADD_DATE="1527554698" LAST_MODIFIED="1527554712">layui</H3>\n' +
    '            <DL>\n' +
    '              <DT><A HREF="http://www.layui.com/" ADD_DATE="1527554712"\n' +
    '                     ICON="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACgklEQVQ4jW2Tz29UVRTHP+fc13mTGWhnFpaWFqWUQlsc2PkDMYJolQRYuDCEEIk/km74Z0jcEBP0P9EEF2riwrhgY5GEmCAxmnbKTOe9d+/XxZspMfYkJzm5Oed7P+fcc+2NCxuvu2X3JHoggpvFlIyDTbU7ZvyaVG062Nfuds5MkqL1d3cNhE3S/2tWe5K7n7O61tdijCnG6Hmzae9dvigwklSn/5/AAK9iTGa+5pIEuIdg/f6uvvj8ll2/+iE7/V3c/SACAWbIJcknlwR3DQdD+/Gnn9ncvE2326GqKiYYZjW91cF+c65Ju5KFEHjy5A+6nQ5Xr7zP88EAd8fMKIqCGCOjUVEDjGV9Eu6f1WJsbFyimedgYjjco/fqOve/usv1ax8wGAvXBC+qAOjMzGBmnD51ksXFo5RFSYyR+fk5zpxZ5dTKMjFGJs+UvZhOTXDkyEtIot1usXxiia2tx0xPH+Lb7x5w+7M7PHr0mHa7TYqpJpgIJCXyvMHx4y9jZkhiYWEeSZgZVRW5eeMjzvbWGe4Nx0OlJjCDoiiZnZ1l9fQKKSXMjG53ZiwGWQicf/M1ut0uD77/YX9eDsg9MBgM9e6lCxw+fIiyrDAz2q0WRVGws9Nn6cQrtNstzvbWObm8pNGowMyUARSjgmPHjtontz5WSslCcCRx8Z23+Ob+l0gwNzeLJJrNnNXVFftt63eazRw7//YVVVVMnc60LS4uWFWV43U1siyQ5zkGlGXJ3mik4MGePv1Tf/+zrSwLnknpYaPRWNve3onPnv3l5uOmzVASUhpvYL02IE1NTaVGIw8xlg8zoU9TSvdCyHqtVqZ6uLKDftJ4xySwlNIvqrT5LzxzG4aRloz7AAAAAElFTkSuQmCC">layui\n' +
    '                - 经典模块化前端UI框架</A>\n' +
    '            </DL>\n' +
    '          <DT><A HREF="http://www.bootcss.com/" ADD_DATE="1527554753"\n' +
    '                 ICON="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACqElEQVQ4jV2TQWicVRSFv/veP//MJIHSRd0pokIjWGhDpY2ZRV3poiBY0JVKFwVLt4HSVTeu3VUoLe2i0F1wUai4CogjEWs1QhZxIQRCaCSI0syMM/+797j4g4j33cXjwHv3nHM5dmn5xmLO+Q7GikJgIDBDHDVIyNqLRAsaw0bNlZRyulPleqCQ1D61nA1LYNmwZJBAEhFhEUFEKFk1sLC7laTBtJmEkCUzGx+ONf17ZpIIBBJVlen2a6qcFJJJwmclgJUqwiVIyYzRaKKl5ZP2xtKrRAQpGRLs7e7zdGObg2d/Wd3tKBSGMEmqXN6Kzkmj0diWlk/y/kdv8//a2/2dG1dvsbdzYFWdJQ8TooqIdozJFMHh8zGlOA/vPmb9qyfMLfT4+OpFzg1OcfatRR5ufc2x4wvm4QhZcndKOB5OiYKs1by/9wdbT3/jp41tDvb/pDSF3Z1nWIJSCh4F90LlUUACEu6OHVG+dv0DPl29RLdXU9c13w9/Ybj+M526opSG0JHB7o4Q2UTxQkQAsPnkV7a3dsg5cf7CKc6cfZ1Prl3k9udrzM318Wi9qzwKksAy7gV3B+Dxl99w/9Yj6m7FhXeWuLf2Ge++N+DB7UdMp1OSGfFfBrhaH9wpTeHY8QVefPkFuv0OZ84vAjCZTJnOWvoS7QclihCGSU2Z2fxCj6pTsXrzMqs3L/+7xtlsxv0v1jh8PmJ+vq/Sbk+VewEgilnd6+jb9R9tPJ6ARKoyCMajMRvDTTZ/2Kbbq9WUxlrZYG++8qEkhZCZmY1HE00mU5OEok2OmdHrd+n1a4XCJNpjSlXxMsyps+LeBIhuv7b+XN2msM1fy9Ad92JqIeVUJY/ZMJ+Yf+07jNNSvBQKIgIPt4jA3YkIwoNQICRJmGGhGBaaK/8AruDNgLDwp9IAAAAASUVORK5CYII=">Bootstrap中文网</A>\n' +
    '        </DL>\n' +
    '      <DT><H3 ADD_DATE="1527554698" LAST_MODIFIED="1527554762">后台</H3>\n' +
    '        <DL>\n' +
    '          <DT><H3 ADD_DATE="1527554698" LAST_MODIFIED="1527554724">redis</H3>\n' +
    '            <DL>\n' +
    '              <DT><A HREF="https://redis.io/" ADD_DATE="1527554724">Redis</A>\n' +
    '            </DL>\n' +
    '          <DT><H3 ADD_DATE="1527554698" LAST_MODIFIED="1527554732">solr</H3>\n' +
    '            <DL>\n' +
    '              <DT><A\n' +
    '                HREF="https://www.baidu.com/link?url=F7C_HGlkgSb9RUG3mcqrKNsR5HRg8llX6rv9n9OU7yP4h8E7C69qYwTc4KNivN76&wd=&eqid=e89d153d0005b5d1000000035b0ca2b3"\n' +
    '                ADD_DATE="1527554732"\n' +
    '                ICON="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACWUlEQVQ4jW3TT4hVdRjG8c85986M/2acnBpHzJJKE0wQlaisRNoEVpCQSBCCFbUwdy1ChCRooYKhYIv+LMrNEAhq/oFKzMjFUIImg6U4YoxNzgwz6eiVudzza/GeS0N1Vuf3ct7fc573+7xZSikpn+ZbljG1NvX873rebEqJVDYf6GNLL4NjcR4Y5egFilR+N+XSalY21xvkOQMj7PyGoZvcN4uta3n9AP1/sO15tqyhkaiUf5LL4rbWKtWcGxOh1NPBWI1vL/L7GPM7+e4ijYKmKFSLFIUv+7gzyYvLuGcGF67z2Dymt0S9Vue1x6mW0kVpo5rhzBV2HKM2SZ6x9xV+uMwbq8PaW0/TVmX1w3xwnDWLePYRioIspZT2n2bfKaa3huoXm0Lltz/pnEF3e5w3fs73l8LewTdZ2FVSWDKXu3Wuj7OkJ/y908v6T3jhY070h9rQzWiq1bk6WlqAtYvZvZ7hCd5+hr2nON4fyrcnee8QD93L4m4OnaNnNg92lThTiig1uX50km1HeH9dzOTTMzHUjml8+BLXxlg4J+ZRJLJGkZJEveDdg1weZtMTLL+f05f49QY/XmHdUn66xq6XWdQdOPOMvCgiQF+d5fAv7NsQ7PuuMreD5x7lVo1XVzFeY8NnDI5Hc5HImzE+P0j7NFoqjEwE75ZKUFi+IGLe3sZfNfqHwnJqXpBlrHggKGz/ms1P0TWT3p8jD5ufjH0YvkUlZ/7sf5YuaxQpZSIwe04G52qFOTNZ0BkUBkYCYVsLG1dGsJqD/w+F/13hxOgdWithc+ra/w1Zt/sgjraIiwAAAABJRU5ErkJggg==">https://www.baidu.com/link?url=F7C_HGlkgSb9RUG3mcqrKNsR5HRg8llX6rv9n9OU7yP4h8E7C69qYwTc4KNivN76&amp;wd=&amp;eqid=e89d153d0005b5d1000000035b0ca2b3</A>\n' +
    '            </DL>\n' +
    '          <DT><A HREF="http://nginx.org/" ADD_DATE="1527554762"\n' +
    '                 ICON="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAWklEQVQ4ja1TQQ4AIAjS1l97U6+tW1ulRFOPDpSBigRLr06XARlt55RcBa/thorKgNBwNQEnGWB8BYyqpcDbTiTip0Aaij1AQygPiCR8ACJTd/DtAUvM/oVwTScFHbbXhF2aAAAAAElFTkSuQmCC">nginx\n' +
    '            news</A>\n' +
    '        </DL>\n' +
    '    </DL>\n' +
    '</DL>'

/* GET users listing. */
router.get('/aaa', function (req, res, next) {
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
