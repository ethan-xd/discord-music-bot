import { buildButtons } from './utils'
import { config } from '@app-config/main'
import { GuildQueue, GuildQueueEvents, Player, PlayerEventsEmitter } from 'discord-player'
import { EmbedBuilder, PartialTextBasedChannelFields, TextChannel } from 'discord.js'

type Send = PartialTextBasedChannelFields['send']

const send = (queue: GuildQueue<TextChannel>, ...args: Parameters<Send>): ReturnType<Send> =>
    queue.metadata.send(...args)

export const createEvents = (player: Player) => {
    const events = player.events as PlayerEventsEmitter<GuildQueueEvents<TextChannel>>
    events.on('error', (_queue, error) => {
        console.log(JSON.stringify(error))
    })

    events.on('playerError', (_queue, error) => {
        console.log(JSON.stringify(error))
    })

    events.on('playerStart', (queue, track) => {
        if (!config.opt.loopMessage && queue.repeatMode !== 0) return
        const embed = new EmbedBuilder()
            .setColor('#ff9900')
            .setTitle(track.title)
            .setDescription('Now playing <a:music:1032596852585025596>')
            .setThumbnail(track.thumbnail)
            .setFields(
                {
                    name: 'Requested by',
                    value: track.requestedBy?.toString() ?? '[requester unknown]',
                    inline: true,
                },
                { name: 'Duration', value: track.duration, inline: true },
            )
        return send(queue, {
            embeds: [embed],
            components: [buildButtons()],
        })
    })

    events.on('audioTrackAdd', (_queue, _track) => {
        // send(queue, `Queued ${track.title}.`);
    })

    events.on('disconnect', (queue) => send(queue, 'Queue cleared.'))

    events.on('emptyChannel', (queue) => send(queue, 'Goodbye losers!'))

    events.on('emptyQueue', (queue) => send(queue, 'Queue is finished.'))

    events.on('audioTracksAdd', (queue, _tracks) => send(queue, 'Queued the playlist.'))
}
