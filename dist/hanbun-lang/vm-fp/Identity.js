export class Identity {
    value;
    constructor(value) {
        this.value = value;
    }
    static instance() {
        return {
            unit(v) {
                return {
                    data: new Identity(v),
                    ...Identity.instance(),
                };
            },
            bind(f) {
                return f(this.data.value);
            },
        };
    }
}
