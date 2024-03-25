"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _tools = require("../../common/tools.js");
/*----------------------------------------*\
  MFT - Recorder.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2024-03-25 00:46:20
  @Last Modified time: 2024-03-25 00:53:02
\*----------------------------------------*/

class Recorder {
  constructor(knob, midiOut) {
    this.isRecording = false;
    this.isPlaying = false;
    this.band = [];
    this._timeScale = 1;
    knob.color = [0, 64, 255];
    knob.onPressed(async () => {
      this.isRecording = true;
      knob.color = [255, 0, 0];
      this.isPlaying && (await this.askToStop());
      this.band.length = 0;
      this.record("start", knob.value);
    }).onReleased(() => {
      this.isRecording = false;
      knob.color = [0, 64, 255];
      this.record("stop", knob.value);
      this.play();
      this.isPlaying = true;
    }).onDoubleClick(async () => {
      knob.color = [255, 255, 0];
      this.isPlaying && (await this.askToStop());
      this.band.length = 0;
      knob.color = [0, 64, 255];
    }).onTurn(inc => {
      knob.value = (knob.value + inc + 128) % 128;
      this.isRecording && this.record("change", knob.value);
      midiOut(knob.id, knob.value);
    });
    this.knob = knob;
    this.midiOut = midiOut;
    this.hasToStop = null;
  }
  record(name, value) {
    this.band.push({
      eventName: name,
      time: (0, _tools.getTime)(),
      value: value
    });
  }
  stop() {
    this.knob.strobTag = 0.0;
    this.isPlaying = false;
    if (this.hasToStop != null) this.hasToStop();
    this.hasToStop = null;
  }
  async play() {
    this.knob.strobTag = 0.5;
    const current = this.band[0];
    const next = this.band[1 % this.band.length];
    if (!current || !next) return this.stop();
    this.knob.value = current.value;
    this.midiOut(this.knob.id, this.knob.value);
    this.band.push(this.band.shift());
    await (0, _tools.wait)((next.time - current.time) * this._timeScale);
    if (this.hasToStop != null) return this.stop();
    this.play();
  }
  async askToStop() {
    await new Promise((resolve, reject) => {
      this.hasToStop = resolve;
    });
  }
  set order(value) {}
  set speed(value) {
    let tmp = 128 - value;
    if (tmp < 64) {
      tmp = Math.pow(tmp * 0.015625, 5);
    } else {
      tmp = (tmp - 64) * 0.015625;
      tmp = tmp * tmp * 9 + 1;
    }
    this._timeScale = Math.min(Math.max(tmp, 0.1), 10);
  }
}
exports.default = Recorder;