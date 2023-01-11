const stack = [];
const context = [globalThis];

globalThis["錄"] = (arg) => console.log(arg);
globalThis["模"] = (node) => node.cloneNode(true);
globalThis["接"] = (parent, child) => parent.append(child);
globalThis["為"] = (fn, timeout) => setTimeout(fn, timeout);
globalThis["止"] = (d) => clearTimeout(d);
globalThis["尋"] = (s) => document.querySelector(s);
globalThis["繪"] = (fn) => requestAnimationFrame(fn);
globalThis["世"] = globalThis;
globalThis["取一數"] = () => Math.random();

function debug(...args) {
  // console.debug([...stack]);
  // console.debug([...context]);
  // console.debug(...args);
}

export const select = (branch1, branch2) => {
  debug("[select]");
  if (!stack.length) return left("stack is empty");
  return stack.pop() ? branch1() : branch2();
};

export const loadVal = (json, left, right) => {
  debug("[loadVal]", json);
  return makeVal(json, left, (val) => {
    stack.push(val);
    return right();
  });
};

export const loadRef = (path, left, right) => {
  debug("[loadRef]", path);
  return lookup(path, left, (val) => {
    stack.push(val);
    return right();
  });
};

export const binOp = (op, left, right) => {
  debug("[binOp]", op);
  if (stack.length < 2) return left("not enough operands");
  const rVal = stack.pop();
  const lVal = stack.pop();
  try {
    switch (op) {
      case "<":
        stack.push(lVal < rVal);
        return right();
      case "<=":
        stack.push(lVal <= rVal);
        return right();
      case ">":
        stack.push(lVal > rVal);
        return right();
      case ">=":
        stack.push(lVal >= rVal);
        return right();
      case "==":
        stack.push(lVal === rVal);
        return right();
      case "加":
        stack.push(lVal + rVal);
        return right();
      case "減":
        stack.push(lVal - rVal);
        return right();
      case "乘":
        stack.push(lVal * rVal);
        return right();
      case "除":
        stack.push(lVal / rVal);
        return right();
      case "冪":
        let res = 1;
        for (let i = 0; i < rVal; ++i) res *= lVal;
        stack.push(res);
        return right();
      default:
        return left("operation not supported");
    }
  } catch (e) {
    return left(e.message);
  }
};

export const store = (path, left, right) => {
  debug("[store]", path);
  if (!stack.length) return left("stack is empty");
  const root = context[context.length - 1];
  const val = stack.pop();
  return update(root, path, val, left, right);
};

export const setVal = (key, json, left, right) => {
  debug("[setVal]", key, json);
  if (!stack.length) return left("stack is empty");
  return makeVal(json, left, (val) => {
    return update(stack[stack.length - 1], [key], val, left, right);
  });
};

export const setRef = (key, ref, left, right) => {
  debug("[setRef]", key, ref);
  if (!stack.length) return left("stack is empty");
  return lookup(ref, left, (val) => {
    return update(stack[stack.length - 1], [key], val, left, right);
  });
};

export const makeNode = (tag, left, right) => {
  debug("[makeNode]", tag);
  try {
    let node;
    switch (tag) {
      case "svg":
        node = document.createElementNS("http://www.w3.org/2000/svg", tag);
        node.setAttributeNS(
          "http://www.w3.org/2000/xmlns/",
          "xmlns:xlink",
          "http://www.w3.org/1999/xlink"
        );
        break;
      default:
        node = document.createElement(tag);
    }
    stack.push(node);
    return right();
  } catch (e) {
    stack.push({ tag });
    return right();
  }
};

export const register = (message, fn, left, right) => {
  debug("[register]", message);
  if (!stack.length) return left("stack is empty");
  const target = stack[stack.length - 1];
  const handler = (arg) => {
    // handler.length == 1
    const index = stack.length;
    context.push({ ["吾"]: target, ["世"]: globalThis });
    stack.push(arg);
    fn.call();
    const res = stack[index];
    stack.length = index;
    context.pop();
    return res;
  };
  target[message] = target["on" + message] = handler;
  return right();
};

export const call = (path, message, left, right) => {
  debug("[call]", path, message);
  return lookup(path, left, (target) => {
    const fn = target[message];
    if (typeof fn != "function") {
      return left(`${path}::${message} is not callable`);
    }
    if (stack.length < fn.length) {
      return left(`not enough arguments`);
    }
    const args = [];
    for (let i = 0; i < fn.length; ++i) {
      args.unshift(stack.pop());
    }
    try {
      stack.push(fn.apply(target, args));
      return right();
    } catch (e) {
      return left(e.message);
    }
  });
};

function lookup(path, left, right) {
  return lookupFrom(context[context.length - 1], path, left, right);
}

function lookupFrom(context, path, left, right) {
  let cur = context;
  for (let p of path) {
    if (!indexable(cur)) {
      if (context === globalThis) {
        return left(`${path.join("/")} not found!`);
      } else {
        return lookupFrom(globalThis, path, left, right);
      }
    }
    cur = cur[p];
  }
  return cur === undefined
    ? lookupFrom(globalThis, path, left, right)
    : right(cur);
}

function update(cur, path, value, left, right) {
  if (!path.length) return left("path must be specified");
  const key = path[path.length - 1];
  for (let p of path.slice(0, -1)) {
    if (!indexable(cur[p])) {
      cur[p] = {};
    }
    cur = cur[p];
  }
  cur[key] = value;
  return right();
}

function makeVal(json, left, right) {
  try {
    return right(JSON.parse(json));
  } catch (e) {
    return left(e.message);
  }
}

function indexable(o) {
  return typeof o == "function" || (typeof o == "object" && o);
}
