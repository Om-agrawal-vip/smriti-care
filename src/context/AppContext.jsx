import React, { createContext, useContext, useState, useEffect } from 'react';
import soundFx from '../utils/audio';

const AppContext = createContext(null);

const initialUserProfile = {
  name: 'Arup Bordoloi',
  age: 72,
  language: 'English',
  caregiver: 'Ananya (Daughter)',
};

const initialLevelProgress = [
  { level: 1, name: 'Tea Garden Memory Match', score: 100, accuracy: 95, timeTaken: '1m 20s', completed: true },
  { level: 2, name: 'Bihu Rhythm Patterns', score: 85, accuracy: 88, timeTaken: '1m 45s', completed: true },
  { level: 3, name: 'Majuli Island Pathways', score: 0, accuracy: 0, timeTaken: '--', completed: false },
  { level: 4, name: 'Kaziranga Wildlife Recall', score: 0, accuracy: 0, timeTaken: '--', completed: false },
  { level: 5, name: 'Brahmaputra Story Echoes', score: 0, accuracy: 0, timeTaken: '--', completed: false, isMilestone: true },
  { level: 6, name: 'Cheraw Bamboo Step Recall', score: 0, accuracy: 0, timeTaken: '--', completed: false },
  { level: 7, name: 'Hornbill Festival Echoes', score: 0, accuracy: 0, timeTaken: '--', completed: false },
  { level: 8, name: 'Loktak Lake Floating Phumdi', score: 0, accuracy: 0, timeTaken: '--', completed: false },
  { level: 9, name: 'Shillong Pine Whispers', score: 0, accuracy: 0, timeTaken: '--', completed: false },
  { level: 10, name: 'North East Grand Journey', score: 0, accuracy: 0, timeTaken: '--', completed: false, isMilestone: true },
];

export const AppProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [userProfile, setUserProfile] = useState(initialUserProfile);
  const [levelProgress, setLevelProgress] = useState(initialLevelProgress);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Tutorial / Walkthrough States
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [isOverviewModalOpen, setIsOverviewModalOpen] = useState(false);

  useEffect(() => {
    soundFx.setEnabled(soundEnabled);
  }, [soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      soundFx.setEnabled(next);
      if (next) soundFx.playTap();
      return next;
    });
  };

  const updateProfile = (updatedFields) => {
    setUserProfile((prev) => ({ ...prev, ...updatedFields }));
  };

  const updateLevelProgress = (levelNumber, results) => {
    setLevelProgress((prev) =>
      prev.map((lvl) =>
        lvl.level === levelNumber ? { ...lvl, ...results, completed: true } : lvl
      )
    );
  };

  const startInteractiveTour = () => {
    soundFx.playTap();
    setTourStep(0);
    setIsTourOpen(true);
    setIsOverviewModalOpen(false);
  };

  const closeTour = () => {
    setIsTourOpen(false);
    setTourStep(0);
  };

  const nextTourStep = () => {
    setTourStep((prev) => prev + 1);
  };

  const prevTourStep = () => {
    setTourStep((prev) => Math.max(0, prev - 1));
  };

  const openOverviewModal = () => {
    soundFx.playTap();
    setIsOverviewModalOpen(true);
  };

  const closeOverviewModal = () => {
    soundFx.playTap();
    setIsOverviewModalOpen(false);
  };

  return (
    <AppContext.Provider
      value={{
        selectedLanguage,
        setSelectedLanguage,
        userProfile,
        setUserProfile,
        updateProfile,
        levelProgress,
        setLevelProgress,
        updateLevelProgress,
        soundEnabled,
        toggleSound,
        setSoundEnabled,
        isTourOpen,
        tourStep,
        startInteractiveTour,
        closeTour,
        nextTourStep,
        prevTourStep,
        isOverviewModalOpen,
        openOverviewModal,
        closeOverviewModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
