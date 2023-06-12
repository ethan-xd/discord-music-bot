import { Button } from '../types'
import { methods } from '../utils'
import { QueueRepeatMode } from 'discord-player'

const loop: Button = ({ inter, queue }) => {
    if (!queue || !queue.isPlaying())
        return inter.reply({ content: 'Nothing is currently playing.', ephemeral: true })

    const repeatMode = queue.repeatMode

    if (repeatMode === 0) queue.setRepeatMode(QueueRepeatMode.TRACK)

    if (repeatMode === 1) queue.setRepeatMode(QueueRepeatMode.QUEUE)

    if (repeatMode === 2) queue.setRepeatMode(QueueRepeatMode.OFF)

    return inter.reply({
        content: `Looping ${methods[queue.repeatMode]}.`,
    })
}

export default loop
