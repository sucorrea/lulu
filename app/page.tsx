import Lulus from '@/components/lulus/lulus';
import { fetchParticipants } from '@/services/queries/fetchParticipants';

const Home = async () => {
  const participants = await fetchParticipants();

  return (
    <>
      {/* <ParticipantProfile participant={participants[0]} />
      <ParticipantStats /> */}
      {/* <ParticipantsList /> */}
      <Lulus participants={participants} />;
    </>
  );
};

export default Home;
