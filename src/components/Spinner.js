import React from 'react';

const Spinner = ({ loader, isLate }) => {
  return (
    <>
      <input type="checkbox" id="check" />
      <label
        htmlFor="check"
        className={`spinner-label ${!loader ? 'label-active-success' : ''}`}
      >
        <div
          className={`check-icon ${!loader ? 'check-active-success' : ''}`}
        ></div>
      </label>
    </>
  );
};

export default Spinner;
