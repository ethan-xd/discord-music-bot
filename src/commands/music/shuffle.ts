import { Command } from '../../types'

export default {
    name: 'shuffle',
    description: 'Shuffle the queue.',
    voiceChannel: true,

    execute: ({ inter, player }) => {
        const queue = player.queues.get(inter.guildId)

        if (!queue || !queue.isPlaying())
            return inter.reply({ content: 'Nothing is currently playing.', ephemeral: true })

        if (!queue.tracks.size)
            return inter.reply({
                content: 'There is nothing else in the queue to shuffle.',
                ephemeral: true,
            })

        queue.tracks.shuffle()

        return inter.reply({ content: `Shuffling ${queue.tracks.size} tracks.` })
    },
} satisfies Command
