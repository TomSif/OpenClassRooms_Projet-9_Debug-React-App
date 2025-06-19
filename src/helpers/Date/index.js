// helpers/Date.js
const getMonth = (date) => {
  const options = { month: 'long' };
  return new Date(date).toLocaleDateString('fr-FR', options);
};

export default getMonth;
