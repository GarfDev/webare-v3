"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getI18n = void 0;

var _i18n = require("i18n");

var _getStaticPath = require("../utils/getStaticPath");

var createI18nInstance = () => {
  var i18n = new _i18n.I18n();
  i18n.configure({
    locales: ['vi', 'en'],
    directory: (0, _getStaticPath.getStaticPath)('locales'),
    defaultLocale: 'vi'
  });
  return () => i18n;
};

var getI18n = createI18nInstance();
exports.getI18n = getI18n;