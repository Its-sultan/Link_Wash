export function Blob() {
  return (
    <div className="relative z-10 flex items-center justify-center h-64 sm:h-80 md:h-100 lg:h-125">
      <div className="relative w-64 sm:w-72 md:w-90 lg:w-110 h-64 sm:h-72 md:h-90 lg:h-110 flex items-center justify-center">
        {/* Soft glow */}
        <div className="blob-glow absolute w-48 sm:w-56 md:w-72 lg:w-90 h-48 sm:h-56 md:h-72 lg:h-90" />
        {/* Main morphing blob */}
        <div className="blob-main absolute w-48 sm:w-56 md:w-72 lg:w-90 h-48 sm:h-56 md:h-72 lg:h-90">
          <div className="blob-highlight absolute inset-0" />
          <div className="blob-inner absolute inset-1.75" />
        </div>
      </div>
    </div>
  );
}