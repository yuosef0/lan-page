export default function GeometricBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Dots Pattern - Top Left */}
      <svg
        className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] opacity-10"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="dotGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="black" stopOpacity="1" />
            <stop offset="100%" stopColor="black" stopOpacity="0" />
          </radialGradient>
        </defs>
        {Array.from({ length: 20 }).map((_, ring) => {
          const radius = ring * 10 + 20;
          const dotsInRing = Math.max(8, ring * 4);
          return Array.from({ length: dotsInRing }).map((_, i) => {
            const angle = (i / dotsInRing) * Math.PI * 2;
            const x = 200 + Math.cos(angle) * radius;
            const y = 200 + Math.sin(angle) * radius;
            const size = Math.max(1, 3 - ring * 0.1);
            return (
              <circle
                key={`${ring}-${i}`}
                cx={x}
                cy={y}
                r={size}
                fill="url(#dotGradient)"
              />
            );
          });
        })}
      </svg>

      {/* Curved Lines Pattern - Top Right */}
      <svg
        className="absolute top-[-50px] right-[-50px] w-[350px] h-[350px] opacity-15"
        viewBox="0 0 350 350"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: 12 }).map((_, i) => {
          const offset = i * 15;
          return (
            <path
              key={i}
              d={`M ${350 - offset} 0 Q ${200 - offset} ${100 + i * 5} ${350 - offset * 2} ${350}`}
              stroke="black"
              strokeWidth={i % 3 === 0 ? 2 : 1}
              fill="none"
              opacity={1 - i * 0.05}
            />
          );
        })}
      </svg>

      {/* Radial Lines Pattern - Bottom Left */}
      <svg
        className="absolute bottom-[-80px] left-[-80px] w-[350px] h-[350px] opacity-12"
        viewBox="0 0 350 350"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: 32 }).map((_, i) => {
          const angle = (i / 32) * Math.PI * 2;
          const length = 120 + Math.random() * 50;
          const x1 = 175;
          const y1 = 175;
          const x2 = 175 + Math.cos(angle) * length;
          const y2 = 175 + Math.sin(angle) * length;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="black"
              strokeWidth={i % 4 === 0 ? 1.5 : 0.8}
              opacity={0.6}
            />
          );
        })}
        <circle cx="175" cy="175" r="15" fill="none" stroke="black" strokeWidth="2" opacity="0.8" />
      </svg>

      {/* Dotted Arc Pattern - Bottom Right */}
      <svg
        className="absolute bottom-[-60px] right-[-60px] w-[320px] h-[320px] opacity-15"
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: 8 }).map((_, ring) => {
          const radius = ring * 25 + 40;
          const dots = 45;
          const startAngle = Math.PI;
          const endAngle = Math.PI * 1.5;
          return Array.from({ length: dots }).map((_, i) => {
            const angle = startAngle + (i / dots) * (endAngle - startAngle);
            const x = 160 + Math.cos(angle) * radius;
            const y = 160 + Math.sin(angle) * radius;
            return (
              <circle
                key={`${ring}-${i}`}
                cx={x}
                cy={y}
                r={1.5}
                fill="black"
                opacity={0.7 - ring * 0.08}
              />
            );
          });
        })}
      </svg>

      {/* Additional Geometric Lines - Center */}
      <svg
        className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] opacity-8"
        viewBox="0 0 600 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: 6 }).map((_, i) => {
          const y = 100 + i * 50;
          return (
            <line
              key={i}
              x1="0"
              y1={y}
              x2="600"
              y2={y}
              stroke="black"
              strokeWidth="0.5"
              strokeDasharray="4 8"
              opacity="0.3"
            />
          );
        })}
      </svg>
    </div>
  );
}
