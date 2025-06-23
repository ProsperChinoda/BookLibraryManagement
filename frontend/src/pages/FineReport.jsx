import React, { useEffect, useState } from 'react';
import api from "../api";

const FineReport = () => {
    const [fines, setFines] = useState([]);

    useEffect(() => {
        api.get('/api/fines/').then(res => setFines(res.data));
    }, []);

    return (
        <div>
            <h1>Overdue Fines</h1>
            <ul>
                {fines.map(fine => (
                    <li key={fine.loan_id}>
                        Loan ID: {fine.loan_id}, Fine Amount: ${fine.fine_amount.toFixed(2)}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FineReport;