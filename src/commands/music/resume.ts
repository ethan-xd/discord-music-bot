import { Command } from '../../types'

export default {
    name: 'resume',
    description: 'play the track',
    voiceChannel: true,

    execute: ({ inter, player }) => {
        const queue = player.queues.get(inter.guildId)

        if (!queue)
            return inter.reply({ content: 'Nothing is currently playing.', ephemeral: true })

        if (!queue.node.isPaused())
            return inter.reply({ content: 'The track is already playing.', ephemeral: true })

        const success = queue.node.resume()

        if (success) {
            return inter.reply({
                content: `Resumed *${queue.currentTrack?.title ?? '[unknown track name]'}*.`,
            })
        } else {
            return inter.reply({ content: 'Something went wrong.', ephemeral: true })
        }
    },
} satisfies Command
