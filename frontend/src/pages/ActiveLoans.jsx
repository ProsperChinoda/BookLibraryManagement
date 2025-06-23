import React, { useEffect, useState } from 'react';
import api from '../api';


const ActiveLoans = () => {
    const [loans, setLoans] = useState([]);

    useEffect(() => {
        api.get('/api/active_loans/').then(res => setLoans(res.data));
    }, []);

    return (
        <div>
            <h1>Active Loans</h1>
            <ul>
                {loans.map(loan => (
                    <li key={loan.id}>
                        Loan ID: {loan.id}, Due Date: {loan.due_date}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActiveLoans;