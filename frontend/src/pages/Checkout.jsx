import React, { useState, useEffect } from 'react';
import api from "../api";

const Checkout = () => {
    const [members, setMembers] = useState([]);
    const [bookCopies, setBookCopies] = useState([]);
    const [selectedMember, setSelectedMember] = useState('');
    const [selectedBookCopy, setSelectedBookCopy] = useState('');

    useEffect(() => {
        api.get('/api/member/').then(res => setMembers(res.data));
        api.get('/api/bookcopies/').then(res => setBookCopies(res.data));
    }, []);

    const handleCheckout = async () => {
        try {
            const response = api.post('/api/checkout/', {
                member_id: selectedMember,
                book_copy_id: selectedBookCopy
            });
            alert(`Loan created with ID: ${response.data.loan_id}`);
        } catch (error) {
            console.error("Error during checkout:", error);
        }
    };

    return (
        <div>
            <h1>Checkout</h1>
            <select onChange={(e) => setSelectedMember(e.target.value)}>
                <option>Select Member</option>
                {members.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                ))}
            </select>
            <select onChange={(e) => setSelectedBookCopy(e.target.value)}>
                <option>Select Book Copy</option>
                {bookCopies.map(copy => (
                    <option key={copy.id} value={copy.id}>{copy.copy_id}</option>
                ))}
            </select>
            <button onClick={handleCheckout}>Checkout</button>
        </div>
    );
};

export default Checkout;