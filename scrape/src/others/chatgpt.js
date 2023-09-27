const fetch = require('node-fetch')
const cheerio = require('cheerio')
const { default: axios, isAxiosError } = require("axios");
const UA = require('random-useragent');
const { API_KEY } = require('./configg.js');
const chatgpt = async(text) => {

    const result = {
        
        "status": 200,
       
        
    }

    return await axios({
        method: 'post',
        url: 'https://api.pawan.krd/v1/chat/completions',
        data: {
       // "prompt": text,
 // "temperature": 0.7,
  "max_tokens": 100,
  //"top_p": 0.9,
  //"frequency_penalty": 0,
 // "presence_penalty": 0,
  "model": "gpt-3.5-turbo",
  "messages": [{role: "user", content: text}],
 // "stop": "<|im_end|>"
        },
        headers: {
           "accept": "application/json",
            'User-Agent': UA.getRandom(),
           "Content-Type": "application/json",
           "Accept-Language": "in-ID",
            apiKey: "pk-pIWAlRroXTOAigkWdHcYvmlmgzEQXuoMWbVAaLAVZswSRbEB"
          }
      }).
    then(res => {
        if(res.status === 200) {
            result.success = true;
            result.data = res?.data?.choices?.[0].message.content || 'Mohon maaf iBeng belum tau';
        } else {
            result.message = 'Response Failed';
        }
        return result;
    }).
    catch(err => {
        result.message = `Error : ${err.message}`;
        return result
    }) ;
}

module.exports = chatgpt