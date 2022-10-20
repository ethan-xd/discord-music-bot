const { EmbedBuilder } = require('discord.js');
module.exports = async ({ client, inter, queue }) => { 
    if (!queue) return inter.reply({ content: `Nothing is currently playing.`, ephemeral: true });

        if (!queue.tracks[0]) return  inter.reply({ content: `There is nothing in the queue.`, ephemeral: true });

        const songs = queue.tracks.length;

        const nextSongs = songs > 5 ? `\n\n...and **${songs - 5}** more track(s).` : ``;

        const tracks = queue.tracks.map((track, i) => `**${i + 1}** - *${track.title}* requested by ${track.requestedBy.toString()}.`)

        const embed = new EmbedBuilder()
        .setColor('#ff9900')
        .setTitle('Queue')
        .setDescription(`Now playing: *${queue.current.title}*\n\n${tracks.slice(0, 5).join('\n')}${nextSongs}`)
        

        inter.reply({ embeds: [embed] });
}
