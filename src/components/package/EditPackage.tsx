import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface PackageImage {
  packageImageId?: number;
  filename?: string;
  filetype?: string;
  filesize?: string;
  filebytes?: any;
  packageDataId?: number;
  imageFile?: any;
  url?: any;
}

interface PackageData {
  packageDataId?: number;
  description?: string;
  viaDestination?: string;
  date?: string;
  availableSeat?: number;
  packageImages?: PackageImage[];
}

interface Package {
  packageId: number;
  packageName: string;
  destination: string;
  price: string;
  dateCreated?: string;
  packageData?: PackageData;
}

const EditPackage = () => {
  const { id } = useParams();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.get(`/api/package/package/${id}`);
        setPackageData(response.data);
      } catch (error) {
        console.error('Failed to fetch package data:', error);
        alert('Error fetching package data.');
      }
    };

    fetchPackage();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageData) return;

    try {
      const formData = new FormData();
      formData.append('packageId', packageData.packageId.toString());
      formData.append('packageName', packageData.packageName);
      formData.append('destination', packageData.destination);
      formData.append('price', packageData.price);
      formData.append('description', packageData.packageData?.description || '');
      formData.append('viaDestination', packageData.packageData?.viaDestination || '');
      formData.append('date', packageData.packageData?.date || '');
      formData.append('availableSeat', packageData.packageData?.availableSeat?.toString() || '0');

      if (packageData.packageData?.packageImages) {
        packageData.packageData.packageImages.forEach((image, index) => {
          if (image.imageFile) {
            formData.append(`packageData.packageImages[${index}].imageFile`, image.imageFile);
          }
        });
      }

      await axios.put(`/api/package/package/${id}`, formData);
      alert('Package updated successfully!');
      navigate('/packages');
    } catch (error) {
      console.error('Failed to update package:', error);
      alert('Error updating package.');
    }
  };

  return (
    <div className="container">
      <h1 className="mt-3">Edit Package</h1>
      {packageData ? (
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Package Name"
              value={packageData.packageName}
              onChange={(e) => setPackageData({ ...packageData, packageName: e.target.value })}
            />
            <label>Package Name</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Destination"
              value={packageData.destination}
              onChange={(e) => setPackageData({ ...packageData, destination: e.target.value })}
            />
            <label>Destination</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Price"
              value={packageData.price}
              onChange={(e) => setPackageData({ ...packageData, price: e.target.value })}
            />
            <label>Price</label>
          </div>
          <button type="submit" className="btn btn-primary">Save Changes</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/packages')}>
            Cancel
          </button>
        </form>
      ) : (
        <div className="alert alert-warning" role="alert">
          Package not found!
        </div>
      )}
    </div>
  );
};

export default EditPackage;