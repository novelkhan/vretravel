import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import adminService from '../../services/AdminService';
import sharedService from '../../services/SharedService';
import { MemberView } from '../../models/admin';
import './Admin.css';

const AdminPage: React.FC = () => {
  const [members, setMembers] = useState<MemberView[]>([]);
  const [memberToDelete, setMemberToDelete] = useState<MemberView | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await adminService.getMembers();
        setMembers(data);
      } catch (error) {
        console.error('Failed to fetch members:', error);
      }
    };
    fetchMembers();
  }, []);

  const lockMember = async (id: string) => {
    try {
      await adminService.lockMember(id);
      handleLockUnlockFilterAndMessage(id, true);
    } catch (error) {
      console.error('Failed to lock member:', error);
    }
  };

  const unlockMember = async (id: string) => {
    try {
      await adminService.unlockMember(id);
      handleLockUnlockFilterAndMessage(id, false);
    } catch (error) {
      console.error('Failed to unlock member:', error);
    }
  };

  const deleteMember = (id: string) => {
    const member = members.find((m) => m.id === id);
    if (member) {
      setMemberToDelete(member);
      setShowModal(true);
    }
  };

  const confirmDelete = async () => {
    if (memberToDelete) {
      try {
        await adminService.deleteMember(memberToDelete.id);
        sharedService.showNotification(
          true,
          'Deleted',
          `Member of ${memberToDelete.userName} has been deleted!`
        );
        setMembers(members.filter((m) => m.id !== memberToDelete.id));
        setMemberToDelete(undefined);
        setShowModal(false);
      } catch (error) {
        console.error('Failed to delete member:', error);
      }
    }
  };

  const declineDelete = () => {
    setMemberToDelete(undefined);
    setShowModal(false);
  };

  const handleLockUnlockFilterAndMessage = (id: string, locking: boolean) => {
    const member = members.find((m) => m.id === id);
    if (member) {
      const updatedMembers = members.map((m) =>
        m.id === id ? { ...m, isLocked: locking } : m
      );
      setMembers(updatedMembers);
      sharedService.showNotification(
        true,
        locking ? 'Locked' : 'Unlocked',
        `${member.userName} member has been ${locking ? 'locked' : 'unlocked'}`
      );
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const titleCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <div className="container my-3">
      <div className="my-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate('/admin/add-edit-member')}
        >
          Create Member
        </button>
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
              <td colSpan={7} className="text-center">
                No Members
              </td>
            </tr>
          ) : (
            members.map((member) => (
              <tr key={member.id}>
                <td>{member.userName}</td>
                <td>{titleCase(member.firstName)}</td>
                <td>{titleCase(member.lastName)}</td>
                <td>{formatDate(member.dateCreated)}</td>
                <td>
                  {member.roles.map((role, index) => (
                    <span key={role}>
                      {role}
                      {index + 1 < member.roles.length ? ', ' : ''}
                    </span>
                  ))}
                </td>
                <td className="text-center">
                  {!member.isLocked ? (
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => lockMember(member.id)}
                    >
                      Lock
                    </button>
                  ) : (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => unlockMember(member.id)}
                    >
                      Unlock
                    </button>
                  )}
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => navigate(`/admin/add-edit-member/${member.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteMember(member.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Modal show={showModal} onHide={declineDelete} dialogClassName="modal-sm">
        <Modal.Body className="text-center">
          <p>Are you sure you want to delete {memberToDelete?.userName}?</p>
          <Button variant="secondary" onClick={confirmDelete} className="me-2">
            Yes
          </Button>
          <Button variant="primary" onClick={declineDelete}>
            No
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminPage;