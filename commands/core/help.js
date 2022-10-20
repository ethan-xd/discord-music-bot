const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: "View help.",
    showHelp: false,

    execute({ client, inter }) {
        const commands = client.commands.filter(x => x.showHelp !== false);

        const embed = new EmbedBuilder()
        .setColor('#ff9900')
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
        .addFields([ { name: `All commands`, value: commands.map(x => `\`${x.name}\``).join(' | ') } ])

        inter.reply({ embeds: [embed] });
    },
};