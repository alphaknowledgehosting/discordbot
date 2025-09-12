const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    const eventsPath = path.join(__dirname, '..', 'events');
    
    // Create events directory if it doesn't exist
    if (!fs.existsSync(eventsPath)) {
        fs.mkdirSync(eventsPath, { recursive: true });
        console.log('📁 Created events directory');
    }
    
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
            console.log(`✅ Loaded ONCE event: ${event.name}`);
        } else {
            client.on(event.name, (...args) => event.execute(...args));
            console.log(`✅ Loaded ON event: ${event.name}`);
        }
    }
    
    console.log(`📅 Loaded ${eventFiles.length} events total`);
};
