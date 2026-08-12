export function FooterBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">

      <svg
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 w-full h-32 fill-blue-300/15"
      >
        <path d="M0,120 C240,60 480,180 720,110 C960,40 1200,150 1440,90 L1440,220 L0,220 Z" />
      </svg>
      <svg
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 w-full h-24 fill-blue-400/15"
        style={{ animation: "fw-drift 9s ease-in-out infinite" }}
      >
        <path d="M0,140 C200,90 460,190 720,130 C980,70 1240,160 1440,110 L1440,220 L0,220 Z" />
      </svg>
      <svg
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 w-full h-16 fill-blue-500/20"
        style={{ animation: "fw-drift 6s ease-in-out infinite reverse" }}
      >
        <path d="M0,160 C260,120 500,200 760,150 C1020,100 1260,180 1440,140 L1440,220 L0,220 Z" />
      </svg>

      {[
        { left: "8%", size: 6, delay: "0s" },
        { left: "15%", size: 10, delay: "1.4s" },
        { left: "24%", size: 4, delay: "2.8s" },
        { left: "38%", size: 8, delay: "0.6s" },
        { left: "47%", size: 5, delay: "3.4s" },
        { left: "58%", size: 12, delay: "1.9s" },
        { left: "67%", size: 6, delay: "0.2s" },
        { left: "76%", size: 9, delay: "2.3s" },
        { left: "85%", size: 5, delay: "3.9s" },
        { left: "92%", size: 7, delay: "1.1s" },
      ].map((b, i) => (
        <span
          key={i}
          className="absolute bottom-0 rounded-full bg-blue-400/30 border border-blue-300/40"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            animation: `fw-rise ${5 + (b.size % 4)}s ease-in-out infinite`,
            animationDelay: b.delay,
          }}
        />
      ))}
    </div>
  );
}