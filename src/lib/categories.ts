export const NOTE_CATEGORIES = ['AP', 'IB', 'SAT', 'TMUA', 'Olimpiyat', 'Matematik', 'Ekonomi'] as const;
export type NoteCategory = (typeof NOTE_CATEGORIES)[number];
