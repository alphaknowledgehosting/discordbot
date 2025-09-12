module.exports = {
    name: 'help',
    description: 'Show all available commands',
    category: 'utility',
    
    async execute(message, args) {
        const { commands } = message.client;
        
        const embed = {
            title: '🤖 Aki Bot Commands',
            description: 'Here are all available commands:',
            fields: [],
            color: 0x7289DA,
            timestamp: new Date()
        };

        // Group commands by category
        const categories = {};
        commands.forEach(command => {
            const category = command.category || 'general';
            if (!categories[category]) categories[category] = [];
            categories[category].push(command);
        });

        // Add fields for each category
        Object.keys(categories).forEach(category => {
            const commandList = categories[category]
                .map(cmd => `\`!${cmd.name}\` - ${cmd.description}`)
                .join('\n');
            
            embed.fields.push({
                name: `📁 ${category.charAt(0).toUpperCase() + category.slice(1)}`,
                value: commandList,
                inline: false
            });
        });

        message.reply({ embeds: [embed] });
    }
};
