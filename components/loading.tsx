import React from 'react';
import BounceLoader from 'react-spinners/BounceLoader';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <BounceLoader color="#FF0000" />
    </div>
  );
};

export default Loading;
