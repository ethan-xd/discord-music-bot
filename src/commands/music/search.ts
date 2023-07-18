import { Command } from '../../types'
import { config } from '@app-config/main'
import { QueryType } from 'discord-player'
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js'
import { throwIfNull, throwIfUndefined } from 'throw-expression'

export default {
    name: 'search',
    description: 'Search a track',
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description: 'What search query?',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    execute: async ({ inter, player }) => {
        if (!inter.isChatInputCommand()) {
            return inter.reply({ content: 'not a chat input', ephemeral: true })
        }
        const song = throwIfNull(inter.options.getString('song'), 'song is null')

        const res = await player.search(song, {
            requestedBy: inter.user,
            searchEngine: QueryType.AUTO,
        })

        if (!res.tracks.length)
            return inter.reply({ content: 'Nothing found for that search.', ephemeral: true })

        const queue = player.queues.create(inter.guild, {
            metadata: throwIfNull(inter.channel, 'channel was null when creating queue'),
            leaveOnEnd: config.opt.leaveOnEnd,
        })
        const maxTracks = res.tracks.slice(0, 10)

        const embed = new EmbedBuilder()
            .setColor('#ff9900')
            .setTitle(`Results for ${song}`)
            .setDescription(
                `${maxTracks
                    .map((track, i) => `**${i + 1}** - ${track.title} | ${track.author}`)
                    .join('\n')}\n\nSend a message between **1** and **${
                    maxTracks.length
                }** or **cancel** within 15 seconds.`,
            )
            .setTimestamp()

        await inter.reply({ embeds: [embed] })

        const collector = throwIfNull(inter.channel, 'channel was null').createMessageCollector({
            time: 15000,
            max: 1,
            filter: (m) => m.author.id === inter.member.id,
        })
        collector.on('collect', async (query) => {
            if (query.content.toLowerCase() === 'cancel') {
                await inter.followUp({ content: 'Search cancelled.', ephemeral: true })
                return collector.stop()
            }

            const value = parseInt(query.content)
            if (!value || value <= 0 || value > maxTracks.length) {
                await inter.followUp({
                    content: `Send a message between **1** and **${maxTracks.length}** or **cancel**.`,
                    ephemeral: true,
                })
                return
            }

            collector.stop()

            try {
                if (!queue.connection) await queue.connect(inter.member.voice.channel)
            } catch {
                player.queues.delete(inter.guildId)
                await inter.followUp({ content: "Can't join the voice channel.", ephemeral: true })
                return
            }

            await inter.followUp(`Queued *${res.tracks[0]?.title ?? '[unknown track]'}*.`)

            queue.addTrack(
                throwIfUndefined(
                    res.tracks[Number(query.content) - 1],
                    'ummm uhhh track not found?',
                ),
            )

            if (!queue.isPlaying()) await queue.node.play()
        })

        collector.on('end', async (_, reason) => {
            if (reason === 'time')
                await inter.followUp({ content: 'Search timed out.', ephemeral: true })
        })
        return
    },
} satisfies Command<true>
