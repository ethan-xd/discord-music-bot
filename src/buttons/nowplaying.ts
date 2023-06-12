import { Button } from '../types'
import { nowPlayingEmbed } from '../utils'

const nowplaying: Button = ({ inter, queue }) => nowPlayingEmbed(inter, queue)

export default nowplaying
