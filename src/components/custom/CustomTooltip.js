import React, { useState } from 'react'

function CustomTooltip({ content, children }) {
  const [showTooltip, setShowTooltip] = useState(false)

  const handleMouseEnter = () => {
    setShowTooltip(true)
  }

  const handleMouseLeave = () => {
    setShowTooltip(false)
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {children}
      {showTooltip && (
        <div
          style={{
            whiteSpace: 'nowrap',
            position: 'absolute',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '5px 15px',
            borderRadius: '4px',
            top: '-75%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'auto',
            fontSize: '12px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '40%',
              marginLeft: '0',
              width: '0',
              height: '0',
              borderTop: '6px solid rgba(0, 0, 0, 0.7)',
              borderBottom: '6px solid transparent',
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
            }}
          ></div>
          {content}
        </div>
      )}
    </div>
  )
}

export default CustomTooltip
