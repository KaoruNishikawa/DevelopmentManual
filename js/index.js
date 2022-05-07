"use strict"

import * as config from "./config.js"
import { MarkdownRenderer } from "./markdown.js"
import * as trans from "./transition.js"
import * as utils from "./utils.js"


console.info("Thank you for visiting here!")

/* Avoid FOUC */
$("body").hide()

$(document).ready(
    () => {
        /* Header icons */
        $("#dm-this-page-url").append(config.urlGetter)
        $("#dm-theme-switch").append(
            trans.createThemeSwitch(config.urlParser.dataTheme !== "light")
        )

        /* Show bookmark */
        utils.showBookmark("./static/json/bookmark.json")

        /* Load and Render Markdown Files */
        const mdFileRoot = "./static/md"
        const mdLoadPromise = []
        for (let titleDiv of $(".dm-md-content")) {
            const fileName = titleDiv.id.split("-")[1]
            mdLoadPromise.push(MarkdownRenderer.renderMarkdown(
                `${mdFileRoot}/${fileName}.md`, titleDiv
            ))
        }

        /* All Elements Rendered */
        Promise.all(mdLoadPromise).then(() => {
            /* Open parsed location */
            config.urlParser.transit()
            /* Show page */
            trans.fade($("body").show(), "in", 500)
            config.urlParser.jump()
        })
    }
)
