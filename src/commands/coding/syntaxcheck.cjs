module.exports = {
    name: 'syntaxcheck',
    description: 'Check JavaScript syntax of provided code',
    usage: '!syntaxcheck your JS code here',
    category: 'coding',
    cooldown: 5,
    
    async execute(message, args) {
        const code = args.join(' ');
        
        if (!code || code.length < 5) {
            return message.reply({
                embeds: [{
                    title: '❌ No Code Provided',
                    description: 'Please provide JavaScript code after the command.',
                    color: 0xFF0000
                }]
            });
        }
        
        try {
            // Basic syntax check using Function constructor
            new Function(code);
            
            // If we reach here, syntax is valid
            const embed = {
                title: '✅ Syntax Check Passed',
                fields: [
                    { name: '📋 Code', value: `\`\`\`javascript\n${code.slice(0, 400)}\n\`\`\``, inline: false },
                    { name: '🎉 Result', value: 'No syntax errors detected!', inline: false },
                    { name: '📊 Length', value: `${code.length} characters`, inline: true }
                ],
                color: 0x00FF00,
                timestamp: new Date()
            };
            
            message.reply({ embeds: [embed] });
            
        } catch (error) {
            const embed = {
                title: '❌ Syntax Error Detected',
                fields: [
                    { name: '📋 Code', value: `\`\`\`javascript\n${code.slice(0, 400)}\n\`\`\``, inline: false },
                    { name: '🚫 Error', value: error.message, inline: false },
                    { name: '💡 Tip', value: 'Check for missing brackets, semicolons, or typos', inline: false }
                ],
                color: 0xFF0000,
                timestamp: new Date()
            };
            
            message.reply({ embeds: [embed] });
        }
    }
};
