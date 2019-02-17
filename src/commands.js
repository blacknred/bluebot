const {
    onJoke,
    onMeme,
    onPoll,
    onMusic,
    onShould,
    onAdvice,
    onHoroscope,
} = require('./handlers');
const {
    withAsyncResponse,
    replyWithTranslation,
} = require('./middleware');

module.exports = [
    {
        path: 'dad',
        pre: replyWithTranslation,
        handler: onJoke,
    },
    {
        path: 'adv',
        pre: replyWithTranslation,
        handler: onAdvice,
    },
    {
        path: 'horo',
        pre: replyWithTranslation,
        handler: onHoroscope,
    },
    {
        path: 'should',
        pre: withAsyncResponse,
        handler: onShould,
    },
    {
        path: 'meme',
        pre: withAsyncResponse,
        handler: onMeme,
    },
    // ???
    {
        path: 'mus',
        pre: withAsyncResponse,
        handler: onMusic,
    },
    {
        path: 'pol',
        pre: withAsyncResponse,
        handler: onPoll,
    },
];
