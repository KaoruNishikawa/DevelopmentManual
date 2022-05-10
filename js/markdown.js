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

const renderer = {
    list(body, ordered, start) {
        const type = ordered ? "ol" : "ul"
        const startatt = (ordered && start !== 1) ? (' start="' + start + '"') : ""
        function wrapTable(body) { return `<table>\n${body}</table>\n` }
        if (/<tr>/.test(body)) { body = wrapTable(body) }
        return "<" + type + startatt + ">\n" + body + "</" + type + ">\n"
    },
    listitem(text, task, checked) {
        if (task) { return `<li>${text}</li>\n` }
        const replacePattern = /^(?<summary><p>.*?<\/p>)[\n\r\s<p>\/]*?\[details\][\n\r\s<p>\/]*?(?<details><pre>.*)$/s
        /* 's' flag represents "dotall" mode, which makes /./ to match /\n/. */
        const replaceTo = `
            <tr><td class="dm-summary" id="dm-summary-$<summary>">$<summary></td></tr>
            <tr><td><div  class="dm-details" id="dm-details-$<summary>">$<details></div></td></tr>
        `
        const replacedText = text.replace(replacePattern, replaceTo)
        if (replacedText === text) { return `<li>${text}</li>\n` }

        const idValidated = replacedText.replace(/id="(.*?)"/g, (match, id) => {
            const validId = id.replace(
                /[^\d\w._-\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/g, ""
                /* Match non-[alphanumeric, ., _, -, Japanese] characters. */
            )
            return `id="${validId}"`
        })
        return idValidated + "\n"
    }
}
marked.setOptions({
    highlight: (code, lang) => {
        const language = hljs.getLanguage(lang) ? lang : "plaintext"
        return hljs.highlight(code, { language }).value
    },
    langPrefix: "hljs language-",
    gfm: true,
    headerIds: true,
})
marked.use({ renderer })


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
                $(elem).append(utils.fontAwesomeLink("fa-anchor", "#" + uniqueId))
            }
        }
        return $elems
    }

    /**
     * Hide details and attach its opener to summary in tables.
     * @param {jQuery} $elems - Elements to search for the summary-details table.
     * @returns {jQuery} Elements with details table opener attached.
     */
    static renderDetailsTable($elems) {
        $elems.find(".dm-details").hide()
        $elems.find(".dm-summary").map(function () {
            const targetID = this.id.replace("summary", "details")
            $(this).click(() => { $(`#${targetID}`).slideToggle(300) })
        })
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
        $elems = this.renderDetailsTable($elems)

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
