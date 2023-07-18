import { GuildQueue, Player } from 'discord-player'
import {
    ApplicationCommandOption,
    Client,
    Collection,
    CommandInteraction,
    InteractionResponse,
    Message,
    MessageComponentInteraction,
    VoiceBasedChannel,
} from 'discord.js'

export type Command<VoiceChannel extends boolean = boolean> = {
    name: string
    description: string
    showHelp?: boolean
    options?: ApplicationCommandOption[]
    execute: (args: {
        client: Client
        inter: CommandInteraction<'cached'> &
            (VoiceChannel extends true
                ? { member: { voice: { channel: VoiceBasedChannel } } }
                : unknown)
        player: Player
        commands: Collection<string, Command>
    }) => Promise<InteractionResponse | Message<true> | void>
} & (VoiceChannel extends true ? { voiceChannel: true } : { voiceChannel?: false })

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
