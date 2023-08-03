const puppeteer = require( 'puppeteer' )

async function getCookies( login, password) {

  // const herokuDeploymentParams = {'args' : ['--no-sandbox', '--disable-setuid-sandbox']}
  console.log("Opening the browser......");

  const browser = await puppeteer.launch({
         headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            'ignoreHTTPSErrors': true
        })

  console.log('Opened the browser2.')

  // Авторизация на  www.strava.com/login
  const page1 = await browser.newPage()
  //await page1.setViewport({width: 1280, height: 1024})
  await page1.goto('https://www.strava.com/login', {waitUntil: 'networkidle2'})
  // await page1.screenshot({path: '01_login_page_loaded.png'});
  console.log(`In getCookies: Setting login to :${login}`)
  console.log(`In getCookies: Setting password to :${password}`)

  await page1.waitForSelector('form', {timeout: 0})
  console.log(`In getCookies: got form`)
  await page1.type('input#email', login)
  await page1.type('input#password', password)
  // await page1.screenshot({path: '02_login_and_password_inserted.png'});

  await page1.waitForTimeout(200)
  console.log(`In getCookies: got timer`)
  await page1.evaluate(()=>document
    .querySelector('button#login-button')
    .click()
  )
  console.log(`In getCookies: clicked login-button`)
  await page1.waitForNavigation({timeout: 0})
  console.log(`In getCookies: got Navigation`)
  	
	
  // await page1.screenshot({path: '03_redirected_to_new_page.png'});

  // Извлекаем _strava4_session cookie
  const sessionFourCookie = await page1.cookies()
  // console.log(sessionFourCookie)
  // console.log("================================")

  // Авторизация на heatmap-external-a.strava.com/auth
  const page2 = await browser.newPage()
  console.log(`In getCookies: got newPage`)
  await page2.setCookie(...sessionFourCookie)
  console.log(`In getCookies: set sessionFourCookie for extern :${sessionFourCookie}`)
  await page2.goto('https://heatmap-external-a.strava.com/auth',{waituntil: 'networkidle2', timeout: 0})
  console.log(`In getCookies: got extern`)
  
//  await page2.goto('https://www.strava.com/heatmap')


  // Извлекаем дополненные CloudFront cookies
  const cloudfontCookie = await page2.cookies()
  // await page2.screenshot({path: '04_redirected_to_heatmap_page.png'});
  // console.log(cloudfontCookie)

  // console.log('Browser end')
  function uniq(a) {
    let seen = {}
    return a.filter(e => seen.hasOwnProperty(e.name) ? false : (seen[e.name]=true))
  }

  let allCookies = sessionFourCookie
      .concat(cloudfontCookie)
  console.log("allCookies")
  console.log(allCookies)

  let uniqueCookies = uniq(allCookies)
  console.log("uniqueCookies")
  console.log(uniqueCookies)

//   let stringOfCookies = uniqueCookies
// //      .filter(e => e.name.match(/^(CloudFront-Signature|CloudFront-Key-Pair-Id|CloudFront-Policy)$/))
//       .map(e => ` ${e.name}=${e.value};`)
//       .reduce(((s,v)=> s+v),"")
//   console.log(stringOfCookies)

  let signature = uniqueCookies
      .filter(e => e.name.match(/^CloudFront-Signature$/))
      .map(e => e.value)
      .reduce(((s,v)=> s+v),"")
  console.log(signature)
  console.log("OrWeCouldTry")
  console.log(uniqueCookies.find(e => e.name === 'CloudFront-Signature').value)
  let keypairid = uniqueCookies
      .filter(e => e.name.match(/^CloudFront-Key-Pair-Id$/))
      .map(e => e.value)
      .reduce(((s,v)=> s+v),"")
  console.log(keypairid)
  let  policy= uniqueCookies
      .filter(e => e.name.match(/^CloudFront-Policy$/))
      .map(e => e.value)
      .reduce(((s,v)=> s+v),"")
  console.log(policy)

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<providers>
	<provider id="10942" type="0" visible="true" background="-1">
		<name>Simon Strava 5</name>
		<mode>Simon Global Heatmap All 5</mode>
		<countries>World</countries>
		<url><![CDATA[https://heatmap-external-c.strava.com/tiles-auth/all/hot/{z}/{x}/{y}.png?v={ts}&Policy=${policy}&Key-Pair-Id=${keypairid}&Signature=${signature}]]></url>
		<zoomPart>{z}-8</zoomPart>
		<zoomMin>8</zoomMin>
		<zoomMax>23</zoomMax>
		<tileSize>256</tileSize>
		<tileScale dpi="0" multi="2.0" replace="19" />
		<attribution>
			<![CDATA[© 2019 Strava]]>
		</attribution>
		<extraHeader>
			<![CDATA[ Connection#keep-alive ]]>
		</extraHeader>
		<extraHeader>
			<![CDATA[ Referer#https://www.strava.com/heatmap ]]>
		</extraHeader>
		<extraHeader>
			<![CDATA[ User-Agent#Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36 ]]>
		</extraHeader>
	</provider>
	<provider id="10943" type="0" visible="true" background="-1">
		<name>Simon Strava 5</name>
		<mode>Simon Global Heatmap Ride 5</mode>
		<countries>World</countries>
		<url><![CDATA[https://heatmap-external-c.strava.com/tiles-auth/ride/hot/{z}/{x}/{y}.png?v={ts}&Policy=${policy}&Key-Pair-Id=${keypairid}&Signature=${signature}]]></url>
		<zoomPart>{z}-8</zoomPart>
		<zoomMin>8</zoomMin>
		<zoomMax>23</zoomMax>
		<tileSize>256</tileSize>
		<tileScale dpi="0" multi="2.0" replace="19" />
		<attribution>
			<![CDATA[© 2019 Strava]]>
		</attribution>
		<extraHeader>
			<![CDATA[ Connection#keep-alive ]]>
		</extraHeader>
		<extraHeader>
			<![CDATA[ Referer#https://www.strava.com/heatmap ]]>
		</extraHeader>
		<extraHeader>
			<![CDATA[ User-Agent#Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36 ]]>
		</extraHeader>
	</provider>
</providers>
`

//   let oldxml = `<?xml version="1.0" encoding="UTF-8"?>
// <providers>
// 	<provider id="10902" type="0" visible="true" background="-1">
// 		<name>Simon Strava</name>
// 		<mode>Simon Global Heatmap All</mode>
// 		<countries>World</countries>
// 		<url><![CDATA[https://heatmap-external-c.strava.com/tiles-auth/all/hot/{z}/{x}/{y}.png?v={ts}]]></url>
// 		<zoomPart>{z}-8</zoomPart>
// 		<zoomMin>8</zoomMin>
// 		<zoomMax>22</zoomMax>
// 		<tileSize>256</tileSize>
// 		<tileScale dpi="0" multi="2.0" replace="19" />
// 		<attribution>
// 			<![CDATA[© 2019 Strava]]>
// 		</attribution>
// 		<extraHeader>
// 			<![CDATA[ Cookie#{${stringOfCookies}} ]]>
// 		</extraHeader>
// 		<extraHeader>
// 			<![CDATA[ Connection#keep-alive ]]>
// 		</extraHeader>
// 		<extraHeader>
// 			<![CDATA[ Referer#https://www.strava.com/heatmap ]]>
// 		</extraHeader>
// 		<extraHeader>
// 			<![CDATA[ User-Agent#Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36 ]]>
// 		</extraHeader>
// 	</provider>
// </providers>
// `

  console.log(xml)
  await browser.close()
  return xml
}

module.exports = getCookies
