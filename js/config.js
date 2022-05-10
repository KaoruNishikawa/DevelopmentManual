"use strict"

/**
 * @fileoverview Page configuration.
 */

import * as trans from "./transition.js"
import * as utils from "./utils.js"


/** Class for handling page URL. */
class URLHandler {
    constructor() { this.url = new URL(window.location.href) }

    /**
     * Set the URL parameter describing the current page state.
     * @param {[string, ?]} param - Array of parameter name and value pair.
     */
    set searchParams(param) { this.url.searchParams.set(...param) }

    /**
     * Get the URL parameter describing the current page state.
     * @returns {Map.<string, string>} Parameter name to value mapping.
     */
    get searchParams() { return this.url.searchParams }

    /**
     * Set the URL hash which describes the current location.
     * @param {string} hash - Hash of the URL.
     */
    set hash(hash) { this.url.hash = hash }

    /**
     * Get the URL hash which describes the current location.
     * @returns {string} Hash of the URL.
     */
    get hash() { return this.url.hash }
}


const urlGetter = utils.fontAwesomeLink("fa-link").click(
    () => {
        console.info("Current URL:", pageURL.url.href)
        navigator.clipboard.writeText(pageURL.url.href)
            .then(() => { $.notify("Copied current URL", "info") })
    }
)


class PanelID {
    constructor(id) {
        this.id = id
        this.sectionRegex = /dm-panel-(?<panel>\w+)-(?<section>[^-\s]+)$/
        this.topRegex = /dm-md-(?<panel>\w+)$/;
        ([this.panel, this.section] = this.#parse())  // Somehow parentheses required
    }

    #parse() {
        const panel = this.sectionRegex.exec(this.id)
        if (panel) { return [panel.groups.panel, panel.groups.section] }
        const panelTop = this.topRegex.exec(this.id)
        if (panelTop) { return [panelTop.groups.panel, "title"] }
        return ["", ""]
    }

    get opener() { if (this.panel) { return `#dm-${this.panel}` } }

    get panelSection() {
        if (this.section) { return `#dm-panel-${this.panel}-${this.section}` }
    }
}


class URLParser {
    constructor() { }

    /**
     * @returns {string} Data theme.
     */
    get dataTheme() {
        const theme = pageURL.searchParams.get("data-theme")
        return theme ? theme : "dark"
    }

    /**
     * Parse ID of modal panels.
     * @returns {[string, string]} Modal panel opener's ID and full target panel ID.
     */
    get modalPanel() {
        const parser = new PanelID(pageURL.hash)
        const ret = [parser.opener, parser.panelSection]
        ret.map((x) => { x ? decodeURI(x) : x })
        return ret
    }

    #jumpTo(id) {
        const $curerntPanel = $(`#dm-md-${id.split("-")[2]}`)
        const headerHeight = parseFloat(
            getComputedStyle(document.documentElement)
                .getPropertyValue("--dm-height-navbar")
        )
        $curerntPanel.animate({ scrollTop: $(id).offset().top - headerHeight }, 500)
    }

    transit() {
        /* Data theme */
        const currentTheme = this.dataTheme
        $("html").attr("data-theme", currentTheme)
        pageURL.searchParams = ["data-theme", currentTheme]
        trans.toggleTheme(currentTheme)

        /* Modal panel */
        const [opener, id] = this.modalPanel
        if (id) {
            console.debug(`Opening ${id} via ${opener}`)
            const originalHref = pageURL.url.href
            const result = $(opener).click()
            pageURL.url.href = originalHref  // Don't overwrite URL.
            if (result.length === 0) { console.warn(`Page ${opener} not found.`) }
        }
    }

    jump() {
        const [_, id] = this.modalPanel
        if (id) { this.#jumpTo(id) }
    }
}

/** Instance to export. */
const pageURL = new URLHandler()
const urlParser = new URLParser()


export { pageURL, urlGetter, urlParser }
