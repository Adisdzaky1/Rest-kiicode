const axios = require('axios')
const fetch = require('node-fetch')
const qs = require('qs')
const cheerio = require('cheerio')
const request = require('request')
const fakeUa = require('fake-useragent')
const Replicate = require('replicate')
const fs = require("fs")

const {secret} = require("./secret");


const chalk = require('chalk')
const { randomUUID } = require('crypto')


  async function jadianime() {
    try {
        const response = await fetch('https://tikporntok.com/?random=1')
        const htmlText = await response.text()
        const $ = cheerio.load(htmlText)

        const hasil = []
        $('.swiper-slide').each(function(index, element) {
            const title = $(element).attr('data-title')
            const video = $(element).find('source').attr('src') || $(element).find('video').attr('src')
            const thumb = $(element).find('img').attr('src')
            const desc = $(element).find('.shorts_events > p').text().trim()
            const views = $(element).find('#video-views-count-' + index).text()

            hasil.push({
                title,
                video,
                thumb,
                desc,
                views,
            })
        })

        return hasil
    } catch (error) {
        throw new Error('Error fetching data from TikPornTok: ' + error.message)
    }
}

const {
    JSDOM
} = require('jsdom')


/* New Line */
async function MLSound(tema, query) {
    let res
    if (tema == "id") {
        res = await fetch("https://mobile-legends.fandom.com/wiki/" + query + "/Audio/id")
    }
    if (tema == "en") {
        res = await fetch("https://mobilelegendsbuild.com/sound/" + query)
    }
    let html = await res.text()
    let dom = new JSDOM(html)
    var totals = dom.window.document.getElementsByTagName("audio");
    let audio = []
    for (var i = 0; i < totals.length; i++) {
        audio.push(totals[i].getAttribute("src"))
    }
    return audio
}

/* New Line */
async function AnimeSound(category, page) {
    let res = await fetch('https://audiojungle.net/search/' + category + '?page=' + page)
    let html = await res.text()
    let dom = new JSDOM(html)
    var collection = dom.window.document.getElementsByTagName('source');
    let audio = []
    for (var i = 0; i < collection.length; i++) {
        audio.push(collection[i].getAttribute('src'))
    }
    let newArr = audio.filter(el => el != null);
    return newArr
}


async function realesrgan(url, scale) {
  const scaleNumber = scale ? scale : 2;
  const { data } = await axios(`https://toolsapi.spyne.ai/api/forward`, {
    method: "post",
    data: {
      image_url: url,
      scale: scaleNumber,
      save_params: {
        extension: ".png",
        quality: 95,
      },
    },
    headers: {
      "content-type": "application/json",
      accept: "*/*",
    },
  });
  return data;
}
 /*function (filename,callback){
   var b64 = fs.readFileSync(filename,'base64');
   var dt = [];
   dt[0]='data:image/jpeg;base64,'+b64;
   dt[1]='anime';
   var bd = {fn_index: 0, data: dt, session_hash: "vzrx9clggr"};
   var url = 'https://akhaliq-real-esrgan.hf.space/api/predict/';
   console.log(bd)
   request({
     url: url,
     method: "POST",
     proxy: 'http://192.168.17.241:2346',
     headers:{
       'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
       'content-type':'application/json',
       'referer': 'https://akhaliq-real-esrgan.hf.space/?__theme=light'
     },
    body:JSON.stringify(bd)
   }, function(error, response, resbody) {
     if (error && error.code) {
       console.log('pipe error catched!')
       console.log(error);
     } else {
       console.log(resbody);
       var data = eval('('+resbody+')');
       console.log(data);
     }
   });
 }
 realesrgan('/home/ter/i/111.png',function(r){console.log(r)})*/



async function scaletask(imageURL) {
  const replicate = new Replicate({
    auth: "3a4886dd3230e523600d3b555f651dc82aba3a4e",
    fetch: fetch,
  });

  const model =
    "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b";
  const input = {
    image: imageURL,
    scale: 8,
    face_enhance: true,
  };
  const output = await replicate.run(model, { input }).catch((error) => {
    console.log("Repli Error: " + error);
    return "Sorry, I'm having trouble with image upscaling right now. Contact iBeng on Whatsapp at +6281257172080 for help.";
  });
  return output;
};

