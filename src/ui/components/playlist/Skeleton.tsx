import React from "react";

export const PlaylistSkeleton = () => (
    <div style={{
      padding: "5px",
      cursor: "pointer",
      display: 'flex',
      alignItems: 'center',
    }}>
      <div style={{
        width: '30px',
        height: '30px',
        marginRight: '10px',
        backgroundColor: '#444',
        borderRadius: '5px',
        animation: 'skeleton-load 1s infinite alternate'
      }} />
      <div style={{
        width: '100px',
        height: '15px',
        backgroundColor: '#444',
        borderRadius: '5px',
        animation: 'skeleton-load 1s infinite alternate'
      }} />
    </div>  
);