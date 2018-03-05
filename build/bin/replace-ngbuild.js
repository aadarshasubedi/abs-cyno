#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const _filename = 'build.js';
const copy = require('./copy');

function replaceNgBuild(){
    console.info('开始构建@angular/cli/tasks/build扩展脚本....');
    const r = __dirname.split(path.sep).slice(0, -2).join(path.sep) + path.sep;
    const srcFile =  path.join(__dirname, _filename + '.txt');
    const desFile = path.join(r, 'node_modules/@angular/cli/tasks/', _filename);
    copy(srcFile, desFile)
    console.info('构建完成....');
}

module.exports = replaceNgBuild;