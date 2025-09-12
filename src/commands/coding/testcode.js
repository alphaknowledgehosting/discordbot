module.exports = {
    name: 'testcode',
    description: 'Test with predefined code samples',
    usage: '!testcode [valid|invalid|random]',
    category: 'coding',
    
    async execute(message, args) {
        const type = args[0] || 'random';
        
        const validSamples = [
            'function greet(name) { return `Hello, ${name}!`; }',
            'const arr = [1,2,3]; const doubled = arr.map(x => x * 2);',
            'class Calculator { constructor() { this.result = 0; } }',
            'async function fetchData() { return await fetch("api"); }'
        ];
        
        const invalidSamples = [
            'function broken() { console.log("missing bracket";',
            'const x = 5; const y = 10; console.log(x +* y);',
            'function test() { return result; // undefined variable',
            'const obj = { name: "test", getValue: function() { return this.; } }'
        ];
        
        let selectedCode, isValid, description;
        
        switch(type.toLowerCase()) {
            case 'valid':
                selectedCode = validSamples[Math.floor(Math.random() * validSamples.length)];
                isValid = true;
                description = 'Testing with **valid** code sample';
                break;
            case 'invalid':
                selectedCode = invalidSamples[Math.floor(Math.random() * invalidSamples.length)];
                isValid = false;
                description = 'Testing with **invalid** code sample';
                break;
            default:
                const allSamples = [...validSamples, ...invalidSamples];
                selectedCode = allSamples[Math.floor(Math.random() * allSamples.length)];
                isValid = validSamples.includes(selectedCode);
                description = 'Testing with **random** code sample';
        }
        
        const embed = {
            title: '🧪 Code Test Sample',
            description: description,
            fields: [
                { name: '📋 Sample Code', value: `\`\`\`javascript\n${selectedCode}\n\`\`\``, inline: false },
                { name: '🔍 Expected Result', value: isValid ? '✅ Should pass syntax check' : '❌ Should fail syntax check', inline: false },
                { name: '💡 Next Step', value: `Try: \`!syntaxcheck ${selectedCode}\``, inline: false }
            ],
            color: isValid ? 0x00FF00 : 0xFF0000,
            timestamp: new Date()
        };
        
        message.reply({ embeds: [embed] });
    }
};
