import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Customer = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/api/customer/get-customers')
      .then(response => setMessage(response.data.value.message))
      .catch(error => console.log(error));
  }, []);

  return (
    <div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Customer;