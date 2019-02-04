const axios = require('axios');
const cheerio = require('cheerio');

const GAG_URL = 'http://9gag.com';
const YESNO_URL = 'https://yesno.wtf/api';
const POL_URL = 'https://2ch.hk/po/threads.json';
const DAD_JOKE_URL = 'https://icanhazdadjoke.com/';
const ADVICE_URL = 'https://api.adviceslip.com/advice';
const HORO_URL = 'http://horoscope-api.herokuapp.com/horoscope';
const RAND_IMAGE_URL = 'https://source.unsplash.com/collection/3356631/600x800';
const GAG_SECTIONS = ['comic', 'country', 'nsfw'];
const HORO_DATES = ['today', 'week', 'month', 'year'];
const HORO_SUNSIGNS = ['taurus', 'leo', 'scorpio', 'aquarius', 'gemini', 'virgo',
    'sagittarius', 'pisces', 'aries', 'cancer', 'libra', 'capricorn',
];
const ANSWERS = {
    nojoke: 'No, Dad didn`t joke about it yet.',
    jokeerror: 'No time for jokes mate.',
    noadvice: 'Sorry, nothing to advice.',
    horoscopeerror: 'Let fate remain a mystery this time',
};

axios.defaults.timeout = 5000;

function getRandSong() {
    return Buffer.alloc(800000);
}

async function getRandMeme() {
    const index = Math.floor(Math.random() * GAG_SECTIONS.length);
    const res = await axios.get(`${GAG_URL}/${GAG_SECTIONS[index]}/fresh`);

    const $ = cheerio.load(res.data);
    const result = $('a.badge-track').map((a) => {
        console.log('kk');
        console.log($(this));
        var item = {
            title: null,
            id: null,
            url: null,
            image: null,
            points: null,
            commentCount: null
        };
        // item.title = $(this).children('header').children('h2.badge-item-title').children('a').text().trim();
        // item.id = $(this).attr('data-entry-id');
        // item.url = "http://9gag.com" + $(this).children('div.badge-post-container').children('a').attr('href');
        // item.image = $(this).children('div.badge-post-container').children('a').children('img').attr('src');
        // item.points = $(this).children('p.post-meta').children('a.badge-evt.point').children('span.badge-item-love-count').text().trim();
        // item.commentCount = $(this).children('p.post-meta').children('a.badge-evt.comment').text().trim();
        // item.commentCount = item.commentCount.substring(0, item.commentCount.indexOf(' comments'));

        return item;
    }).get();
    console.log(result);
    

    return RAND_IMAGE_URL;
}

async function getPol() {
    const res = await axios.get(POL_URL);
    console.log(res.data.threads);
    return `
        ${res.data.threads[0].subject}
        https://2ch.hk/po/res/${res.data.threads[0].num}.html
    `;
}

async function getRandVideo() {
    const url = 'https://player.vimeo.com/external/272348880.hd.mp4?s=d6216c0238a4166737a37426212eaed6cff3ac09&profile_id=175&oauth2_token_id=57447761&download=4';
    const res = await axios({
        url,
        responseType: 'stream'
    });
    return res.data;
}

// should adv horo dad 
async function getYesNo() {
    try {
        const res = await axios.get(YESNO_URL);

        if (res.data.image) throw new Error();
        const data = await axios({
            url: res.data.image,
            responseType: 'stream'
        });
        return {
            isGif: true,
            data: data.data,
        };
    } catch (e) {
        return {
            isGif: false,
            data: ['No', 'Yes', 'Maybe..'][Math.floor(Math.random() * 3)],
        };
    }
}

async function getAdvice(text) {
    const query = text.split(' ')[1];

    try {
        const res = await axios.get(`${ADVICE_URL}${query ? `/search/${query}` : ''}`);
    
        if (res.data.message) throw new Error();
        if (!query) return res.data.slip.advice;
        const randIndex = Math.floor(Math.random() * res.data.slips.length);
        return res.data.slips[randIndex].advice;
    } catch (e) {
        return ANSWERS.noadvice;
    }
}

async function getJoke(text) {
    const query = text.split(' ')[1];

    try {
        const res = await axios({
            url: `${DAD_JOKE_URL}${query ? `search?term=${query}` : ''}`,
            responseType: 'json',
            headers: {
                Accept: 'text/plain',
            }
        });

        if (!res.data) return ANSWERS.nojoke;
        if (!query) return res.data;
        const dataArr = res.data.split('\n');
        const randIndex = Math.floor(Math.random() * dataArr.length);
        return dataArr[randIndex];
    } catch (e) {
        return ANSWERS.jokeerror;
    }
}

async function getHoroscope(text) {
    let datespan = 'today';
    let sunsign = 'Leo';
    const optsArr = text.split(' ').slice(1) || [];
    optsArr.forEach((opt) => {
        opt = opt.toLowerCase();
        if (HORO_DATES.includes(opt)) datespan = opt;
        if (HORO_SUNSIGNS.includes(opt)) sunsign = opt;
    });
    sunsign = sunsign.charAt(0).toUpperCase() + sunsign.slice(1);

    try {
        const res = await axios({
            url: `${HORO_URL}/${datespan}/${sunsign}`,
            responseType: 'json',
        });

        const responce = res.data.horoscope.replace(/Ganesha/g, 'Astrologist');
        return responce;
    } catch (e) {
        return ANSWERS.horoscopeerror;
    } 
}

module.exports = {
    getJoke,
    getAdvice,
    getPol,
    getYesNo,
    getRandSong,
    getRandVideo,
    getRandMeme,
    getHoroscope,
};