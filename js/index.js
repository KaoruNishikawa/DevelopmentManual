"use strict"

const taggedElements = document.getElementsByClassName("dm-link")
const linkElem = document.createElement("i")
linkElem.classList.add("fa", "fa-hashtag")
linkElem.setAttribute("aria-hidden", "true")
for (let element of taggedElements) {
    linkElem.id = ""
    element.insertBefore(linkElem, element.firstChild,)
}
