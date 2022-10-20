const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'filter',
    description: 'Add a filter to the currently playing song.',
    voiceChannel: true,
    options: [
        {
            name: 'filter',
            description: 'Which filter?',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [...Object.keys(require("discord-player").AudioFilters.filters).map(m => Object({ name: m, value: m })).splice(0, 25)],
        }
    ],


    async execute({ inter, client }) {
        const queue = player.getQueue(inter.guildId);

        if (!queue || !queue.playing) return inter.reply({ content: `Nothing is currently playing.`, ephemeral: true });

        const actualFilter = queue.getFiltersEnabled()[0];

        const infilter = inter.options.getString('filter');


        const filters = [];

        queue.getFiltersEnabled().map(x => filters.push(x));
        queue.getFiltersDisabled().map(x => filters.push(x));

        const filter = filters.find((x) => x.toLowerCase() === infilter.toLowerCase());

        if (!filter) return inter.reply({ content: `That filter doesn't exist.${actualFilter ? `\n\nThe currently active filter is \`${actualFilter}\`.` : ''}`, ephemeral: true });

        const filtersUpdated = {};

        filtersUpdated[filter] = queue.getFiltersEnabled().includes(filter) ? false : true;

        await queue.setFilters(filtersUpdated);

        inter.reply({ content: `\`${filter}\` filter is now **${queue.getFiltersEnabled().includes(filter) ? 'enabled' : 'disabled'}. World's funniest joke!` });
    },
};