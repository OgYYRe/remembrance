export function validatePassword(password: string): void {
    const p = password.trim();

    if (p.length === 0) throw new Error("Password cant be empty.");
    if (p.length < 6) throw new Error("Password is too short (min. 6).");
    if (p.length > 10) throw new Error("Password is too long (max. 10).");
    if (!/[a-z]/.test(p)) throw new Error("Password needs a lowercase letter.");
    if (!/[A-Z]/.test(p)) throw new Error("Password needs an uppercase letter.");
    if (!/[0-9]/.test(p)) throw new Error("Password needs a number.");
    if (!/[^A-Za-z0-9]/.test(p)) throw new Error("Password needs a special character.(e.g. !@#$%)");
}
