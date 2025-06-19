import React from "react";
import "../styles/Book.css"

function Book({ book, onDelete}) {

    return (
        <div className="book-container">
            <p className="book-isbn">{book.isbn}</p>
            <p className="book-title">{book.title}</p>
            <p className="book-publisher">{book.publisher}</p>
            <p className="book-pubyear">{book.pub_year}</p>
            <p className="book-genre">{book.genre}</p>
            <button className="delete-button" onClick={() => onDelete(book.id)}>
                Delete
            </button>
        </div>
    );
}

export default Book