const translate = require('@vitalets/google-translate-api');

const answers = require('./answers');

async function withAsyncResponse(ctx, next) {
    const pre1 = setTimeout(() => ctx.reply(answers.wait), 1000);
    const pre2 = setTimeout(() => ctx.reply(answers.heavy), 7000);
    const pre3 = setTimeout(() => ctx.reply(answers.heavy), 12000);
    try {
        await next(ctx);
    } catch (e) {
        ctx.reply(`${answers.error}${e.message}`);
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

module.exports = {
    withAsyncResponse,
    replyWithTranslation,
};
