const PRIMARY = '#6c63ff';
const CARD_BG = '#f3f4fe';      // very light purple for cards
const TEXT = '#262182';         // deep purple for headings
const BODY_TEXT = '#444';       // neutral for body text
const INPUT_BG = '#e9eafd';     // soft purple for inputs

export const Colors = {
  light: {
    text: TEXT,
    background: '#fff',
    tint: PRIMARY,
    icon: PRIMARY,
    tabIconDefault: BODY_TEXT,
    tabIconSelected: PRIMARY,
  },
  dark: {
    text: '#fff',
    background: '#000', // Changed to black for dark mode
    tint: PRIMARY,
    icon: PRIMARY,
    tabIconDefault: '#9591ee',
    tabIconSelected: PRIMARY,
  },
};

export const Palettes = {
  home: {
    light: {
      background: '#fff',
      card: CARD_BG,
      text: TEXT,
      secondaryText: BODY_TEXT,
      accent: PRIMARY,
      buttonText: '#fff',
      inputBackground: INPUT_BG,
    },
    dark: {
      background: '#000',                // Black background
      card: '#232347',                   // Softer dark card
      text: '#f3f4fe',                   // Light purple text
      secondaryText: '#9591ee',          // Soft purple secondary
      accent: PRIMARY,                   // Primary accent
      buttonText: '#fff',
      inputBackground: '#232347',        // Match card for input
    },
  },
  academic: {
    light: {
      background: '#fff',
      card: CARD_BG,
      text: TEXT,
      secondaryText: BODY_TEXT,
      accent: PRIMARY,
      buttonText: '#fff',
      inputBackground: INPUT_BG,
    },
    dark: {
      background: '#000',
      card: '#232347',
      text: '#f3f4fe',
      secondaryText: '#9591ee',
      accent: PRIMARY,
      buttonText: '#fff',
      inputBackground: '#232347',
    },
  },
  habits: {
    light: {
      background: '#fff',
      card: CARD_BG,
      text: TEXT,
      secondaryText: BODY_TEXT,
      accent: PRIMARY,
      buttonText: '#fff',
      inputBackground: INPUT_BG,
    },
    dark: {
      background: '#000',
      card: '#232347',
      text: '#f3f4fe',
      secondaryText: '#9591ee',
      accent: PRIMARY,
      buttonText: '#fff',
      inputBackground: '#232347',
    },
  },
};
