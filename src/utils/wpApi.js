const BASE_URL = import.meta.env.VITE_WP_API_URL;

/**
 * Utility to fetch data from WordPress REST API
 * @param {string} endpoint - The API endpoint (e.g., '/posts')
 * @param {object} params - Query parameters
 */
export const fetchFromWP = async (endpoint, params = {}) => {
    const url = new URL(`${BASE_URL}${endpoint}`);

    // Add query params
    Object.keys(params).forEach(key =>
        url.searchParams.append(key, params[key])
    );

    try {
        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`WP API Error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching from WordPress:", error);
        throw error;
    }
};

/**
 * Helper to get featured image URL from WP post
 * @param {object} post - The WP post object
 */
export const getFeaturedImage = (post) => {
    return post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
};

/**
 * Helper to get ACF fields
 * @param {object} post - The WP post object
 */
export const getACF = (post) => {
    return post.acf || {};
};

/**
 * Helper to handle dynamic images with fallbacks
 * @param {string} wpUrl - The URL from WordPress API
 * @param {string} fallbackAsset - The local imported asset
 * @returns {string} - The URL to use
 */
export const getImageUrl = (wpUrl, fallbackAsset) => {
    if (wpUrl && wpUrl.trim() !== "" && !wpUrl.includes("undefined")) {
        return wpUrl;
    }
    return fallbackAsset;
};
