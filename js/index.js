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

const markdownBox = document.getElementsByClassName("dm-md-content")
for (let box of markdownBox) {
    const path = "./mdcontent/" + box.title + ".md"
    axios.get(path).then(
        (response) => {
            const parsedHTML = marked(response.data)
            // parsedHTML.q
            console.log(parsedHTML)
            box.innerHTML = parsedHTML
        }
    )
}
axios.get()
