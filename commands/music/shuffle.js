module.exports = {
    name: 'shuffle',
    description: 'Shuffle the queue.',
    voiceChannel: true,

    async execute({ inter }) {
        const queue = player.getQueue(inter.guildId);

        if (!queue || !queue.playing) return inter.reply({ content: `Nothing is currently playing.`, ephemeral: true });

        if (!queue.tracks[0]) return inter.reply({ content: `There is nothing else in the queue to shuffle.`, ephemeral: true });

        await queue.shuffle();

        return inter.reply({ content:`Shuffling ${queue.tracks.length} tracks.`});
    },
};