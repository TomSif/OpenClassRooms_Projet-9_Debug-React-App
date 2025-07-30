import { fireEvent, render, screen, within } from "@testing-library/react";
import { api, DataProvider } from "../../contexts/DataContext";
import Home from "./index";

// --- Données de test (Mock Data) ---
// Ces données sont contrôlées et spécifiques à nos tests pour garantir leur fiabilité.
// Elles sont conçues pour être réalistes tout en étant non ambiguës.
const mockData = {
  events: [
    {
      id: 1,
      type: "conférence",
      date: "2022-04-29T20:28:45.744Z",
      title: "User&product MixUsers",
      cover: "/images/alexandre-pellaes-6vAjp0pscX0-unsplash.png",
      description: "Présentation des nouveaux usages UX.",
      nb_guesses: 900,
      periode: "14-15-16 Avril",
      prestations: ["1 espace d’exposition"],
    },
    {
      id: 2,
      type: "conférence",
      date: "2022-08-29T20:28:45.744Z", // La date la plus récente
      title: "Conférence #productCON",
      cover: "/images/headway-F2KRf_QfCqw-unsplash.png",
      description: "Présentation des outils analytics.",
      nb_guesses: 1300,
      periode: "24-25-26 Février",
      prestations: ["1 scéne principale"],
    },
    {
      id: 3,
      type: "expérience digitale",
      date: "2022-01-29T20:28:45.744Z", // La date la plus ancienne
      title: "#DigitonPARIS",
      cover: "/images/charlesdeluvio-wn7dOzUh3Rs-unsplash.png",
      description: "Présentation des outils analytics aux professionnels.",
      nb_guesses: 1300,
      periode: "24-25-26 Février",
      prestations: ["1 site web dédié"],
    },
  ],
  focus: [
    {
      title: "World economic forum",
      description: "Oeuvre à la coopération entre le secteur public et le privé.",
      date: "2022-01-29T20:28:45.744Z",
      cover: "/images/evangeline-shaw-nwLTVwb7DbU-unsplash1.png",
    },
  ],
};


// --- Suite de tests pour la page d'accueil ---

describe("When Form is created", () => {
  it("a list of fields card is displayed", async () => {
    render(<Home />);
    await screen.findByText("Email");
    await screen.findByText("Nom");
    await screen.findByText("Prénom");
    await screen.findByText("Personel / Entreprise");
  });

  describe("and a click is triggered on the submit button", () => {
    it("the success message is displayed", async () => {
      render(<Home />);
      fireEvent(
        await screen.findByText("Envoyer"),
        new MouseEvent("click", {
          cancelable: true,
          bubbles: true,
        })
      );
      await screen.findByText("En cours");
      await screen.findByText("Message envoyé !");
    });
  });
});


describe("When a page is created", () => {
  beforeEach(() => {
    // Avant chaque test de cette suite, on s'assure que l'appel API
    // retournera nos données de test contrôlées.
    api.loadData = jest.fn().mockResolvedValue(mockData);
  });
  
  it("a list of events is displayed", async () => {
    render(
      <DataProvider>
        <Home />
      </DataProvider>
    );
    // On attend que la section soit chargée en cherchant son titre.
    await screen.findByRole("heading", { name: "Nos réalisations", level: 2 });
   // Vérifier qu'au moins un événement est affiché (peu importe combien)
    const eventElements = await screen.findAllByText(/#productCON|MixUsers/i);
    expect(eventElements.length).toBeGreaterThan(0);
  }); 

  it("a list of people is displayed", () => {
    render(
      <DataProvider>
        <Home />
      </DataProvider>
    );
    // On vérifie la présence des membres de l'équipe (données statiques).
    expect(screen.getByText("Samira")).toBeInTheDocument();
    expect(screen.getByText("Luís")).toBeInTheDocument();
  });

  it("a footer is displayed", () => {
    render(
      <DataProvider>
        <Home />
      </DataProvider>
    );
    // On vérifie la présence d'éléments uniques du footer.
    expect(screen.getByText("Notre dernière prestation")).toBeInTheDocument();
    expect(screen.getByText("contact@724events.com")).toBeInTheDocument();
  });
  
  it("an event card, with the last event, is displayed in the footer", async () => {
    // 1. On calcule le résultat attendu à partir de nos données de test.
    const latestEvent = [...mockData.events].sort((a, b) => new Date(b.date) - new Date(a.date))[0];

    render(
      <DataProvider>
        <Home />
      </DataProvider>
    );

    // 2. On attend que le conteneur du footer soit là.
    const footerElement = await screen.findByRole("contentinfo");

    // 3. LA CORRECTION CLÉ : On utilise AWAIT et FINDER à l'intérieur du 'within'.
    //    Ceci attend que le titre apparaisse DANS le footer, même s'il y a un délai.
    const lastEventTitleInFooter = await within(footerElement).findByText(
      new RegExp(latestEvent.title, "i")
    );
      
    // 4. On confirme sa présence.
    expect(lastEventTitleInFooter).toBeInTheDocument();
  });
});