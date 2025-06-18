
import TrashDetector from "@/components/TrashDetector";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 relative">
      {/* Logo in top right corner without neon effects */}
      <div className="absolute top-4 right-4 z-10">
        <img 
          src="/lovable-uploads/4c9c6528-a3d8-4328-99df-24bef6444344.png" 
          alt="Reclevo Logo" 
          className="w-16 h-16 object-contain"
        />
      </div>
      
      {/* Enhanced animated background elements with evenly distributed neon */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-xl animate-pulse shadow-[0_0_50px_rgba(0,255,255,0.4)]"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-xl animate-pulse delay-300 shadow-[0_0_50px_rgba(0,255,255,0.4)]"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl animate-pulse delay-1000 shadow-[0_0_80px_rgba(0,150,255,0.4)]"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl animate-pulse delay-700 shadow-[0_0_80px_rgba(0,150,255,0.4)]"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-cyan-300/15 rounded-full blur-lg animate-pulse delay-500 shadow-[0_0_40px_rgba(0,255,255,0.3)]"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-cyan-300/15 rounded-full blur-lg animate-pulse delay-800 shadow-[0_0_40px_rgba(0,255,255,0.3)]"></div>
        <div className="absolute top-1/3 left-1/2 w-20 h-20 bg-cyan-500/10 rounded-full blur-md animate-pulse delay-200 shadow-[0_0_30px_rgba(0,255,255,0.2)]"></div>
        <div className="absolute bottom-1/3 left-1/2 w-20 h-20 bg-cyan-500/10 rounded-full blur-md animate-pulse delay-900 shadow-[0_0_30px_rgba(0,255,255,0.2)]"></div>
      </div>
      
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <TrashDetector />
      </div>
    </div>
  );
};

export default Index;
