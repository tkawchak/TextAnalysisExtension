module.exports = {
    getWebpageUrl: getWebpageUrl,
};

/**
 * Get the webpage url from the current page
 */
function getWebpageUrl() {
    var url = window.location.href;
    return url;
}