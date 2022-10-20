const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'remove',
    description: "Remove a track from the queue.",
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description: 'The name or URL of the track you want to jump to.',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'number',
            description: 'The place in the queue the track is in.',
            type: ApplicationCommandOptionType.Number,
            required: false,
        }
    ],

    async execute({ inter }) { 
        const number =  inter.options.getNumber('number')
        const track = inter.options.getString('song');

        const queue = player.getQueue(inter.guildId);

        if (!queue || !queue.playing) return inter.reply({ content: `Nothing is currently playing.`, ephemeral: true });
        if (!track && !number) inter.reply({ content: `No option was filled out.`, ephemeral: true });

        if (track) {

        for (let song of queue.tracks) {
            if (song.title === track || song.url === track ) {
                queue.remove(song)
                return inter.reply({ content: `Removed *${track}* from the queue.` });
            }

        }

        return inter.reply({ content: `Couldn't find *${track}* in the queue.`, ephemeral: true });    
        }

        if (number) {

            const index = number - 1
            const trackname = queue.tracks[index].title

            if (!trackname) return inter.reply({ content: `Couldn't find your requested track in the queue.`, ephemeral: true });   

            queue.remove(index);
            
            return inter.reply({ content: `Removed *${track}* from the queue.` });
        }


         
    }
}