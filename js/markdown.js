"use strict"

/**
 * @fileoverview Handle Markdown contents.
 */

import * as trans from "./transition.js"
import * as utils from "./utils.js"

/* CDN modules (no need to specify explicitly) */
const marked = window.marked
const DOMPurify = window.DOMPurify
const $ = jQuery = window.jQuery

marked.setOptions({
    highlight: (code, lang) => {
        const language = hljs.getLanguage(lang) ? lang : "plaintext"
        return hljs.highlight(code, { language }).value
    },
    langPrefix: "hljs language-",
    gfm: true,
    headerIds: true,
})


/**
 * Parse Markdown to HTML.
 * @param {string} path - Relative path, which may starts with "./"
 * @returns {Promise.<jQuery>} Parsed HTML elements.
 */
async function loadMarkdown(path) {
    const dataText = await $.get(path)
    const parsedHTML = marked.parse(dataText)
    return $(DOMPurify.sanitize(parsedHTML))
}

class MarkdownRenderer {
    constructor() { }

    static #generateID($elem, fileName) {
        if ($elem.is("h1")) { return `dm-panel-${fileName}-title` }
        else { return `dm-panel-${fileName}-${$elem.attr("id")}` }
    }

    static #escapeHyphen(id) {
        return id.replace(/-/g, "_")
    }

    /**
     * Make unique ID and attach anchor.
     * @param {jQuery} $elems - Raw element to attach IDs.
     * @param {string} fileName - File name, to create unique ID.
     * @returns {jQuery} Element with unique IDs.
     */
    static addAnchor($elems, fileName) {
        for (let elem of $elems) {
            if (elem.id) {
                elem.id = this.#escapeHyphen(elem.id)
                const uniqueId = this.#generateID($(elem), fileName)
                elem.id = uniqueId
                $(elem).append(utils.fontAwesomeLink("fa-anchor", `#${uniqueId}`))
            }
        }
        return $elems
    }

    static convertListToTable($elems) {
        for (let elem of $elems) {
            if (elem.nodeName == "UL") { console.log(elem) }
            // console.log(elem.localName)
            // TODO: Implement.
        }
        return $elems
    }

    /**
     * Create rendered Markdown contents and its utility tools.
     * @param {string} path - Relative path to Markdown file, which may starts with "./"
     * @returns {[jQuery, string, function(): undefined]} Div element containing parsed
     *     contents, title of the page, and the panel opener callback.
     */
    static async parseMarkdown(path) {
        const fileName = path.split("/").pop().split(".")[0]
        let $elems = await loadMarkdown(path)
        $elems = this.convertListToTable($elems)

        const $page = $("<div>").append(this.addAnchor($elems, fileName))

        const id = `dm-md-${fileName}`
        const title = $elems[0].innerText

        return [$page.attr({ id: id }), title, trans.modalWindow.opener(`#${id}`)]
    }

    /**
     * Render parsed Markdown contents on HTML.
     * @param {string} path - Relative path to Markdown file, which may starts with "./"
     * @param {object} openerElem - Element to attach opener function.
     */
    static async renderMarkdown(path, openerElem) {
        const [$elems, title, opener] = await this.parseMarkdown(path)
        $(openerElem).click(opener).text(title)
        $elems.addClass("dm-modal").appendTo($("#dm-modal-container")).hide()
    }
}


export { loadMarkdown, MarkdownRenderer }
