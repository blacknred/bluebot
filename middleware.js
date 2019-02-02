const fs = require('fs');
const axios = require('axios');
const Telegraf = require('telegraf');

const RAND_IMAGE_URL = 'https://source.unsplash.com/collection/3356631/600x800';

module.exports = (bot) => {
    bot.start((ctx) => ctx.reply('Welcome'));
    bot.help((ctx) => ctx.reply('Just random content buddy. Command.'));
    bot.on('sticker', (ctx) => ctx.reply('👍 but I\'m waiting for the command'));
    bot.on('file', (ctx) => ctx.reply('👍 but I\'m waiting for the command'));

    bot.command('rpic', async (ctx) => ctx.replyWithPhoto({
        url: RAND_IMAGE_URL,
    }));
    bot.command('rmus', async (ctx) => ctx.replyWithVoice({
        source: Buffer.alloc(20)
    }));
    bot.command('rvid', async (ctx) => {
        try {
            const res = await axios({
                url: 'https://player.vimeo.com/external/272348880.hd.mp4?s=d6216c0238a4166737a37426212eaed6cff3ac09&profile_id=175&oauth2_token_id=57447761&download=4',
                responseType: 'stream'
            });
            ctx.replyWithVideo({
                source: res.data
            });
        } catch (e) {
            console.log(e.message);
            ctx.reply(e.message);
        }
    });

    bot.hears(/(hi|hello)+/, (ctx) => ctx.reply('Hey there'));
    bot.hears('bye', (ctx) => Telegraf.reply(`Hmm, I was waiting for more from ${ctx.message.chat.first_name}.`));
    bot.hears(/./, (ctx) => ctx.reply(`${ctx.message.text} from ${ctx.message.chat.first_name}`));
};