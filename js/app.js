document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM content fully loaded and parsed")
    ajaxMethod()
    addSubmitListener()
    //addLiElementListener()


//todo odświeżanie strony po kasowaniu
    // todo po dodaniu elementu żeby nie przeładowywało strony
})


function ajaxMethod(methodParam, book) {
    //addLiElementListener()
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
        // let książka = book.id
        // console.log(książka)
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
        console.log(data)
        if (data !== null && (methodParam !== "DELETE" && methodParam !== "PUT")) {
            printBooks(data, "POST")
            //addLiElementListener()

            //takbyło
             addDeleteButtonListener()
             addModifyButtonListener()


        }
        else if (methodParam === "DELETE") {  //kasuje element z pasującym id
            // let bookToDel = document.querySelector("[data-id=" + "'" + book.id + "'");
            let bookToDel = document.querySelector("[data-id=" + "'" + book.id + "'");
            bookToDel.parentElement.removeChild(bookToDel)
            // addLiElementListener()
        }
        else {
            // addLiElementListener()
            let bookToModify = document.querySelector("[data-id=" + "'" + book.id + "'");
            console.log("modyfikacja")
            printBooks(book, "PUT", bookToModify)
        }

    }).fail(function (xhr, status, err) {
        console.log("błąd")

    }).always(function (xhr, status) {
        //addLiElementListener()

//addLiElementListener()
    })
    // addLiElementListener()
}

function addSubmitListener() {

    let form = document.querySelector("form");
    form.addEventListener("submit", function (event) {
        event.preventDefault()


        //console.log(book)

        //sprawdzamy czy id z formularza puste, jeśli tak to POST, jeśli nie to PUT
        let formId = document.getElementById("id")
        //if (formId.dataset.id === "") {
        if (formId.dataset.id === undefined) {
            let book = getFormParams()
            // wysyłamy POSTEm
            ajaxMethod("POST", book)
            console.log("POSTEEEEM")
        }
        else {  //aktualizacja PUTem
            //let book = getFormParams()
            //book = {formId,book}
            let {isbn, title, author, publisher, type} = getFormParams()
            let id = formId.dataset.id
            let book = {id, isbn, title, author, publisher, type}
            //todo zmodyfikować aby wysyłało książkę z id
            ajaxMethod("PUT", book)
            console.log("PUTTEM")
            console.log(book)
        }
        console.log("SPAGETTI")

    })
}

function addModifyButtonListener() {

    let formId = document.getElementById("id")

    let modifyEl = document.querySelectorAll(".modify");
    console.log(modifyEl)

    let id = ""
    modifyEl.forEach(modifyBtn => {
        modifyBtn.addEventListener("click", function (event) {
            event.stopImmediatePropagation()
            console.log(this.parentElement.dataset.id)
            id = this.parentElement.dataset.id
            formId.dataset.id = this.parentElement.dataset.id

            document.getElementById("title").setAttribute("value", this.parentElement.dataset.title)
            document.getElementById("author").setAttribute("value", this.parentElement.dataset.author)
            document.getElementById("isbn").setAttribute("value", this.parentElement.dataset.isbn)
            document.getElementById("publisher").setAttribute("value", this.parentElement.dataset.publisher)
            document.getElementById("type").setAttribute("value", this.parentElement.dataset.type)
        })
    })
    // console.log(id)
    //
    // formId.dataset.id = id

    // let {isbn, title, author, publisher,type} = getFormParams();
    // let book = {id,isbn,title,author,publisher,type}
}

function addDeleteButtonListener() {

    // let deleteEl = document.querySelectorAll(".delete");
    // console.log(deleteEl)
    //
    // deleteEl.forEach(deleteBtn => {
    //     deleteBtn.addEventListener("click", function (event) {
    //         event.stopImmediatePropagation()
    //         //let caller = event.target
    //         console.log(this)
    //         let id = this.parentElement.dataset.id
    //         let book = {id}
    //         ajaxMethod("DELETE", book)
    //     })
    // })
    $('li').on('click', '.delete', function () {
        let id = this.parentElement.dataset.id
        let book = {id}
        ajaxMethod("DELETE", book)


        //do something
    });

}

function addLiElementListener() {
    // var ulEl = document.querySelector("ul")
    // var ul = $("ul")
    // ul.on('click', 'li', function () {
    //     //this.firstElementChild.classList.add("hidden")
    //     this.firstElementChild.classList.toggle("hidden")
    //
    // })
    // let liEl = document.querySelectorAll("li");
    // liEl.forEach(li => {
    //     //li.firstElementChild.classList.add("hidden")
    //     li.addEventListener("click", function (event) {
    //          event.stopPropagation()
    //         this.firstElementChild.classList.toggle("hidden")
    //     })
    // })
    $('ul').on('click', 'li', function () {
        // let id = this.parentElement.dataset.id
        console.log("test")
        // let book = {id}
        // ajaxMethod("DELETE", book)
        // $(this).first().toggleClass("hidden")
        //this.querySelector("div").classList.toggle("hidden")
        this.firstElementChild.classList.toggle("hidden")
        console.log("UKRYWAMY")


        //do something
    });

}

function printBooks(data, ajaxParam, bookToModify) {
    // if (data === undefined) {
    //     let {newLiEl, newDivEl, newDeleteButton, newModifyButton} = createElements();
    //
    //     newLiEl = setDataAndAppend(newLiEl, newDivEl, newDeleteButton, newModifyButton, data);
    //
    //     document.querySelector("ul").replaceChild(bookToModify, newLiEl)
    // }

    if (data.length === undefined) {    //data is single object
        if (ajaxParam === "POST") {

            let {newLiEl, newDivEl, newDeleteButton, newModifyButton} = createElements();

            newLiEl = setDataAndAppend(newLiEl, newDivEl, newDeleteButton, newModifyButton, data);

            document.querySelector("ul").appendChild(newLiEl)

            // let {newLiEl, newDivEl, newDeleteButton, newModifyButton} = createElements();
            //
            // newLiEl = setDataAndAppend(newLiEl, newDivEl, newDeleteButton, newModifyButton, data);
            //
            // document.querySelector("ul").replaceChild(bookToModify,newLiEl)
            addLiElementListener()
            let form = document.querySelector("form");
            form.reset()
        }
        else {
            console.log(bookToModify)
            let {newLiEl, newDivEl, newDeleteButton, newModifyButton} = createElements();


            newLiEl = setDataAndAppend(newLiEl, newDivEl, newDeleteButton, newModifyButton, data);
            // ewLinEl.firstElementChild.addEventListener("click", function () {
            //
            //
            // })
            // newLiEl.firstElementChild.addEventListener("click",function () {
            //     newLiEl.classList.toggle("hidden")
            // })
            document.querySelector("ul").replaceChild(newLiEl, bookToModify)
            //addLiElementListener()
            //ajaxMethod()

            let formId = document.getElementById("id")
            //formId.dataset.id = undefined
            formId.removeAttribute("data-id")
            // let form = document.querySelector("form");
            // form.reset()

            // addLiElementListener()
             let allInputs = document.querySelectorAll("input");
            allInputs.forEach(input => {
                input.removeAttribute("value")
            })
            let form = document.querySelector("form");
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
             //addLiElementListener()
        });
    }
    console.log("KUUUURWAAAA")
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

