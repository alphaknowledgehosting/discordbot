module.exports = {
    name: 'testdelete',
    description: 'Test if bot can delete messages',
    category: 'utility',
    
    async execute(message, args) {
        try {
            // Send a test message
            const testMessage = await message.channel.send('🧪 This is a test message that will be deleted in 3 seconds...');
            
            // Delete it after 3 seconds
            setTimeout(async () => {
                try {
                    await testMessage.delete();
                    message.channel.send('✅ Bot can successfully delete messages!');
                } catch (error) {
                    message.channel.send(`❌ Failed to delete test message: ${error.message}`);
                }
            }, 3000);
            
        } catch (error) {
            message.reply(`❌ Error creating test message: ${error.message}`);
        }
    }
};
