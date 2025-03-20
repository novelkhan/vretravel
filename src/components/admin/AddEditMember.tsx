import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AddEditMember = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    password: '',
    roles: '',
  });
  const [applicationRoles, setApplicationRoles] = useState([]);
  const [existingMemberRoles, setExistingMemberRoles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios.get(`/api/admin/get-member/${id}`)
        .then(response => {
          setFormData(response.data);
          setExistingMemberRoles(response.data.roles.split(','));
        })
        .catch(error => console.log(error));
    }
    axios.get('/api/admin/get-application-roles')
      .then(response => setApplicationRoles(response.data))
      .catch(error => console.log(error));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setErrorMessages([]);

    try {
      const response = await axios.post('/api/admin/add-edit-member', formData);
      // Handle success notification
      navigate('/admin');
    } catch (error) {
      if (error.response.data.errors) {
        setErrorMessages(error.response.data.errors);
      } else {
        setErrorMessages([error.response.data]);
      }
    }
  };

  const handleRoleChange = (role) => {
    const roles = formData.roles.split(',');
    const index = roles.indexOf(role);
    if (index !== -1) {
      roles.splice(index, 1);
    } else {
      roles.push(role);
    }
    setFormData({ ...formData, roles: roles.join(',') });
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="col-12 col-lg-5">
        <main className="form-signin">
          <form onSubmit={handleSubmit}>
            <div className="text-center mb-4">
              <h3 className="mb-3 font-weight-normal">
                {id ? 'Update' : 'Add'} Member
              </h3>
            </div>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
              <label>First name</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
              <label>Last name</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              />
              <label>Username</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <label>Password</label>
            </div>
            <div className="row mb-3">
              <div className="col-2">
                <label>Roles:</label>
              </div>
              <div className="col-10">
                <div className="btn-group">
                  {applicationRoles.map(role => (
                    <button
                      key={role}
                      type="button"
                      className={`btn btn-outline-primary ${existingMemberRoles.includes(role) ? 'active' : ''}`}
                      onClick={() => handleRoleChange(role)}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {errorMessages.length > 0 && (
              <ul className="text-danger">
                {errorMessages.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
            <div className="row my-4">
              <div className="col-6">
                <button type="submit" className="btn btn-info w-100">
                  {id ? 'Update' : 'Create'} Member
                </button>
              </div>
              <div className="col-6">
                <button type="button" className="btn btn-danger w-100" onClick={() => navigate('/admin')}>
                  Back to list
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddEditMember;