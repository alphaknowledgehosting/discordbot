module.exports = {
    name: 'qr',
    description: 'Quick review - just type the code after the command',
    usage: '!qr your code here',
    category: 'coding',
    
    async execute(message, args) {
        const code = args.join(' ');
        
        if (!code || code.length < 5) {
            return message.reply('❌ Please provide code after the command: `!qr console.log("hello")`');
        }

        const embed = {
            title: '🤖 Quick Code Review',
            fields: [
                { name: '📋 Code', value: `\`\`\`javascript\n${code.slice(0, 500)}\n\`\`\``, inline: false },
                { name: '⭐ Analysis', value: '✅ Code extracted successfully! Basic review complete.', inline: false },
                { name: '💡 Tip', value: 'This is a simple version. Full AI review coming soon!', inline: false }
            ],
            color: 0x00FF00,
            timestamp: new Date()
        };

        message.reply({ embeds: [embed] });
    }
};
