"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.application = exports.EventType = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _socket = require("socket.io-client");

var _discord = require("discord.js");

var _i18n = require("./core/i18n");

var _getUniqueId = require("./core/utils/getUniqueId");

var _client = require("./core/client");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_dotenv.default.config();

var EventType; // Create a new client instance

exports.EventType = EventType;

(function (EventType) {
  EventType["MESSAGE"] = "MESSAGE";
  EventType["HANDSHAKE"] = "HANDSHAKE";
  EventType["MATCHED"] = "MATCHED";
  EventType["RECEIVE_MESSAGE"] = "RECEIVE_MESSAGE";
  EventType["NO_ROUTING"] = "NO_ROUTING";
})(EventType || (exports.EventType = EventType = {}));

var application = () => {
  var i18n = (0, _i18n.getI18n)();
  var client = new _client.webareClient({
    partials: ['CHANNEL'],
    intents: ['DIRECT_MESSAGES', _discord.Intents.FLAGS.GUILDS, _discord.Intents.FLAGS.DIRECT_MESSAGES, _discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING]
  });
  var socket = (0, _socket.io)(process.env.MAIN_NODE_URL); // When the client is ready, run this code (only once)

  client.once('ready', () => {
    socket.connect();
  });
  process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
  });
  socket.on('connect', /*#__PURE__*/_asyncToGenerator(function* () {
    socket.emit(EventType.HANDSHAKE, {
      client_id: yield (0, _getUniqueId.getUniqueId)()
    });
  }));
  client.on('messageCreate', /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(function* (message) {
      var _message$guild;

      if (message.author.bot) return;
      if (message.author.id === client.user.id) return;
      if (message !== null && message !== void 0 && (_message$guild = message.guild) !== null && _message$guild !== void 0 && _message$guild.id) return;

      switch (message.content) {
        case '!find':
          {
            var res = yield _axios.default.post("".concat(process.env.MAIN_NODE_URL, "/queue/join"), {
              author: {
                id: message.author.id
              }
            });
            message.channel.send(i18n.__(res.data.message));
            break;
          }

        case '!leave':
          {
            var _res = yield _axios.default.post("".concat(process.env.MAIN_NODE_URL, "/match/leave"), {
              author: {
                platform: 'discord',
                id: message.author.id
              }
            });

            message.channel.send(i18n.__(_res.data.message));
            break;
          }

        case '!leave:queue':
          {
            var _res2 = yield _axios.default.post("".concat(process.env.MAIN_NODE_URL, "/queue/leave"), {
              author: {
                platform: 'discord',
                id: message.author.id
              }
            });

            message.channel.send(i18n.__(_res2.data.message));
            break;
          }

        default:
          socket.emit(EventType.MESSAGE, {
            meta: {
              client_id: yield (0, _getUniqueId.getUniqueId)()
            },
            author: {
              platform: 'discord',
              uuid: message.author.id
            },
            content: {
              text: message.content
            }
          });
      }
    });

    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }());
  socket.on(EventType.RECEIVE_MESSAGE, /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(function* (message) {
      try {
        var channel = yield client.users.fetch(message.receiver.uuid);

        if (message.content.system) {
          channel.send(i18n.__(message.content.text));
        } else {
          channel.send(message.content.text);
        }
      } catch (e) {}
    });

    return function (_x2) {
      return _ref3.apply(this, arguments);
    };
  }());
  socket.on(EventType.NO_ROUTING, /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(function* (message) {
      try {
        var channel = yield client.users.fetch(message.receiver.uuid);
        channel.send(i18n.__(message.content.text));
      } catch (e) {}
    });

    return function (_x3) {
      return _ref4.apply(this, arguments);
    };
  }()); // Login to Discord with your client's token

  client.login(process.env.BOT_TOKEN);
};

exports.application = application;
application();