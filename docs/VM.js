import { Pure } from "./fp-helpers/Freer.js";
export class ERROR {
    message;
    constructor(message) {
        this.message = message;
    }
}
export class RESET {
}
export class PUSH {
    val;
    constructor(val) {
        this.val = val;
    }
}
export class PEEK {
}
export class POP {
}
export class GET_ENV {
}
export class PUT_ENV {
    root;
    constructor(root) {
        this.root = root;
    }
}
export class LOOKUP {
    path;
    constructor(path) {
        this.path = path;
    }
}
export class SAFE_LOOKUP {
    path;
    constructor(path) {
        this.path = path;
    }
}
export class UPDATE {
    root;
    path;
    value;
    constructor(root, path, value) {
        this.root = root;
        this.path = path;
        this.value = value;
    }
}
export class UPDATE_ROOT {
    path;
    value;
    constructor(path, value) {
        this.path = path;
        this.value = value;
    }
}
export function run(m) {
    new Instance().run(m);
}
export class Instance {
    stack = [];
    env = window;
    run(m) {
        if (m instanceof Pure)
            return;
        const { eff, cont } = m.functor;
        this.run(cont(this.handle(eff)));
    }
    handle(eff) {
        if (eff instanceof ERROR) {
            throw eff.message;
        }
        if (eff instanceof RESET) {
            this.stack = [];
            return;
        }
        if (eff instanceof PUSH) {
            this.stack.push(eff.val);
            return;
        }
        if (eff instanceof POP) {
            return this.stack.pop();
        }
        if (eff instanceof PEEK) {
            if (!this.stack.length)
                throw "nothing on stack!";
            return this.stack[this.stack.length - 1];
        }
        if (eff instanceof GET_ENV) {
            return this.env;
        }
        if (eff instanceof PUT_ENV) {
            this.env = eff.root;
            return;
        }
        if (eff instanceof LOOKUP) {
            let cur = this.env;
            for (let p of eff.path) {
                if (typeof cur !== "object" || cur === null)
                    return null;
                cur = cur[p];
            }
            return cur;
        }
        if (eff instanceof SAFE_LOOKUP) {
            let cur = this.env;
            for (let p of eff.path) {
                if (typeof cur !== "object" || cur === null)
                    throw `${eff.path.join("/")}not found!`;
                cur = cur[p];
            }
            return cur;
        }
        if (eff instanceof UPDATE) {
            if (!eff.path.length)
                throw "what do you want to update?";
            let key = eff.path[eff.path.length - 1];
            let cur = eff.root;
            for (let p of eff.path.slice(0, -1)) {
                if (typeof cur[p] !== "object" || cur[p] === null) {
                    cur[p] = {};
                }
                cur = cur[p];
            }
            cur[key] = eff.value;
            return;
        }
        if (eff instanceof UPDATE_ROOT) {
            if (!eff.path.length)
                throw "what do you want to update?";
            let key = eff.path[eff.path.length - 1];
            let cur = this.env;
            for (let p of eff.path.slice(0, -1)) {
                if (typeof cur[p] !== "object" || cur[p] === null) {
                    cur[p] = {};
                }
                cur = cur[p];
            }
            cur[key] = eff.value;
            return;
        }
        throw eff;
    }
}
