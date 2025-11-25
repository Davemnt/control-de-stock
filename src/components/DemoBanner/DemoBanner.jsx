import { isDemoMode, getClientConfig } from '../../config/clientConfig';
import { AlertCircle } from 'lucide-react';
import './DemoBanner.css';

const DemoBanner = () => {
  const config = getClientConfig();

  if (!isDemoMode() || !config.showDemoBanner) {
    return null;
  }

  return (
    <div className="demo-banner">
      <div className="demo-banner-content">
        <AlertCircle size={20} />
        <span>
          <strong>MODO DEMOSTRACIÓN</strong> - Los datos mostrados son ejemplos para fines ilustrativos
        </span>
      </div>
      {config.demoUsers && (
        <div className="demo-credentials">
          Usuario: <strong>{config.demoUsers.admin}</strong> / 
          Contraseña: <strong>{config.demoUsers.password}</strong>
        </div>
      )}
    </div>
  );
};

export default DemoBanner;
