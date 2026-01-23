export function nicknameToEmail(nickname: string): string {
    const normalized = nickname.trim().toLowerCase();

    if (normalized.length < 5) {
        throw new Error("Nickname must be at least 5 characters long.");
    }

    // erlaubt: a-z, 0-9, . _
    if (!/^[a-z0-9._]+$/.test(normalized)) {
        throw new Error("Nickname contains invalid characters.");
    }

    return `${normalized}@remembrance.com`;
}
