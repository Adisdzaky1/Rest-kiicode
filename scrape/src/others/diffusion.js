const fetch = require('node-fetch')

async function animedif(prompt) {
    const Blobs = await fetch(
        "https://api-inference.huggingface.co/models/prompthero/openjourney-v2",
        {
            method: "POST",
            headers: {
                "content-type": "application/json",
                Authorization: "Bearer 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",
            },
            body: JSON.stringify({ inputs: prompt }),
        }
    ).then((res) => res.blob());
    
    const arrayBuffer = await Blobs.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer;
}

/*async function animedif(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/succinctly/text2image-prompt-generator",
		{
			headers: { Authorization: "Bearer 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" },
			method: "POST",
			body: JSON.stringify(data),
		}
	)
	const result = await response.blob();
	let arrayBuffer = await result.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer, 'base64')
	return buffer
}*/

async function animedif2(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/stablediffusionapi/anime-model-v2",
		{
			headers: { Authorization: "Bearer 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" },
			method: "POST",
			body: JSON.stringify(data),
		}
	)
	const result = await response.blob();
	let arrayBuffer = await result.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer, 'base64')
	return buffer
}
async function stabledif(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/stablediffusionapi/lyrielv16",
		{
			headers: { Authorization: "Bearer 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" },
			method: "POST",
			body: JSON.stringify(data),
		}
	)
	const result = await response.blob();
	let arrayBuffer = await result.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer, 'base64')
	return buffer
}
async function stabledif2(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/stablediffusionapi/dreamshaper-v6",
		{
			headers: { Authorization: "Bearer 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" },
			method: "POST",
			body: JSON.stringify(data),
		}
	)
	const result = await response.blob();
	let arrayBuffer = await result.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer, 'base64')
	return buffer
}

module.exports = {
animedif,
animedif2,
stabledif,
stabledif2,
}
