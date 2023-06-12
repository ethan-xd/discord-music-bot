import { GuildQueue, Player } from 'discord-player'
import {
    ApplicationCommandOption,
    Client,
    Collection,
    CommandInteraction,
    InteractionResponse,
    Message,
    MessageComponentInteraction,
} from 'discord.js'

export interface Command {
    name: string
    description: string
    voiceChannel?: boolean
    showHelp?: boolean
    options?: ApplicationCommandOption[]
    execute: (args: {
        client: Client
        inter: CommandInteraction<'cached'>
        player: Player
        commands: Collection<string, Command>
    }) => Promise<InteractionResponse | Message<true> | void>
}

export interface CustomId {
    ffb: string
}

export type Button = (args: {
    client: Client
    inter: MessageComponentInteraction<'cached'>
    customId: CustomId
    queue: GuildQueue | null
}) => Promise<InteractionResponse>

export type CommandOrMessageComponentInteraction =
    | CommandInteraction<'cached'>
    | MessageComponentInteraction<'cached'>
