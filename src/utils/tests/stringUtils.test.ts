import { describe, expect, it } from "vitest";
import { snakeCaseString } from "../stringUtils";

describe('snakeCaseString', () => {
    it('converts simple strings to snake case', () => {
        const testInput = "Test string with spaces";
        const expected = "test-string-with-spaces";
        const actual = snakeCaseString(testInput);
        expect(actual).toEqual(expected);
    })

    it('converts special characters to hypens', () => {
// /[/\<>:"|?*]
        const testInput = "te/st st\\ring *wit|h sp<ecia:l chara>ct?ers";
        const expected = "te-st-st-ring--wit-h-sp-ecia-l-chara-ct-ers";
        const actual = snakeCaseString(testInput);
        expect(actual).toEqual(expected);
    })
})