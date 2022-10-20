module.exports = {
    name: 'resume',
    description: 'play the track',
    voiceChannel: true,

    execute({ inter }) {
        const queue = player.getQueue(inter.guildId);

        if (!queue) return inter.reply({ content: `Nothing is currently playing.`, ephemeral: true });

        if(!queue.connection.paused) return inter.reply({content: `The track is already playing.`, ephemeral: true})

        const success = queue.setPaused(false);
        
        if (success) {
            return inter.reply({ content: `Resumed *${queue.current.title}*.` });
        } else {
            return inter.reply({ content: `Something went wrong.`, ephemeral: true  });
        }
    },
};
