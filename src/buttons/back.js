module.exports = async ({  inter, queue }) => { 
    if (!queue || !queue.playing) return inter.reply({ content: `Nothing is currently playing.`, ephemeral: true });

    if (!queue.previousTracks[1]) return inter.reply({ content: `Nothing was played before this track.`, ephemeral: true });

    await queue.back();

    inter.reply({ content:`Playing the previous track.`});
}
