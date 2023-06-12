import { Button } from '../types'

const back: Button = async ({ inter, queue }) => {
    if (!queue || !queue.isPlaying())
        return inter.reply({ content: 'Nothing is currently playing.', ephemeral: true })

    if (!queue.history.previousTrack)
        return inter.reply({
            content: 'Nothing was played before this track.',
            ephemeral: true,
        })
    await queue.history.back()
    return inter.reply({ content: 'Playing the previous track.' })
}

export default back
