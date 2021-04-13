const Discord = require('discord.js');
require('dotenv').config();
const { Client, DiscordAPIError } = require('discord.js');
const client = new Client();
const createCaptcha = require('./captcha');
const fs = require('fs').promises;
const { token } = require('./config.json');
const { prefix } = require('./config.json');


client.once('ready', () => {
  console.log('Ready! Made by Shiloh#0001'); // Don't change, please?
  client.user.setActivity(`s!help`, {
    type: 'WATCHING'
  });
  
client.on("message", async message => {
    const prefix = "s!";
    if (message.content === 'hi') {
        message.channel.send('yoo');
    } else if (message.content === 'cutie') {
        message.channel.send('Your discord ID')
    } else if (message.content === 'daddy') {
        message.channel.send('Your discord ID')
    }
})




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

client.on('message', message => {
    if(message.author.bot) return;
    else if (message.content === `${prefix}help`) {
        const embed = new Discord.MessageEmbed()
        .setColor('#46edf2')
        .setDescription('**Commands**')
        .addField('s!setup', 'Get a description on how to setup shil6h')
        .addField('s!info', 'Get information about shil6h')
        .addField('s!invite', 'Get the invite for shil6h')
        .setFooter(`Requested by ${message.author.tag}`)
        .setTimestamp()

        return message.channel.send(embed);
    }
})

client.on('message', message => {
    if(message.author.bot) return;
    else if (message.content === `${prefix}invite`) {
        const embed = new Discord.MessageEmbed()
        .setColor('#46edf2')
        .setDescription('**Invite**')
        .addField() 
        .setFooter(`Requested by ${message.author.tag}`)
        .setTimestamp()

        return message.channel.send(embed);
    }
})

client.on('message', message => {
    if(message.author.bot) return;
    else  if (message.content === `${prefix}setup`) {
        const embed = new Discord.MessageEmbed()
        .setColor('#46edf2')
        .setDescription('**Setup**')
        .addField('To setup shil6h all you have to do is invite me to your server and from there I will captcha on')
        .setFooter(`Requested by ${message.author.tag}`)
        .setTimestamp()
        
        return message.channel.send(embed);
    }
})

client.on('message', message => {
    if(message.author.bot) return;
    else if (message.content === `${prefix}info`) {
        const embed = new Discord.MessageEmbed()
        .setColor('#46edf2')
        .setTitle('**Information**')
        .setDescription('A discord bot that allows you to have to verify via captcha to maintain within the server. Failure to do so will result in a kick. If you do not complete the captcha correctly you will get another attempt. There is no limit on attempts and it is case sensitve. This bot is to help preventing your server from getting raided, botted and or fake discord accounts from joining.')
        .setFooter(`Requested by ${message.author.tag}`)
        .setTimestamp()
        
        return message.channel.send(embed);
    }
})


client.login(token);
