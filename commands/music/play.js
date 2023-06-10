const { QueryType } = require('discord-player');
const { ApplicationCommandOptionType } = require('discord.js');
module.exports = {
    name: 'play',
    description: "Add a track to the queue.",
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description: 'The song name or URL.',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    async execute({inter}) {
        const channel = inter.channel;
        if (!channel) return inter.reply('You are not connected to a voice channel!');
        const query = inter.options.getString('song', true);
    
        await inter.deferReply();
    
        try {
            const { track } = await player.play(channel, query, {
                nodeOptions: {
                    metadata: inter // we can access this metadata object using queue.metadata later on
                }
            });
    
            return inter.followUp(`**${track.title}** enqueued!`);
        } catch (e) {
            return inter.followUp(`Something went wrong: ${e}`);
        }
    },
};