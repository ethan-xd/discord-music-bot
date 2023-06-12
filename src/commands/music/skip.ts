import { Command } from '../../types'
import { skipEmbed } from '../../utils'

export default {
    name: 'skip',
    description: 'Skip the currently playing track.',
    voiceChannel: true,
    execute: ({ inter, player }) => skipEmbed(inter, player.queues.get(inter.guildId)),
} satisfies Command
