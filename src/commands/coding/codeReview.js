const axios = require('axios');

module.exports = {
    name: 'review',
    description: 'Get AI-powered code review and suggestions',
    usage: '!review ``````',
    category: 'coding',
    cooldown: 10,
    
    async execute(message, args) {
        // Debug: Let's see the raw message content
        console.log('DEBUG - Raw message content:', JSON.stringify(message.content));
        console.log('DEBUG - Message content length:', message.content.length);
        
        // Try multiple regex patterns
        const patterns = [
            /``````/,  // Original pattern
            /``````/s,      // Alternative pattern with \s
            /``````/,     // More flexible pattern
            /``````/,         // Capture everything before newline
            /``````/                 // Most basic pattern
        ];
        
        let match = null;
        let patternUsed = -1;
        
        for (let i = 0; i < patterns.length; i++) {
            match = message.content.match(patterns[i]);
            if (match) {
                patternUsed = i;
                console.log(`DEBUG - Pattern ${i} matched:`, match);
                break;
            }
        }
        
        if (!match) {
            // Show debug info
            const debugEmbed = {
                title: '🐛 Debug Info - No Code Block Found',
                fields: [
                    { name: 'Message Length', value: message.content.length.toString(), inline: true },
                    { name: 'Contains ``````') ? 'Yes' : 'No', inline: true },
                    { name: 'Raw Content', value: `\`\`\`\n${message.content.slice(0, 500)}\n\`\`\``, inline: false }
                ],
                color: 0xFF0000,
                footer: { text: 'Debug mode - checking message format' }
            };
            
            return message.reply({ embeds: [debugEmbed] });
        }

        // Extract code based on pattern used
        let language, code;
        
        switch (patternUsed) {
            case 0:
            case 2:
                language = match[1] || 'unknown';
                code = match[2].trim();
                break;
            case 1:
                language = match[1] || 'unknown';
                code = match[2].trim();
                break;
            case 3:
                language = match[1] || 'unknown';
                code = match[2].trim();
                break;
            case 4:
                // Basic pattern - try to split language and code
                const content = match[1].trim();
                const lines = content.split('\n');
                if (lines.length > 1 && lines[0].length < 20 && !lines[0].includes(' ')) {
                    language = lines[0];
                    code = lines.slice(1).join('\n').trim();
                } else {
                    language = 'unknown';
                    code = content;
                }
                break;
        }

        console.log(`DEBUG - Extracted language: "${language}", code length: ${code.length}`);

        if (!code || code.length < 5) {
            return message.reply({
                embeds: [{
                    title: '❌ Code Too Short',
                    description: `Extracted code: \`${code}\`\nPlease provide meaningful code for review.`,
                    color: 0xFF0000
                }]
            });
        }

        // For now, let's just return a mock review to test extraction
        const embed = {
            title: '🤖 AI Code Review (Debug Mode)',
            fields: [
                { name: '🔧 Pattern Used', value: `Pattern ${patternUsed}`, inline: true },
                { name: '📝 Language', value: language === 'unknown' ? 'Not specified' : language, inline: true },
                { name: '📊 Lines of Code', value: code.split('\n').length.toString(), inline: true },
                { name: '📋 Extracted Code', value: `\`\`\`${language}\n${code.slice(0, 200)}${code.length > 200 ? '...' : ''}\n\`\`\``, inline: false },
                { name: '⭐ Status', value: 'Code extraction successful! AI review temporarily disabled for debugging.', inline: false }
            ],
            color: 0x00FF00,
            timestamp: new Date()
        };

        await message.reply({ embeds: [embed] });
    }
};
