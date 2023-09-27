const { default: axios, isAxiosError } = require("axios");
const cheerio = require("cheerio");

function random() {
		return new Promise((resolve, reject) => {
			const randPage = Math.floor(Math.random() * 4) + 1;
			axios.get(`https://www.lensa69.com/cerita-sex/page/${randPage}`)
				.then(async response => {
					if (isAxiosError()) throw ('axios error');
					const $ = cheerio.load(response.data);
					let hasil = new Array();
					$(".items > .item").each(function (aa, bb) {
						hasil.push($(this).find("a").attr("href"));
					});
					let filterHasil = hasil.filter(F => F != undefined);
					const randHasil = filterHasil[Math.floor(Math.random() * filterHasil.length)];
					let final = await axios.get(randHasil);
					if (final instanceof Error) return reject(final.message);
					const cc = cheerio.load(final.data);
					const title = cc("div.sbox > div.entry-content > div > h1").text().trim();
					const thumb = cc("div.sbox > div.entry-content > p > img").attr("src");
					const tanggal = cc("div.sbox > div.entry-content > div > p.fr > span").text().trim();
					const cerita = cc("div.sbox > div.entry-content").find("p").text().replace(tanggal, "");
					const result = {
						title: title,
						thumb: thumb,
						tanggal: tanggal,
						cerita: cerita
					};
					resolve(result);
				})
				.catch(err => resolve(err));
		});
	}

