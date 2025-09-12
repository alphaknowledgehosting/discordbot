module.exports = {
    name: 'simple',
    description: 'Simple code review',
    category: 'coding',
    
    async execute(message, args) {
        const code = args.join(' ');
        
        if (!code) {
            return message.reply('❌ Please provide code: `!simple console.log("hello")`');
        }

        const embed = {
            title: '🤖 Simple Code Review',
            description: 'Code analysis complete!',
            fields: [
                { name: '📋 Your Code', value: `\`\`\`javascript\n${code}\n\`\`\``, inline: false },
                { name: '✅ Status', value: 'Code received and processed successfully!', inline: false }
            ],
            color: 0x00FF00,
            timestamp: new Date()
        };

        message.reply({ embeds: [embed] });
    }
};
