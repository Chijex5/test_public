import React from 'react';
import './Loaders.css';

const Loaders = () => (
  <div className='loader-container'>
    <div className="loader">
      <div className="ball one" style={{ '--i': 0 }}></div>
      <div className="ball two" style={{ '--i': 1 }}></div>
      <div className="ball three" style={{ '--i': 2 }}></div>
      <div className="ball four" style={{ '--i': 3 }}></div>
      <div className="ball five" style={{ '--i': 4 }}></div>
      <div className="ball six" style={{ '--i': 5 }}></div>
      <div className="ball seven" style={{ '--i': 6 }}></div>
      <div className="ball eight" style={{ '--i': 7 }}></div>
      <div className="ball nine" style={{ '--i': 8 }}></div>
      <div className="ball ten" style={{ '--i': 9 }}></div>
      </div>
    </div>
);

export default Loaders;
