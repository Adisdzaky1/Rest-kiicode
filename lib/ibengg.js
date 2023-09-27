var fs = require("fs")
var former = require("form-data")
const { default: axios, isAxiosError } = require("axios");
const cheerio = require("cheerio");
const encodeUrl = require('encodeurl')

async function coki() {
	try {
		var a = await axios.request("https://photofunia.com/images?server=1", {
			method: "GET",
			headers: {
				"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; Flow) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/359.0.0.288 Safari/537.36",
				"Accept": "application/json, text/javascript, */*; q=0.01",
				"Host": "photofunia.com"
			}
		})
		var coki = a.headers['set-cookie'][0].split(';')[0]
		return ({
			coki: coki
		})
	} catch (e) {
		if (e.response) {
			return ({
				status: e.response.status,
				msg: e.response.statusText
			})

		}
		console.log(e)
	}
}

async function imgkey(url, imeg) {
	var u = new URL(url)
	var a = await coki()
	try {
		var form = new former()
		form.append("image", imeg, {
			filename: `${Math.floor(Math.random() * 10000)}.jpg`
		})
		var b = await axios.request("https://photofunia.com/images?server=1", {
			method: "POST",
			data: form.getBuffer(),
			headers: {
				"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; Flow) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/359.0.0.288 Safari/537.36",
				"Accept": "application/json, text/javascript, */*; q=0.01",
				"Host": "photofunia.com",
				cookie: a.coki + "; accept_cookie=true",
				...form.getHeaders(),
				"Accept-Language": "id-ID,id;q=0.9,en-GB;q=0.8,en;q=0.7,en-US;q=0.6",
				"Referer": "https://photofunia.com" + u.pathname
			}
		})
		var imgkey = b.data.response.key
		return ({
			key: imgkey,
			coki: a.coki,
			data: b.data
		})
	} catch (e) {
		if (e.response) {
			return ({
				status: "gagal",
				msg: e.response.statusText
			})
		} else {
			return ({
				status: "gagal", 
				msg: "bukan link gambar itu bang"
			})
		}
		console.log(e)
	}
}

async function photofunimg(url, imeg) {
	var u = new URL(url)
	if (!/https:\/\/.+\.photofunia.+/g.test(url)) {
		return resolve({
			status: "gagal", 
			msg: "itu bukan link dari photofunia"
		})
	}
	var key = await imgkey(url, imeg)
	console.log(key)
	try {
		form2 = new former()
		form2.append('current-category', "all_effects");
		form2.append('image', key.key);
		form2.append("image:crop", "0");
		c = await axios.request("https://photofunia.com" + u.pathname + "?server=1", {
			method: "POST",
			data: form2.getBuffer(),
			headers: {
				"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; Flow) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/359.0.0.288 Safari/537.36",
				"Accept": "application/json, text/javascript, */*; q=0.01",
				"Host": "photofunia.com",
				cookie: key.coki + "; accept_cookie=true",
				...form2.getHeaders(),
				"Accept-Language": "id-ID,id;q=0.9,en-GB;q=0.8,en;q=0.7,en-US;q=0.6",
				"Referer": "https://photofunia.com" + u.pathname
			}
		})
		var img = /data-share-image="(.+?)"/.exec(c.data)[1]
		return ({
			status: "sukses",
			url: img
		})
	} catch (e) {
		if (e.response) {
			return ({
				status: "gagal",
				msg: e.response.statusText
			})

		} else {
			return ({
				status: "gagal", 
				msg: "error nih"
			})
		}
		console.log(e)
	}
}

