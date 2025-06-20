import { useState, useEffect } from "react";
import api from "../api";
import Book from "../components/Book"
import "../styles/Home.css"

function Home() {
    const [books, setBooks] = useState([]);
    const [isbn, setISBN] = useState("");
    const [title, setTitle] = useState("");
    const [publisher, setPublisher] = useState("");
    const [pub_year, setPubYear] = useState("");
    const [genre, setGenre] = useState("");
    const [currentBookId, setCurrentBookId] = useState(null);

    useEffect(() => {
        getBooks();
    }, []);

    const getBooks = () => {
        api
            .get("/api/book/")
            .then((res) => res.data)
            .then((data) => {
                setBooks(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const deleteBook = (id) => {
        api
            .delete(`/api/book/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Book deleted!");
                else alert("Failed to delete book.");
                getBooks();
                resetForm();
            })
            .catch((error) => alert(error));
    };

    const createBook = (e) => {
        e.preventDefault();
        api
            .post("/api/book/", { isbn, title, publisher, pub_year, genre })
            .then((res) => {
                if (res.status === 201) alert("Book created!");
                else alert("Failed to make book.");
                getBooks();
                resetForm();
            })
            .catch((err) => alert(err));
    };

    const updateBook = (id, updatedBook) => {
    api
        .put(`/api/book/${id}/`, updatedBook)
        .then((res) => {
            if (res.status === 200) alert("Book updated!");
            else alert("Failed to update book.");
            getBooks();
            resetForm();
        })
        .catch((error) => alert(error));
};

const handleUpdate = (book) => {
        setISBN(book.isbn);
        setTitle(book.title);
        setPublisher(book.publisher);
        setPubYear(book.pub_year);
        setGenre(book.genre);
        setCurrentBookId(book.id);
};

const handleBook = (e) => {
    e.preventDefault();
    const updatedBook = { isbn, title, publisher, pub_year, genre };

        if (currentBookId) {
            updateBook(currentBookId, updatedBook); 
        } else {
            createBook(e);
        }
};

const resetForm = () => {
    setISBN("");
    setTitle("");
    setPublisher("");
    setPubYear("");
    setGenre("");
    setCurrentBookId(null);
}


    return (
        <div>
            <div>
                <h2>Book</h2>
                {books.map((book) => (
                    <Book book={book} onDelete={deleteBook} key={book.id} onEdit={handleUpdate} />
                ))}
            </div>
            <h2>{ currentBookId ? "Update Book" : "Create a Book"}</h2>
            <form onSubmit={handleBook}>
                <label htmlFor="isbn">ISBN:</label>
                <br />
                <input
                    type="text"
                    id="isbn"
                    name="isbn"
                    required
                    onChange={(e) => setISBN(e.target.value)}
                    value={isbn}
                />
                <br /><br />
                <label htmlFor="title">Title:</label>
                <br />
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
                <br /><br />
                <label htmlFor="publisher">Publisher:</label>
                <br />
                <input
                    type="text"
                    id="publisher"
                    name="publisher"
                    required
                    onChange={(e) => setPublisher(e.target.value)}
                    value={publisher}
                />
                <br /><br />
                <label htmlFor="pub_year">Publisher Year:</label>
                <br />
                <input
                    type="number"
                    id="pub_year"
                    name="pub_year"
                    required
                    onChange={(e) => setPubYear(e.target.value)}
                    value={pub_year}
                />
                <br /><br />
                <label htmlFor="genre">Genre:</label>
                <br />
                <textarea
                    id="genre"
                    name="genre"
                    required
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                ></textarea>
                <br />
                <input type="submit" value={currentBookId ? "Update" : "Submit"}></input>
            </form>
        </div>
    );
}

export default Home;