require('dotenv').config();
const { Client, DiscordAPIError } = require('discord.js');
const client = new Client();
const createCaptcha = require('./captcha');
const fs = require('fs').promises;
const { token } = require('./config.json');
const { prefix } = require('./config.json');


client.once('ready', () => {
  console.log('Ready! Made by Shiloh#0001');
  client.user.setActivity(`contact me @ tedy#0003`, {
    type: 'WATCHING'
  });
  
client.on("message", async message => {
    const prefix = "$";
    if (message.content === 'hi') {
        message.channel.send('yoo');
    } else if (message.content === 'cutie') {
        message.channel.send('<@478051668542619670>')
    } else if (message.content === 'daddy') {
        message.channel.send('<@478051668542619670>')
    }
})



});
client.on('guildMemberAdd', async member => {
				const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome'); 
    const captcha = await createCaptcha();
    try {
        const msg = await member.send(`Welcome ${member.user} to **${member.guild.name}** \nMake sure you read the rules! \n\n**Please reply with the given captcha below to verify you are human**.\n\n This Captcha **is** case sensitve \n(*__you have 5 minutes to enter the captcha or you will be kicked__*)`, {
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
	.addField('s!members', 'Display total amount of members shil6h is watching over')
	.addField('s!servers', 'Display total amount of servers shil6h is in')
        .addField('s!setup', 'Get a description on how to setup shil6h')
        .addField('s!info', 'Get information about shil6h')
        .addField('s!invite', 'Get the invite for shil6h')
        .addField('s!website', 'Get a link to the shil6h website')
	.addField('s!privacy', 'Display the privacy policy')
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
        .setTitle('**Invite**')
        .setDescription('[Click here for shil6h invite!](https://discord.com/oauth2/authorize?client_id=830529009829543976&scope=bot&permissions=268443714)')
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
        .setTitle('**Setup**')
        .setDescription('To setup shil6h all you have to do is invite me to your server and from there I will captcha on')
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

client.on('message', message => {
    if(message.author.bot) return;
    else if (message.content === `${prefix}website`) {
        const embed = new Discord.MessageEmbed()
        .setColor('#46edf2')
        .setTitle('**Website**')
        .setDescription('Click here for [shil6h website!](http://shil6h.com/)')
        .setFooter(`Requested by ${message.author.tag}`)
        .setTimestamp()
        
        return message.channel.send(embed);
    }
})

client.on('message', message => {
    if(message.author.bot) return;
    else if (message.content === `${prefix}privacy`) {
        const embed = new Discord.MessageEmbed()
        .setColor('#46edf2')
        .setTitle('**Privacy Policy**')
        .addField('What information is stored', 'If you setup a modlog, the server and channel id is stored. If you setup a welcome/leave message, the server, channel id, and message information is stored.')
        .addField('Why we store the information and how we use it', 'For modlog and welcome/leave message information, this data is used to send messages/perform actions with previously used information.')
        .addField('Who gets this data', 'All data is only locked up for only the creators to see.')
        .addField('Third Party Data Sharing', 'We do not have any thrid party connections.')
        .addField('Questions and Concerns', 'If you have questions and/or concerns about the data stored, please [dm me](https://discord.com/users/478051668542619670)')
        .addField('Removing my Data', 'If you want to remove data or do not accept access for us to see it, please [dm me](https://discord.com/users/478051668542619670)')
        .addField('Note', 'We reserve the right to change this without notifying our users.')
        .setFooter(`Requested by ${message.author.tag}`)
        .setTimestamp()
        
        return message.channel.send(embed);
    }
})

client.on("message", async message => {
    const prefix = "$";
    if (message.content === 's!servers') {
        message.channel.send(`I am in ${client.guilds.cache.size} servers!`);
    } else if (message.content === 's!members') {
        message.channel.send(`I am watching over ${client.users.cache.size} members!`)
    }
})

client.login(token);
