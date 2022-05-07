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

/**
 * Fade in/out the element.
 * @param {jQuery} $element - Element to apply the animation.
 * @param {string} direction - Fade "in" or "out".
 * @param {int} duration - Duration of animation in [ms].
 * @param {function(): undefined} callback - Function to be called on fade complete.
 * @returns {jQuery} Element(s) the animation is applied.
 */
function fade($element, direction, duration, callback) {
    if (!["in", "out"].includes(direction.toLowerCase())) {
        throw "`direction` should be 'in' or 'out'."
    }
    const [start, end] = (direction.toLowerCase() === "in") ? [0, 1] : [1, 0]
    return $element
        .animate({ opacity: start }, 0)
        .animate({ opacity: end }, { duration: duration, complete: callback })
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
            fade($(targetId).show(), "in", 500)
            fade($("#dm-modal-header").show(), "in", 500)
        }
    }

    /**
     * Create callback function to close all modal windows.
     * @returns {function(): undefined} Callback function to close all modal windows.
     */
    closer() {
        return () => {
            config.pageURL.hash = ""
            fade($(".dm-modal"), "out", 500, () => $(".dm-modal").hide())
            fade($("#dm-modal-header"), "out", 500, () => $("#dm-modal-header").hide())
        }
    }
}

/* Instance to export. */
const modalWindow = new ModalWindow()


export { createThemeSwitch, fade, modalWindow, toggleTheme }
