module.exports = {
    name: 'clear',
    description: 'Clear all the music in the queue.',
    voiceChannel: true,

    async execute({ inter }) {
        const queue = player.getQueue(inter.guildId);

        if (!queue || !queue.playing) return inter.reply({ content: `Nothing is currently playing.`, ephemeral: true });

        if (!queue.tracks[0]) return inter.reply({ content: `There is nothing in the queue to clear.`, ephemeral: true });

        await queue.clear();

        inter.reply(`The queue was cleared.`);
    },
};