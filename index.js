const Telegraf = require('telegraf');
const uuidv1 = require('uuid/v1');
const fetch = require("node-fetch");
const fs = require('fs')
var Blob = require('blob');
const OpusToPCM = require('opus-to-pcm')


const token = '';
const uuid = '';
const yandexApiKey = '';

// fs.readFile('./file_50.oga', (err, data) =>
//     fetch(`https://asr.yandex.net/asr_xml?uuid=${uuid}&key=${yandexApiKey}&topic=queries&disableAntimat=false`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'audio/ogg;codecs=opus',
//             'Transfer-Encoding': 'chunked',
//             'Host': 'asr.yandex.net',
//         },
//         body: new ArrayBuffer(data)
//     })
//         .then(kek => console.log(2, kek)))

// https://asr.yandex.net/asr_xml?uuid=<идентификатор пользователя>&key=<API-ключ>&topic=<языковая модель>&lang=<язык>&disableAntimat=<антимат>
const bot = new Telegraf(token);
// bot.start((ctx) => ctx.reply('Welcome'));
// bot.help((ctx) => ctx.reply('Send me a sticker'));
// bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.on('message', (ctx) => {
    ctx.message.voice && fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${ctx.message.voice.file_id}`)
        .then(response => response.json())
        .then(({ result: { file_path } }) => file_path)
        .then(path => fetch(`https://api.telegram.org/file//bot${token}/${path}`))
        .then(response => response.blob())
        // .then(response => response)
        .then(audio => {
            console.log(audio)
            return fetch(`http://asr.yandex.net/asr_xml?uuid=${uuid}&key=${yandexApiKey}&topic=queries&disableAntimat=false`, {
                method: 'POST',
                headers: {
                    'Host': 'asr.yandex.net',
                    'Content-Type': 'audio/ogg;codecs=opus',
                    'Transfer-Encoding': 'chunked',
                },
                body: audio
            })
        })
        .then(res => ctx.reply('Оно бы работало, но Илюша пока не может в аудио кодировки((('))
        .catch(err => console.log(err))
});
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch()