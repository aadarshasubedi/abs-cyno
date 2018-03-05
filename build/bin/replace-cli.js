#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const _filename = '.angular-cli.json';
const _httpProxyfilename = 'http-proxy.js';
const copy = require('./copy');

function replaceNgCli(){
    console.info('开始构建.angular-cli.json扩展配置....');
    const r = __dirname.split(path.sep).slice(0, -2).join(path.sep) + path.sep;
    copy(path.join(__dirname, _filename), path.join(r, _filename));
    copy(path.join(__dirname, _httpProxyfilename + '.txt'), path.join(r, _httpProxyfilename));
    console.info('构建完成....');
}

module.exports = replaceNgCli;