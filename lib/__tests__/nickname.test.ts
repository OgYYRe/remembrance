import { nicknameToEmail } from "../auth";

describe("nicknameToEmail - Positive Fälle", () => {
    test("gültiger Nickname wird zu Email", () => {
        const email = nicknameToEmail("oguzhan_01");
        expect(email).toBe("oguzhan_01@remembrance.com");
    });

    test("Grossbuchstaben werden zu kleinbuchstaben", () => {
        const email = nicknameToEmail("OgUzHaN");
        expect(email).toBe("oguzhan@remembrance.com");
    });
});

describe("nicknameToEmail - Negative Fälle", () => {
    test("Nickname zu kurz -> Fehler", () => {
        expect(() => nicknameToEmail("abc")).toThrow();
    });

    test('Ungültige Zeichen " " Fehler', () => {
        expect(() => nicknameToEmail("oguz han!")).toThrow();
    });

    test("Leerer Nickname -> Fehler", () => {
        expect(() => nicknameToEmail("")).toThrow();
    });
});

describe("nicknameToEmail - Grenzfälle", () => {
    test("Nickname genau Minimum-Länge ist ok", () => {
        const email = nicknameToEmail("abcde");
        expect(email).toBe("abcde@remembrance.com");
    });

    test("Nickname mit Punkt und Unterstrich ist ok", () => {
        const email = nicknameToEmail("a.b_c");
        expect(email).toBe("a.b_c@remembrance.com");
    });
});
