import { Command } from '../../types'
import { ApplicationCommandOptionType } from 'discord.js'

export default {
    name: 'play',
    description: 'Add a track to the queue.',
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description: 'The song name or URL.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    execute: async ({ inter, player }) => {
        const channel = inter.channel
        if (!channel) return inter.reply('You are not connected to a voice channel!')
        if (!('bitrate' in channel)) {
            return inter.reply('non-voice channel detected')
        }
        if (!inter.isChatInputCommand()) {
            return inter.reply({ content: 'not a chat input', ephemeral: true })
        }
        const query = inter.options.getString('song', true)

        await inter.deferReply()

        try {
            const { track } = await player.play(channel, query, {
                requestedBy: inter.user,
                nodeOptions: {
                    metadata: {
                        channel: inter.channel,
                        client: inter.guild.members.me,
                        requestedBy: inter.user,
                        asdf: 1,
                    },
                },
            })
            return await inter.followUp(`**${track.title}** enqueued!`)
        } catch (e) {
            return inter.followUp(`Something went wrong: ${String(e)}`)
        }
    },
} satisfies Command
