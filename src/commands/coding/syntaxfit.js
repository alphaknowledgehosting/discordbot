module.exports = {
    name: 'syntaxfix',
    description: 'Check JavaScript syntax and provide smart fixes with suggestions',
    usage: '!syntaxfix your broken JS code here',
    category: 'coding',
    cooldown: 10,
    
    async execute(message, args) {
        const code = args.join(' ');
        
        if (!code || code.length < 5) {
            return message.reply({
                embeds: [{
                    title: '❌ No Code Provided',
                    description: 'Please provide JavaScript code for analysis and correction.',
                    fields: [
                        { name: 'Usage', value: '`!syntaxfix if (x > 0 { console.log("positive"); }`', inline: false }
                    ],
                    color: 0xFF0000
                }]
            });
        }
        
        try {
            // Try to parse the code
            new Function(code);
            
            // If successful, provide formatting and suggestions
            const formatted = formatCode(code);
            const suggestions = analyzeBestPractices(code);
            
            const embed = {
                title: '✅ Syntax Valid - Here are Improvements',
                fields: [
                    { name: '📋 Original Code', value: `\`\`\`javascript\n${code.slice(0, 300)}\n\`\`\``, inline: false },
                    { name: '✨ Formatted Code', value: `\`\`\`javascript\n${formatted.slice(0, 300)}\n\`\`\``, inline: false },
                    { name: '💡 Suggestions', value: suggestions, inline: false }
                ],
                color: 0x00FF00,
                timestamp: new Date()
            };
            
            return message.reply({ embeds: [embed] });
            
        } catch (error) {
            // Analyze the error and provide specific fixes
            const fixes = analyzeSyntaxError(error, code);
            const correctedCode = smartAutoCorrection(code, error);
            
            const embed = {
                title: '❌ Syntax Errors Found - Here are Smart Fixes',
                fields: [
                    { name: '📋 Your Code', value: `\`\`\`javascript\n${code.slice(0, 250)}\n\`\`\``, inline: false },
                    { name: '🚫 Error Details', value: `\`\`\`\n${error.message}\n\`\`\``, inline: false },
                    { name: '🔧 What\'s Wrong', value: fixes, inline: false },
                    { name: '✅ Corrected Code', value: `\`\`\`javascript\n${correctedCode.slice(0, 250)}\n\`\`\``, inline: false }
                ],
                color: 0xFF4500,
                timestamp: new Date(),
                footer: { text: 'Copy the corrected code and test it again!' }
            };
            
            message.reply({ embeds: [embed] });
        }
    }
};

