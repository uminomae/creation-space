export function createMainDevStatsBridge() {
    let begin = () => {};
    let end = () => {};

    return {
        setHandlers(nextBegin, nextEnd) {
            begin = typeof nextBegin === 'function' ? nextBegin : (() => {});
            end = typeof nextEnd === 'function' ? nextEnd : (() => {});
        },
        getBegin() {
            return begin;
        },
        getEnd() {
            return end;
        },
    };
}
