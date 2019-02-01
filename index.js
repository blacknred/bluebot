require('dotenv').config();
const Telegraf = require('telegraf');

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const PORT = process.env.PORT || 3001;
const URL = process.env.URL || 'https://blooobot.herokuapp.com';

const bot = new Telegraf(process.env.BOT_TOKEN, {
    username: 'bloobot'
});

bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.hears(/./, (ctx) => ctx.reply(ctx.message));

bot.command('oldschool', (ctx) => ctx.reply('Hello'));
bot.command('modern', ({ reply }) => reply('Yo'));
bot.command('hipster', Telegraf.reply('λ'));

// bot.launch();
bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`);
bot.startWebhook(`/bot${BOT_TOKEN}`, null, PORT)