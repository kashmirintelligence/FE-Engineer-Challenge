"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketEvents = void 0;
// Socket events
var SocketEvents;
(function (SocketEvents) {
    SocketEvents["CONNECT"] = "connect";
    SocketEvents["DISCONNECT"] = "disconnect";
    SocketEvents["ERROR"] = "error";
    SocketEvents["TEMPERATURE_UPDATE"] = "temperature:update";
    SocketEvents["TEMPERATURE_CONTROL"] = "temperature:control";
    SocketEvents["PRESSURE_UPDATE"] = "pressure:update";
    SocketEvents["PRESSURE_RELEASE"] = "pressure:release";
    SocketEvents["FLOW_UPDATE"] = "flow:update";
    SocketEvents["FLOW_VALVE_ADJUST"] = "flow:valve-adjust";
})(SocketEvents || (exports.SocketEvents = SocketEvents = {}));
