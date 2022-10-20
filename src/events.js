const { ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');

player.on('error', (queue, error) => {
    console.log(JSON.stringify(error));
});

player.on('connectionError', (queue, error) => {
    console.log(JSON.stringify(error));
});

player.on('trackStart', (queue, track) => {
    if (!client.config.opt.loopMessage && queue.repeatMode !== 0) return;
    const embed = new EmbedBuilder()
    .setColor('#ff9900')
    .setTitle(track.title)
    .setDescription('Now playing <a:music:1032596852585025596>')
    .setThumbnail(track.thumbnail)
    .setFields(
        { name: 'Requested by', value: track.requestedBy.toString(), inline: true },
        { name: 'Duration', value: track.duration, inline: true }
    )
    .setURL(track.url)

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

    const row1 = new ActionRowBuilder().addComponents(back, queuebutton, resumepause, loop, skip)
    queue.metadata.send({ embeds: [embed], components: [row1] })
});

player.on('trackAdd', (queue, track) => {
    //queue.metadata.send(`Queued ${track.title}.`);
});

player.on('botDisconnect', (queue) => {
    queue.metadata.send('Queue cleared.');
});

player.on('channelEmpty', (queue) => {
    queue.metadata.send('Goodbye losers!');
});

player.on('queueEnd', (queue) => {
    queue.metadata.send('Queue is finished.');
});

player.on('tracksAdd', (queue, tracks) => {
    queue.metadata.send('Queued the playlist.');
});