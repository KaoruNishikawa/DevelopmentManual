"use strict"

/**
 * @fileoverview Collection of utility functions.
 */

/* CDN modules (no need to specify explicitly) */
const $ = jQuery = window.jQuery


/**
 * Create Icon.
 * @param {string} iconClass - FontAwesome icon class. "fa" isn't needed.
 * @param {string} [href] - Hyper link attached to the icon.
 * @param {string} [text] - Text that follows the icon.
 * @returns {jQuery} Icon element.
 */
function fontAwesomeLink(iconClass, href, text) {
    const icon = $("<i>", { "aria-hidden": true })
        .addClass(["fa", iconClass, "fa-fw"])
    return href ? $("<a>", { text: text, href: href }).prepend(icon) : icon
}

/**
 * Show bookmark list.
 * @param {string} path - Path to bookmark list JSON file.
 */
function showBookmark(path) {
    const container = $("#dm-bookmark")
    const createEntry = (valueObj, key) => {
        return $("<span>").append(
            fontAwesomeLink(valueObj.icon, valueObj.href, key).attr("target", "_blank")
        )
    }
    fetch(path)
        .then(response => { return response.json() })
        .then(jsonData => {
            new Map(Object.entries(jsonData)).forEach(
                (v, k) => { createEntry(v, k).appendTo(container) }
            )
        })
}


export { fontAwesomeLink, showBookmark }
