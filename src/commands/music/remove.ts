import { Command } from '../../types'
import { ApplicationCommandOptionType } from 'discord.js'

export default {
    name: 'remove',
    description: 'Remove a track from the queue.',
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
        const number = inter.options.getNumber('number')
        const track = inter.options.getString('song')

        const queue = player.queues.get(inter.guildId)

        if (!queue || !queue.isPlaying())
            return inter.reply({ content: 'Nothing is currently playing.', ephemeral: true })
        if (!track && !number)
            return inter.reply({ content: 'No option was filled out.', ephemeral: true })

        if (track) {
            for (const song of queue.tracks.toArray()) {
                if (song.title === track || song.url === track) {
                    queue.node.remove(song)
                    return inter.reply({ content: `Removed *${track}* from the queue.` })
                }
            }

            return inter.reply({
                content: `Couldn't find *${track}* in the queue.`,
                ephemeral: true,
            })
        }

        if (number) {
            const index = number - 1
            const trackname = queue.tracks.at(index)?.title

            if (!trackname)
                return inter.reply({
                    content: "Couldn't find your requested track in the queue.",
                    ephemeral: true,
                })

            queue.node.remove(index)

            return inter.reply({ content: `Removed *${trackname}* from the queue.` })
        }
        return inter.reply({ content: 'this should NEVER happen' })
    },
} satisfies Command
