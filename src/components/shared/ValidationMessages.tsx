import React from 'react';

interface ValidationMessagesProps {
  errorMessages: string[];
}

const ValidationMessages: React.FC<ValidationMessagesProps> = ({ errorMessages }) => {
  if (!errorMessages || errorMessages.length === 0) return null;

  return (
    <div className="alert alert-danger" role="alert">
      <ul className="mb-0">
        {errorMessages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
};

export default ValidationMessages;