// AUTO GENERATED CODE
// Run app-config with 'generate' command to regenerate this file
import '@app-config/main'

export interface Config {
    app: App
    opt: Opt
}

export interface App {
    playing: string
    token: string
    global: boolean
    guild?: string
}

export interface Opt {
    defaultvolume: number
    discordPlayer: DiscordPlayer
    DJ: Dj
    leaveOnEnd: boolean
    loopMessage: boolean
    maxVol: number
    spotifyBridge: boolean
}

export interface Dj {
    commands: string[]
    enabled: boolean
    roleName: string
}

export interface DiscordPlayer {
    ytdlOptions: YtdlOptions
}

export interface YtdlOptions {
    highWaterMark: number
    quality: string
}

// augment the default export from app-config
declare module '@app-config/main' {
    export interface ExportedConfig extends Config {}
}
