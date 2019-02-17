// const Telegraf = require('telegraf');
const {
    getPol,
    getJoke,
    getYesNo,
    getMemes,
    getAdvice,
    getRandSong,
    getHoroscope,
} = require('./helpers');
const answers = require('./answers');

const onStart = ctx => ctx.reply(answers.welcome);

const onHelp = ctx => ctx.reply(answers.help);

const onSticker = ctx => ctx.reply(answers.weird);

const onHearsHi = ctx => ctx.reply(answers.hi);

const onHearsAll = ({
    reply,
    message: m
}) => reply(`${m.text} from ${m.chat.first_name}`);

const onJoke = ctx => getJoke(ctx.message.text);

const onAdvice = ctx => getAdvice(ctx.message.text);

const onHoroscope = ctx => getHoroscope(ctx.message.text);

const onShould = async(ctx) => {
    const {
        isGif,
        data,
    } = await getYesNo();
    if (!isGif) {
        return ctx.reply(data);
    }
    return ctx.replyWithVideo({
        source: data,
    });
};

const onMeme = async(ctx) => {
    const memes = await getMemes(ctx.message.text);
    memes.forEach(async (meme) => {
        if (meme.isImg) {
            await ctx.replyWithPhoto(src);
        } else {
            await ctx.replyWithVideo({
                source: meme.src,
            });
        }
    });
    return;
};

const onMusic = async (ctx) => ctx.replyWithVoice({
    source: await getRandSong(),
});

const onPoll = async(ctx) => ctx.reply(await getPol());

module.exports = {
    onHelp,
    onStart,
    onSticker,
    onHearsHi,
    onHearsAll,

    onJoke,
    onMeme,
    onPoll,
    onMusic,
    onShould,
    onAdvice,
    onHoroscope,
};