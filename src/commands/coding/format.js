module.exports = {
    name: 'format',
    description: 'Format and beautify JavaScript code',
    usage: '!format your messy code here',
    category: 'coding',
    
    async execute(message, args) {
        const code = args.join(' ');
        
        if (!code) {
            return message.reply('❌ Please provide code to format: `!format const x=5;if(x>0){console.log("positive");}`');
        }
        
        // Basic formatting (simple version)
        let formatted = code
            .replace(/;/g, ';\n')
            .replace(/{/g, ' {\n  ')
            .replace(/}/g, '\n}')
            .replace(/,/g, ',\n  ')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join('\n');
        
        const embed = {
            title: '🎨 Code Formatter',
            fields: [
                { name: '📥 Original', value: `\`\`\`javascript\n${code.slice(0, 300)}\n\`\`\``, inline: false },
                { name: '📤 Formatted', value: `\`\`\`javascript\n${formatted.slice(0, 300)}\n\`\`\``, inline: false },
                { name: '📊 Stats', value: `Original: ${code.length} chars\nFormatted: ${formatted.length} chars`, inline: true }
            ],
            color: 0x7289DA,
            timestamp: new Date()
        };
        
        message.reply({ embeds: [embed] });
    }
};
