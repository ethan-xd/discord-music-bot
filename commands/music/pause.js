module.exports = {
    name: 'pause',
    description: 'Pause the currently playing track.',
    voiceChannel: true,

    execute({ inter }) {
        const queue = player.getQueue(inter.guildId);

        if (!queue) return inter.reply({ content: `Nothing is currently playing.`, ephemeral: true });
        
        if(queue.connection.paused) return inter.reply({content: 'The track is already paused.', ephemeral: true})

        const success = queue.setPaused(true);
        
        if (success) {
            return inter.reply({ content: `Paused *${queue.current.title}*.` });
        } else {
            return inter.reply({ content: `Something went wrong.`, ephemeral: true  });
        }
    },
};
