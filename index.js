const Telegraf = require('telegraf');
const fetch = require("node-fetch");
const fs = require('fs');
const https = require('https');

const token = '';       // Telegram token
const catalogId = '';   // Yandex cloud folder id
const iamToken = '';    // Yandex cloud IAM token

const bot = new Telegraf(token);
bot.on('message', (ctx) => {
    ctx.message.voice && fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${ctx.message.voice.file_id}`)
        .then(response => response.json())
        .then(({ result: { file_path } }) => file_path)
        .then(path => writeTheFile(`https://api.telegram.org/file//bot${token}/${path}`, () => sendResultToTheService(ctx)))
        .catch(err => console.log(err))
});
bot.launch()

function sendResultToTheService(ctx) {
    return fs.readFile('./file.oga', (err, data) => {
        if (err) return err;
        return fetch(`https://stt.api.cloud.yandex.net/speech/v1/stt:recognize/?topic=general&folderId=${catalogId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${iamToken}`,
                'Transfer-Encoding': 'chunked',
            },
            body: data,
        })
            .then(res => res.json())
            .then(({ result }) => ctx.reply(result))
            .catch(err => console.log(err))
    });

}

function writeTheFile(url, onWriteFinishedCb) {
    const file = fs.createWriteStream("file.oga");
    https.get(url, (response) => response.pipe(file));
    file.on('finish', () => file.close(onWriteFinishedCb));
}
