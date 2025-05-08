// import React from 'react';

// const ValidationMessages = ({ errorMessages }) => {
//   return (
//     <ul className="text-danger">
//       {errorMessages.map((error, index) => (
//         <li key={index}>{error}</li>
//       ))}
//     </ul>
//   );
// };

// export default ValidationMessages;


import React from 'react';

interface ValidationMessagesProps {
  errorMessages?: string[];
}

const ValidationMessages: React.FC<ValidationMessagesProps> = ({ errorMessages }) => {
  if (!errorMessages || errorMessages.length === 0) {
    return null;
  }

  return (
    <ul className="text-danger list-unstyled">
      {errorMessages.map((error, index) => (
        <li key={index}>{error}</li>
      ))}
    </ul>
  );
};

export default ValidationMessages;