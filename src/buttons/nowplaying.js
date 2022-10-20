const { EmbedBuilder } = require('discord.js');
module.exports = async ({ client, inter, queue }) => { 
    if (!queue) return inter.reply({ content: `Nothing is currently playing.`, ephemeral: true });

        const track = queue.current;

        const methods = ['Disabled', 'Track', 'Queue'];

        const timestamp = queue.getPlayerTimestamp();

        const trackDuration = timestamp.progress == 'Infinity' ? 'Live 🔴' : track.duration;

        const progress = queue.createProgressBar();
        

        const embed = new EmbedBuilder()
        .setTitle(track.title)
        .setThumbnail(track.thumbnail)
        .setURL(track.url)
        .setDescription(`${progress}`)
        .setFields(
            { name: 'Requested by', value: track.requestedBy.toString(), inline: true },
            { name: 'Loop', value: methods[queue.repeatMode], inline: true }
        )
        .setColor('#ff9900');

        const back = new ButtonBuilder()
            .setLabel('⏮ Back')
            .setCustomId(JSON.stringify({ffb: 'back'}))
            .setStyle('Primary')

            const skip = new ButtonBuilder()
            .setLabel('Next ⏭')
            .setCustomId(JSON.stringify({ffb: 'skip'}))
            .setStyle('Primary')

            const resumepause = new ButtonBuilder()
            .setLabel('Play/Pause')
            .setCustomId(JSON.stringify({ffb: 'resume&pause'}))
            .setStyle('Success')

            const loop = new ButtonBuilder()
            .setLabel('Loop')
            .setCustomId(JSON.stringify({ffb: 'loop'}))
            .setStyle('Secondary')
            
            const queuebutton = new ButtonBuilder()
            .setLabel('Queue')
            .setCustomId(JSON.stringify({ffb: 'queue'}))
            .setStyle('Secondary')



        const row = new ActionRowBuilder().addComponents(back, queuebutton, resumepause, loop, skip);

         inter.reply({ embeds: [embed], components: [row] });
}