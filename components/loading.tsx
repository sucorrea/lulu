import BounceLoader from 'react-spinners/BounceLoader';

const Loading = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <BounceLoader color="var(--primary)" />
  </div>
);

export default Loading;
