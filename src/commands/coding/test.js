module.exports = {
    name: 'test',
    description: 'Test if coding commands work',
    category: 'coding',
    
    async execute(message, args) {
        message.reply('🎉 Coding commands are working!');
    }
};
