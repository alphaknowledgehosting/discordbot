module.exports = {
    name: 'testfilter',
    description: 'Test the word filter with a specific message',
    usage: '!testfilter your test message here',
    category: 'moderation',
    
    async execute(message, args) {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.reply('❌ You need "Manage Messages" permission to test the filter.');
        }
        
        const testText = args.join(' ');
        
        if (!testText) {
            return message.reply('❌ Please provide text to test: `!testfilter stupid message`');
        }
        
        // Use the same filter function from the event
        const filterResult = filterInappropriateContent(testText);
        
        const embed = {
            title: '🧪 Filter Test Results',
            fields: [
                { name: '📝 Test Text', value: `\`${testText}\``, inline: false },
                { name: '🔍 Detection Status', value: filterResult.hasBadWords ? '🚫 **FLAGGED**' : '✅ **CLEAN**', inline: true },
                { name: '📊 Words Found', value: filterResult.flaggedCount.toString(), inline: true },
                { name: '⭐ Censored Result', value: `\`${filterResult.censoredText}\``, inline: false }
            ],
            color: filterResult.hasBadWords ? 0xFF0000 : 0x00FF00,
            timestamp: new Date()
        };
        
        if (filterResult.flaggedWords.length > 0) {
            embed.fields.push({
                name: '🚫 Flagged Words',
                value: filterResult.flaggedWords.map(w => `\`${w}\``).join(', '),
                inline: false
            });
        }
        
        message.reply({ embeds: [embed] });
    }
};

// Copy the same filtering functions here for testing
function filterInappropriateContent(text) {
    // Same function as above - copy it here
    const inappropriateWords = {
        english: ['damn', 'hell', 'crap', 'stupid', 'idiot', 'moron', 'jerk', 'loser', 'dumb', 'fool']
    };
    
    let censoredText = text;
    const flaggedWords = [];
    let hasBadWords = false;
    const textLower = text.toLowerCase();
    
    Object.keys(inappropriateWords).forEach(language => {
        inappropriateWords[language].forEach(word => {
            const wordLower = word.toLowerCase();
            const wholeWordRegex = new RegExp(`\\b${escapeRegExp(wordLower)}\\b`, 'i');
            const containsWord = textLower.includes(wordLower);
            
            if (wholeWordRegex.test(text) || containsWord) {
                hasBadWords = true;
                if (!flaggedWords.includes(word)) {
                    flaggedWords.push(word);
                }
                const globalRegex = new RegExp(escapeRegExp(word), 'gi');
                censoredText = censoredText.replace(globalRegex, '*'.repeat(word.length));
            }
        });
    });
    
    return {
        censoredText,
        hasBadWords,
        flaggedWords,
        flaggedCount: flaggedWords.length
    };
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
