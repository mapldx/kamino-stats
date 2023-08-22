import LineChart from "../charts/portfolio";

const PortfolioModal = ({ data, onClose }) => {
  const handleOutsideClick = (e) => {
    if (e.target.className === 'modal') {
      onClose();
    }
  };

  return (
    <div className="modal z-50" onClick={handleOutsideClick}>
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <div className="flex items-center justify-center h-full">
          {data ? <LineChart data={data} /> : <div>Loading...</div>}
        </div>
      </div>
    </div>
  );

};

export default PortfolioModal;