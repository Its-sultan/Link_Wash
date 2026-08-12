export function AirWaves() {
  return (
    <svg
      width="120"
      height="60"
      viewBox="0 0 120 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-blue-400/70"
    >
      <path
        d="M0 10 Q 15 0, 30 10 T 60 10 T 90 10 T 120 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        pathLength="100"
        strokeDasharray="20 10"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="100"
          dur="1.1s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M0 20 Q 15 10, 30 20 T 60 20 T 90 20 T 120 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        pathLength="100"
        strokeDasharray="20 10"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="100"
          dur="0.9s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M0 30 Q 15 20, 30 30 T 60 30 T 90 30 T 120 30"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        pathLength="100"
        strokeDasharray="20 10"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="100"
          dur="1.2s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M0 40 Q 15 30, 30 40 T 60 40 T 90 40 T 120 40"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        pathLength="100"
        strokeDasharray="20 10"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="100"
          dur="1s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M0 50 Q 15 40, 30 50 T 60 50 T 90 50 T 120 50"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        pathLength="100"
        strokeDasharray="20 10"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="100"
          dur="1.3s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}