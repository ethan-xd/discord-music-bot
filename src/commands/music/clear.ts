import { Command } from '../../types'

export default {
    name: 'clear',
    description: 'Clear all the music in the queue.',
    voiceChannel: true,
    execute: ({ inter, player }) => {
        const queue = player.queues.get(inter.guildId)
        if (!queue || !queue.isPlaying()) {
            return inter.reply({ content: 'Nothing is currently playing.', ephemeral: true })
        }
        if (!queue.size) {
            return inter.reply({
                content: 'There is nothing in the queue to clear.',
                ephemeral: true,
            })
        }
        queue.clear()
        return inter.reply('The queue was cleared.')
    },
} satisfies Command
