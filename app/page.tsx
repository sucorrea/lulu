import Lulus from '@/components/lulus/lulus';
import { getParticipants } from '@/services/participants-server';

const Home = async () => {
  const participants = await getParticipants();

  return <Lulus participants={participants} />;
};

export default Home;
