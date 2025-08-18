import { ApiError } from "../utils/ApiError.js";

const validateUrl = (req, res, next) => {
  const { url, customExpiry } = req.body;
  
  if (!url) {
    throw new ApiError(400, "URL is required");
  }

  
  const urlPattern = /^https?:\/\/.+\..+/;
  if (!urlPattern.test(url)) {
    throw new ApiError(400, "Please enter a valid URL starting with http:// or https://");
  }

  
  if (customExpiry) {
    const expiryDate = new Date(customExpiry);
    if (isNaN(expiryDate.getTime()) || expiryDate <= new Date()) {
      throw new ApiError(400, "Expiry date must be in the future");
    }
  }

  next();
};

export {validateUrl};