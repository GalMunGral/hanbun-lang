import { Ok, Err, Parser, fail, pure } from "./lib.js";
const r = (r) => new Parser((s) => {
    const match = s.match(r);
    if (match == null || (match.index && match.index > 0)) {
        return new Err(`Expected ${r} at "${s}"`, s);
    }
    const token = match[0];
    return new Ok(token, s.slice(token.length));
});
const ws = r(/\s*/);
const number = r(/\d+(\.\d+)?/).map(Number);
const string = r(/"(\\"|[^"])*"/).map((r) => r.slice(1, -1));
/**
 * json
 *  - element
 */
export const json = fail.or(() => element);
/**
 * value
 *  - object
 *  - array
 *  - string
 *  - number
 *  - "true"
 *  - "false"
 *  - "null"
 */
const value = fail
    .or(() => object)
    .or(() => array)
    .or(() => string)
    .or(() => number)
    .or(() => r(/true/).map(() => true))
    .or(() => r(/false/).map(() => false))
    .or(() => r(/null/).map(() => null));
/**
 * object
 *  - '(' ws ')'
 *  - '(' members ')'
 */
const object = fail
    .or(() => pure({}).apl(r(/\(/)).apl(ws).apl(r(/\)/)))
    .or(() => pure(Object.fromEntries).apl(r(/\(/)).ap(members).apl(r(/\)/)));
/**
 * members
 *  - member '.' members
 *  - member
 */
const members = fail
    .or(() => pure((head) => (tail) => [head, ...tail])
    .ap(member)
    .apl(r(/\./))
    .ap(members))
    .or(() => member.map((x) => [x]));
/**
 * member
 *  - ws string ws '->' element
 */
const member = fail.or(() => pure((key) => (value) => [key, value])
    .apl(ws)
    .ap(string.or(() => r(/[\w-]+/)))
    .apl(ws)
    .apl(r(/->/))
    .ap(element));
/**
 * array
 *  - '(' ws ')'
 *  - '(' elements ')'
 */
const array = fail
    .or(() => pure([]).apl(r(/\(/)).apl(ws).apl(r(/\)/)))
    .or(() => r(/\(/).apr(elements).apl(r(/\)/)));
/**
 * elements
 *  - element '.' elements
 *  - element
 */
const elements = fail
    .or(() => pure((head) => (tail) => [head, ...tail])
    .ap(element)
    .apl(r(/\./))
    .ap(elements))
    .or(() => element.map((x) => [x]));
/**
 * element
 *  - ws value ws
 *  - ws jsml ws
 */
const element = fail
    .or(() => ws.apr(value).apl(ws))
    .or(() => ws.apr(jsml).apl(ws));
/////////////////////////////////////////////////////////
/**
 * attr
 *  - ATTR = json
 */
const attr = fail.or(() => pure((key) => (value) => [key, value])
    .ap(r(/[\w-]+/))
    .apl(r(/=/))
    .ap(json.or(() => pure(""))));
/**
 * attrs
 *  - attr ws attrs
 *  - ws
 */
const attrs = fail.or(() => attr.sep(ws).map(Object.fromEntries));
/**
 * children
 *  - json ws children
 *  - ws
 */
const children = fail.or(() => json.sep(ws));
/**
 * jsml
 *  - "<" ws TAG ws attrs ws ">" ws children ws "</" ws TAG ws ">""
 *  - "<" ws TAG ws attrs ws "/>"
 */
const jsml = fail
    .or(() => pure((tag) => (attrs) => (children) => ({
    tag,
    attrs,
    children,
}))
    .ap(r(/!([\w-]+)/).map((match) => match.slice(1)))
    .apl(ws)
    .ap(attrs)
    .apl(ws)
    .apl(ws)
    .ap(children)
    .apl(ws)
    .apl(r(/!/)))
    .or(() => pure((tag) => (attrs) => ({
    tag,
    attrs,
}))
    .ap(r(/!([\w-]+)/).map((match) => match.slice(1)))
    .apl(ws)
    .ap(attrs)
    .apl(ws)
    .apl(r(/!/)));
export { element as parser };
