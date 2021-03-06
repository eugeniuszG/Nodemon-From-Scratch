#!/usr/bin/env node

const program = require('caporal');
const chokidar = require('chokidar');
const debounce = require('lodash.debounce');
const fs = require('fs');
const {spawn} = require('child_process');



program
    .version('1.0.0')
    .argument('[filename]', 'Name of a file to execute')
    .action(async ({filename}) =>{

        const name = filename || "index.js";

        try {
            await fs.promises.access(name);
        } catch (err) {
            throw new Error(`Cant find this file ${name}`);
        }
        

        const start = debounce(() => {
            spawn('node', [name], {stdio: 'inherit'});
        }, 100);
        
        chokidar
            .watch('.')
            .on('add', start)
            .on('change', start)
            .on('unlink', start);
        
    });

program.parse(process.argv);




