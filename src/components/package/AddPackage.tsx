import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Define the type for the form data
interface FormData {
  packageName: string;
  destination: string;
  price: string;
}

const AddPackage = () => {
  const [formData, setFormData] = useState<FormData>({
    packageName: '',
    destination: '',
    price: '',
  });

  const [errorMessages, setErrorMessages] = useState<string[]>([]); // Explicitly define the type as string[]
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/package/add-package', formData);
      alert('Package added successfully!');
      navigate('/packages');
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrorMessages(error.response.data.errors); // Ensure this matches the expected type (string[])
      } else {
        setErrorMessages([error.response?.data || 'An error occurred']); // Fallback error message
      }
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="col-12 col-lg-5">
        <main className="form-signin">
          <form onSubmit={handleSubmit}>
            <div className="text-center mb-4">
              <h3 className="mb-3 font-weight-normal">Add Package</h3>
            </div>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Package Name"
                value={formData.packageName}
                onChange={(e) =>
                  setFormData({ ...formData, packageName: e.target.value })
                }
              />
              <label>Package Name</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Destination"
                value={formData.destination}
                onChange={(e) =>
                  setFormData({ ...formData, destination: e.target.value })
                }
              />
              <label>Destination</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="number"
                className="form-control"
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
              <label>Price</label>
            </div>
            {errorMessages.length > 0 && (
              <ul className="text-danger">
                {errorMessages.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
            <div className="d-grid mt-4 px-1">
              <button type="submit" className="btn btn-lg btn-info">
                Add Package
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddPackage;