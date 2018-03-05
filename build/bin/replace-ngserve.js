#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const _filename = 'serve.js';
const copy = require('./copy');

function replaceNgServe(){
    console.info('开始构建@angular/cli/tasks/serve扩展脚本....');
    const r = __dirname.split(path.sep).slice(0, -2).join(path.sep) + path.sep;
    const srcFile =  path.join(__dirname, 'serve.js.txt');
    const desFile = path.join(r, 'node_modules/@angular/cli/tasks/', _filename);
    copy(srcFile, desFile)
    console.info('构建完成....');
}

module.exports = replaceNgServe;