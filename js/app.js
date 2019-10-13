document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM content fully loaded and parsed")

    ajaxMethod()
    addSubmitListener()

})


function ajaxMethod(methodParam,book) {

    let data
    // console.log(methodParam)
    let ajaxParam = ""
    if (methodParam === undefined) {
        ajaxParam = "GET"
        data = null
    }
    else if(methodParam === "POST"){
        ajaxParam = "POST"
        data = JSON.stringify(book)
    }
        $.ajax({
            url: "http://localhost:8282/books",
            data: data,
            type: ajaxParam,
            dataType: "json",
            contentType: "application/json"
        }).done(function (data) {

            if (ajaxParam = "GET") {
                printBooks(data)
            }
            // else if(ajaxParam = "POST"){
            //     printBooks(data)
            // }

        }).fail(function (xhr, status, err) {
            console.log("błąd")

        }).always(function (xhr, status) {


        })

}

function addSubmitListener() {

    let form = document.querySelector("form");
    form.addEventListener("submit", function (event) {

        let book = getFormParams()
        console.log(book)

        //sprawdzamy czy id z formularza puste, jeśli tak to POST, jeśli nie to PUT
        let formId = document.getElementById("id")
        if(formId.dataset.id === undefined ){
           // wysyłamy POSTEm
            ajaxMethod("POST",book)
        }

    })

}

function printBooks(data) {

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
    document.querySelector("body").insertBefore(ulEl, document.querySelector("form"))

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

function getFormParams() {

    let isbn = document.getElementById("isbn").value
    let title = document.getElementById("title").value
    let author = document.getElementById("author").value
    let publisher = document.getElementById("publisher").value
    let type = document.getElementById("type").value

    return {isbn, title, author, publisher, type}
}

