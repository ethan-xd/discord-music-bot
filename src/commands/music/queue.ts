import { Command } from '../../types'
import { queueEmbed } from '../../utils'

export default {
    name: 'queue',
    description: 'Get the songs in the queue',
    voiceChannel: true,

    execute: ({ inter, player }) => queueEmbed(inter, player.queues.get(inter.guildId)),
} satisfies Command
