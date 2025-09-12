const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'checkperms',
    description: 'Check bot permissions in current channel',
    category: 'utility',
    
    async execute(message, args) {
        const botMember = message.guild.members.me;
        const channelPermissions = message.channel.permissionsFor(botMember);
        
        const requiredPerms = [
            'ViewChannel',
            'SendMessages', 
            'ManageMessages',
            'ReadMessageHistory',
            'EmbedLinks'
        ];
        
        const embed = {
            title: '🔑 Bot Permissions Check',
            description: `Checking permissions for ${botMember.displayName}`,
            fields: [
                {
                    name: '📋 Channel Permissions',
                    value: requiredPerms.map(perm => {
                        const hasPermission = channelPermissions.has(perm);
                        return `${hasPermission ? '✅' : '❌'} ${perm}`;
                    }).join('\n'),
                    inline: false
                },
                {
                    name: '🏷️ Bot Role Position',
                    value: `Position: ${botMember.roles.highest.position}`,
                    inline: true
                },
                {
                    name: '👑 Is Admin',
                    value: channelPermissions.has('Administrator') ? 'Yes' : 'No',
                    inline: true
                }
            ],
            color: channelPermissions.has('ManageMessages') ? 0x00FF00 : 0xFF0000,
            timestamp: new Date()
        };
        
        message.reply({ embeds: [embed] });
    }
};
