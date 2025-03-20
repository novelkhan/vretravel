import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Package ইন্টারফেস ডিফাইন করুন
interface Package {
  packageId: number;
  packageName: string;
  destination: string;
  price: string;
}

const Packages = () => {
  const [packages, setPackages] = useState<Package[]>([]); // স্টেটের টাইপ নির্ধারণ করুন
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('/api/package/packages');
        setPackages(response.data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    fetchPackages();
  }, []);

  const buyNow = async (pkg: Package) => {
    try {
      const response = await axios.post('/api/order/single-checkout', { packageId: pkg.packageId });
      alert(`You have selected "${pkg.packageName}" for buying.`);
      console.log(response);
    } catch (error) {
      alert('Failed to add to cart!');
      console.error(error);
    }
  };

  const addToCart = async (pkg: Package) => {
    try {
      const response = await axios.post('/api/cart/add-to-cart', { packageId: pkg.packageId });
      alert(`"${pkg.packageName}" added to cart successfully!`);
      console.log(response);
    } catch (error) {
      alert('Failed to add to cart!');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1 className="mt-3">All Packages</h1>
      <div className="d-flex justify-content-end mt-3">
        <button className="btn btn-primary rounded-pill" onClick={() => navigate('/packages/add-package')}>
          Add New Package
        </button>
      </div>
      <div className="container text-center mt-5">
        <div className="row justify-content-md-between">
          {packages.map(pkg => (
            <div key={pkg.packageId} className="col-md-6 col-12 col-sm-12">
              <div className="card text-center mb-3" style={{ width: '18rem' }}>
                <div className="card-body">
                  <h5 className="card-title">{pkg.packageName}</h5>
                  <p className="card-text">{pkg.destination}</p>
                  <p className="card-text">{pkg.price}</p>
                  <div className="d-grid gap-2">
                    <button className="btn btn-success btn-sm rounded-pill" onClick={() => buyNow(pkg)}>
                      Buy Now
                    </button>
                    <button className="btn btn-warning btn-sm rounded-pill" onClick={() => addToCart(pkg)}>
                      Add to Cart
                    </button>
                  </div>
                  <div className="border-top pt-3 mt-3">
                    <div className="row">
                      <div className="col-6">
                        <button className="btn btn-sm btn-outline-danger rounded-pill">Delete</button>
                      </div>
                      <div className="col-6">
                        <button className="btn btn-sm btn-outline-primary rounded-pill" onClick={() => navigate(`/packages/edit-package/${pkg.packageId}`)}>
                          Edit
                        </button>
                      </div>
                    </div>
                    <div className="row justify-content-center">
                      <div className="col-6">
                        <button className="btn btn-sm btn-outline-primary rounded-pill">Details</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Packages;