/** @format */

import React from "react";

function Modal({ text, children }) {
  return (
    <>
      <div className='modal-overlay'></div>
      <div className='modal-content'>
        <div className='modal__title'> {text}</div>
        {children}
      </div>
    </>
  );
}

export default Modal;