async function attp(text) {
    try {
        const getidResponse = await fetch("https://id.bloggif.com/text");
        const getidText = await getidResponse.text();
        const id = cheerio.load(getidText)("#content > form").attr("action");
        const options = {
            method: "POST",
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
            },
            body: new URLSearchParams({
                target: 1,
                text: text,
                glitter_id: Math.floor(Math.random() * 2821),
                font_id: "lucida_sans_demibold_roman",
                size: 100,
                bg_color: "FFFFFF",
                transparent: 1,
                border_color: "000000",
                border_width: 2,
                shade_color: "000000",
                shade_width: 1,
                angle: 0,
                text_align: "center",
            }),
        };
        const response = await fetch(`https://id.bloggif.com${id}`, options);
        const bodyText = await response.text();
        const $ = cheerio.load(bodyText);
        const entries = [];
        $('div.box.center a').each((index, element) => {
            const title = $(element).text();
            const url = $(element).attr('href');
            entries.push({
                title,
                url: "https://id.bloggif.com" + url
            });
        });

        return entries;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function replicate(imageUrl, prompt, ApiKey) {
    try {
        // POST request to Replicate to start the image restoration generation process
        let startResponse = await fetch(
            "https://api.replicate.com/v1/predictions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Token " + ApiKey,
                },
                body: JSON.stringify({
                    version: "854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b",
                    input: {
                        image: imageUrl,
                        prompt: prompt,
			a_prompt: "best quality, extremely detailed, photo from Pinterest, interior, cinematic photo, ultra-detailed, ultra-realistic, award-winning",
			n_prompt: "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
      
         
                    },
                }),
            }
        );
        let jsonStartResponse = await startResponse.json();
        let endpointUrl = jsonStartResponse.urls.get;
        const originalImage = jsonStartResponse.input.image;
        const roomId = jsonStartResponse.id;
        // GET request to get the status of the image restoration process & return the result when it's ready
        let generatedImage;
        while (!generatedImage) {
            // Loop in 1s intervals until the alt text is ready
            let finalResponse = await fetch(endpointUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Token " + ApiKey,
                },
            });
            let jsonFinalResponse = await finalResponse.json();
            if (jsonFinalResponse.status === "succeeded") {
                generatedImage = jsonFinalResponse.output[1];
            } else if (jsonFinalResponse.status === "failed") {
                break;
            } else {
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }
        if (generatedImage) {
            return {
                original: originalImage,
                generated: generatedImage,
                id: roomId
            }
        } else {
            console.log("Failed to restore image");
        }
    } catch (error) {
        // Increment their credit if something went wrong
        console.log("Failed to restore image");
    }
}

async function pinterestdl(url) {
  res = await axios(
    "https://www.expertsphp.com/facebook-video-downloader.php",
    {
      method: "POST",
      data: new URLSearchParams(Object.entries({ url })),
      headers: {
        "user-agent":
          "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
      },
    }
  );

  result = res.data.split(`src="https://v1.pinimg`)[1].split(`"`)[0];

  return "https://v1.pinimg" + result;
}      

function msToTime(duration) {
    const milliseconds = parseInt((duration % 1000) / 100);
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    return `${hours}h ${minutes}m ${seconds}s ${milliseconds}ms`;
}

function formatSize(sizeInBytes) {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let index = 0;

    while (sizeInBytes >= 1024 && index < units.length - 1) {
        sizeInBytes /= 1024;
        index++;
    }

    return sizeInBytes.toFixed(2) + " " + units[index];
}

