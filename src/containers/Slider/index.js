import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);

  // Tri des événements par date décroissante (CORRIGÉ)
  const byDateDesc =
    data?.focus?.sort(
      (a, b) => new Date(b.date) - new Date(a.date) // Tri décroissant correct
    ) || [];

  useEffect(() => {
    // Éviter de créer l'interval si pas d'événements
    if (byDateDesc.length > 0) {
      const interval = setInterval(() => {
        setIndex((prev) => (prev < byDateDesc.length - 1 ? prev + 1 : 0));
      }, 5000);

      return function cleanup() {
        clearInterval(interval);
      };
    }

    return undefined;
  }, [byDateDesc.length]);

  // Reset de l'index si le nombre d'événements change
  useEffect(() => {
    if (index >= byDateDesc.length && byDateDesc.length > 0) {
      setIndex(0);
    }
  }, [byDateDesc.length, index]);

  // Ne rien afficher si pas de données
  if (!data?.focus || byDateDesc.length === 0) {
    return <div className="SlideCardList">Aucun événement à afficher</div>;
  }

  return (
    <div className="SlideCardList">
      {byDateDesc.map((event, idx) => (
        <div
          key={event.id}
          className={`SlideCard SlideCard--${
            index === idx ? "display" : "hide"
          }`}
        >
          <img src={event.cover} alt={event.title || "Événement"} />
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div>{getMonth(new Date(event.date))}</div>
            </div>
          </div>
        </div>
      ))}

      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc.map((eventRadio, radioIdx) => (
            <input
              key={eventRadio.id}
              type="radio"
              name={`radio-button-${eventRadio.id}`}
              checked={index === radioIdx}
              onChange={() => setIndex(radioIdx)} // AJOUTÉ: permettre le clic sur les boutons radio
              aria-label={`Aller à l'événement ${radioIdx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
