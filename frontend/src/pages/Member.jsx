import { useState, useEffect } from "react";
import api from "../api";
import Member from "../components/Member"
import "../styles/Home.css"

function Main() {
    const [members, setMembers] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [status, setStatus] = useState("");
    const [editingMemberId, setEditingMemberId] = useState(null);

    useEffect(() => {
        getMembers();
    }, []);
    
    const getMembers = () => {
        api
            .get("/api/member/")
            .then((res) => res.data)
            .then((data) => {
                setMembers(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const deleteMember  = (id) => {
        api
        .delete(`/api/member/${id}/`)
        .then((res) => {
            if (res.status === 204) alert("Member deleted!");
            else alert("Failed to delete book.");
            getMembers();
            resetForm();
        })
        .catch((error) => alert(error));
    };

     const createMember = (e) => {
        e.preventDefault();
        api
            .post("/api/member/", { name, email, phone, status })
            .then((res) => {
                if (res.status === 201) alert("Member created!");
                else alert("Failed to create member.");
                getMembers();
                resetForm();
            })
            .catch((err) => alert(err));
    };

     const updateMember = (id, updatedMember) => {
    api
        .put(`/api/member/${id}/`, updatedMember)
        .then((res) => {
            if (res.status === 200) alert("Member updated!");
            else alert("Failed to update member.");
            getMembers();
            resetForm();
        })
        .catch((error) => alert(error));
};   
    const handleUpdate = (member) => {
            setName(member.name);
            setEmail(member.email);
            setPhone(member.phone);
            setStatus(member.status);
            setEditingMemberId(member.id)
    };

    const handleMember = (e) => {
        e.preventDefault();
        const updatedMember = { name, email, phone, status};

        if (editingMemberId) {
            updateMember(editingMemberId, updatedMember)
        } else {
            createMember(e);
        }
    };

        const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setStatus("");
    setEditingMemberId(null);
};

    return (
    <div>
        <div>
            <h2>Member</h2>
                {members.map((member) => (
                    <Member member={member} onDelete={deleteMember} key={member.id} onEdit={handleUpdate} />
                ))}
        </div>
        <h2>{ editingMemberId ? "Update Member" : "Create a Member"}</h2>
        <form onSubmit={handleMember}>
        <label htmlFor="name">Full Name:</label>
                <br />
                <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
                <br /><br />
                <label htmlFor="email">Email:</label>
                <br />
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <br /><br />
                <label htmlFor="phone">Phone:</label>
                <br />
                <input
                    type="number"
                    id="phone"
                    name="phone"
                    required
                    onChange={(e) => setPhone(e.target.value)}
                    value={phone}
                />
                <br /><br />
                <label htmlFor="status">Status:</label>
                <br />
                <select onChange={(e) => setStatus(e.target.value)}
                    value={status}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
                <br />
                <input type="submit" value={editingMemberId ? "Update" : "Submit"} ></input>
        </form> 
    </div>
    );
}
export default Main;