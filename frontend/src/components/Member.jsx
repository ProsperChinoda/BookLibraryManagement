import React from "react";
import "../styles/Book.css"

function Member({ member, onDelete, onEdit}) {

    return (
        <div className="book-container">
            <p className="book-isbn">{member.name}</p>
            <p className="book-title">{member.email}</p>
            <p className="book-pubyear">{member.phone}</p>
            <p className="book-genre">{member.status}</p>
            <button className="delete-button" onClick={() => onDelete(member.id)}>
                Delete
            </button>
            <button className="update-button" onClick={() => onEdit(member)}>
                Update
            </button>
        </div>
    );
}

export default Member