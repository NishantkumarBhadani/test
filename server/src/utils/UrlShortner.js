import { Url } from "../model/url.model.js";
class UrlShortener{
    constructor() {
    this.chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    this.base = this.chars.length;
    }
    async generateShortCode(length = 6) {
        let attempts = 0;
        const maxAttempts = 10;

        while (attempts < maxAttempts) {
            const timestamp = Date.now().toString(36);
            const random = Math.random().toString(36).substring(2);
            const combined = (timestamp + random).replace(/[^a-zA-Z0-9]/g, '');
            
            
            let shortCode = combined.substring(0, length);
            if (shortCode.length < length) {
                shortCode = this.padWithRandom(shortCode, length);
            }

            
            const existing = await Url.findOne({ shortCode });
            if (!existing) {
                return shortCode;
            }
            
            attempts++;
            length++;
        }
        
        throw new Error('Unable to generate unique short code');
    }

    padWithRandom(str, targetLength) {
        while (str.length < targetLength) {
            str += this.chars[Math.floor(Math.random() * this.base)];
        }
        return str;
    }
}

export {UrlShortener};