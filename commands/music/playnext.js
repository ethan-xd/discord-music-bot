const { ApplicationCommandOptionType } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
    name: 'playnext',
    description: "Add a track to the front of the queue.",
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description: 'The song name or URL.',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    async execute({ inter }) { 
        const queue = player.getQueue(inter.guildId);

        if (!queue || !queue.playing) return inter.reply({ content: `Nothing is currently playing.`, ephemeral: true });

        const song = inter.options.getString('song');

        const res = await player.search(song, {
            requestedBy: inter.member,
            searchEngine: QueryType.AUTO
        });

        if (!res || !res.tracks.length) return inter.reply({ content: `Nothing found for that search.`, ephemeral: true });

       if (res.playlist) return inter.reply({ content: `Playlist's are not supported for this command.`, ephemeral: true });

        queue.insert(res.tracks[0], 0)

        await inter.reply({ content:`Playing *${res.tracks[0].title}* next.`});

    }
}