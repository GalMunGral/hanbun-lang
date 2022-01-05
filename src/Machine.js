var stack = [];
var context = [globalThis];

globalThis.log = (arg) => console.log(arg);

exports.debug = (next) => {
  console.log(stack);
  console.log(context);
  return next();
}

exports.select = (branch1, branch2) => {
  if (!stack.length)
    return left('stack is empty');
  return stack.pop() ? branch1() : branch2();
}

exports.loadVal = (json, left, right) => {
  return makeVal(json, left, (val) => {
    stack.push(val);
    return right();
  });
}

exports.loadRef = (path, left, right) => {
  return lookup(path, left, (val) => {
    stack.push(val);
    return right();
  })
}

exports.pop = (left, right) => {
  if (!stack.length)
    return left('stack is empty');
  stack.pop();
  return right();
}

exports.binOp = (op, left, right) => {
  if (stack.length < 2)
    return left('not enough operands');
  const lVal = stack.pop();
  const rVal = stack.pop();
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
      case "+":
        stack.push(lVal + rVal);
        return right();
      case "-":
        stack.push(lVal - rVal);
        return right();
      case "*":
        stack.push(lVal * rVal);
        return right();
      case "/":
        stack.push(lVal / rVal);
        return right();
      case "**":
        let res = 1;
        for (let i = 0; i < rVal; ++i) res *= lVal
        stack.push(res);
        return right();
      default:
        return left('operation not supported')
    }
  } catch (e) {
    return left(e.message);
  }
}

exports.store = (path, left, right) => {
  if (!stack.length)
    return left("stack is empty");
  const root = context[context.length - 1];
  const val = stack.pop();
  return update(root, path, val, left, right);
}

exports.setVal = (path, json, left, right) => {
  if (!stack.length)
    return left("stack is empty");
  return makeVal(json, left, (val) => {
    return update(stack[stack.length - 1], path, val, left, right);
  })
}

exports.setRef = (path, ref, left, right) => {
  if (!stack.length)
    return left("stack is empty");
  return lookup(ref, left, (val) => {
    return update(stack[stack.length - 1], path, val, left, right);
  })
}

exports.makeNode = (tag, left, right) => {
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
    stack.push({ tag })
    return right();
  }
}

exports.register = (message, fn, left, right) => {
  if (!stack.length) return left('stack is empty');
  const target = stack[stack.length - 1];
  const handler = (arg) => { // handler.length == 1
    const index = stack.length;
    context.push({ this : target });
    stack.push(arg);
    fn.call();
    const res = stack[index];
    stack.length = index;
    context.pop();
    return res;
  }
  target[message] = target['on' + message] = handler;
  return right();
}

exports.call = (path, message, left, right) => {
  return lookup(path, left, (target) => {
    const fn = target[message];
    if (typeof fn != 'function') {
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
  })
} 

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
  const key = path.pop();
  for (let p of path) {
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
  return typeof o == 'function' || (typeof o == 'object' && o);
}
