// const Telegraf = require('telegraf');

const {
    getRandPol,
    getRandSong,
    getRandVideo,
    getRandImage,
    getHoroscope,
    getRandomAdvice,
} = require('./helpers');

const ANSWERS = {
    welcome: 'Welcome! Random content grabber here)... Start with commands.',
    help: 'Just random content buddy. Command.',
    weird: '👍 but I\'m waiting for the command.',
};

function withAsyncResponse(ctx, next) {
    try {
        next(ctx);
    } catch (e) {
        ctx.reply(`Hmm..${e.message}`);
    } finally {
        ctx.reply('Done. Wait...');
    }
}

module.exports = (bot) => {
    bot.command('rpic', withAsyncResponse, ctx => ctx.replyWithPhoto({
        url: getRandImage(),
    }));
    bot.command('rmus', withAsyncResponse, async (ctx) => ctx.replyWithVoice({
        source: await getRandSong(),
    }));
    bot.command('rvid', withAsyncResponse, async (ctx) => ctx.replyWithVideo({
        source: await getRandVideo(),
    }));
    bot.command('pol', async (ctx) => ctx.reply(getRandPol()));
    bot.command('adv', async (ctx) => ctx.reply(await getRandomAdvice(ctx.message.text)));
    bot.command('horo', async (ctx) => ctx.reply(await getHoroscope(ctx.message.text)));
    
    bot.start(ctx => ctx.reply(ANSWERS.welcome));
    bot.help(ctx => ctx.reply(ANSWERS.help));
    bot.on('sticker', ctx => ctx.reply(ANSWERS.weird));
    bot.hears(/(hi|Hi|hello|Hello)+/, ctx => ctx.reply('Hey there'));
    bot.hears(/./, ({ reply, message: m }) => reply(`${m.text} from ${m.chat.first_name}`));
};