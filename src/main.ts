import { createEvents } from './events'
import { load } from './loader'
import { config, loadConfig } from '@app-config/main'
import { Player } from 'discord-player'
import { Client, GatewayIntentBits } from 'discord.js'

;(async () => {
    await loadConfig()
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.MessageContent,
        ],
        allowedMentions: { parse: ['roles', 'users'] },
    })
    const player = new Player(client, config.opt.discordPlayer)
    await player.extractors.loadDefault()

    load(client, player)
    createEvents(player)

    await client.login(config.app.token)
})()
