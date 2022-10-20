module.exports = {
    name: 'stop',
    description: 'Stop and leave the voice channel.',
    voiceChannel: true,

    execute({ inter }) {
        const queue = player.getQueue(inter.guildId);

        if (!queue || !queue.playing) return inter.reply({ content:`Nothing is currently playing.`, ephemeral: true });

        queue.destroy();

        inter.reply({ content: `Goodbye losers!`});
    },
};