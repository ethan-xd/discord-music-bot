const { QueueRepeatMode } = require('discord-player');
const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'loop',
    description: 'Looping options.',
    voiceChannel: true,
    options: [
        {
        name: 'action' ,
        description: 'Which looping action?',
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
            { name: 'Loop Song', value: 'enable_loop_song' },
            { name: 'Loop Queue', value: 'enable_loop_queue' },
            { name: 'Disable', value: 'disable_loop'}
            
        ],
    }
    ],
    execute({ inter }) {
        const queue = player.getQueue(inter.guildId);

        if (!queue || !queue.playing) return inter.reply({ content: `Nothing is currently playing.`, ephemeral: true });
        switch (inter.options._hoistedOptions.map(x => x.value).toString()) {
            case 'enable_loop_queue': {
                if (queue.repeatMode === 1) return inter.reply({ content:`Something is already looping. Use \`/loop disable\`.`, ephemeral: true });

                const success = queue.setRepeatMode( QueueRepeatMode.QUEUE);

                if (success) {
                    return inter.reply({ content: `Looping queue.` });
                } else {
                    return inter.reply({ content: `Something went wrong.`, ephemeral: true  });
                }
            }
            case 'disable_loop': {
                const success = queue.setRepeatMode(QueueRepeatMode.OFF);

                if (success) {
                    return inter.reply({ content: `Looping disabled.` });
                } else {
                    return inter.reply({ content: `Something went wrong.`, ephemeral: true  });
                }
            }
            case 'enable_loop_song': {
                if (queue.repeatMode === 2) return inter.reply({ content:`Something is already looping. Use \`/loop disable\`.`, ephemeral: true });

                const success = queue.setRepeatMode( QueueRepeatMode.TRACK);
                
                if (success) {
                    return inter.reply({ content: `Looping track.` });
                } else {
                    return inter.reply({ content: `Something went wrong.`, ephemeral: true  });
                }
            }
        }
       
    },
};