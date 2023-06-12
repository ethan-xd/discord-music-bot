import { CommandOrMessageComponentInteraction } from './types'
import { GuildQueue } from 'discord-player'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js'
import { throwIfNull } from 'throw-expression'

export const methods = ['disabled', 'track', 'queue', 'autoplay'] as const

export const nowPlayingEmbed = (
    inter: CommandOrMessageComponentInteraction,
    queue: GuildQueue | null,
) => {
    if (!queue) {
        return inter.reply({ content: 'Nothing is currently playing.', ephemeral: true })
    }
    const track = throwIfNull(
        queue.currentTrack,
        'currentTrack was null (should have been caught by the queue check)',
    )
    const progress = queue.node.createProgressBar()
    const embed = new EmbedBuilder()
        .setTitle(track.title)
        .setThumbnail(track.thumbnail)
        .setURL(track.url)
        .setDescription(progress ?? '[progress unknown]')
        .setFields(
            {
                name: 'Requested by',
                value: track.requestedBy?.toString() ?? '[requester unknown',
                inline: true,
            },
            { name: 'Loop', value: methods[queue.repeatMode], inline: true },
        )
        .setColor('#ff9900')
    return inter.reply({ embeds: [embed], components: [buildButtons()] })
}

export const buildButtons = () => {
    const back = new ButtonBuilder()
        .setLabel('⏮ Back')
        .setCustomId(JSON.stringify({ ffb: 'back' }))
        .setStyle(ButtonStyle.Primary)

    const skip = new ButtonBuilder()
        .setLabel('Next ⏭')
        .setCustomId(JSON.stringify({ ffb: 'skip' }))
        .setStyle(ButtonStyle.Primary)

    const resumepause = new ButtonBuilder()
        .setLabel('Play/Pause')
        .setCustomId(JSON.stringify({ ffb: 'resume&pause' }))
        .setStyle(ButtonStyle.Success)

    const loop = new ButtonBuilder()
        .setLabel('Loop')
        .setCustomId(JSON.stringify({ ffb: 'loop' }))
        .setStyle(ButtonStyle.Secondary)

    const queuebutton = new ButtonBuilder()
        .setLabel('Queue')
        .setCustomId(JSON.stringify({ ffb: 'queue' }))
        .setStyle(ButtonStyle.Secondary)

    return new ActionRowBuilder<ButtonBuilder>().addComponents(
        back,
        queuebutton,
        resumepause,
        loop,
        skip,
    )
}

export const queueEmbed = (
    inter: CommandOrMessageComponentInteraction,
    queue: GuildQueue | null,
) => {
    if (!queue) return inter.reply({ content: 'Nothing is currently playing.', ephemeral: true })

    if (!queue.currentTrack)
        return inter.reply({ content: 'There is nothing in the queue.', ephemeral: true })

    const songs = queue.size

    const nextSongs = songs > 5 ? `\n\n...and **${songs - 5}** more track(s).` : ''

    const tracks = queue.tracks.map(
        (track, i) =>
            `**${i + 1}** - *${track.title}* requested by ${
                track.requestedBy?.toString() ?? '[unknown requester]'
            }.`,
    )

    const embed = new EmbedBuilder()
        .setColor('#ff9900')
        .setTitle('Queue')
        .setDescription(
            `Now playing: *${queue.currentTrack.title}*\n\n${tracks
                .slice(0, 5)
                .join('\n')}${nextSongs}`,
        )

    return inter.reply({ embeds: [embed] })
}

export const skipEmbed = (
    inter: CommandOrMessageComponentInteraction,
    queue: GuildQueue | null,
) => {
    if (!queue || !queue.isPlaying())
        return inter.reply({ content: 'Nothing is currently playing.', ephemeral: true })

    const success = queue.node.skip()

    if (success) {
        return inter.reply({ content: `Skipped *${throwIfNull(queue.currentTrack).title}*.` })
    } else {
        return inter.reply({ content: 'Something went wrong.', ephemeral: true })
    }
}
