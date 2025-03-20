import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [members, setMembers] = useState([]);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/admin/get-members')
      .then(response => setMembers(response.data))
      .catch(error => console.log(error));
  }, []);

  const lockMember = (id) => {
    axios.put(`/api/admin/lock-member/${id}`)
      .then(() => {
        setMembers(members.map(member => member.id === id ? { ...member, isLocked: true } : member));
        // Handle success notification
      })
      .catch(error => console.log(error));
  };

  const unlockMember = (id) => {
    axios.put(`/api/admin/unlock-member/${id}`)
      .then(() => {
        setMembers(members.map(member => member.id === id ? { ...member, isLocked: false } : member));
        // Handle success notification
      })
      .catch(error => console.log(error));
  };

  const deleteMember = (id) => {
    axios.delete(`/api/admin/delete-member/${id}`)
      .then(() => {
        setMembers(members.filter(member => member.id !== id));
        setMemberToDelete(null);
        // Handle success notification
      })
      .catch(error => console.log(error));
  };

  return (
    <div>
      <div className="my-3">
        <button className="btn btn-outline-primary" onClick={() => navigate('/admin/add-edit-member')}>Create Member</button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr className="table-warning">
            <th>Username</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Date created</th>
            <th>Roles</th>
            <th className="text-center">Lock / Unlock</th>
            <th className="text-center">Edit / Delete</th>
          </tr>
        </thead>
        <tbody>
          {members.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">No Members</td>
            </tr>
          ) : (
            members.map(member => (
              <tr key={member.id}>
                <td>{member.userName}</td>
                <td>{member.firstName}</td>
                <td>{member.lastName}</td>
                <td>{new Date(member.dateCreated).toLocaleDateString()}</td>
                <td>{member.roles.join(', ')}</td>
                <td className="text-center">
                  {!member.isLocked ? (
                    <button className="btn btn-warning btn-sm me-2" onClick={() => lockMember(member.id)}>Lock</button>
                  ) : (
                    <button className="btn btn-success btn-sm" onClick={() => unlockMember(member.id)}>Unlock</button>
                  )}
                </td>
                <td className="text-center">
                  <button className="btn btn-primary btn-sm me-2" onClick={() => navigate(`/admin/add-edit-member/${member.id}`)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => setMemberToDelete(member)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {memberToDelete && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body text-center">
                <p>Are you sure you want to delete {memberToDelete.userName}?</p>
                <button className="btn btn-default me-2" onClick={() => deleteMember(memberToDelete.id)}>Yes</button>
                <button className="btn btn-primary" onClick={() => setMemberToDelete(null)}>No</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;