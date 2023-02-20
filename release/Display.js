"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _config = _interopRequireDefault(require("./common/config.js"));
var _tools = require("./common/tools.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*----------------------------------------*\
  midiFighter - Display.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2023-02-20 22:17:43
  @Last Modified time: 2023-02-21 00:26:02
\*----------------------------------------*/

const {
  STROB_DELAY: strobDebay,
  RECORD_COLOR: recordColor,
  REVERSE_COLOR: reverseColor,
  RESET_COLOR: resetColor,
  STORE_COLOR: storeColor,
  CLEAR_REC_COLOR: clearRecColor,
  TIMESCALE_COLOR: timescaleColor
} = _config.default.UI;
class Display {
  constructor(send) {
    this._stateColor = 0;
    this._value = 0;
    this.send = send;
    this.anims = {
      reset: async () => {
        this.displayColor(resetColor);
        await (0, _tools.wait)(strobDebay);
        this.displayColor(this._stateColor);
      },
      store: async () => {
        this.displayColor(storeColor);
        await (0, _tools.wait)(strobDebay);
        this.displayColor(this._stateColor);
      },
      fadeIn: async (delay = 0) => {
        await (0, _tools.wait)(delay);
        for (let j = 0; j <= 1; j += 0.02) {
          this.displayIntensity(j);
          await (0, _tools.wait)(5);
        }
      },
      fadeOut: async (delay = 0) => {
        await (0, _tools.wait)(delay);
        for (let j = 0; j <= 1; j += 0.02) {
          this.displayIntensity(1 - j);
          await (0, _tools.wait)(5);
        }
      },
      gradiant: async (delay = 0, color) => {
        await (0, _tools.wait)(delay);
        for (let j = 0; j <= 1; j += 0.02) {
          this.displayColor((0, _tools.lerp)(this._stateColor, color, j));
          await (0, _tools.wait)(5);
        }
        this.stateColor = color;
      }
    };
  }
  set stateColor(color) {
    this._stateColor = color;
    this.displayColor(this._stateColor);
  }
  set value(val) {
    this._value = val;
    this.displayValue(this._value);
  }
  displayValue(value) {
    this.send(Display.RING_CHANNEL, value);
  }
  displayColor(color) {
    color = color % 128;
    this.send(Display.COLOR_CHANNEL, color);
  }
  displayIntensity(intensity) {
    intensity = (0, _tools.lerp)(Display.INTENSITY_MIN, Display.INTENSITY_MAX, Math.min(Math.max(intensity, 0), 1));
    this.send(Display.INTENSITY_CHANNEL, intensity);
  }
  static RING_CHANNEL = 0x00;
  static COLOR_CHANNEL = 0x01;
  static INTENSITY_CHANNEL = 0x02;
  static INTENSITY_MIN = 17;
  static INTENSITY_MAX = 49;
}
exports.default = Display;