import Lulus from '@/components/lulus/lulus';
import { BirthdayCalendar } from '@/components/participant/birthday-calendar';
import { ParticipantProfile } from '@/components/participant/participant-profile';
import { ParticipantStats } from '@/components/participant/participant-stats';
import { ParticipantsList } from '@/components/participant/participants-list';
import { fetchParticipants } from '@/services/queries/fetchParticipants';

const Home = async () => {
  const participants = await fetchParticipants();

  return (
    <>
      {/* <ParticipantProfile participant={participants[0]} />
      <BirthdayCalendar />
      <ParticipantStats /> */}
      {/* <ParticipantsList /> */}
      <Lulus participants={participants} />;
    </>
  );
};

export default Home;
