import React, { useEffect, useState } from 'react';
import customerService from '../services/CustomerService';

const Customer = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    customerService.getCustomers()
      .then(response => {
        // সঠিকভাবে nested value এক্সেস করুন
        setMessage(response.data.value.message);
      })
      .catch(error => {
        console.log(error);
        setMessage('Error loading data');
      });
  }, []);

  return (
    <div className="ms-5">
      {message && <p>{message}</p>}
    </div>
  );
};

export default Customer;