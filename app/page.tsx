import Lulus from '@/components/lulus/lulus';
import { ParticipantStats } from '@/components/participant/participant-stats';
import { fetchParticipants } from '@/services/queries/fetchParticipants';

const Home = async () => {
  const participants = await fetchParticipants();

  return (
    <>
      {/* <ParticipantProfile participant={participants[0]} />*/}
      <ParticipantStats />
      <Lulus participants={participants} />;
    </>
  );
};

export default Home;
