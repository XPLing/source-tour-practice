import {expect, it, describe} from "vitest";
import {isObject} from "../src";
import {isOn} from "../dist";

describe('TEST Utils', () => {
    it('test isObject', function () {
        expect(isObject({})).toBe(true);
        expect(isObject(1)).toBe(false);
    });
    it('test isOn', function () {
        expect(isOn('onClick')).toBe(true)
        expect(isOn('Click')).toBe(false)
    })
})
