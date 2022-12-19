const fs = require ('fs')
const cool = require('cool-ascii-faces');
const express = require('express');
const rateLimit = require('express-rate-limit')
const scraper = require( './WebScraper.js' )
const path = require('path');
const PORT = process.env.PORT || 5000;

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req, res) => res.send(cool()))
  .get( '/sa/:login/:password/', async ( req, res, next ) => {
    console.log("In async")
      const login = req.params.login
      const password = req.params.password
      if (!login) return next(error(400, 'No login parameter'))
      if (!password) return next(error(400, 'No password parameter'))

    console.log("In async: awaiting scraper")
      const xml = await scraper(login, password)
//      fs.writeFile("./result.xml", xml, function(err) {
//        if(err) {
//            return console.log(err);
//        }
//        console.log("./result.xml was saved")
//      })
//    console.log('writing reslult.xml')
 //     await fs.writeFileSync('./result.xml',xml)
  //  console.log('written result.xml')
   //   await res.download('./result.xml')
      res.setHeader("Content-Type", "text/plain")
      res.send(xml)
      res.end("")
      // res.json(authedCookies);
    })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
