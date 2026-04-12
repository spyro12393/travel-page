'use client'

const PETALS = [
  { left: '4%',  delay: '0s',    dur: '9s',    size: 10, color: '#FFB7C5' },
  { left: '11%', delay: '-4s',   dur: '12s',   size: 8,  color: '#FFA0BA' },
  { left: '19%', delay: '-8s',   dur: '10.5s', size: 13, color: '#FFCCD8' },
  { left: '28%', delay: '1s',    dur: '8.5s',  size: 9,  color: '#FFB7C5' },
  { left: '37%', delay: '-5s',   dur: '11s',   size: 11, color: '#FF9BB5' },
  { left: '46%', delay: '-9.5s', dur: '9.5s',  size: 8,  color: '#FFCCD8' },
  { left: '55%', delay: '2s',    dur: '13s',   size: 10, color: '#FFB7C5' },
  { left: '64%', delay: '-3s',   dur: '10s',   size: 12, color: '#FFA0BA' },
  { left: '72%', delay: '-7s',   dur: '8.5s',  size: 9,  color: '#FFB7C5' },
  { left: '81%', delay: '0.5s',  dur: '11.5s', size: 11, color: '#FFCCD8' },
  { left: '89%', delay: '-6s',   dur: '9s',    size: 8,  color: '#FFB7C5' },
  { left: '95%', delay: '-2s',   dur: '10.5s', size: 10, color: '#FF9BB5' },
]

export default function Petals() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 5,
      }}
    >
      {PETALS.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: p.left,
            top: 0,
            animation: `sakura-fall ${p.dur} linear ${p.delay} infinite`,
          }}
        >
          {/* Petal shape: rotated rounded rectangle */}
          <div
            style={{
              width: p.size,
              height: Math.round(p.size * 1.55),
              background: `linear-gradient(140deg, ${p.color} 0%, ${p.color}bb 100%)`,
              borderRadius: '50% 5% 50% 5%',
              boxShadow: `0 1px 4px ${p.color}55`,
              transform: `rotate(${i * 23}deg)`,
            }}
          />
        </div>
      ))}
    </div>
  )
}
