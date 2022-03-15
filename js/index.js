"use strict"

// const taggedElements = document.getElementsByClassName("dm-link")
// const linkElem = document.createElement("i")
// linkElem.classList.add("fa", "fa-hashtag")
// linkElem.setAttribute("aria-hidden", "true")
// for (let element of taggedElements) {
//     linkElem.id = ""
//     console.log(element)
//     element.insertBefore(linkElem, element.firstChild)
// }

const rootURL = document.URL

const markdownRootPath = "./mdcontent/"
const markdownPath = (title) => markdownRootPath + title + ".md"

const markdownBox = document.getElementsByClassName("dm-md-content")
for (let box of markdownBox) {
    const path = markdownPath(box.title)
    axios.get(path).then(
        (response) => {
            const parsedHTML = marked.parse(response.data)
            box.innerHTML = DOMPurify.sanitize(parsedHTML)
        }
    )
    for (elem of box.children) {  // async??
        elem.classList.add("dm-md-element")
        if (elem.id !== "") {
            elem.innerHTML += `<a class="anchor" href="#${box.title}"><i class="fa fa-hashtag"></i></a>`
        }
    }
}
