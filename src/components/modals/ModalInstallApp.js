import React from 'react';
import { X, Smartphone, Download, Share, MoreVertical, PlusSquare } from 'lucide-react';

/**
 * ModalInstallApp - Instructions d'installation PWA
 * 
 * Guide pour installer COT HK Planning comme application sur mobile
 */
const ModalInstallApp = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div 
        className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg flex flex-col border border-cyan-500/30"
        style={{
          background: 'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.98) 100%)',
          maxHeight: 'calc(100vh - 1rem)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Installer l'application</h2>
              <p className="text-xs text-gray-400">COT HK Planning sur votre mobile</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors bg-gray-800/50"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4 space-y-6">
          
          {/* Android */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🤖</span>
              <h3 className="text-lg font-semibold text-green-400">Android (Chrome)</h3>
            </div>
            <ol className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="bg-green-500/20 text-green-400 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
                <span>Ouvrez <strong>Chrome</strong> et accédez à COT HK Planning</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-green-500/20 text-green-400 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
                <div className="flex items-center gap-1">
                  <span>Appuyez sur le menu</span>
                  <MoreVertical className="w-4 h-4 text-green-400" />
                  <span>(3 points en haut à droite)</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-green-500/20 text-green-400 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
                <div className="flex items-center gap-1">
                  <span>Sélectionnez</span>
                  <Download className="w-4 h-4 text-green-400" />
                  <strong>"Installer l'application"</strong>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-green-500/20 text-green-400 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">4</span>
                <span>Confirmez l'installation</span>
              </li>
            </ol>
            <p className="mt-3 text-xs text-green-400/70 italic">
              L'icône COT HK apparaitra sur votre écran d'accueil !
            </p>
          </div>

          {/* iOS */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🍎</span>
              <h3 className="text-lg font-semibold text-blue-400">iPhone / iPad (Safari)</h3>
            </div>
            <ol className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="bg-blue-500/20 text-blue-400 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
                <span>Ouvrez <strong>Safari</strong> et accédez à COT HK Planning</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-500/20 text-blue-400 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
                <div className="flex items-center gap-1">
                  <span>Appuyez sur</span>
                  <Share className="w-4 h-4 text-blue-400" />
                  <span>(icône partage en bas)</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-500/20 text-blue-400 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
                <div className="flex items-center gap-1">
                  <span>Faites défiler et appuyez sur</span>
                  <PlusSquare className="w-4 h-4 text-blue-400" />
                  <strong>"Sur l'écran d'accueil"</strong>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-500/20 text-blue-400 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">4</span>
                <span>Appuyez sur <strong>"Ajouter"</strong></span>
              </li>
            </ol>
            <p className="mt-3 text-xs text-blue-400/70 italic">
              Important : utilisez Safari, pas Chrome sur iOS !
            </p>
          </div>

          {/* Partager */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📤</span>
              <h3 className="text-lg font-semibold text-purple-400">Partager avec les collègues</h3>
            </div>
            <p className="text-sm text-gray-300 mb-3">
              Envoyez ce lien par SMS, WhatsApp ou email. Ils n'ont qu'à l'ouvrir dans Chrome et suivre les étapes ci-dessus.
            </p>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value="https://planningcothk.netlify.app"
                className="flex-1 px-3 py-2 bg-gray-800 border border-purple-500/40 rounded-lg text-white text-sm select-all"
                onClick={(e) => e.target.select()}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText('https://planningcothk.netlify.app');
                  const btn = document.getElementById('copy-btn');
                  if (btn) { btn.textContent = 'Copié !'; setTimeout(() => { btn.textContent = 'Copier'; }, 2000); }
                }}
                id="copy-btn"
                className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/40 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                Copier
              </button>
            </div>
            {typeof navigator !== 'undefined' && navigator.share && (
              <button
                onClick={() => navigator.share({ title: 'COT HK Planning', text: 'Installe l\'app COT HK Planning sur ton téléphone :', url: 'https://planningcothk.netlify.app' })}
                className="mt-3 w-full py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/40 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Share className="w-4 h-4" /> Partager directement
              </button>
            )}
          </div>

          {/* Avantages */}
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-cyan-400 mb-2">Avantages de l'application</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>Accès rapide depuis l'écran d'accueil</li>
              <li>Mode plein écran (sans barre de navigation)</li>
              <li>Fonctionne même avec connexion limitée</li>
              <li>Mises à jour automatiques</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700/50 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors font-medium"
          >
            Compris !
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalInstallApp;
