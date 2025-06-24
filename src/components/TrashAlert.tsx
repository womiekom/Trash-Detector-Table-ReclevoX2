
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface TrashAlertProps {
  isVisible: boolean;
  trashItems: string[];
}

const TrashAlert: React.FC<TrashAlertProps> = ({ isVisible, trashItems }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-500/30 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-8 rounded-2xl shadow-2xl border-4 border-red-400 max-w-md mx-4 animate-pulse">
        <div className="flex items-center justify-center mb-4">
          <AlertTriangle className="h-12 w-12 text-yellow-300 animate-bounce mr-3" />
          <h2 className="text-3xl font-bold">TRASH DETECTED!</h2>
        </div>
        
        <div className="text-center space-y-3">
          <p className="text-xl font-semibold">🗑️ Please dispose of:</p>
          <div className="bg-red-800/50 p-3 rounded-lg">
            <p className="text-lg font-medium">{trashItems.join(', ')}</p>
          </div>
          <p className="text-lg animate-pulse">Throw it in the trash bin NOW!</p>
        </div>
      </div>
    </div>
  );
};

export default TrashAlert;
