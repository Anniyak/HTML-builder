const { stdin, stdout, exit } = process;
const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');
const ReadStream = fs.createReadStream(path.resolve(__dirname, 'text.txt'), 'utf-8');

let data = '';

ReadStream.on('data', chunk => data += chunk);
ReadStream.on('end', () => console.log(data));