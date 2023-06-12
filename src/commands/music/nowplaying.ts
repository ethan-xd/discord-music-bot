import { Command } from '../../types'
import { nowPlayingEmbed } from '../../utils'
import { throwIfNull } from 'throw-expression'

export default {
    name: 'nowplaying',
    description: 'See what is now playing.',
    voiceChannel: true,

    execute: ({ inter, player }) =>
        nowPlayingEmbed(
            inter,
            player.queues.get(throwIfNull(inter.guildId, 'guild id not cached')),
        ),
} satisfies Command
