const { Client, EmbedBuilder } = require('discord.js')
const client = new Client({ intents: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 20, 21] })
const slash = require('./slash.js')
require('dotenv').config()

slash.init(process.env.TOKEN, process.env.CLIENT_ID, process.env.GUILD_ID)

const minutes = 15, the_interval = minutes * 60 * 1000
var guild
var logChannel

var oldMemberCount = 0

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  guild = client.guilds.cache.get(process.env.GUILD_ID)
  logChannel = client.channels.cache.get(process.env.LOGCHANNEL_ID)
  client.user.setPresence({ activities: [{ name: 'за сервером!', type: 3 }], status: 'online' });
  
  countMembers()

  setInterval(function() {
    countMembers()
  }, the_interval)
})

client.on('guildMemberAdd', async member => {
  await member.edit({roles: [process.env.PLAYERROLE_ID]})
  var joined = Math.ceil(Math.abs(Date.now() - member.user.createdAt) / (1000 * 3600 * 24))
  await logChannel.send({embeds: [getEmbed(`${member.user.tag} присоединился.`, `**аккаунт создан: ${joined} дней назад**\n**id: ${member.id}**`, member.displayAvatarURL({format: 'png', size: 1024}))]})
})

client.on('guildMemberRemove', async member => {
  var joined = Math.ceil(Math.abs(Date.now() - member.user.createdAt) / (1000 * 3600 * 24))
  await logChannel.send({embeds: [getEmbed(`${member.user.tag} покинул сервер.`, `**аккаунт создан: ${joined} дней назад**\n**id: ${member.id}**`, member.displayAvatarURL({format: 'png', size: 1024}))]})
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!')
  }
  if (interaction.commandName === 'ip') {
    //await interaction.deferReply();
    await interaction.reply({embeds: [
      new EmbedBuilder()
      .setAuthor({name: 'Текущий айпи сервера'})
      .setColor(0x00FFC6)
      .setTitle(process.env.IP)]
    })
  }
})

async function countMembers() {
    if (oldMemberCount != guild.memberCount){
      oldMemberCount = guild.memberCount;
      var memberCountChannel = client.channels.cache.get(process.env.COUNTCHANNEL_ID)
      memberCountChannel.setName('👥участников: ' + guild.memberCount)
    }
}

function getEmbed(title, description, thumbnail) {
    var embed = new EmbedBuilder()
    .setColor(0x00FFC6)
    .setTitle(title)
    .setDescription(description)
    .setThumbnail(thumbnail)
    return embed
}

client.login(process.env.TOKEN)