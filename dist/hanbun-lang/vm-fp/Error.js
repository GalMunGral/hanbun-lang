export class ErrorT {
    run;
    constructor(run) {
        this.run = run;
    }
    static lift(m) {
        return {
            data: new ErrorT(m.bind((v) => m.unit({ err: undefined, ok: v }))),
            ...ErrorT.trans(m),
        };
    }
    static trans(m) {
        return {
            unit(v) {
                return {
                    data: new ErrorT(m.unit({ err: undefined, ok: v })),
                    ...ErrorT.trans(m),
                };
            },
            err(e) {
                return {
                    data: new ErrorT(m.unit({ err: e, ok: undefined })),
                    ...ErrorT.trans(m),
                };
            },
            bind(f) {
                return {
                    data: new ErrorT(this.data.run.bind((v) => {
                        return v.err ? m.unit(v) : f(v.ok).data.run;
                    })),
                    ...ErrorT.trans(m),
                };
            },
        };
    }
}
