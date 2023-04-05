const { Telegraf } = require("telegraf");
const axios = require('axios');

const BOT = new Telegraf("TELEGRAMAPIKEY");
const GPT_TOKEN = new Telegraf("OPENAIAPIKEY");

// max count tokens for each request 
const MAX_TOKENS = 150;
const STOP = '\n';

// function for generating response text
async function GenerateText(prompt) {
    const RESPONSE = await axios.post(
        // specified url for code generate in different programming languages
        'https://api.openai.com/v1/engines/davinci-codex/completions',
        // An object thats sends configuration data as a json file for OpenAI API
        {
            prompt: prompt,
            max_tokens: MAX_TOKENS,
            n: 1,
            stop: STOP,
        },
        // thats second part of configuration data. 
        // we have "Content-Type" - that mean what name mean as well(format)
        // we have "Authorization" - specified OpenAI token
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${GPT_TOKEN}`,
            },
        }
    );

    // return result of response with one element of array(he only one, ours answer on the question). We specified in n:1 . And we take it [0] text without spaces.
    return RESPONSE.data.choices[0].text.trim();
}


// start command( chat working only after this )
BOT.start(async(ctx) => {
    ctx.reply('Напишите свой первый вопрос!');
    const TEXT_AFTER_START = await GenerateText('Для получения наилучшего ответа на ваш вопрос - постарайтесь сформулировать его максимально точно и обозначить детали, если таковы имеются.');
    await ctx.reply(TEXT_AFTER_START);
});


// help command ( not so usefull in enought )
BOT.command('help', (ctx) => {
    const message =
        `/start - Бот начинает свою работу\n/help - Посмотреть все команды.`

    ctx.reply(message);
});

BOT.catch((err) => console.log(err));

BOT.launch();
