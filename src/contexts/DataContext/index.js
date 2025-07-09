import PropTypes from "prop-types";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  }
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [ last, setLast ] = useState(null);
  const getData = async () => { 
    try {
      const resp = (await api.loadData());
      setData(resp);
      const { events } = resp;
      const lastItem = events.reduce((latest, current) => new Date(current.date) > new Date(latest.date) ? current : latest);
      setLast( lastItem );
    } catch (err) {
      setError(err);
    }
  };
      useEffect(() => {
      if(data) return 
      getData();
  }, [ data ]);

  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
        last,
        getData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;
