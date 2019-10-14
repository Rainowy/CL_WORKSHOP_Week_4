document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM content fully loaded and parsed")

    ajaxMethod()
    addSubmitListener()

})

function ajaxMethod(methodParam, book) {

    let data
    let bookId = ""
    let ajaxParam = ""
    if (methodParam === undefined) {
        ajaxParam = "GET"
    }
    else if (methodParam === "POST") {
        ajaxParam = "POST"
        data = JSON.stringify(book)
    }
    else if (methodParam === "DELETE") {
        ajaxParam = "DELETE"

        bookId = book.id
    }
    else {
        ajaxParam = "PUT"
        bookId = book.id
        data = JSON.stringify(book)
    }
    $.ajax({
        url: "http://localhost:8282/books/" + bookId,
        data: data,
        type: ajaxParam,
        dataType: "json",
        contentType: "application/json"
    }).done(function (data) {
        if (data !== null && (methodParam !== "DELETE" && methodParam !== "PUT")) {

            printBooks(data, "POST")
        }
        else if (methodParam === "DELETE") {  //kasuje element z pasującym id
            let bookToDel = document.querySelector("[data-id=" + "'" + book.id + "'");
            bookToDel.parentElement.removeChild(bookToDel)
        }
        else {
            let bookToModify = document.querySelector("[data-id=" + "'" + book.id + "'");

            printBooks(book, "PUT", bookToModify)
        }

    }).fail(function (xhr, status, err) {
        console.log("błąd")

    }).always(function (xhr, status) {
        addDeleteButtonListener()
        addModifyButtonListener()
    })
}

function addSubmitListener() {

    let form = document.querySelector("form");
    form.addEventListener("submit", function (event) {
        event.preventDefault()
        //sprawdzamy czy id z formularza puste, jeśli tak to POST, jeśli nie to PUT
        let formId = document.getElementById("id")

        if (formId.dataset.id === undefined) {
            let book = getFormParams()
            // wysyłamy POSTEm
            ajaxMethod("POST", book)
        }
        else {  //aktualizacja PUTem

            let {isbn, title, author, publisher, type} = getFormParams()
            let id = formId.dataset.id
            let book = {id, isbn, title, author, publisher, type}

            ajaxMethod("PUT", book)
        }
    })
}

function addModifyButtonListener() {

    let formId = document.getElementById("id")

    let modifyEl = document.querySelectorAll(".modify");

    let id = ""
    modifyEl.forEach(modifyBtn => {
        modifyBtn.addEventListener("click", function (event) {
            event.stopImmediatePropagation()
            id = this.parentElement.dataset.id
            formId.dataset.id = this.parentElement.dataset.id

            document.getElementById("title").setAttribute("value", this.parentElement.dataset.title)
            document.getElementById("author").setAttribute("value", this.parentElement.dataset.author)
            document.getElementById("isbn").setAttribute("value", this.parentElement.dataset.isbn)
            document.getElementById("publisher").setAttribute("value", this.parentElement.dataset.publisher)
            document.getElementById("type").setAttribute("value", this.parentElement.dataset.type)
        })
    })
}

function addDeleteButtonListener() {

    $('li').on('click', '.delete', function () {
        let id = this.parentElement.dataset.id
        let book = {id}
        ajaxMethod("DELETE", book)
    });
}

function addLiElementListener() {

    $('ul').on('click', 'li', function () {
        this.firstElementChild.classList.toggle("hidden")
    });
}

function printBooks(data, ajaxParam, bookToModify) {
    let form = document.querySelector("form");

    if (data.length === undefined) {    //data is single object
        if (ajaxParam === "POST") {

            let {newLiEl, newDivEl, newDeleteButton, newModifyButton} = createElements();

            newLiEl = setDataAndAppend(newLiEl, newDivEl, newDeleteButton, newModifyButton, data);

            document.querySelector("ul").appendChild(newLiEl)

            addLiElementListener()
            form.reset()
        }
        else {
            let {newLiEl, newDivEl, newDeleteButton, newModifyButton} = createElements();

            newLiEl = setDataAndAppend(newLiEl, newDivEl, newDeleteButton, newModifyButton, data);

            document.querySelector("ul").replaceChild(newLiEl, bookToModify)

            let formId = document.getElementById("id")
            formId.removeAttribute("data-id")

            form.querySelectorAll("input").forEach(input => {
                input.removeAttribute("value")
            })
            form.reset()
            addDeleteButtonListener()
            addModifyButtonListener()
            addLiElementListener()
        }
    }
    else {  //data is an array

        let ulEl = document.createElement("ul");

        data.forEach(book => {

            let {newLiEl, newDivEl, newDeleteButton, newModifyButton} = createElements();

            newLiEl = setDataAndAppend(newLiEl, newDivEl, newDeleteButton, newModifyButton, book);

            ulEl.appendChild(newLiEl)

            document.querySelector("body").insertBefore(ulEl, document.querySelector("form"))
        });
    }
    addLiElementListener()
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

function setDataAndAppend(newLiEl, newDivEl, newDeleteButton, newModifyButton, book) {

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

    return newLiEl
}

