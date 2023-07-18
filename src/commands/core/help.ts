import { Command } from '../../types'
import { EmbedBuilder } from 'discord.js'
import { throwIfNull } from 'throw-expression'

export default {
    name: 'help',
    description: 'View help.',
    showHelp: false,

    execute: ({ client, inter, commands }) => {
        commands = commands.filter((x) => x.showHelp !== false)
        const user = throwIfNull(client.user, 'user was null')
        const embed = new EmbedBuilder()
            .setColor('#ff9900')
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ size: 1024 }),
            })
            .addFields([
                { name: 'All commands', value: commands.map((x) => `\`${x.name}\``).join(' | ') },
            ])

        return inter.reply({ embeds: [embed] })
    },
} satisfies Command
