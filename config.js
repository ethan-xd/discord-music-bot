module.exports = {
    app: {
        token: 'MTAzMjU4ODY2MzM5MTAxMDkwNw.GLqLo9.bI9qBGUjVzohpj0rkd9uRM2ZJ1PUsZBV3lPVWA',
        playing: '',
        global: true,
        guild: 'XXX'
    },

    opt: {
        DJ: {
            enabled: false,
            roleName: '',
            commands: []
        },
        maxVol: 100,
        leaveOnEnd: true,
        loopMessage: false,
        spotifyBridge: true,
        defaultvolume: 100,
        discordPlayer: {
            ytdlOptions: {
                quality: 'highestaudio',
                highWaterMark: 1 << 25
            }
        }
    }
};
