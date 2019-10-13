document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM content fully loaded and parsed")

    ajaxMethod()
    addSubmitListener()

//todo odświeżanie strony po kasowaniu
    // todo po dodaniu elementu żeby nie przeładowywało strony
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
        let książka = book.id
        console.log(książka)
        bookId = book.id
    }
    $.ajax({
        url: "http://localhost:8282/books/" + bookId,
        data: data,
        type: ajaxParam,
        dataType: "json",
        contentType: "application/json"
    }).done(function (data) {
        if (data !== null && methodParam !== "DELETE") {
            // if () {
                console.log(data)
                printBooks(data)
                addDeleteButtonListener()
            //}
        }

    }).fail(function (xhr, status, err) {
        console.log("błąd")

    }).always(function (xhr, status) {


    })

}

function addSubmitListener() {

    let form = document.querySelector("form");
    form.addEventListener("submit", function (event) {

        let book = getFormParams()
        //sprawdzamy czy id z formularza puste, jeśli tak to POST, jeśli nie to PUT
        let formId = document.getElementById("id")
        if (formId.dataset.id === undefined) {
            // wysyłamy POSTEm
            ajaxMethod("POST", book)
        }
        else {
            ajaxMethod("PUT", book)
        }
        //event.preventDefault()
    })
}

function addDeleteButtonListener() {

    let deleteEl = document.querySelectorAll(".delete");
    console.log(deleteEl)

    deleteEl.forEach(deleteBtn => {
        deleteBtn.addEventListener("click", function (event) {
            //let caller = event.target
            console.log(this)
            let id = this.parentElement.dataset.id
            let book = {id}
            ajaxMethod("DELETE", book)
        })
    })


}

function printBooks(data) {

    let ulEl = document.createElement("ul");

   // if(data !== null) {
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
   // }
    //else console.log("data null")
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

