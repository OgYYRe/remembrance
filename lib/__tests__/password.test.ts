import { validatePassword } from "../password";

describe("validatePassword – Positive Fälle", () => {
    test("gültiges Passwort", () => {
        expect(() => validatePassword("Ab1234.")).not.toThrow();
    });
});

describe("validatePassword – Negative Fälle", () => {
    test("leeres Passwort", () => {
        expect(() => validatePassword("")).toThrow();
    });


    test("kein Kleinbuchstabe", () => {
        expect(() => validatePassword("AB123456.")).toThrow();
    });

    test("kein Grossbuchstabe", () => {
        expect(() => validatePassword("ab123456.")).toThrow();
    });

    test("keine Zahl", () => {
        expect(() => validatePassword("Abcdefg.")).toThrow();
    });

    test("kein Sonderzeichen", () => {
        expect(() => validatePassword("Ab1234567")).toThrow();
    });
});

describe("validatePassword – Grenzfälle", () => {
    test("kurz (5 Zeichen)", () => {
        expect(() => validatePassword("Ab12.")).toThrow();
    });

    test("genau minimale Länge (6)", () => {
        expect(() => validatePassword("Ab123.")).not.toThrow();
    });

    test("genau maximale Länge (10)", () => {
        expect(() => validatePassword("Ab123456.")).not.toThrow();
    });
    test("lang (11 Zeichen)", () => {
        expect(() => validatePassword("Ab12345678.")).toThrow();
    });

    test("Leerzeichen am Anfang und Ende", () => {
        expect(() => validatePassword("  Ab123456.  ")).not.toThrow();
    });
});
