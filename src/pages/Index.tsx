
import TrashDetector from "@/components/TrashDetector";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 relative">
      {/* Logo in top right corner */}
      <div className="absolute top-4 right-4 z-10">
        <img 
          src="/lovable-uploads/45faf74a-d40a-4dcf-a8d6-17e44d19dd39.png" 
          alt="Reclevo Logo" 
          className="w-16 h-16 object-contain animate-pulse"
        />
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-cyan-400/5 rounded-full blur-lg animate-pulse delay-500"></div>
      </div>
      
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <TrashDetector />
      </div>
    </div>
  );
};

export default Index;