async function capcut(url) { 
return new Promise((resolve, reject) => {
let token = url.match(/\d+/)[0];
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

function cocofun(url) {
return new Promise((resolve, reject) => {
axios({url, method: "get",
headers: {
"Cookie": "client_id=1a5afdcd-5574-4cfd-b43b-b30ad14c230e",
"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
}
}).then(data => {
$ = cheerio.load(data.data)
let json
const res = $('script#appState').get()
for(let i of res){
if(i.children && i.children[0] && i.children[0].data){
ress = i.children[0].data.split('window.APP_INITIAL_STATE=')[1]
json = JSON.parse(ress)
}
const result = {
topic: json.share.post.post.content ? json.share.post.post.content : json.share.post.post.topic.topic,
caption: $("meta[property='og:description']").attr('content'),
play: json.share.post.post.playCount,
like: json.share.post.post.likes,
share: json.share.post.post.share,
duration: json.share.post.post.videos[json.share.post.post.imgs[0].id].dur,
thumbnail: json.share.post.post.videos[json.share.post.post.imgs[0].id].coverUrls[0],
watermark: json.share.post.post.videos[json.share.post.post.imgs[0].id].urlwm,
no_watermark: json.share.post.post.videos[json.share.post.post.imgs[0].id].url
}
resolve(result)
}
}).catch(reject)
})
}



/**
 * toonify class class that allows you to transform an image (where a person's face is clearly visible) to give it an zombie effect.
 * 
 * @class makemeazombie
 * @see {@link https://makemeazombie.com|MakemeaZombie}
 */


    /**
     * Allows you to transform an image to apply an zombie style
     * 
     * @param {objet} args
     * @param {string} args.photo - Image to transform, can be image path, image url or base64 image
     * @param {string} args.destinyFolder - Path to save the transformed image, if not provided the image will be delivered in base64
     * @return {Promise<string>} Transformed image
     */
/*async function makemeazombie(args) {
        return new Promise((resolve, reject) => {
            if (typeof args.photo !== 'undefined' && args.photo !== '') {
                convertTo64(args.photo)
                .then(async (res) => {
                    let nameFile = `${ randomUUI() }.jpeg`;
                    let pathImage = path.join(__dirname, `./images/${ nameFile }`);
                    let base64Image = res.split(';base64,').pop();
                    fs.writeFileSync(pathImage, base64Image, {encoding: 'base64'}, (err) => {
                        if(err) log.error('File created with error');
                    });

                    request.post({
                        url: 'https://deepgrave-image-processor-no7pxf7mmq-uc.a.run.app/transform_in_place',
                        contentType: false,
                        formData: {
                            image: fs.createReadStream(pathImage)
                        }
                    }, async (error, response, body) => {
                        // Delete image
                        fs.unlinkSync(pathImage);

                        if (error){
                            reject('An error occurred while trying to transform the image');
                        } else {
                            if (body === 'No face found') {
                                reject('It was not possible to identify a face in the image, try sending a profile image');
                            } else {
                                let imgBuffer =  Buffer.from(body, 'base64');
                                sharp(imgBuffer)
                                //.extract({ width: 512, height: 512, left: 512, top: 0 })
                                .resize(720, 720)
                                .toBuffer()
                                .then( buffer => {
                                    if (args.destinyFolder !== undefined && args.destinyFolder !== ''){
                                        if (fs.existsSync(args.destinyFolder)) {
                                            const finalImage = path.join(args.destinyFolder, nameFile);
                                            fs.writeFileSync(finalImage, buffer.toString('base64'), {encoding: 'base64'}, (err) => {
                                                console.log('File created');
                                            });
                                            resolve(finalImage);   
                                        } else {
                                            reject('Destiny Directory not found.');
                                        }
                                    } else {
                                        resolve(buffer.toString('base64'));   
                                    }
                                })
                                .catch( err => {
                                    reject('An error occurred while trying to transform the image with sharp');
                                })

                            }
                        }
                    });
                })
                .catch(err => {
                    reject(err);
                })
            } else {
                reject('An image must be provided to transform...');
            }
        })
    }*/
                
const request = require("request");

async function whois(domain) {
  return new Promise((resolve, reject) => {
    var options = {
      method: "POST",
      url: "https://www.hostinger.co.id/whois",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      form: {
        domain: domain,
        submit: "search",
      },
    };

    request(options, async function (error, response, body) {
      if (error) throw new Error(error);
      const result = JSON.parse(body);
      resolve({
        result: result["domain"],
      });
    });
  });
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const baseurl = "https://hercai.onrender.com/v2/hercai";


/**
 * @typedef {Class} Hercai
 * @see {Hercai}
 * @example const { Hercai } = require("hercai");
 * @example import { Hercai } from "hercai";
 * @type {Class}
 * @class
 */
class Hercai {
    constructor() {
    };

/**
* The Question You Want to Ask Artificial Intelligence.
* @param {string} model "v2"
* @param {string} model "beta"
* @param {string} content The Question You Want to Ask Artificial Intelligence.
* @example client.question({model:"v2",content:"how are you?"})
* @type {string} The Question You Want to Ask Artificial Intelligence.
* @returns {Hercai}
* @async
*/
async question({model = "v2",content}){
if(!["v2","beta"].some(ind => model == ind)) model = "v2";
if(!content || content == undefined || content == null)throw new Error("Please specify a question!");
try{
var api = await axios.get(`https://hercai.onrender.com/${model}/hercai?question=`+encodeURI(content),{
    headers: {
        "content-type": "application/json",
    },
})
return api.data;
}catch(err){
throw new Error("Error: "+ err.message)   
}
}

/**
* Tell Artificial Intelligence What You Want to Draw.
* @param {string} model "v1" , "v2" , "v2-beta"
* @param {string} prompt Tell Artificial Intelligence What You Want to Draw.
* @example client.drawImage({model:"v1",prompt:"anime girl"})
* @type {string} Tell Artificial Intelligence What You Want to Draw.
* @returns {Hercai}
* @async
*/
async drawImage({model = "v1",prompt}){
    if(!["v1","v2","v2-beta"].some(ind => model == ind)) model = "v1";
    if(!prompt || prompt == undefined || prompt == null)throw new Error("Please specify a prompt!");
    try{
    var api = await axios.get(`https://hercai.onrender.com/${model}/text2image`+"?prompt="+encodeURI(prompt),{
        headers: {
            "content-type": "application/json",
        },
    })
    return api.data;
    }catch(err){
    throw new Error("Error: "+ err.message)   
    }
    }


}

module.exports = Hercai;
module.exports.whois = whois
module.exports.capcut = capcut
module.exports.cocofun = cocofun
module.exports.random = random
