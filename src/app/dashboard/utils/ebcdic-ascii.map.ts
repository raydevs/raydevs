import { map } from "./ascii-ebcdic.map";

const xah_inverse_map = ((mapObj) => {
    const m2 = new Map();
    mapObj.forEach ( ((vv,kk) => { m2.set(vv,kk) }) );
    return m2;
});

export const EBCDIC_ASCII_MAP = xah_inverse_map(map);