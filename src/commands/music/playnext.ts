import { Command } from '../../types'
import { QueryType } from 'discord-player'
import { ApplicationCommandOptionType } from 'discord.js'
import { throwIfNull, throwIfUndefined } from 'throw-expression'

export default {
    name: 'playnext',
    description: 'Add a track to the front of the queue.',
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description: 'The song name or URL.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    execute: async ({ inter, player }) => {
        const queue = player.queues.get(inter.guildId)

        if (!queue || !queue.isPlaying()) {
            return inter.reply({ content: 'Nothing is currently playing.', ephemeral: true })
        }
        if (!inter.isChatInputCommand()) {
            return inter.reply({ content: 'not a chat input', ephemeral: true })
        }
        const song = throwIfNull(inter.options.getString('song'), 'song was null')

        const res = await player.search(song, {
            requestedBy: inter.user,
            searchEngine: QueryType.AUTO,
        })

        if (!res.tracks.length)
            return inter.reply({ content: 'Nothing found for that search.', ephemeral: true })

        if (res.playlist)
            return inter.reply({
                content: "Playlist's are not supported for this command.",
                ephemeral: true,
            })

        const track = throwIfUndefined(res.tracks[0], 'no tracks')
        queue.node.insert(track, 0)

        return inter.reply({ content: `Playing *${track.title}* next.` })
    },
} satisfies Command
