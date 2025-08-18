import { Url } from "../model/url.model.js";
import { ApiError } from "../utils/ApiError.js";
import { UrlShortener } from "../utils/UrlShortner.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const shortUrl = AsyncHandler(async (req, res)=>{
    try {

        const { url, customExpiry } = req.body;

        const shortener = new UrlShortener();
        const shortUrl = await shortener.generateShortCode();
    
        let expiresAt;
        if (customExpiry) {
            expiresAt = new Date(customExpiry);
        } else {
            expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);        }

        const urlEntry = new Url({
        originalUrl: url,
        shortUrl,
        expiresAt
        });

        await urlEntry.save();

        return res.status(200).json(
            new ApiResponse(200, urlEntry, "Url shortening completed.")
        );
        
    } catch (error) {
        console.error('Error creating short URL:', error);
    
        if (error.code === 11000) {
            throw new ApiError(500, "Failed to generate unique short code. Please try again.");
        }
    
        throw new ApiError(500, "Internal server error. Please try again later.");
    }
});

const redirect = AsyncHandler(async (req, res)=>{
    try {
        const { shortCode } = req.params;
    
        if (!/^[a-zA-Z0-9]+$/.test(shortCode)) {
            throw new ApiError(404, "Invalid short code format");
        }

        const urlEntry = await Url.findOne({
        shortCode,
        expiresAt: { $gt: new Date() }
        });

        if (!urlEntry) {
            throw new ApiError(404, "URL not found or expired");
        }

        res.redirect(301, urlEntry.originalUrl);
        
    } catch (error) {
        console.error("Redirection failed", error);
        throw new ApiError(500, "Internal server error");
    }
});

export {shortUrl, redirect}