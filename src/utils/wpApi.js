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
 * Upload a file to WordPress Media Library
 * @param {File} file - The file to upload
 * @returns {Promise<string>} - The source URL of the uploaded image
 */
export const uploadToWP = async (file) => {
    const username = import.meta.env.VITE_WP_USERNAME;
    const password = import.meta.env.VITE_WP_APP_PASSWORD;

    if (!username || !password) {
        throw new Error("WordPress credentials missing in .env");
    }

    const auth = btoa(`${username}:${password}`);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);

    try {
        console.log(`Uploading to WordPress: ${file.name} (${file.type})`);
        const response = await fetch(`${BASE_URL}/media`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Disposition': `attachment; filename="${file.name}"`,
                'Content-Type': file.type, // Explicitly set content type
            },
            body: file
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("WP Upload Error Data:", errorData);
            throw new Error(`WordPress upload failed: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();
        console.log("WP Upload Success Data:", data);

        // WP.com sometimes uses different fields or nested ones. 
        // source_url is standard, but let's be safe.
        const url = data.source_url || data.guid?.rendered || data.link;
        return { url: url, id: data.id };
    } catch (error) {
        console.error("Error uploading to WordPress:", error);
        throw error;
    }
};

/**
 * Delete a file from WordPress Media Library
 * @param {number|string} mediaId - The ID of the media to delete
 */
export const deleteFromWP = async (mediaId) => {
    if (!mediaId || isNaN(Number(mediaId))) {
        console.warn("deleteFromWP called with invalid ID:", mediaId);
        return false; // Silently fail or return false if ID is obviously invalid
    }

    const username = import.meta.env.VITE_WP_USERNAME;
    const password = import.meta.env.VITE_WP_APP_PASSWORD;

    if (!username || !password) {
        throw new Error("WordPress credentials missing in .env");
    }

    const auth = btoa(`${username}:${password}`);

    try {
        const response = await fetch(`${BASE_URL}/media/${mediaId}?force=true`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Basic ${auth}`,
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`WordPress deletion failed: ${errorData.message || response.statusText}`);
        }

        return true;
    } catch (error) {
        console.error("Error deleting from WordPress:", error);
        throw error;
    }
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
