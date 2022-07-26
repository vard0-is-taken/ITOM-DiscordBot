const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name: 'ip',
    description: 'Показать текущий ip-адресс сервера.',
  },
];

exports.init = function(token, client, guild) {
  var rest = new REST({ version: '10' }).setToken(token);
  (async () => {
    try {
      console.log('Started refreshing application (/) commands.');
  
      await rest.put(Routes.applicationGuildCommands(client, guild), { body: commands });
  
      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
    })();   
}