import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const allEvents = data?.events || [];
  const typeFilteredEvents = allEvents.filter(
    (event) => !type || event.type === type
  );

  const paginatedEvents = typeFilteredEvents.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  const totalPages = Math.ceil(typeFilteredEvents.length / PER_PAGE);
  const pageNumber = totalPages > 0 ? totalPages : 1;

  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType === "Toutes" || !evtType ? null : evtType);
  };

  const typeList = data?.events
    ? [...new Set(data.events.map((event) => event.type).filter(Boolean))]
    : [];

  const selectOptions = typeList;

  // eslint-disable-next-line no-console
  console.log("type actuel :", type);
    // eslint-disable-next-line no-console
  console.log("page actuelle :", currentPage);

  return (
    <>
      {error && <div>An error occurred</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={selectOptions}
            onChange={changeType}
            titleEmpty={false}
            label="Catégories"
            value={type}
          />
          <div id="events" className="ListContainer">
            {paginatedEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)} // Ensure the date is a Date object
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {Array.from({ length: pageNumber }, (_, index) => (
              <button
                type="button"
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                disabled={currentPage === index + 1}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
