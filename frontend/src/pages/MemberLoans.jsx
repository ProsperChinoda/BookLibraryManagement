import React, { useEffect, useState } from 'react';
import api from "../api"

const MemberLoans = ({ memberId }) => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        api.get(`/api/members/${memberId}/history/`).then(res => setHistory(res.data));
    }, [memberId]);

    return (
        <div>
            <h1>Member History</h1>
            <ul>
                {history.map(loan => (
                    <li key={loan.id}>
                        Loan ID: {loan.id}, Due Date: {loan.due_date}, Returned: {loan.returned_date ? 'Yes' : 'No'}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MemberLoans;