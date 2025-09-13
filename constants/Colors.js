const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

// 🎨 Add page-specific palettes
export const Palettes = {
  home: {
    light: {
      background: '#FAEBD7', // Antique White
      card: '#8B4513',       // Dirt Brown
      text: '#111',
      secondaryText: '#555',
      accent: '#7897AB',     // Link Water
      buttonText: '#fff',
      inputBackground: '#F0F0F0',
    },
    dark: {
      background: '#2F4F4F', // Slate Gray
      card: '#556B2F',       // Slate Green
      text: '#fff',
      secondaryText: '#aaa',
      accent: '#7897AB',
      buttonText: '#fff',
      inputBackground: '#333',
    },
  },

  academic: {
    light: {
      background: '#E6D0C4', // Desert Sand
      card: '#C19A6B',       // Apache
      text: '#111',
      secondaryText: '#444',
      accent: '#7B3F00',     // Cocoa
      buttonText: '#fff',
      inputBackground: '#F2E6DF',
    },
    dark: {
      background: '#4E3629', // Metallic Bronze
      card: '#7B3F00',       // Cocoa
      text: '#fff',
      secondaryText: '#bbb',
      accent: '#C19A6B',     // Apache
      buttonText: '#fff',
      inputBackground: '#3A2C23',
    },
  },

  habits: {
    light: {
      background: '#FAFAFA', // Alabaster
      card: '#CCCCFF',       // Periwinkle
      text: '#111',
      secondaryText: '#444',
      accent: '#FFA500',     // Royal Orange
      buttonText: '#fff',
      inputBackground: '#fff',
    },
    dark: {
      background: '#2E2E2E',
      card: '#708090',       // Slate-like for dark mode
      text: '#fff',
      secondaryText: '#aaa',
      accent: '#FFA500',
      buttonText: '#fff',
      inputBackground: '#3A3A3A',
    },
  },
};