function photofuntext(url, text) {
	return new Promise(async (resolve, reject) => {
		if (!/https:\/\/.+\.photofunia.+/g.test(url)) {
			return resolve({
				msg: "itu bukan link dari photofunia"
			})
		}
		var u = new URL(url)
		try {
			a = await axios.request("https://photofunia.com/cookie-warning?server=1", {
				"method": "GET",
				"headers": {
					"Host": "photofunia.com",
					"Referer": "https://photofunia.com" + u.pathname
				}
			})
			var coki = a.headers['set-cookie'][0].split(';')[0]
			var form = new former()
			form.append('current-category', 'all_effect')
			form.append('text', text)

			var b = await axios.request("https://photofunia.com" + u.pathname + "?server=1", {
				method: "POST",
				data: form.getBuffer(),
				headers: {
					accept: '*/*',
					'accept-language': 'en-US,en;q=0.9',
					...form.getHeaders(),
					'referer': 'https://photofunia.com' + u.pathname,
					'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; Flow) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/359.0.0.288 Safari/537.36',
					cookie: coki + "; accept_cookie=true"
				}
			})

			var img = /data-share-image="(.+?)"/.exec(b.data)[1]
			return resolve({
				status: "sukses",
				url: img
			})
		} catch (e) {
			if (e.response) {
				return resolve({
					status: "gagal",
					msg: e.response.statusText
				})

			} else {
				return resolve({
					status: "gagal", 
					msg: "salah link mungkin"
				})
			}
			console.log(e)
		}
	})
}
/*
	 *@ XVIDEOS
	 */
	function xvideossearch(query) {
		return new Promise(async (resolve, reject) => {
			await axios.request(`https://www.xvideos.com/?k=${query}&p=${Math.floor(Math.random() * 9) + 1}`, {
				method: "GET"
			}).then(async result => {
				if (isAxiosError()) throw ('axios error');
				const $ = cheerio.load(result.data, {
					xmlMode: false
				});
				let title = new Array();
				let duration = new Array();
				let quality = new Array();
				let url = new Array();
				let thumb = new Array();
				let hasil = new Array();

				$("div.mozaique > div > div.thumb-under > p.title").each(function (a, b) {
					title.push($(this).find("a").attr("title"));
					duration.push($(this).find("span.duration").text());
					url.push("https://www.xvideos.com" + $(this).find("a").attr("href"));
				});
				$("div.mozaique > div > div.thumb-under").each(function (a, b) {
					quality.push($(this).find("span.video-hd-mark").text());
				});
				$("div.mozaique > div > div > div.thumb > a").each(function (a, b) {
					thumb.push($(this).find("img").attr("data-src"));
				});
				for (let i = 0; i < title.length; i++) {
					hasil.push({
						title: title[i],
						duration: duration[i],
						quality: quality[i],
						thumb: thumb[i],
						url: url[i]
					});
				}
				resolve(hasil);
			}).catch(reject);
		});
	}
	function xvideosdown(url) {
		return new Promise(async (resolve, reject) => {
			await axios.request(url, {
				method: "GET"
			}).then(async result => {
				if (isAxiosError()) throw ('axios error');
				const $ = cheerio.load(result.data, {
					xmlMode: false
				});
				const hasil = {
					title: $("meta[property='og:title']").attr("content"),
					keyword: $("meta[name='keywords']").attr("content"),
					views: $("div#video-tabs > div > div > div > div > strong.mobile-hide").text() + " views",
					vote: $("div.rate-infos > span.rating-total-txt").text(),
					like_count: $("span.rating-good-nbr").text(),
					dislike_count: $("span.rating-bad-nbr").text(),
					thumb: $("meta[property='og:image']").attr("content"),
					url: $("#html5video > #html5video_base > div > a").attr("href")
				};
				resolve(hasil);
			}).catch(reject);
		});
	}

