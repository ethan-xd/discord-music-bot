import { Command } from '../../types'

export default {
    name: 'back',
    description: 'Play the previous track.',
    voiceChannel: true,
    execute: async ({ inter, player }) => {
        const queue = player.queues.get(inter.guildId)
        if (!queue || !queue.isPlaying()) {
            return inter.reply({ content: 'Nothing is currently playing.', ephemeral: true })
        }
        if (!queue.history.previousTrack) {
            return inter.reply({
                content: 'Nothing was played before this track.',
                ephemeral: true,
            })
        }
        await queue.history.back()
        return inter.reply({ content: 'Playing the previous track.' })
    },
} satisfies Command
