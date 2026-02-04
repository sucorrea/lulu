import Lulus from '@/components/lulus/lulus';
import { getParticipants } from '@/services/participants-server';

const Home = async () => {
  const participants = await getParticipants();

  return (
    <section className="bg-muted/40 py-10 md:py-14">
      <div className="container space-y-6">
        <header className="space-y-2 text-center md:text-left">
          <h2 className="lulu-header text-2xl md:text-3xl">Participantes</h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Veja quem faz parte dessa rede de carinho e amizade
          </p>
        </header>
        <div className="rounded-2xl border border-border bg-card/80 p-2 md:p-4">
          <Lulus participants={participants} />
        </div>
      </div>
    </section>
  );
};

export default Home;
