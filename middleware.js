const axios = require('axios');
// const Telegraf = require('telegraf');

const RAND_IMAGE_URL = 'https://source.unsplash.com/collection/3356631/600x800';
const ANSWERS = {
    welcome: 'Welcome! Random content grabber here)... Start with commands.',
    help: 'Just random content buddy. Command.',
    weird: '👍 but I\'m waiting for the command',
};

function getRandVideo() {
    return 'https://player.vimeo.com/external/272348880.hd.mp4?s=d6216c0238a4166737a37426212eaed6cff3ac09&profile_id=175&oauth2_token_id=57447761&download=4';
}
function getRandSong() {
    return Buffer.alloc(800000);
}
function getRandPol() {
    return 'https://2ch.hk/po/res/31651319.json';
}

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
    bot.command('rpic', withAsyncResponse, async (ctx) => ctx.replyWithPhoto({
        url: RAND_IMAGE_URL,
    }));
    bot.command('rmus', withAsyncResponse, async (ctx) => ctx.replyWithVoice({
        source: await getRandSong(),
    }));
    bot.command('rvid', withAsyncResponse, async (ctx) => {
        const url = getRandVideo();
        const res = await axios({
            url,
            responseType: 'stream'
        });
        ctx.replyWithVideo({
            source: res.data
        });
    });
    bot.command('rpol', async (ctx) => ctx.reply(getRandPol()));
    
    bot.start(ctx => ctx.reply(ANSWERS.welcome));
    bot.help(ctx => ctx.reply(ANSWERS.help));
    bot.on('sticker', ctx => ctx.reply(ANSWERS.weird));
    bot.hears(/(hi|Hi|hello|Hello)+/, ctx => ctx.reply('Hey there'));
    bot.hears(/./, ({ reply, message: m }) => reply(`${m.text} from ${m.chat.first_name}`));
};