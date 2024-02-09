"use strict";

let requestObj = {};
const configsObj = require('./configs').configs;

global.request = function request(req) {
    if (req != undefined) {
        requestObj = req;
    }

    return requestObj;
}

global.configs = function configs() {
    return configsObj;
}