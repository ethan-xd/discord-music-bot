const ms = require('ms');
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'seek',
    description: 'Seek to a time in a track.',
    voiceChannel: true,
    options: [
    {
        name: 'time',
        description: 'What time?',
        type: ApplicationCommandOptionType.String,
        required: true,
    }
    ],
    async execute({ inter }) {
        const queue = player.getQueue(inter.guildId);

        if (!queue || !queue.playing) return inter.reply({ content: `Nothing is currently playing.`, ephemeral: true });

        const timeToMS = ms(inter.options.getString('time'));

        if (timeToMS >= queue.current.durationMS || timeToMs < 0) return inter.reply({ content:`The requested time is out of bounds.`, ephemeral: true });

        await queue.seek(timeToMS);

        inter.reply({ content: `Seeked to *${ms(timeToMS, { long: true })}*`});
    },
};