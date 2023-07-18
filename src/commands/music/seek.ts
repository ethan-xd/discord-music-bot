import { Command } from '../../types'
import { ApplicationCommandOptionType } from 'discord.js'
import ms, { StringValue } from 'ms'
import { throwIfNull } from 'throw-expression'

export default {
    name: 'seek',
    description: 'Seek to a time in a track.',
    voiceChannel: true,
    options: [
        {
            name: 'time',
            description: 'What time?',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    execute: async ({ inter, player }) => {
        const queue = player.queues.get(inter.guildId)
        if (!inter.isChatInputCommand()) {
            return inter.reply({ content: 'not a chat input', ephemeral: true })
        }

        if (!queue || !queue.isPlaying()) {
            return inter.reply({ content: 'Nothing is currently playing.', ephemeral: true })
        }
        const timeToMS = ms(throwIfNull(inter.options.getString('time'), 'asdf') as StringValue)

        if (
            timeToMS >= throwIfNull(queue.currentTrack, 'currentTrack was null').durationMS ||
            timeToMS < 0
        )
            return inter.reply({ content: 'The requested time is out of bounds.', ephemeral: true })

        await queue.node.seek(timeToMS)

        return inter.reply({ content: `Seeked to *${ms(timeToMS, { long: true })}*` })
    },
} satisfies Command
