document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM content fully loaded and parsed")

    ajaxMethod()

})


function ajaxMethod(methodParam) {

    // console.log(methodParam)
    let ajaxParam = ""
    if (methodParam === undefined) {
        ajaxParam = "GET"


        $.ajax({
            url: "http://localhost:8282/books",
            type: ajaxParam,
            dataType: "json",
            contentType: "application/json"
        }).done(function (data) {

            if (ajaxParam = "GET") {
                printBooksList(data)
            }

        }).fail(function (xhr, status, err) {
            console.log("błąd")

        }).always(function (xhr, status) {


        })


    }
}

function printBooksList(data) {

    let ulEl = document.createElement("ul");



    data.forEach(book => {

        let {newLiEl, newDivEl, newDeleteButton, newModifyButton} = createElements();

    newLiEl.dataset.id = book.id
    newLiEl.dataset.isbn = book.isbn
    newLiEl.dataset.title = book.title
    newLiEl.dataset.author = book.author
    newLiEl.dataset.publisher = book.publisher
    newLiEl.dataset.type = book.type

    newLiEl.innerText = "Nazwa: " + book.title + " || Autor: " + book.author

    newDivEl.innerText = "Id " + book.id + " || Isbn " + book.isbn + " || Publisher " + book.publisher + " || Type " + book.type

    newLiEl.appendChild(newDivEl)
    newLiEl.appendChild(newDeleteButton)
    newLiEl.appendChild(newModifyButton)
    ulEl.appendChild(newLiEl)
});
    document.querySelector("body").insertBefore(ulEl,document.querySelector("form"))

}

function createElements() {
    let newLiEl = document.createElement("li");
    let newDivEl = document.createElement("div")
    newDivEl.classList.add("hidden")
    newDivEl.style.backgroundColor = "yellow"

    let newDeleteButton = document.createElement("button")
    newDeleteButton.innerText = "KASUJ"
    newDeleteButton.classList.add("delete")

    let newModifyButton = document.createElement("button")
    newModifyButton.innerText = "MODYFIKUJ"
    newModifyButton.classList.add("modify")
    return {newLiEl, newDivEl, newDeleteButton, newModifyButton};
}