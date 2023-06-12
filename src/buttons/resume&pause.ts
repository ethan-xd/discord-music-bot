import { Button } from '../types'
import { throwIfNull } from 'throw-expression'

const resumeAndPause: Button = ({ inter, queue }) => {
    if (!queue || !queue.isPlaying())
        return inter.reply({ content: 'Nothing is currently playing.', ephemeral: true })

    const success = queue.node.resume()
    if (!success) queue.node.pause()

    return inter.reply({
        content: `${success ? 'Resumed' : 'Paused'} *${
            throwIfNull(queue.currentTrack, 'current track was null').title
        }*.`,
    })
}
export default resumeAndPause
