require('dotenv').config();
const { Client } = require('discord.js');
const client = new Client();
const createCaptcha = require('./captcha');
const fs = require('fs').promises;
const { token } = require('./config.json');;


client.once('ready', () => {
  console.log('Ready! Made by Shiloh#0001');
  client.user.setActivity(`shiloh sleep`, {
    type: 'WATCHING'
  });
  
});
client.on('guildMemberAdd', async member => {
				const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome'); 
    const captcha = await createCaptcha();
    try {
        const msg = await member.send(`Welcome ${member.user}! \nMake sure you read the rules! \n\n**Please enter the given captcha below to verify you are human**.\n\n This Captcha **is** case sensitve \n(*__you have 5 minutes to enter the captcha or you will be kicked__*)`, {
            files: [{
                attachment: `${__dirname}/captchas/${captcha}.png`,
                name: `${captcha}.png`
            }]
        });
        try {
            const filter = m => {
                if(m.author.bot) return;
                if(m.author.id === member.id && m.content === captcha) return true;
                else {
                    m.channel.send('You entered the captcha incorrectly.');
                    return false;
                }
            };
            const response = await msg.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time']});
            if(response) {
                await msg.channel.send('You have verified yourself as human!');
                await fs.unlink(`${__dirname}/captchas/${captcha}.png`)
                    .catch(err => console.log(err));
            }
        }
        catch(err) {
            console.log(err);
            await msg.channel.send(`You did not solve the captcha correctly on time. You may join back and recomplete the captcha correctly.`);
            await member.kick();
            await fs.unlink(`${__dirname}/captchas/${captcha}.png`)
                    .catch(err => console.log(err));
        }
    }
    catch(err) {
        console.log(err);
    }
});

client.login(token);
