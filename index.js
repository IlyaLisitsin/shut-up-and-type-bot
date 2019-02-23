const Telegraf = require('telegraf');
const fetch = require("node-fetch");

const token = '742079108:AAGjJ9Ugxp2uN4CTEepcdcFwpbXoc20LqzE';
const uuid = '4a99246551f24c339dc20c7a415f3cd6';
const yandexApiKey = '6891b0ef-ea2f-421a-a761-be94d69393ff';

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

const bot = new Telegraf(token);
bot.on('message', (ctx) => {
    ctx.message.voice && fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${ctx.message.voice.file_id}`)
        .then(response => response.json())
        .then(({ result: { file_path } }) => file_path)
        .then(path => fetch(`https://api.telegram.org/file//bot${token}/${path}`))
        .then(response => response.blob())
        .then(audio => {
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
bot.launch()