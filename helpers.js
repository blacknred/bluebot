const axios = require('axios');
const cheerio = require('cheerio');

const GAG_URL = 'http://9gag.com';
const YESNO_URL = 'https://yesno.wtf/api';
const POL_URL = 'https://2ch.hk/po/threads.json';
const DAD_JOKE_URL = 'https://icanhazdadjoke.com/';
const ADVICE_URL = 'https://api.adviceslip.com/advice';
const GAG_MEDIA_HOST = 'img-9gag-fun.9cache.com';
const HORO_URL = 'http://horoscope-api.herokuapp.com/horoscope';
const GAG_SECTIONS = ['fresh', 'comic', 'nsfw', 'video'];
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

async function getMemes(text) {
    let section = GAG_SECTIONS[0];
    let search;
    let count = 1;
    const memes = [];

    const optsArr = text.split(' ').slice(1) || [];
    optsArr.forEach((opt) => {
        if (isNaN(opt)) {
            opt = opt.toLowerCase();
            if (GAG_SECTIONS.includes(opt)) section = opt;
            else search = opt;
        } else count = opt;
    });
    const url = `${GAG_URL}/${search ? `search?query=${search}` : section}`;

    try {
        while (memes.length < count) {
            let res = await axios.get(url);

            let $ = cheerio.load(res.data, {
                xmlMode: true,
            });
            let rawIds = $('span#jsid-latest-entries').contents().first().text();
            if (!rawIds) throw new Error();
            let ids = rawIds.split(',').slice(0, count - memes.length);
            let raw = $('script:not([src])')[5].children[0].data;
            if (!raw) throw new Error();
            ids.forEach(async (id) => {
                let pattern = new RegExp(`http(s?):\\\\/\\\\/${GAG_MEDIA_HOST}\\\\/photo\\\\/${id}_460s.{1,5}.(?:mp4|webm|gif)`, 'g');
                let src = raw.match(pattern);
                if (src && src[0]) {

                    const data = await axios({
                        url: src[0].replace(/\\\//g, '/'),
                        responseType: 'stream',
                    });

                    memes.push({
                        isImg: false,
                        src: data.data,
                    });
                } else {
                    memes.push({
                        isImg: true,
                        src: `https://${GAG_MEDIA_HOST}/photo/${id}_700b.jpg`,
                    });
                }
            });
        }

        return memes;
    } catch (e) {
        console.log(e);
        return memes; //
    }
}

async function getYesNo() {
    try {
        const res = await axios.get(YESNO_URL);

        if (!res.data.image) throw new Error();
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
            data: ['No.', 'Yes!', 'Maybe..'][Math.floor(Math.random() * 3)],
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

// ???
function getRandSong() {
    return Buffer.alloc(800000);
}

async function getPol() {
    const res = await axios.get(POL_URL);
    console.log(res.data.threads);
    return `
        ${res.data.threads[0].subject}
        https://2ch.hk/po/res/${res.data.threads[0].num}.html
    `;
}

module.exports = {
    getPol,
    getJoke,
    getYesNo,
    getMemes,
    getAdvice,
    getRandSong,
    getHoroscope,
};