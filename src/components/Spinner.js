import React from 'react';

const Spinner = ({ loader }) => {
	return (
		<>
			<input type="checkbox" id="check" />
			<label htmlFor="check" className={`spinner-label ${!loader ? 'label-active-success' : ''}`}>
				<div className={`check-icon ${!loader ? 'check-active-success' : ''}`} />
			</label>
			{/* <div className="semipolar-spinner">
				<div className="ring"></div>
				<div className="ring"></div>
				<div className="ring"></div>
				<div className="ring"></div>
				<div className="ring"></div>
			</div> */}
		</>
	);
};

console.log(1);

export default Spinner;
