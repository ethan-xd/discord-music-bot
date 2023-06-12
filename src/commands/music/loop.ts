import { Command } from '../../types'
import assertNever from 'assert-never'
import { QueueRepeatMode } from 'discord-player'
import { ApplicationCommandOptionType, CommandInteractionOptionResolver } from 'discord.js'
import { Mutable } from 'utility-types'

const choices = [
    { name: 'Loop Song', value: 'enable_loop_song' },
    { name: 'Loop Queue', value: 'enable_loop_queue' },
    { name: 'Disable', value: 'disable_loop' },
] as const

export default {
    name: 'loop',
    description: 'Looping options.',
    voiceChannel: true,
    options: [
        {
            name: 'action',
            description: 'Which looping action?',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: choices as Mutable<typeof choices>,
        },
    ],
    execute: ({ inter, player }) => {
        const queue = player.queues.get(inter.guildId)
        if (!inter.isChatInputCommand()) {
            return inter.reply({ content: 'not a chat input', ephemeral: true })
        }
        if (!queue || !queue.isPlaying())
            return inter.reply({ content: 'Nothing is currently playing.', ephemeral: true })
        const value = // @ts-expect-error TODO: why is this using a private property
            (inter.options as CommandInteractionOptionResolver<'cached'>)._hoistedOptions
                .map((x) => x.value)
                .toString() as (typeof choices)[number]['value']
        switch (value) {
            case 'enable_loop_queue': {
                if (queue.repeatMode === 1)
                    return inter.reply({
                        content: 'Something is already looping. Use `/loop disable`.',
                        ephemeral: true,
                    })
                queue.setRepeatMode(QueueRepeatMode.QUEUE)
                return inter.reply({ content: 'Looping queue.' })
            }
            case 'disable_loop': {
                queue.setRepeatMode(QueueRepeatMode.OFF)
                return inter.reply({ content: 'Looping disabled.' })
            }
            case 'enable_loop_song': {
                if (queue.repeatMode === QueueRepeatMode.QUEUE)
                    return inter.reply({
                        content: 'Something is already looping. Use `/loop disable`.',
                        ephemeral: true,
                    })
                queue.setRepeatMode(QueueRepeatMode.TRACK)
                return inter.reply({ content: 'Looping track.' })
            }
            default:
                assertNever(value)
        }
    },
} satisfies Command
