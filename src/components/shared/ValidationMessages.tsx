import React from 'react';

const ValidationMessages = ({ errorMessages }) => {
  return (
    <ul className="text-danger">
      {errorMessages.map((error, index) => (
        <li key={index}>{error}</li>
      ))}
    </ul>
  );
};

export default ValidationMessages;