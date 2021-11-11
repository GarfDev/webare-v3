"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.webareClient = void 0;

var _discord = require("discord.js");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class webareClient extends _discord.Client {
  constructor(options) {
    super(options);

    _defineProperty(this, "commands", void 0);

    this.commands = new _discord.Collection();
  }

}

exports.webareClient = webareClient;