import { Button } from '../types'
import { queueEmbed } from '../utils'

const queueButton: Button = ({ inter, queue }) => queueEmbed(inter, queue)

export default queueButton
