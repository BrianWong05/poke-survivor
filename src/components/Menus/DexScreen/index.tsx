import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './styles.css';
import { DexManager } from '@/systems/DexManager';
import { PLAYABLE_DEX, ENEMY_DEX, WEAPON_DEX, type DexEntry, type PlayableDexEntry, type EnemyDexEntry, type WeaponDexEntry } from '@/config/GameData';

type TabType = 'pokemon' | 'enemies' | 'weapons';

interface DexScreenProps {
  onClose: () => void;
}

export const DexScreen: React.FC<DexScreenProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('pokemon');
  const [selectedItem, setSelectedItem] = useState<DexEntry | null>(null);
  const dexManager = DexManager.getInstance();

  const getList = (): DexEntry[] => {
    switch (activeTab) {
      case 'pokemon': return PLAYABLE_DEX;
      case 'enemies': return ENEMY_DEX;
      case 'weapons': return WEAPON_DEX;
    }
  };

  const currentList = getList();

  const handleCardClick = (entry: DexEntry) => {
    if (dexManager.isUnlocked(entry.id)) {
      setSelectedItem(entry);
    }
  };

  return (
    <div className="dex-screen-overlay">
      <div className="dex-header">
        <h1 className="dex-title">PokéDex</h1>
        <button className="dex-close-btn" onClick={onClose}>Close</button>
      </div>

      <div className="dex-tabs">
        <button 
          className={`dex-tab ${activeTab === 'pokemon' ? 'active' : ''}`}
          onClick={() => setActiveTab('pokemon')}
        >
          Pokemon
        </button>
        <button 
          className={`dex-tab ${activeTab === 'enemies' ? 'active' : ''}`}
          onClick={() => setActiveTab('enemies')}
        >
          Enemy
        </button>
        <button 
          className={`dex-tab ${activeTab === 'weapons' ? 'active' : ''}`}
          onClick={() => setActiveTab('weapons')}
        >
          Moves
        </button>
      </div>

      <div className="dex-grid">
        {currentList.map((entry) => {
          const isUnlocked = dexManager.isUnlocked(entry.id);
          const isSeen = dexManager.isSeen(entry.id);

          let className = 'dex-card';
          if (!isSeen) className += ' locked';
          else if (!isUnlocked) className += ' seen';

          return (
            <div 
              key={entry.id} 
              className={className}
              onClick={() => handleCardClick(entry)}
            >
              {isSeen && (
                <div 
                  className="dex-card-image"
                  style={{ backgroundColor: isUnlocked ? 'transparent' : '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {isUnlocked && entry.spritePath.includes('/') ? (
                       <img 
                         src={entry.spritePath} 
                         alt={t(entry.nameKey)}
                         style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                         onError={(e) => {
                           (e.target as HTMLImageElement).style.display = 'none';
                         }}
                       />
                  ) : (
                    <div style={{ 
                      width: '100%', height: '100%', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '24px', color: '#555' 
                    }}>
                     {isUnlocked ? 'IMG' : '?'}
                    </div>
                  )}
                </div>
              )}
              <div className="dex-card-name">
                {isUnlocked ? t(entry.nameKey) : (isSeen ? '???' : 'Locked')}
              </div>
            </div>
          );
        })}
      </div>

      {selectedItem && (
        <div className="dex-modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="dex-modal" onClick={(e) => e.stopPropagation()}>
            <button className="dex-close-modal" onClick={() => setSelectedItem(null)}>×</button>
            <div className="dex-modal-header">
              <div className="dex-modal-image">
                 {selectedItem.spritePath.includes('/') ? (
                   <img 
                     src={selectedItem.spritePath} 
                     alt={t(selectedItem.nameKey)}
                     style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                   />
                 ) : (
                   <div style={{ 
                      width: '100%', height: '100%', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#ffcc00'
                    }}>IMG</div>
                 )}
              </div>
              <div className="dex-modal-info">
                <h2>{t(selectedItem.nameKey)}</h2>
                <div style={{ color: '#888', fontStyle: 'italic' }}>{selectedItem.id.toUpperCase()}</div>
              </div>
            </div>
            
            <div className="dex-modal-description">
              {t(selectedItem.descKey)}
            </div>

            <div className="dex-modal-stats">
              {(activeTab === 'pokemon') && (
                <>
                  <div className="dex-stat-label">{t('hp')}:</div>
                  <div>{(selectedItem as PlayableDexEntry).baseHp}</div>
                  <div className="dex-stat-label">Evolution:</div>
                  <div>{(selectedItem as PlayableDexEntry).evolution || 'None'}</div>
                </>
              )}
              {(activeTab === 'enemies') && (
                <>
                  <div className="dex-stat-label">{t('hp')}:</div>
                  <div>{(selectedItem as EnemyDexEntry).hp}</div>
                  <div className="dex-stat-label">{t('speed')}:</div>
                  <div>{(selectedItem as EnemyDexEntry).speed}</div>
                  <div className="dex-stat-label">Drop Tier:</div>
                  <div>{(selectedItem as EnemyDexEntry).dropTier}</div>
                </>
              )}
              {(activeTab === 'weapons') && (
                <>
                  <div className="dex-stat-label">Type:</div>
                  <div>{(selectedItem as WeaponDexEntry).type}</div>
                  <div className="dex-stat-label">{t('damage')}:</div>
                  <div>{(selectedItem as WeaponDexEntry).damage}</div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

