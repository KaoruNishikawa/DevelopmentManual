"use strict"

// const rootURL = document.URL

const markdownRootPath = "./mdcontent/"
const markdownPath = (title) => markdownRootPath + title + ".md"

const anchorFAClass = "fa fa-hashtag"
const anchorHTML = (link) => `<a class="anchor" href="#${link}"><i class="${anchorFAClass}"></i></a>`

const markdownBox = document.getElementsByClassName("dm-md-content")
for (let box of markdownBox) {
    const path = markdownPath(box.title)
    axios.get(path).then(
        response => {
            const parsedHTML = marked.parse(response.data)
            box.innerHTML = DOMPurify.sanitize(parsedHTML)
        }
    ).then(
        _ => {
            for (elem of box.children) {
                elem.classList.add("dm-md-element")
                if (elem.id !== "") {
                    elem.innerHTML += anchorHTML(elem.id)
                }
                console.log(`add anchor @${elem.id}`)
            }
        }
    )
}
