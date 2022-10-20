const { InteractionType } = require('discord.js');

module.exports = (client, inter) => {
    if (inter.type === InteractionType.ApplicationCommand) {
        const DJ = client.config.opt.DJ;
        const command = client.commands.get(inter.commandName);

    if (!command) return inter.reply({  content: 'Something went wrong.', ephemeral: true, }), client.slash.delete(inter.commandName)
    if (command.permissions && !inter.member.permissions.has(command.permissions)) return inter.reply({  content: `You do not have permission to use this command.`, ephemeral: true, })
    if (DJ.enabled && DJ.commands.includes(command) && !inter.member._roles.includes(inter.guild.roles.cache.find(x => x.name === DJ.roleName).id)) return inter.reply({  content: `You must have the \`${DJ.roleName}\` role to use this command.`, ephemeral: true, })
    if (command.voiceChannel) {
            if (!inter.member.voice.channel) return inter.reply({ content: `You must be in a voice channel.`, ephemeral: true })
            if (inter.guild.members.me.voice.channel && inter.member.voice.channel.id !== inter.guild.members.me.voice.channel.id) return inter.reply({  content: `You must be in the same voice channel.`, ephemeral: true, })
       }
        command.execute({ inter, client });
    }
    if (inter.type === InteractionType.MessageComponent) {
        const customId = JSON.parse(inter.customId)
        const file_of_button = customId.ffb
        const queue = player.getQueue(inter.guildId);
        if (file_of_button) {
            delete require.cache[require.resolve(`../src/buttons/${file_of_button}.js`)];
            const button = require(`../src/buttons/${file_of_button}.js`)
            if (button) {
                if (!inter.member.voice.channel) return inter.reply({ content: `You must be in a voice channel.`, ephemeral: true, });
                if (inter.guild.members.me.voice.channel && inter.member.voice.channel.id !== inter.guild.members.me.voice.channel.id) return inter.reply({  content: `You must be in the same voice channel.`, ephemeral: true, });
                return button({ client, inter, customId, queue });
            }
        }
    }
};