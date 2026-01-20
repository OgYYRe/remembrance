export function nicknameToEmail(nickname: string): string {
    const normalized = nickname.trim().toLowerCase().replace(/[^a-z0-9._]/g, "");

    if (normalized.length < 5) {
        throw new Error('Nickname must be at least 5 alphanumeric characters long.');
    }

    return `${normalized}@remembrance.com`;
}