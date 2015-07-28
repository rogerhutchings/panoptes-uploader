#!/usr/bin/env node

// Parse arguments
var argv = require('./argv').get();

if (argv._.length === 0 && !argv.help) {
    console.error('Error: No command given, exiting.');
    process.exit(1);
} else if (argv._.length > 1) {
    console.error('Error: Too many commands given, exiting.');
    process.exit(1);
}

// Run command
if (argv._.length === 0 && argv.help) {
    require('./commands/help')();
} else {
    try {
        require('./commands/' + argv._[0])();
    } catch (e) {
        console.error(e)
        console.error('Error: Command not found, exiting.');
        process.exit(1);
    }
}
