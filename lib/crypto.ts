// Basic XOR for simple obfuscation (as requested "basic encryption")
// Browser-compatible implementation using btoa/atob with UTF-8 support
const SECRET_KEY = 'simple-salt';

export const encrypt = (text: string): string => {
    const saltedText = `${SECRET_KEY}:${text}`;
    // Use encodeURIComponent/unescape pattern for UTF-8 Base64 in browser
    return btoa(unescape(encodeURIComponent(saltedText)));
};

export const decrypt = (encoded: string): string => {
    try {
        const decoded = decodeURIComponent(escape(atob(encoded)));
        const [salt, ...rest] = decoded.split(':');
        if (salt !== SECRET_KEY) return 'Decryption Error';
        return rest.join(':');
    } catch {
        return 'Decryption Error';
    }
};