// Enhanced auto-correction function
function smartAutoCorrection(code, error) {
    let corrected = code;
    const errorMessage = error.message.toLowerCase();
    
    console.log('Original code:', code);
    console.log('Error message:', errorMessage);
    
    // Fix specific patterns
    
    // 1. Missing closing parenthesis before opening brace: if (condition {
    if (errorMessage.includes('unexpected token') && code.includes('{')) {
        // Pattern: if (something { or while (something { or for (something {
        corrected = corrected.replace(/(if|while|for|function)\s*\([^)]*\{/g, (match) => {
            // Insert ) before {
            return match.replace('{', ') {');
        });
    }
    
    // 2. Missing opening parenthesis: if condition) {
    if (errorMessage.includes('unexpected token') && corrected.includes(')')) {
        corrected = corrected.replace(/(if|while|for)\s+([^(][^)]*\))/g, '$1 ($2');
    }
    
    // 3. Fix nested parentheses issues
    if (errorMessage.includes('unexpected token')) {
        // Count and balance parentheses in conditional statements
        const conditionalMatch = corrected.match(/(if|while|for)\s*\([^{]*\{/);
        if (conditionalMatch) {
            const statement = conditionalMatch[0];
            const openParens = (statement.match(/\(/g) || []).length;
            const closeParens = (statement.match(/\)/g) || []).length;
            
            if (openParens > closeParens) {
                const missing = openParens - closeParens;
                corrected = corrected.replace(statement, statement.replace('{', ')'.repeat(missing) + ' {'));
            }
        }
    }
    
    // 4. General bracket balancing
    const openParens = (corrected.match(/\(/g) || []).length;
    const closeParens = (corrected.match(/\)/g) || []).length;
    if (openParens > closeParens) {
        corrected += ')'.repeat(openParens - closeParens);
    }
    
    const openBraces = (corrected.match(/\{/g) || []).length;
    const closeBraces = (corrected.match(/\}/g) || []).length;
    if (openBraces > closeBraces) {
        corrected += '}'.repeat(openBraces - closeBraces);
    }
    
    const openBrackets = (corrected.match(/\[/g) || []).length;
    const closeBrackets = (corrected.match(/\]/g) || []).length;
    if (openBrackets > closeBrackets) {
        corrected += ']'.repeat(openBrackets - closeBrackets);
    }
    
    // 5. Fix string literals
    const quotes = (corrected.match(/"/g) || []).length;
    if (quotes % 2 !== 0) {
        corrected += '"';
    }
    
    const singleQuotes = (corrected.match(/'/g) || []).length;
    if (singleQuotes % 2 !== 0) {
        corrected += "'";
    }
    
    // 6. Add semicolon if missing
    if (!corrected.trim().endsWith(';') && !corrected.trim().endsWith('}')) {
        corrected += ';';
    }
    
    // 7. Fix common typos
    corrected = corrected
        .replace(/fucntion/g, 'function')
        .replace(/retrun/g, 'return')
        .replace(/cosole/g, 'console')
        .replace(/lenght/g, 'length')
        .replace(/udefined/g, 'undefined');
    
    console.log('Corrected code:', corrected);
    return corrected;
}

// Enhanced error analysis
function analyzeSyntaxError(error, code) {
    const errorMessage = error.message.toLowerCase();
    const fixes = [];
    
    // Specific error pattern detection
    if (errorMessage.includes('unexpected token {')) {
        if (code.match(/(if|while|for)\s*\([^)]*\{/)) {
            fixes.push('• **Missing closing parenthesis `)` before opening brace `{`**');
            fixes.push('• **Conditional statements need: `if (condition) { ... }`**');
        }
    }
    
    if (errorMessage.includes('unexpected token')) {
        if (code.includes('(') && !code.includes(')')) {
            fixes.push('• **Missing closing parenthesis `)`**');
        }
        if (code.includes('{') && !code.includes('}')) {
            fixes.push('• **Missing closing curly brace `}`**');
        }
        if (code.includes('[') && !code.includes(']')) {
            fixes.push('• **Missing closing square bracket `]`**');
        }
        if ((code.split('"').length - 1) % 2 !== 0) {
            fixes.push('• **Unclosed string literal - missing closing quote `"`**');
        }
    }
    
    if (errorMessage.includes('unexpected end of input')) {
        fixes.push('• **Code appears incomplete - missing closing brackets**');
        fixes.push('• **Check that all functions and blocks are properly closed**');
    }
    
    // Add specific guidance based on code patterns
    if (code.includes('if') && !code.includes('if (')) {
        fixes.push('• **Conditional statements need parentheses: `if (condition)`**');
    }
    
    if (fixes.length === 0) {
        fixes.push('• **Check for missing or mismatched brackets: `()`, `{}`, `[]`**');
        fixes.push('• **Verify all strings are properly quoted**');
        fixes.push('• **Ensure proper syntax for keywords**');
    }
    
    return fixes.join('\n');
}

// Helper functions (same as before)
function formatCode(code) {
    return code
        .replace(/;/g, ';\n')
        .replace(/{/g, ' {\n  ')
        .replace(/}/g, '\n}')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');
}

function analyzeBestPractices(code) {
    const suggestions = [];
    
    if (code.includes('var ')) {
        suggestions.push('• Consider using `const` or `let` instead of `var`');
    }
    
    if (code.includes('==') && !code.includes('===')) {
        suggestions.push('• Use strict equality `===` instead of `==`');
    }
    
    if (!code.includes(';') && code.length > 20) {
        suggestions.push('• Consider adding semicolons for better clarity');
    }
    
    return suggestions.length > 0 ? suggestions.join('\n') : '• Code follows good practices! ✨';
}
