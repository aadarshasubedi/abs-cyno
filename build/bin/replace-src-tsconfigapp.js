#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const _filename = 'tsconfig.app.json';
const copy = require('./copy');

function replaceSrcTsConfigApp(){
    console.info('开始构建src/tsconfig.app.json扩展配置....');
    const r = __dirname.split(path.sep).slice(0, -2).join(path.sep) + path.sep;
    copy(path.join(__dirname, _filename), path.join(r, 'src', _filename));
    console.info('构建完成....');
}

module.exports = replaceSrcTsConfigApp;