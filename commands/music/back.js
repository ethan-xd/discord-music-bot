module.exports = {
    name: 'back',
    description: "Play the previous track.",
    voiceChannel: true,

    async execute({ inter }) {
        const queue = player.getQueue(inter.guildId);

        if (!queue || !queue.playing) return inter.reply({ content: `Nothing is currently playing.`, ephemeral: true });

        if (!queue.previousTracks[1]) return inter.reply({ content: `Nothing was played before this track.`, ephemeral: true });

        await queue.back();

        inter.reply({ content:`Playing the previous track.`});
    },
};