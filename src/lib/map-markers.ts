// Shared pin colours and symbols for the map and its key.
export const categoryIconConfig: Record<string, { bg1: string; bg2: string; svg: string }> = {
  'Beaches': {
    bg1: '#0284c7', bg2: '#38bdf8',
    // Ocean Waves
    svg: `<path d="M2 13c2 0 3-1 4-1s2 1 4 1 3-1 4-1 2 1 4 1 3-1 4-1M2 17c2 0 3-1 4-1s2 1 4 1 3-1 4-1 2 1 4 1 3-1 4-1" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"/>`
  },
  'Mountains': {
    bg1: '#4338ca', bg2: '#818cf8',
    // Mountain Peaks
    svg: `<path d="m8 3 4 8 5-5 5 15H2L8 3z" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`
  },
  'Waterfalls': {
    bg1: '#0891b2', bg2: '#22d3ee',
    // Water Droplet / Cascades
    svg: `<path d="M12 2.7l5.7 5.7a8 8 0 1 1-11.4 0z" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`
  },
  'Wildlife': {
    bg1: '#059669', bg2: '#34d399',
    // Animal Paw Print
    svg: `<circle cx="11" cy="4" r="2" fill="white"/><circle cx="18" cy="8" r="2" fill="white"/><circle cx="4" cy="8" r="2" fill="white"/><path d="M12 10c-3 0-5 2-5 5 0 2.5 2 4 5 4s5-1.5 5-4c0-3-2-5-5-5z" fill="white"/>`
  },
  'Historical': {
    bg1: '#ea580c', bg2: '#fb923c',
    // Castle / Rampart
    svg: `<path d="M3 21h18M5 21V7l7-4 7 4v14M10 10v4M14 10v4" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"/>`
  },
  'Ancient Sites': {
    bg1: '#b45309', bg2: '#f59e0b',
    // Monument / Classical Pillars
    svg: `<path d="M4 21h16M4 5h16M7 5v14M12 5v14M17 5v14M2 5l10-3 10 3" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`
  },
  'Religious Places': {
    bg1: '#7c3aed', bg2: '#a78bfa',
    // Sacred Stupa / Star
    svg: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="white"/>`
  },
  'Hidden Gems': {
    bg1: '#e11d48', bg2: '#fb7185',
    // Gemstone Diamond
    svg: `<path d="M6 3h12l4 6-10 12L2 9z" fill="none" stroke="white" stroke-width="2.5" stroke-linejoin="round"/>`
  }
};

