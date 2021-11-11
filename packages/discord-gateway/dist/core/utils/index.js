"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getStaticPath = require("./getStaticPath");

Object.keys(_getStaticPath).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _getStaticPath[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _getStaticPath[key];
    }
  });
});

var _getUniqueId = require("./getUniqueId");

Object.keys(_getUniqueId).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _getUniqueId[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _getUniqueId[key];
    }
  });
});