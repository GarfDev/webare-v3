"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUniqueId = void 0;

var _uniqid = _interopRequireDefault(require("uniqid"));

var _nodePersist = _interopRequireDefault(require("node-persist"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var createUniqueId = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* () {
    yield _nodePersist.default.init();
    var uuid = (yield _nodePersist.default.getItem('uuid')) || (0, _uniqid.default)();
    yield _nodePersist.default.setItem('uuid', uuid);
    return () => uuid;
  });

  return function createUniqueId() {
    return _ref.apply(this, arguments);
  };
}();

var uuid = null;

var getUniqueId = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* () {
    yield _nodePersist.default.init();
    if (uuid) return uuid;
    uuid = (yield _nodePersist.default.getItem('uuid')) || (0, _uniqid.default)();
    yield _nodePersist.default.setItem('uuid', uuid);
    return uuid;
  });

  return function getUniqueId() {
    return _ref2.apply(this, arguments);
  };
}();

exports.getUniqueId = getUniqueId;