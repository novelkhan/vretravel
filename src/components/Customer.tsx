import React, { useEffect, useState } from 'react';
import customerService from '../services/CustomerService';

const Customer = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    customerService.getCustomers()
      .then(response => {
        // এখন সরাসরি message এক্সেস করা যাবে
        setMessage(response.data.message);
      })
      .catch(error => {
        console.log(error);
        setMessage('Error loading data');
      });
  }, []);

  return (
    <div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Customer;