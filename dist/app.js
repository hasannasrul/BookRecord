//####################### Book Class: Represent a book  #########################
class Book {
    constructor(name, author, year) {
        this.name = name;
        this.author = author;
        this.year = year;
    }
}

//################### UI Class: Handle UI Task  ###############################
class UI {

    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.getElementById('booklist');
        const row = document.createElement('tr');

        row.innerHTML = `
        <td class="text-light">${book.name}</td>
        <td class="text-light">${book.author}</td>
        <td class="text-light">${book.year}</td>
        <td><a href='#' class="btn btn-danger deleteClass">Delete</a></td>
        `;
        list.appendChild(row);
    }

    static removeBook(el) {
        if (el.classList.contains('deleteClass')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlerts(message, bclass) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${bclass}`;
        alert.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.getElementById('submit');
        container.insertBefore(alert, form);
        //vanish in 3 sec
        setTimeout(() => document.querySelector('.alert').remove(), 1500)
    }

    static clearFields() {
        document.getElementById('submit').reset();
    }
}

//########################  display books   ################################

document.addEventListener('DOMContentLoaded', UI.displayBooks);

//#########################   Store Class: Handles Storage  ##########################

class Store {

    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(year) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.year === year) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));

    }

}


//########################  Event: Add a Book   ######################################
document.getElementById('submit').addEventListener('submit', e => {
    //prevent default
    e.preventDefault();
    // Form values
    const name = document.getElementById('bookname').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;

    //validate
    if (name === '' || author === '' || year === '') {
        UI.showAlerts('please fill in all the fields', 'danger');
    } else {
        //instantiate Books
        const newBook = new Book(name, author, year);

        //add book to ui
        UI.addBookToList(newBook);

        //add book to storage
        Store.addBook(newBook);

        //show added book alert
        UI.showAlerts('Book Added successfully', 'success');

        //for resetting the fields
        UI.clearFields();
    }



})


//###########################   Event: Remove a Book    ###########################



document.getElementById('booklist').addEventListener('click', (e) => {
    //remove book from ui
    UI.removeBook(e.target);

    //remove from storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // show success message
    UI.showAlerts('Book removed', 'success');
    
});