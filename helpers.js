const axios = require('axios');

const ADVICE_URL = 'https://api.adviceslip.com/advice';
const HORO_URL = 'http://horoscope-api.herokuapp.com/horoscope';
const RAND_IMAGE_URL = 'https://source.unsplash.com/collection/3356631/600x800';
const HORO_DATES = ['today', 'week', 'month', 'year'];
const HORO_SIGNS = ['Taurus', 'Leo', 'Scorpio', 'Aquarius','Gemini', 'Virgo', 'Sagittarius', 'Pisces', 'Aries', 'Cancer', 'Libra', 'Capricorn'];

function getRandSong() {
    return Buffer.alloc(800000);
}

function getRandImage() {
    return RAND_IMAGE_URL;
}

function getRandPol() {
    return 'https://2ch.hk/po/res/31651319.json';
}

async function getRandVideo() {
    const url = 'https://player.vimeo.com/external/272348880.hd.mp4?s=d6216c0238a4166737a37426212eaed6cff3ac09&profile_id=175&oauth2_token_id=57447761&download=4';
    const res = await axios({
        url,
        responseType: 'stream'
    });
    return res.data;
}

async function getRandomAdvice(text) {
    const query = text.split(' ')[1];
    const res = await axios({
        url: `${ADVICE_URL}${query ? `/search/${query}` : ''}`,
        responseType: 'json',
    });

    if (res.data.message) return 'Sorry, nothing to advice.';
    if (!query) return res.data.slip.advice;
    const randIndex = Math.floor(Math.random() * res.data.slips.length);
    return res.data.slips[randIndex].advice;
}

async function getHoroscope(text) {
    let datespan = 'today';
    let sunsign = 'Leo';

    const optsArr = text.split(' ').slice(1) || [];
    optsArr.forEach((opt) => {
        if (HORO_DATES.includes(opt)) datespan = opt;
        if (HORO_SIGNS.includes(opt)) sunsign = opt;
    });

    const res = await axios({
        url: `${HORO_URL}/${datespan}/${sunsign}`,
        responseType: 'json',
    });

    return res.data.horoscope;
}

module.exports = {
    getRandPol,
    getRandSong,
    getRandVideo,
    getRandImage,
    getHoroscope,
    getRandomAdvice,
};