const path = require('path');
const dotenv = require('dotenv');
const Telegraf = require('telegraf');
const HttpsProxyAgent = require('https-proxy-agent');

const mddlwr = require('./middleware');

dotenv.config({
    path: path.join(__dirname, '../', '.env'),
});

const NAME = process.env.BOT_NAME;
const TOKEN = process.env.BOT_TOKEN;
const URL = process.env.WEBHOOK_URL;
const PORT = process.env.PORT || 3333;
const IS_DEV = process.env.NODE_ENV !== 'production';

// instance
const bot = new Telegraf(TOKEN, {
    telegram: {
        agent: IS_DEV ? new HttpsProxyAgent(process.env.HTTP_PROXY) : null,
        webhookReply: false, // ?
    },
    username: NAME,
});

// inject
mddlwr(bot);

// run
setImmediate(async () => {
    try {
        const data = await bot.telegram.getMe();
        bot.options.username = data.username;
    } catch (e) {
        console.error(e);
    }
});

if (IS_DEV) {
    // bot.startPolling()
    bot.launch();
} else {
    bot.telegram.setWebhook(`${URL}/bot${TOKEN}`);
    bot.startWebhook(`/bot${TOKEN}`, null, PORT);
}
