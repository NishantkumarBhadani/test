import React, { useState } from 'react';
import { Copy, Link, Calendar, Loader, CheckCircle, AlertCircle, ExternalLink, Clipboard } from 'lucide-react';

const UrlShortener = () => {
  const [url, setUrl] = useState('');
  const [customExpiry, setCustomExpiry] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);

  const API_BASE = "http://localhost:8000/api/v1/url";

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setError('');
    } catch (err) {
      setError('Unable to paste from clipboard');
    }
  };

  const validateUrl = (url) => {
    const urlPattern = /^https?:\/\/.+\..+/;
    return urlPattern.test(url);
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/short`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          customExpiry: customExpiry || null
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to shorten URL');
      }

      setShortUrl(data.data.shortUrl);
      setOriginalUrl(data.data.originalUrl);
      setExpiresAt(data.data.expiresAt);

      // Auto-copy to clipboard
      try {
        await navigator.clipboard.writeText(data.data.shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.log('Auto-copy failed, but URL created successfully');
      }

    } catch (err) {
      setError(err.message || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const resetForm = () => {
    setUrl('');
    setCustomExpiry('');
    setShortUrl('');
    setOriginalUrl('');
    setExpiresAt('');
    setError('');
    setSuccess('');
    setCopied(false);
  };

  const formatExpiryDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1); // At least 1 minute in the future
    return now.toISOString().slice(0, 16);
  };

  const getMaxDateTime = () => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    return maxDate.toISOString().slice(0, 16);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex justify-center items-center mb-4">
            <Link className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">URL Shortener</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Transform your long URLs into short, manageable links
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="space-y-6">
            {/* URL Input */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your URL
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/very-long-url"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={handlePaste}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Paste from clipboard"
                    disabled={loading}
                  >
                    <Clipboard className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Expiry */}
            <div>
              <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-2">
                Custom Expiry (Optional)
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  id="expiry"
                  value={customExpiry}
                  onChange={(e) => setCustomExpiry(e.target.value)}
                  min={getMinDateTime()}
                  max={getMaxDateTime()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                  disabled={loading}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Default: 24 hours from now.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !url.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Shortening...
                </>
              ) : (
                <>
                  <Link className="h-5 w-5" />
                  Shorten URL
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-700">{success}</span>
            </div>
          )}
        </div>

        {/* Result Section */}
        {shortUrl && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Your Shortened URL</h2>
                <button
                  onClick={resetForm}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Create Another
                </button>
              </div>

              {/* Short URL Display */}
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <a
                      href={`${API_BASE}/${shortUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium text-lg break-all flex items-center gap-2"
                    >
                      {shortUrl}
                      <ExternalLink className="h-4 w-4 flex-shrink-0" />
                    </a>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      copied
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                    }`}
                  >
                    <Copy className="h-4 w-4" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* URL Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Original URL</h3>
                  <p className="text-gray-600 break-all bg-gray-50 p-3 rounded-lg">
                    {originalUrl}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Expires At</h3>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {formatExpiryDate(expiresAt)}
                  </p>
                </div>
              </div>

              {copied && (
                <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 font-medium">
                    ✅ URL automatically copied to your clipboard!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pb-8">
          <p className="text-gray-500 text-sm">
            Built with React, Express, Node.js, and MongoDB
          </p>
        </div>
      </div>
    </div>
  );
};

export default UrlShortener;