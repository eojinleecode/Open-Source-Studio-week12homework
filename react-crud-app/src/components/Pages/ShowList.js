import React, { useEffect, useState, useRef } from "react";

const API_URL = "https://6924597a3ad095fb8473d8b4.mockapi.io/students";

function ShowList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentId, setCurrentId] = useState(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [major, setMajor] = useState("");
  const [email, setEmail] = useState("");

  const [modalTitle, setModalTitle] = useState("Add Student");

  const modalRef = useRef(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openModal = () => {
    const modal = window.bootstrap.Modal.getOrCreateInstance(modalRef.current);
    modal.show();
  };

  const closeModal = () => {
    const modal = window.bootstrap.Modal.getInstance(modalRef.current);
    if (modal) modal.hide();
  };

  const handleAddClick = () => {
    setModalTitle("Add Student");
    setCurrentId(null);
    setName("");
    setAge("");
    setMajor("");
    setEmail("");
    openModal();
  };

  const handleEditClick = (student) => {
    setModalTitle("Edit Student");
    setCurrentId(student.id);
    setName(student.name || "");
    setAge(student.age || "");
    setMajor(student.major || "");
    setEmail(student.email || "");
    openModal();
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Delete student?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      loadData();
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      age: Number(age),
      major,
      email,
    };

    try {
      if (currentId) {
        await fetch(`${API_URL}/${currentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      closeModal();
      loadData();
    } catch (err) {
      console.error(err);
      alert("Save failed.");
    }
  };
{};
  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Student List (React CRUD)</h2>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={loadData} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </button>
          <button className="btn btn-primary" onClick={handleAddClick}>
            Add Student
          </button>
        </div>
      </div>

      <div className="table-responsive shadow-sm rounded bg-white p-3">
        <table className="table table-striped table-hover mb-0">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Major</th>
              <th>Age</th>
              <th>Email</th>
              <th style={{ width: "160px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">No data.</td>
              </tr>
            ) : (
              students.map((st) => (
                <tr key={st.id}>
                  <td>{st.id}</td>
                  <td>{st.name}</td>
                  <td>{st.major}</td>
                  <td>{st.age}</td>
                  <td>{st.email}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditClick(st)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteClick(st.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="modal fade" id="studentModal" tabIndex="-1" aria-hidden="true" ref={modalRef}>
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{modalTitle}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}></button>
            </div>

            <div className="modal-body">
              <input className="form-control mb-3" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} required/>
              <input type="number" className="form-control mb-3" placeholder="Age" value={age} onChange={(e)=>setAge(e.target.value)} required/>
              <input className="form-control mb-3" placeholder="Major" value={major} onChange={(e)=>setMajor(e.target.value)} required/>
              <input type="email" className="form-control mb-3" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={closeModal}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ShowList;
