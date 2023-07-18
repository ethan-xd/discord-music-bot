import { Command } from '../../types'
import { config } from '@app-config/main'
import { QueryType } from 'discord-player'
import { ApplicationCommandOptionType } from 'discord.js'
import { throwIfNull, throwIfUndefined } from 'throw-expression'

export default {
    name: 'play',
    description: 'Add a track to the queue.',
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
        if (!inter.isChatInputCommand()) {
            return inter.reply({ content: 'not a chat input', ephemeral: true })
        }
        const song = throwIfNull(inter.options.getString('song'), 'no song parameter provided')
        const res = await player.search(song, {
            requestedBy: inter.member,
            searchEngine: QueryType.AUTO,
        })

        if (!res.tracks.length)
            return inter.reply({ content: 'Nothing found for that search.', ephemeral: true })

        const queue = player.queues.create(inter.guild, {
            metadata: inter.channel,
            volume: config.opt.defaultvolume,
            leaveOnEnd: config.opt.leaveOnEnd,
        })

        try {
            if (!queue.connection) await queue.connect(inter.member.voice.channel)
        } catch {
            player.queues.delete(inter.guildId)
            return inter.reply({ content: "Can't join the voice channel.", ephemeral: true })
        }
        const track = throwIfUndefined(res.tracks[0], 'no tracks?')
        await inter.reply({
            content: `Queued ${res.playlist ? 'playlist' : `*${track.title}*`}.`,
        })

        res.playlist ? queue.tracks.add(res.tracks) : queue.tracks.add(track)

        if (!queue.isPlaying()) return queue.node.play()
    },
} satisfies Command<true>
