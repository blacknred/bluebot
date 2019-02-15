// const Telegraf = require('telegraf');
const translate = require('@vitalets/google-translate-api');

const {
    getPol,
    getJoke,
    getYesNo,
    getMemes,
    getAdvice,
    getRandSong,
    getHoroscope,
} = require('./helpers');

const ANSWERS = {
    welcome: 'Welcome! Random content grabber here)... Start with commands.',
    hi: 'Hey there',
    help: 'Just random content buddy. Command.',
    weird: '👍 but I\'m waiting for the command.',
    heavy: 'Heavy calculations...',
    hope: 'I hope it`s worth it.',
    wait: 'Wait...',
    error: 'Hmm...',
    done: 'Done.',
};

async function withAsyncResponse(ctx, next) {
    const pre1 = setTimeout(() => ctx.reply(ANSWERS.wait), 1000);
    const pre2 = setTimeout(() => ctx.reply(ANSWERS.heavy), 7000);
    const pre3 = setTimeout(() => ctx.reply(ANSWERS.heavy), 12000);
    try {
        await next(ctx);
    } catch (e) {
        ctx.reply(`${ANSWERS.error}${e.message}`);
    } finally {
        clearTimeout(pre1);
        clearTimeout(pre2);
        clearTimeout(pre3);
    }
}

async function replyWithTranslation(ctx, next) {
    const text = await next(ctx);
    try {
        const res = await translate(text, {
            from: 'en',
            to: ctx.message.from.language_code,
            proxies: [
                process.env.HTTP_PROXY,
            ]
        });
        ctx.reply(res.text);
    } catch (e) {
        ctx.reply(text);
    }
}

module.exports = (bot) => {
    bot.start(ctx => ctx.reply(ANSWERS.welcome));
    bot.help(ctx => ctx.reply(ANSWERS.help));

    bot.command('dad', replyWithTranslation, ctx => getJoke(ctx.message.text));
    bot.command('adv', replyWithTranslation, ctx => getAdvice(ctx.message.text));
    bot.command('horo', replyWithTranslation, ctx => getHoroscope(ctx.message.text));
    bot.command('should', withAsyncResponse, async(ctx) => {
        const { isGif, data } = await getYesNo();
        if (!isGif) return ctx.reply(data);
        return ctx.replyWithVideo({
            source: data,
        });
    });
    bot.command('meme', withAsyncResponse, async(ctx) => {
        const memes = await getMemes(ctx.message.text);
        memes.forEach(async ({ isImg, src }) => {
            if (isImg) {
                await ctx.replyWithPhoto(src);
            } else {
                await ctx.replyWithVideo({
                    source: src,
                });
            }
        });
        return;
    });

    // ???
    bot.command('mus', withAsyncResponse, async (ctx) => ctx.replyWithVoice({
        source: await getRandSong(),
    }));
    bot.command('pol', withAsyncResponse, async(ctx) => ctx.reply(await getPol()));
    // ???

    bot.on('sticker', ctx => ctx.reply(ANSWERS.weird));
    bot.hears(/(hi|Hi|hello|Hello)+/, ctx => ctx.reply(ANSWERS.hi));
    bot.hears(/./, ({ reply, message: m }) => reply(`${m.text} from ${m.chat.first_name}`));
};