function jj (query){
	return new Promise( async(resolve, reject) => {
		await axios.get('https://brainans.com/search?query='+query).then(response => {
			const $ = cheerio.load(response.data)
			const User = $('#search-container > div:nth-child(1) > div.content__text > a').attr('href')
			axios.get('https://brainans.com/'+User).then(respon => {
				const soup = cheerio.load(respon.data)
				const Vidlink = []
				const main = soup('#videos_container > div > div.content__list.grid.infinite_scroll.cards > div > div > a')
				main.each( function() {
					const Vlink = 'https://brainans.com/'+soup(this).attr('href')
					Vidlink.push(Vlink)
				})
				pickrandom(Vidlink).then(res => {
				axios.get(res).then(resp => {
					const ch = cheerio.load(resp.data)
					const result = {
						username: ch('#card-page > div > div.row > div > div > div > div > div.main__user-desc.align-self-center.ml-2 > a').text(),
						caption: ch('#card-page > div > div.row > div > div > div.main__info.mb-4 > div.main__list').text(),
						likes: ch('#card-page > div > div.row > div > div > div.main__info.mb-4 > div > div:nth-child(1) > span').text(),
						comment: ch('#card-page > div > div.row > div > div > div.main__info.mb-4 > div.content__btns.d-flex > div:nth-child(2) > span').text(),
						share: ch('#card-page > div > div.row > div > div > div.main__info.mb-4 > div.content__btns.d-flex > div:nth-child(3) > span').text(),
						video: ch('#card-page > div > div.row > div > div > div.main__info.mb-4 > div.main__image-container > div > video').attr('src')
					}
					resolve(result)
				})		
				}).catch(resolve)
			}).catch(resolve)
		}).catch(resolve)
	})
}



  
async function capcut(Url) {
	return new Promise((resolve, reject) => {
		let token = Url.match(/\d+/)[0];
		axios({
			url: `https://ssscapcut.com/api/download/${token}`,
			method: 'GET',
			headers: {
				'Accept': '/',
				'User-Agent': 'Mozilla/5.0 (Linux; Android 13; CPH2217 Build/TP1A.220905.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/110.0.5481.153 Mobile Safari/537.36',
				'X-Requested-With': 'acr.browser.barebones',
				'Sec-Fetch-Site': 'same-origin',
				'Sec-Fetch-Mode': 'cors',
				'Sec-Fetch-Dest': 'empty',
				'Referer': 'https://ssscapcut.com/',
				'Accept-Encoding': 'gzip, deflate',
				'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
				'Cookie': 'sign=2cbe441f7f5f4bdb8e99907172f65a42; device-time=1685437999515'
			}
		}).then(({ data }) => {
			console.log(data);
			resolve(data);
		}).catch((err) => {
			console.log(err);
			reject(err);
		});
	});
      }



function blackbox(text) {
  return new Promise(async (resolve, reject) => {
    await axios.post("https://www.useblackbox.io/chat-request-v4", {
      "textInput": text,
      "allMessages": [
        {
          "user": text
        }
      ],
      "stream": "",
      "clickedContinue": false
    })
    .then(( response ) => {
      resolve(response.data)
    })
    .catch((e) => {
      resolve(e?.response)
    })
  })
}



function tiktokUser(username) {
	return new Promise(async(resolve,reject) => {
		
axios.get("https://tiktok-video-no-watermark2.p.rapidapi.com/user/posts?unique_id=" + username + "&count=10", {
  headers: {
    "x-rapidapi-host": "tiktok-video-no-watermark2.p.rapidapi.com",
    "x-rapidapi-key": "533115be6amsh2515f73f171c6f1p160d9djsn833294e42f10",
    "Referer": "https://tik.storyclone.com/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  }
}).then( yanz => {
resolve(yanz.data.data)
})
})
}




module.exports.capcut = capcut
module.exports.tiktokUser = tiktokUser
module.exports.blackbox = blackbox
module.exports.imgkey = imgkey
module.exports.photofuntext = photofuntext
module.exports.xvideosdown = xvideosdown
module.exports.xvideossearch = xvideossearch
/**
 *
 * a = await photofunimg("https://photofunia.com/categories/all_effects/concrete-jungle ", fs.readFileSync("./src/gambar/q.jpg"))
 * return a
 *
 **/
