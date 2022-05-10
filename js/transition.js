"use strict"

/**
 * @fileoverview Functionalities to control contents transition.
 */

import * as config from "./config.js"
const $ = jQuery = window.jQuery


/**
 * Choose and enable the CSS to use.
 * @param {string} theme - Theme to use, "dark" or "light".
 */
function toggleTheme(theme) {
    $(`.dm-code-${theme}-theme`).attr("disabled", false)
    $(`.dm-code-${theme === "dark" ? "light" : "dark"}-theme`).attr("disabled", true)
}

/**
 * Create a theme switch button.
 * @param {boolean} checked - If true, the checkbox is initially checked.
 * @returns {jQuery} Checkbox element.
 */
function createThemeSwitch(checked) {
    return $("<label>", { class: "dm-switch" }).append(
        $("<input>", { type: "checkbox", checked: checked }).click(function () {
            const theme = $(this).is(":checked") ? "dark" : "light"
            $("html").attr("data-theme", theme)
            config.pageURL.searchParams.set("data-theme", theme)
            toggleTheme(theme)
        }),
        $("<span>", { class: "dm-switch-slider dm-switch-round" })
    )
}


class ModalWindow {
    constructor() {
        this.#createModalWindowCloser()
    }

    #createModalWindowCloser() {
        $("<span>").attr("id", "dm-modal-header").html("&times;").click(this.closer())
            .appendTo($("#dm-modal-header-container")).hide()
    }

    /**
     * Create callback function to open the modal window.
     * @param {string} targetId - ID of modal window to open.
     * @returns {function(): undefined} Callback function to open the window.
     */
    opener(targetId) {
        return () => {
            config.pageURL.hash = targetId
            $(targetId).fadeIn(300)
            $("#dm-modal-header").fadeIn(300)
        }
    }

    /**
     * Create callback function to close all modal windows.
     * @returns {function(): undefined} Callback function to close all modal windows.
     */
    closer() {
        return () => {
            config.pageURL.hash = ""
            $(".dm-modal").fadeOut(300)
            $("#dm-modal-header").fadeOut(300)
        }
    }
}

/* Instance to export. */
const modalWindow = new ModalWindow()


export { createThemeSwitch, modalWindow, toggleTheme }
