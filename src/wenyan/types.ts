export type AST =
  | {
      type: "RST";
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
      type: "RST_VAR";
      path: string[];
    }
  | {
      type: "LOAD_CONST";
      value: string;
    }
  | {
      type: "EVAL_EXPR";
      value: string;
    }
  | {
      type: "NODE";
      tag: string;
    }
  | {
      type: "SET_PROP";
      name: string;
      literal?: string;
      path?: string[];
    }
  | {
      type: "DEFN_MSG";
      name: string;
      body: AST[];
    }
  | {
      type: "SEND_MSG";
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
      type: "BLOCK";
      body: AST[];
    }
  | {
      type: "COND";
      consequent: AST[];
      alternate: AST[];
    };
