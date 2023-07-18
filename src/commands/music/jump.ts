import { Command } from '../../types'
import { ApplicationCommandOptionType } from 'discord.js'
import { throwIfUndefined } from 'throw-expression'

export default {
    name: 'jump',
    description: 'Jumps to a track in the queue.',
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
        },
    ],

    execute: ({ inter, player }) => {
        if (!inter.isChatInputCommand()) {
            return inter.reply({ content: 'not a chat input', ephemeral: true })
        }
        const track = inter.options.getString('song')
        const number = inter.options.getNumber('number')
        const queue = player.queues.get(inter.guildId)

        if (!queue || !queue.isPlaying())
            return inter.reply({ content: 'Nothing is currently playing.', ephemeral: true })
        if (!track && !number)
            return inter.reply({ content: 'No option was filled out.', ephemeral: true })

        if (track) {
            for (const song of queue.tracks.toArray()) {
                if (song.title === track || song.url === track) {
                    queue.node.skipTo(song)
                    return inter.reply({ content: `Skipped to *${track}*.` })
                }
            }
            return inter.reply({
                content: `Couldn't find *${track}* in the queue.`,
                ephemeral: true,
            })
        }
        if (number) {
            const index = number - 1
            const trackname = throwIfUndefined(
                queue.tracks.at(index),
                `track at index ${index} not found`,
            ).title
            if (!trackname)
                return inter.reply({
                    content: "Couldn't find your requested track in the queue.",
                    ephemeral: true,
                })
            queue.node.skipTo(index)
            return inter.reply({ content: `Skipped to *${trackname}*.` })
        }
        return inter.reply({ content: 'something went wrong this should NEVER happen' })
    },
} satisfies Command
