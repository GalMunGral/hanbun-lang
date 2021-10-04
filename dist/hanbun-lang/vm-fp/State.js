export class StateT {
    run;
    constructor(run) {
        this.run = run;
    }
    static lift(m) {
        return {
            data: new StateT((s) => m.bind((v) => m.unit({
                state: s,
                value: v,
            }))),
            ...StateT.trans(m),
        };
    }
    static trans(m) {
        return {
            unit(value) {
                return {
                    data: new StateT((state) => m.unit({
                        state,
                        value,
                    })),
                    ...StateT.trans(m),
                };
            },
            bind(f) {
                return {
                    data: new StateT((s) => this.data
                        .run(s)
                        .bind(({ state, value }) => f(value).data.run(state))),
                    ...StateT.trans(m),
                };
            },
            getState() {
                return {
                    data: new StateT((state) => m.unit({
                        state,
                        value: state,
                    })),
                    ...StateT.trans(m),
                };
            },
            putState(s) {
                return {
                    data: new StateT(() => m.unit({
                        state: s,
                        value: undefined,
                    })),
                    ...StateT.trans(m),
                };
            },
            update(f) {
                return {
                    data: new StateT((s) => m.unit({
                        state: f(s),
                        value: s,
                    })),
                    ...StateT.trans(m),
                };
            },
        };
    }
}
