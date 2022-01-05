var stack = [];
var context = [globalThis];

exports.test = (left, right) => {
  if (!stack.length)
    return left('stack is empty');
  return right(Boolean(stack.pop()));
}

exports.pushVal = (json, left, right) => {
  return makeVal(json, left, (val) => {
    stack.push(val);
    return right();
  });
}

exports.pushRef = (path, left, right) => {
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
        stack.push(lVal ** rVal);
        return right();
      default:
        return left('operation not supported')
    }
  } catch (e) {
    return left(e.message);
  }
}

exports.newContext = (target) => {
  context.push({
    __proto__: context[context.length - 1],
    __self__: target,
    document: globalThis.document,
    window: globalThis,
  });
}

exports.restoreContext = () => {
  context.pop();
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

exports.setRef = (path, path, left, right) => {
  if (!stack.length)
    return left("stack is empty");
  return lookup(path, left, (val) => {
    return update(stack[stack.length - 1], path, val, left, right);
  })
}


function lookup(path, left, right) {
  let cur = context[context.length - 1];
  for (let p of path) {
    if (typeof cur !== "object" || cur === null)
      return left(`${eff.path.join("/")}not found!`);
    cur = cur[p];
  }
  return right(cur);
}

function update(cur, path, value, left, right) {
  if (!path.length)
    return left("path must be specified");
  const key = path.pop();
  for (let p of path) {
    if (typeof cur[p] !== "object" || cur[p] === null) {
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
