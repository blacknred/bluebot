const dotenv = require('dotenv');
const Telegraf = require('telegraf');
const HttpsProxyAgent = require('https-proxy-agent');
const fs = require('fs')

dotenv.config();
const PORT = process.env.PORT || 3333;
const BOT_TOKEN = process.env.BOT_TOKEN || '';
const URL = process.env.URL || 'https://blooobot.herokuapp.com';
const PROXY = (process.env.NODE_ENV !== 'production') && process.env.HTTP_PROXY;

const bot = new Telegraf(process.env.BOT_TOKEN, {
    telegram: {
        agent: PROXY ? new HttpsProxyAgent(PROXY) : null,
        webhookReply: true,
    },
    username: 'bloobot',
});

setImmediate(async () => {
    try {
        const data = await bot.telegram.getMe();
        bot.options.username = data.username;
    } catch (e) {
        console.error(e);
    }
});

bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));

bot.command('oldschool', (ctx) => ctx.reply('Hello'));
bot.command('modern', ({ reply }) => reply('Yo'));
bot.command('hipster', Telegraf.reply('λ'));

bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.hears('rpic', (ctx) => ctx.replyWithPhoto({
    url: 'https://source.unsplash.com/collection/3356631/600x800',
    filename: 'kitten.jpg'
}));
// bot.hears('rvid', async (ctx) => ctx.replyWithVideo({
//     source: await fs.createReadStream('https://video-hw.xvideos-cdn.com/videos/3gp/d/0/3/xvideos.com_d03f939ac75ac1df76e037d573919a74.mp4?e=1549084178&ri=1024&rs=85&h=00063f7067cc9aa79a7833e2a4cfcd86')
// }));



bot.hears(/./, (ctx) => ctx.reply( `${ctx.message.text} from ${ctx.message.chat.first_name}`));


if (process.env.NODE_ENV !== 'production') {
    // bot.startPolling()
    bot.launch();
} else {
    bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`);
    bot.startWebhook(`/bot${BOT_TOKEN}`, null, PORT)
}