async function random_mail() {
    const link = "https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=10"

    try {
        let response = await fetch(link);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

async function get_mails(id, domain) {
    const link = `https://www.1secmail.com/api/v1/?action=getMessages&login=${id}&domain=${domain}`;

    try {
        let response = await fetch(link);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}


function lirik(judul){
	return new Promise(async(resolve, reject) => {
		axios.get('https://www.musixmatch.com/search/' + judul)
		.then(async({ data }) => {
		const $ = cheerio.load(data)
		const hasil = {};
		let limk = 'https://www.musixmatch.com'
		const link = limk + $('div.media-card-body > div > h2').find('a').attr('href')
			await axios.get(link)
			.then(({ data }) => {
				const $$ = cheerio.load(data)
				hasil.thumb = 'https:' + $$('div.col-sm-1.col-md-2.col-ml-3.col-lg-3.static-position > div > div > div').find('img').attr('src')
				$$('div.col-sm-10.col-md-8.col-ml-6.col-lg-6 > div.mxm-lyrics').each(function(a,b) {
		   hasil.lirik = $$(b).find('span > p > span').text() +'\n' + $$(b).find('span > div > p > span').text()
		   })
	   })
	   resolve(hasil)
   })
   .catch(reject)
   })
}


/*async function doodstream(url){
    let config = {
        headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            "sec-ch-ua": '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
            "cookie": "PHPSESSID=ugpgvu6fgc4592jh7ht9d18v49; _ga=GA1.2.1126798330.1625045680; _gid=GA1.2.1475525047.1625045680; __gads=ID=92b58ed9ed58d147-221917af11ca0021:T=1625045679:RT=1625045679:S=ALNI_MYnQToDW3kOUClBGEzULNjeyAqOtg",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
        data: {
            'url': url,
            'action': 'post',
        }
    }
  
    const response = await axios.post('https://api.hunternblz.com/doodstream', qs.stringify(config.data), { headers: config.headers })
    return response.data
}

async function terabox(url){
    let config = {
        headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            "sec-ch-ua": '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
            "cookie": "PHPSESSID=ugpgvu6fgc4592jh7ht9d18v49; _ga=GA1.2.1126798330.1625045680; _gid=GA1.2.1475525047.1625045680; __gads=ID=92b58ed9ed58d147-221917af11ca0021:T=1625045679:RT=1625045679:S=ALNI_MYnQToDW3kOUClBGEzULNjeyAqOtg",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
        data: {
            'url': url,
            'action': 'post',
        }
    }
  
    const response = await axios.post('https://api.hunternblz.com/terabox', qs.stringify(config.data), { headers: config.headers })
    return response.data
}*/

async function processing(photoUrl) {
  const response = await axios.post('https://api.codeformer.com/enhance', {
    url: photoUrl
  });
  
  return response.data.result
  }

const WebSocket = require('ws');


/*

Scraper by YanzBotz 
Jangan asal claim

Cara pakai
anime4k("vid.mp4")

*/

let wss = 'wss://kadirnar-anime4k.hf.space/queue/join';

function anime4k(video){ // buffer // base64 
    return new Promise(async(resolve, reject) => {
  let vid = await fs.readFileSync(video)
let size = await fs.statSync(video)
console.log(size)
let result = {}
let name = Math.floor(Math.random() * 100000000000000000) + '.mp4'	
let send_has_payload = {
  "session_hash": "31c4pm5evel",
  "fn_index": 2
}
let send_data_payload = {
     "fn_index":2,
        "data":
           [
                {
                    "name": name,
                    "size": size.size,
                   "data":"data:video/mp4;base64," + vid.toString('base64')
              }
         ],
            "session_hash":"5wzu0avomyf"
     }

    const ws = new WebSocket(wss);
    ws.onopen = function() {
     console.log("Connected to websocket")
    };

    ws.onmessage = async function(event) {
      let message = JSON.parse(event.data);
         
          ws.send(JSON.stringify(send_data_payload));
          

      switch (message.msg) {
         case 'process_completed':        
            result.base64 = message.output.data
         break;
      }
    };

    ws.onclose = function(event) {
      if (event.code === 1000) {
        console.log('Process completed️');
      } else {
        msg.reply('Err : WebSocket Connection Error:\n');
      }
      resolve(result)
    };
  })    
}

const FormData = require('form-data')
const Jimp = require('jimp')

async function remini(imageData, operation) {
  return new Promise(async (resolve, reject) => {
    const availableOperations = ["enhance", "recolor", "dehaze"];
    if (availableOperations.includes(operation)) {
      operation = operation;
    } else {
      operation = availableOperations[0];
    }
    const baseUrl = "https://inferenceengine.vyro.ai/" + operation + ".vyro";
    const formData = new FormData();
    formData.append("image", Buffer.from(imageData), {filename: "enhance_image_body.jpg", contentType: "image/jpeg"});
    formData.append("model_version", 1, {"Content-Transfer-Encoding": "binary", contentType: "multipart/form-data; charset=utf-8"});
    formData.submit({url: baseUrl, host: "inferenceengine.vyro.ai", path: "/" + operation, protocol: "https:", headers: {"User-Agent": "okhttp/4.9.3", Connection: "Keep-Alive", "Accept-Encoding": "gzip"}},
      function (err, res) {
        if (err) reject(err);
        const chunks = [];
        res.on("data", function (chunk) {chunks.push(chunk)});
        res.on("end", function () {resolve(Buffer.concat(chunks))});
        res.on("error", function (err) {
        reject(err);
        });
      },
    );
  });
}
async function animeVideo() {
    const url = 'https://shortstatusvideos.com/anime-video-status-download/'; // Ganti dengan URL yang sesuai
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const videos = [];

    $('a.mks_button.mks_button_small.squared').each((index, element) => {
        const href = $(element).attr('href');
        const title = $(element).closest('p').prevAll('p').find('strong').text();
        videos.push({
            title,
            source: href
        });
    });

    const randomIndex = Math.floor(Math.random() * videos.length);
    const randomVideo = videos[randomIndex];

    return randomVideo;
}

async function animeVideo2() {
    const url = 'https://mobstatus.com/anime-whatsapp-status-video/'; // Ganti dengan URL yang sesuai
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const videos = [];

    const title = $('strong').text();

    $('a.mb-button.mb-style-glass.mb-size-tiny.mb-corners-pill.mb-text-style-heavy').each((index, element) => {
        const href = $(element).attr('href');
        videos.push({
            title,
            source: href
        });
    });

    const randomIndex = Math.floor(Math.random() * videos.length);
    const randomVideo = videos[randomIndex];

    return randomVideo;
}



// Process Image ( Upscale Image )
async function apis(img, conn, from, m, sendErrText) {
    return new Promise(async (resolve, reject) => {
            await axios.post('https://upscaler.zyro.com/v1/ai/image-upscaler', {
                image_data: await getBase64Image(img).catch((error) => {
                    return reject(error.message);
                }),
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': 'https://zyro.com',
                    'Referer': 'https://zyro.com/',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36'
                }}).then(async (response) => {
                if (response.data.upscaled) {
                   
                const hdBuffer = Buffer.from(response.data.upscaled.split(',')[1], 'base64');
                await conn.sendMessage(from, {image: hdBuffer}, {quoted: m})
                } else {
                sendErrText()
                }
        }).catch( async (error) => {
                sendErrText()
        })
    })
}


function getResponse(data) {
    let clr = data.split('content":"');
    let resu = clr.map((rs) => rs.split('"},"index"')[0].split('delta":{"')[0]);
    let twt = resu.map((s) => s.split('"},"finish_reason"')[0]);
    let stringText = twt.map((s) => s.split('index":0,'));
    stringText.splice(0, 1);
    const result = stringText.join("").replace(/\\n/g, "\n").replace(/\\/g, "");
    console.log(result);
    return result;

}

async function ai(text) {
  const payload = {
    messages: [
      { role: "system", content: "your name is vufi, you are an 18 year old teenager and are in college, you have a hobby of listening to music and drawing pixels, you were named by defavolia, you don't have parents because you are artificial intelligence developed by defavolia, defavolia has an instagram account @defavolia" },
      { role: "user", content: text }
    ],
    model: "gpt-3.5-turbo",
    presence_penalty: 0,
    stream: true,
    temperature: 0.7
  };

  try {
    const response = await axios.post('https://postapi.lbbai.cc/v1/chat/completions', payload);
    const res = getResponse(response.data);
    return {message: res};
  } catch (error) {
    console.error('Error:', error);
    return {error: 'Something went wrong.'};
  }
}
	    
module.exports = { lirik, processing, random_mail, get_mails, pinterestdl, replicate, realesrgan, scaletask, jadianime, MLSound, AnimeSound, attp, remini, animeVideo, animeVideo2, apis, ai }
