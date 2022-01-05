"use strict";

globalThis.a = {
  a: {
    b: {
      c: 1234
    }
  }
}

exports.getPath = function(path) {
  let cur = globalThis.a;
  for (let p of path) {
    if (p in cur) {
      cur = cur[p];
    } else {
      return undefined;
    }
  }
  return cur;
};