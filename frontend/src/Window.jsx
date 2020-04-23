import React from 'react';

export default function Window({ title, children, className}) {
  return (
    <div className={`window container ${className}`}>
      <div className="title-bar">
        <div className="title-bar-text">{title}</div>
        <div className="title-bar-controls">
        </div>
      </div>
      <div className="window-body center">
        {children}
      </div>
    </div>
  );
}
