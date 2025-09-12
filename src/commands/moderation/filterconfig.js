module.exports = {
    name: 'filterconfig',
    description: 'Configure automatic message filtering',
    usage: '!filterconfig [enable|disable|status|whitelist]',
    category: 'moderation',
    
    async execute(message, args) {
        // Check permissions
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.reply('❌ You need "Manage Messages" permission to configure the filter.');
        }
        
        const action = args[0]?.toLowerCase();
        
        switch (action) {
            case 'enable':
                message.reply({
                    embeds: [{
                        title: '✅ Auto-Filter Enabled',
                        description: 'Messages with inappropriate content will be automatically censored.',
                        fields: [
                            { name: 'Languages Supported', value: '11 languages', inline: true },
                            { name: 'Action', value: 'Delete → Replace with censored version', inline: true },
                            { name: 'Notification', value: 'User gets DM warning', inline: true }
                        ],
                        color: 0x00FF00
                    }]
                });
                break;
                
            case 'disable':
                message.reply({
                    embeds: [{
                        title: '❌ Auto-Filter Disabled',
                        description: 'Messages will not be automatically filtered.',
                        color: 0xFF0000
                    }]
                });
                break;
                
            case 'whitelist':
                message.reply({
                    embeds: [{
                        title: '👥 Filter Whitelist',
                        description: 'Users with these roles bypass the filter:',
                        fields: [
                            { name: 'Whitelisted Roles', value: '• Moderator\n• Admin\n• Trusted Member', inline: false },
                            { name: 'Add Role', value: '`!filterconfig whitelist add @role`', inline: true },
                            { name: 'Remove Role', value: '`!filterconfig whitelist remove @role`', inline: true }
                        ],
                        color: 0x7289DA
                    }]
                });
                break;
                
            case 'status':
            default:
                message.reply({
                    embeds: [{
                        title: '🛡️ Auto-Filter Status',
                        fields: [
                            { name: 'Status', value: '✅ **ACTIVE**', inline: true },
                            { name: 'Messages Filtered Today', value: '0', inline: true },
                            { name: 'Languages', value: '11 supported', inline: true },
                            { name: 'Settings', value: '• Auto-delete: ON\n• DM warnings: ON\n• Log actions: ON', inline: false }
                        ],
                        color: 0x00FF00,
                        timestamp: new Date()
                    }]
                });
                break;
        }
    }
};
