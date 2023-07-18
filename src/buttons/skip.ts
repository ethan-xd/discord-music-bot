import { Button } from '../types'
import { skipEmbed } from '../utils'

const skip: Button = ({ inter, queue }) => skipEmbed(inter, queue)

export default skip
