import Lulus from '@/components/lulus/lulus';
import ErrorState from '@/components/error-state';
import { getParticipants } from '@/services/participants-server';

const Home = async () => {
  let participants;
  let error = false;

  try {
    participants = await getParticipants();
  } catch (e) {
    console.error('Erro ao buscar participantes:', e);
    error = true;
  }

  if (error || !participants) {
    return (
      <section className="bg-muted/40 py-10 md:py-14">
        <div className="container">
          <ErrorState
            title="Erro ao carregar participantes"
            message="Não foi possível carregar a lista de participantes. Por favor, recarregue a página."
          />
        </div>
      </section>
    );
  }

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
