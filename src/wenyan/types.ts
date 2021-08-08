export type AST =
  | {
      type: "RST";
    }
  | {
      type: "POP";
    }
  | {
      type: "SET_CURSOR";
    }
  | {
      type: "STORE_VAR";
      path: string[];
    }
  | {
      type: "LOAD_VAR";
      path: string[];
    }
  | {
      type: "RST_LOAD_VAR";
      path: string[];
    }
  | {
      type: "LOAD_CONST";
      value: string;
    }
  | {
      type: "LOAD_STR";
      value: string;
    }
  | {
      type: "EVAL_EXPR";
      value: string;
    }
  | {
      type: "DOM_NODE";
      tag: string;
      name?: string;
    }
  | {
      type: "SET_PROP";
      name: string;
      literal?: string;
      path?: string[];
    }
  | {
      type: "DEF_METHOD";
      name: string;
      body: AST[];
    }
  | {
      type: "APPLY_METHOD";
      receiver: string[];
      method: string;
    }
  | {
      type: "APPLY_FUNC";
      func: string;
    }
  | {
      type: "APPLY_OP";
      op: string;
    }
  | {
      type: "IF_TRUE";
      body: AST;
    }
  | {
      type: "IF_FALSE";
      body: AST;
    }
  | {
      type: "BLOCK";
      body: AST[];
    };
