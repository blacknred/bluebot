const path = require('path');
const dotenv = require('dotenv');
const Telegraf = require('telegraf');
const HttpsProxyAgent = require('https-proxy-agent');

const {
    onHelp,
    onStart,
    onSticker,
    onHearsHi,
    onHearsAll,
} = require('./handlers');
const commands = require('./commands');

dotenv.config({
    path: path.join(__dirname, '../', '.env'),
});

const TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;
const IS_DEV = process.env.NODE_ENV !== 'production';

// instance
const bot = new Telegraf(TOKEN, {
    telegram: {
        agent: IS_DEV ? new HttpsProxyAgent(process.env.HTTP_PROXY) : null,
        webhookReply: false, // ?
    },
    username: process.env.BOT_NAME,
});

// inject commands
commands.forEach(route => bot.command(route.path, route.pre, route.handler));

// base handlers
bot.start(onStart);
bot.help(onHelp);
bot.on('sticker', onSticker);
bot.hears(/(hi|Hi|hello|Hello)+/, onHearsHi);
bot.hears(/./, onHearsAll);

// run
setImmediate(async () => {
    try {
        const data = await bot.telegram.getMe();
        bot.options.username = data.username;

        if (IS_DEV) {
            // bot.startPolling()
            bot.launch();
        } else {
            bot.telegram.setWebhook(`${process.env.WEBHOOK_URL}/bot${TOKEN}`);
            bot.startWebhook(`/bot${TOKEN}`, null, PORT);
        }
    } catch (e) {
        console.error(e);
    }
});