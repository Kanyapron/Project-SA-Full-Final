import React, { useState, useEffect } from 'react';

const SongThor = () => {
  const text = 'SongThor';
  const [highlightIndex, setHighlightIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightIndex((prevIndex) => (prevIndex + 1) % text.length);
    }, 430); // ความเร็วในการเปลี่ยนสี (430ms)
    return () => clearInterval(interval);
  }, [text.length]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginLeft: 20 }}>
      <div style={{ display: 'inline', fontSize: '24px' }}>
        {text.split('').map((char, index) => (
          <span
            key={index}
            style={{
              color: index === highlightIndex ? 'orange' : 'white',
              transition: 'color 0.6s ease',
            }}
          >
            {char}
          </span>
        ))}
      </div>
      <h3 style={{ color: 'red', fontSize: '24px', margin: 0, marginLeft: 10 }}>SUT</h3>
    </div>
  );
};

export default SongThor;
