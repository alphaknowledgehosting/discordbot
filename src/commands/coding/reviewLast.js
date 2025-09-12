module.exports = {
    name: 'reviewlast',
    description: 'Review the last code block posted in this channel',
    category: 'coding',
    
    async execute(message, args) {
        try {
            // Fetch recent messages to find code blocks
            const messages = await message.channel.messages.fetch({ limit: 20 });
            
            for (const msg of messages.values()) {
                if (msg.author.bot || msg.id === message.id) continue;
                
                const codeBlockRegex = /``````/;
                const match = msg.content.match(codeBlockRegex);
                
                if (match) {
                    const language = match[1] || 'unknown';
                    const code = match[2].trim();
                    
                    if (code && code.length >= 5) {
                        const embed = {
                            title: '🤖 Found Code Block!',
                            description: `Found code from ${msg.author.username}`,
                            fields: [
                                { name: '📝 Language', value: language === 'unknown' ? 'Not specified' : language, inline: true },
                                { name: '📊 Lines', value: code.split('\n').length.toString(), inline: true },
                                { name: '📋 Code', value: `\`\`\`${language}\n${code.slice(0, 400)}\n\`\`\``, inline: false },
                                { name: '✅ Status', value: 'Code found and extracted successfully!', inline: false }
                            ],
                            color: 0x00FF00,
                            timestamp: new Date()
                        };
                        
                        return message.reply({ embeds: [embed] });
                    }
                }
            }
            
            message.reply({
                embeds: [{
                    title: '❌ No Code Found',
                    description: 'No recent code blocks found in this channel.',
                    color: 0xFF0000
                }]
            });

        } catch (error) {
            console.error('Error in reviewlast command:', error);
            message.reply('❌ An error occurred while searching for code blocks.');
        }
    }
};
