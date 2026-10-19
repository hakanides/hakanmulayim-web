import type { Lang } from '../i18n/ui';

export interface TeachingContent {
  intro: string;
  approachHeading: string;
  approach: string;
  universityHeading: string;
  university: { course: string; detail: string; period: string }[];
  villageHeading: string;
  village: { role: string; detail: string; period: string }[];
  examsHeading: string;
  examsIntro: string;
  exams: { group: string; items: string[] }[];
  cta: string;
}

export const teaching: Record<Lang, TeachingContent> = {
  tr: {
    intro: 'Üniversitede ekonomi ve istatistik derslerinde asistanlık yapıyor, Nesin Matematik Köyü’nde ders veriyor ve uluslararası sınavlara hazırlanan öğrencilerle birebir çalışıyorum.',
    approachHeading: 'Yaklaşım',
    approach: 'Formül ezberi yerine kavramın sezgisel temelini kurmaya, sonra da her sınavın kendi formatının gerektirdiği akıl yürütmeyi çalışmaya dayanır. Matematik ve ekonomiyi birlikte öğretebilmek, özellikle AP/IB ekonomi ve TMUA gibi ispat ağırlıklı sınavlarda fark yaratır.',
    universityHeading: 'Üniversite',
    university: [
      { course: 'ECON 201 Games and Strategies', detail: 'Araştırma görevlisi (Eren İnci), Sabancı Üniversitesi', period: 'Bahar 2026' },
      { course: 'MATH 306 Statistical Modelling', detail: 'Araştırma görevlisi, üç dönem (E. Aydın, S. O. Sezer, T. Bayraktar), Sabancı Üniversitesi', period: 'Güz 2024 – Güz 2025' },
    ],
    villageHeading: 'Nesin Matematik Köyü',
    village: [
      { role: 'Eğitmen', detail: 'Yaz programı', period: 'Yaz 2026' },
      { role: 'Asistan', detail: 'Mustafa Yağcı Dönem Programı', period: '2020' },
    ],
    examsHeading: 'Sınav hazırlığı',
    examsIntro: 'Birebir ve küçük grup dersleri, çevrimiçi veya yüz yüze:',
    exams: [
      { group: 'Matematik', items: ['AP Calculus AB / BC', 'IB Mathematics AA / AI', 'SAT Math', 'TMUA'] },
      { group: 'Ekonomi', items: ['AP Microeconomics', 'AP Macroeconomics', 'IB Economics', 'Ekonomi Olimpiyatı hazırlığı'] },
    ],
    cta: 'Ders talebi için iletişime geçin',
  },
  en: {
    intro: 'I assist economics and statistics courses at the university, teach at the Nesin Mathematics Village, and work one-on-one with students preparing for international examinations.',
    approachHeading: 'Approach',
    approach: 'The emphasis is on building the intuition behind a concept before any formula, and then on the specific reasoning each exam format demands. Teaching mathematics and economics together makes a real difference in AP/IB economics and in proof-oriented exams such as TMUA.',
    universityHeading: 'University',
    university: [
      { course: 'ECON 201 Games and Strategies', detail: 'Teaching assistant (Eren İnci), Sabancı University', period: 'Spring 2026' },
      { course: 'MATH 306 Statistical Modelling', detail: 'Teaching assistant, three terms (E. Aydın, S. O. Sezer, T. Bayraktar), Sabancı University', period: 'Fall 2024 – Fall 2025' },
    ],
    villageHeading: 'Nesin Mathematics Village',
    village: [
      { role: 'Instructor', detail: 'Summer program', period: 'Summer 2026' },
      { role: 'Teaching assistant', detail: 'Mustafa Yağcı Semester Program', period: '2020' },
    ],
    examsHeading: 'Exam preparation',
    examsIntro: 'One-on-one and small-group lessons, online or in person:',
    exams: [
      { group: 'Mathematics', items: ['AP Calculus AB / BC', 'IB Mathematics AA / AI', 'SAT Math', 'TMUA'] },
      { group: 'Economics', items: ['AP Microeconomics', 'AP Macroeconomics', 'IB Economics', 'Economics Olympiad preparation'] },
    ],
    cta: 'Get in touch for lessons',
  },
};
