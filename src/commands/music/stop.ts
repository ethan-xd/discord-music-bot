import { Command } from '../../types'

export default {
    name: 'stop',
    description: 'Stop and leave the voice channel.',
    voiceChannel: true,
    execute: ({ inter, player }) => {
        const queue = player.queues.get(inter.guildId)
        if (!queue || !queue.isPlaying())
            return inter.reply({ content: 'Nothing is currently playing.', ephemeral: true })
        queue.delete()
        return inter.reply({ content: 'Goodbye losers!' })
    },
} satisfies Command
