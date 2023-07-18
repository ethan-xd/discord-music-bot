import { Button, Command, CustomId } from './types'
import { config } from '@app-config/main'
import { HasDefaultExport } from '@detachhead/ts-helpers/dist/types/misc'
import { Player } from 'discord-player'
import { Client, Collection } from 'discord.js'
import { readdirSync } from 'fs'
import { throwIfUndefined } from 'throw-expression'

const commands = new Collection<string, Command>()
const commandsArray: Command[] = []

export const load = (client: Client, player: Player) => {
    console.log('Loading events...')

    client.on('interactionCreate', async (inter) => {
        if (!inter.inCachedGuild()) {
            const errorMessage = "guild wasn't cached. hopefully this never happens"
            if (inter.isCommand()) {
                await inter.reply({
                    content: errorMessage,
                    ephemeral: true,
                })
                return
            } else {
                throw new Error(errorMessage)
            }
        }
        if (inter.isCommand()) {
            const DJ = config.opt.DJ
            const command = commands.get(inter.commandName)

            if (!command) {
                await inter.reply({ content: 'Something went wrong.', ephemeral: true })
                commands.delete(inter.commandName)
                return
            }
            if (
                DJ.enabled &&
                DJ.commands.includes(inter.commandName) &&
                // @ts-expect-error TODO: figure out how to do this without accessing a private method
                (!inter.member._roles as (string | undefined)[]).includes(
                    inter.guild.roles.cache.find((x) => x.name === DJ.roleName)?.id,
                )
            ) {
                await inter.reply({
                    content: `You must have the \`${DJ.roleName}\` role to use this command.`,
                    ephemeral: true,
                })
                return
            }
            if (command.voiceChannel) {
                if (!inter.member.voice.channel) {
                    await inter.reply({
                        content: 'You must be in a voice channel.',
                        ephemeral: true,
                    })
                    return
                }
                if (
                    !inter.guild.members.me ||
                    (inter.guild.members.me.voice.channel &&
                        inter.member.voice.channel.id !== inter.guild.members.me.voice.channel.id)
                ) {
                    await inter.reply({
                        content: 'You must be in the same voice channel.',
                        ephemeral: true,
                    })
                    return
                }
            }
            await command.execute({ inter, client, player, commands })
        }
        if (inter.isMessageComponent()) {
            const customId = JSON.parse(inter.customId) as CustomId
            const file_of_button = customId.ffb
            const queue = player.nodes.get(inter.guildId)
            if (file_of_button) {
                delete require.cache[require.resolve(`./buttons/${file_of_button}.js`)]
                const button = (
                    (await import(`./buttons/${file_of_button}.js`)) as HasDefaultExport<Button>
                ).default
                if (!inter.member.voice.channel)
                    await inter.reply({
                        content: 'You must be in a voice channel.',
                        ephemeral: true,
                    })
                if (
                    !inter.guild.members.me ||
                    (inter.guild.members.me.voice.channel &&
                        inter.member.voice.channel?.id !== inter.guild.members.me.voice.channel.id)
                )
                    await inter.reply({
                        content: 'You must be in the same voice channel.',
                        ephemeral: true,
                    })
                await button({ client, inter, customId, queue })
            }
        }
    })
    client.on('ready', async (readyClient) => {
        if (config.app.global) await readyClient.application.commands.set(commandsArray)
        else
            await throwIfUndefined(
                readyClient.guilds.cache.get(
                    // @ts-expect-error https://github.com/launchcodedev/app-config/issues/224
                    config.app.guild,
                ),
            ).commands.set(commandsArray)
        console.log(
            `Logged to the client ${readyClient.user.username}\n-> Ready on ${readyClient.guilds.cache.size} servers for a total of ${readyClient.users.cache.size} users`,
        )
        readyClient.user.setActivity(config.app.playing)
    })

    console.log('Loading commands...')

    readdirSync(`${__dirname}/commands/`).forEach((dirs) => {
        const commandFileNames = readdirSync(`${__dirname}/commands/${dirs}`).filter((files) =>
            files.endsWith('.js'),
        )

        for (const file of commandFileNames) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires -- i hate dynamic imports
            const command = (require(`./commands/${dirs}/${file}`) as HasDefaultExport<Command>)
                .default
            if (command.name && command.description) {
                commandsArray.push(command)
                console.log(`-> [Loaded Command] ${command.name.toLowerCase()}`)
                commands.set(command.name.toLowerCase(), command)
                delete require.cache[require.resolve(`./commands/${dirs}/${file}`)]
            } else console.log(`[Failed Command]  ${command.name.toLowerCase()}`)
        }
    })
}
