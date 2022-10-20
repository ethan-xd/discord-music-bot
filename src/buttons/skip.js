module.exports = async ({  inter, queue }) => { 
    if (!queue || !queue.playing) return inter.reply({ content: `Nothing is currently playing.`, ephemeral: true });
    
    const success = queue.skip();

    if (success) {
        return inter.reply({ content: `Skipped *${queue.current.title}*.` });
    } else {
        return inter.reply({ content: `Something went wrong.`, ephemeral: true  });
    }
}