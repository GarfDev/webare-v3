"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStaticPath = void 0;

var _path = _interopRequireDefault(require("path"));

var _appRootPath = _interopRequireDefault(require("app-root-path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getStaticPath = continuePath => {
  var _require$main;

  if (process.env.JEST_WORKER_ID) {
    return _path.default.join(_appRootPath.default.path, continuePath);
  }

  return _path.default.join(((_require$main = require.main) === null || _require$main === void 0 ? void 0 : _require$main.filename) || '', '..', continuePath);
};

exports.getStaticPath = getStaticPath;