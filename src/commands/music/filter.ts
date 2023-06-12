import { Command } from '../../types'
import { AudioFilters, QueueFilters } from 'discord-player'
import { ApplicationCommandOptionType } from 'discord.js'
import { throwIfNull } from 'throw-expression'

export default {
    name: 'filter',
    description: 'Add a filter to the currently playing song.',
    voiceChannel: true,
    options: [
        {
            name: 'filter',
            description: 'Which filter?',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: Object.keys(AudioFilters.filters)
                .map((m) => ({ name: m, value: m }))
                .splice(0, 25),
        },
    ],
    execute: async ({ inter, player }) => {
        if (!inter.isChatInputCommand()) {
            return inter.reply({ content: 'not a chat input', ephemeral: true })
        }
        const queue = player.queues.get(inter.guildId)

        if (!queue || !queue.isPlaying()) {
            return inter.reply({ content: 'Nothing is currently playing.', ephemeral: true })
        }

        const filtersEnabled = queue.filters.ffmpeg.getFiltersEnabled()
        const actualFilter = filtersEnabled[0]

        const infilter = inter.options.getString('filter')

        const filters: (keyof QueueFilters)[] = []

        filtersEnabled.forEach((x) => filters.push(x))
        queue.filters.ffmpeg.getFiltersDisabled().forEach((x) => filters.push(x))

        const filter = filters.find(
            (x) => x.toLowerCase() === throwIfNull(infilter, 'infilter was null').toLowerCase(),
        )

        if (!filter)
            return inter.reply({
                content: `That filter doesn't exist.${
                    actualFilter ? `\n\nThe currently active filter is \`${actualFilter}\`.` : ''
                }`,
                ephemeral: true,
            })

        const filtersUpdated: { [K in keyof QueueFilters]: boolean } = {}

        filtersUpdated[filter] = !filtersEnabled.includes(filter)

        await queue.filters.ffmpeg.setFilters(
            // @ts-expect-error TODO: i think the types are wrong here, surely u don't have to specify all the filter names
            filtersUpdated,
        )

        return inter.reply({
            content: `\`${filter}\` filter is now ${
                filtersEnabled.includes(filter) ? 'enabled' : 'disabled'
            }. World's funniest joke!`,
        })
    },
} satisfies Command
