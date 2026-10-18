export type ProfileKey = 'linkedin' | 'orcid' | 'scholar' | 'github';

export interface LangContent {
  tagline: string;
  description: string;   // <meta name="description">
  bio: string[];
  cvLabel: string;
  emailLabel: string;
  scrollHint: string;
}

export interface Profile {
  name: string;
  email: string;
  /** Uluslararası format, + ve boşluk olmadan, ör. '905321234567'; boş = düğme yok */
  whatsappNumber: string;
  /** ör. 'https://calendly.com/...'; boş = düğme yok */
  calendlyUrl: string;
  /** Web3Forms access key; boş = form yok */
  web3formsKey: string;
  cvPdfUrl: string;      // ör. '/cv/hakan-mulayim-cv.pdf'; boş = düğme yok
  heroImage: string;     // ör. '/img/hero.jpg'; boş = düz koyu zemin
  portrait: string;      // ör. '/img/portrait.jpg'; boş = bölüm yok
  profiles: Record<ProfileKey, string>;   // boş = ikon yok
  tr: LangContent;
  en: LangContent;
}

export const profile: Profile = {
  name: 'hakan mülayim',
  email: 'hakan.mulayim@sabanciuniv.edu',
  whatsappNumber: '',
  calendlyUrl: '',
  web3formsKey: '',
  cvPdfUrl: '/cv/hakan-mulayim-cv.pdf',
  heroImage: '/img/hero.jpg',
  portrait: '',
  profiles: { linkedin: '', orcid: '', scholar: '', github: '' },

  tr: {
    tagline: 'Ekonomi Yüksek Lisans Adayı, Sabancı Üniversitesi · Matematik & Ekonomi Eğitmeni',
    description:
      'Hakan Mülayim — Sabancı Üniversitesi Ekonomi yüksek lisans adayı; mikroekonomi teorisi ve ulaşım ekonomisi üzerine araştırma; AP, IB, SAT, TMUA için Matematik & Ekonomi eğitmeni.',
    bio: [
      "Hakan Mülayim, Sabancı Üniversitesi'nde Ekonomi yüksek lisans öğrencisi ve uluslararası sınavlara hazırlanan öğrencilerle matematik ve ekonomi alanında çalışan bir eğitmendir. Araştırma ilgi alanları mikroekonomi teorisi, oyun teorisi, endüstriyel organizasyon ile eşleşme ve piyasa tasarımı; bunların ulaşım ve kent ekonomisine uygulamalarıdır. Yüksek lisans tezi, Eren İnci danışmanlığında, toplu taşımanın optimal finansmanı üzerinedir. Kevin Hasker ve Eren İnci ile birlikte kaleme aldığı “Financing Transit Through Economic Activity” başlıklı çalışma Transportation Research Part B: Methodological dergisine sunulmuştur.",
      "Lisans derecesini Mimar Sinan Güzel Sanatlar Üniversitesi Matematik Bölümü'nde tamamlamıştır. Lisans yıllarında Khovanov homolojisi üzerine bitirme projesi yürütmüş, Directed Reading Program Turkey kapsamında dört boyutlu topoloji çalışmış ve Galatasaray Üniversitesi'nde okuma seminerlerine katılmıştır. 2017'den bu yana Nesin Matematik Köyü programlarının bir parçasıdır; 2026 yaz programında köyde eğitmen olarak görev yapmıştır.",
      "Sabancı Üniversitesi'nde Oyunlar ve Stratejiler (ECON 201) ile İstatistiksel Modelleme (MATH 306) derslerinde asistanlık yapmıştır. Bunun yanında AP Calculus, AP Mikro/Makroekonomi, IB Matematik (AA/AI), IB Ekonomi, SAT Math ve TMUA sınavlarına hazırlanan öğrencilerle ve Ekonomi Olimpiyatı adaylarıyla çalışmaktadır.",
    ],
    cvLabel: 'CV (PDF)',
    emailLabel: 'E-posta',
    scrollHint: 'Aşağı kaydır',
  },

  en: {
    tagline: 'M.A. Candidate in Economics, Sabancı University · Mathematics & Economics Educator',
    description:
      'Hakan Mülayim — M.A. candidate in Economics at Sabancı University; research in microeconomic theory and transportation economics; Mathematics & Economics educator for AP, IB, SAT and TMUA.',
    bio: [
      'Hakan Mülayim is an M.A. student in Economics at Sabancı University and an educator working with students preparing for international examinations in mathematics and economics. His research interests lie in microeconomic theory, game theory, industrial organization, and matching and market design, with applications to transportation and urban economics. His master’s thesis, advised by Eren İnci, concerns the optimal financing of public transit. His working paper “Financing Transit Through Economic Activity”, written with Kevin Hasker and Eren İnci, is under submission at Transportation Research Part B: Methodological.',
      'He holds a B.Sc. in Mathematics from Mimar Sinan Fine Arts University. As an undergraduate he completed a graduation project on Khovanov homology, studied four-dimensional topology through the Directed Reading Program Turkey, and attended reading seminars at Galatasaray University. He has been part of the Nesin Mathematics Village programs since 2017 and was an instructor in its 2026 summer program.',
      'At Sabancı University he has served as a teaching assistant for Games and Strategies (ECON 201) and Statistical Modelling (MATH 306). He also teaches students preparing for AP Calculus, AP Micro/Macroeconomics, IB Mathematics (AA/AI), IB Economics, SAT Math and TMUA, and coaches candidates for the Economics Olympiad.',
    ],
    cvLabel: 'CV (PDF)',
    emailLabel: 'Email',
    scrollHint: 'Scroll down',
  },
};

const PROFILE_ORDER: ProfileKey[] = ['linkedin', 'orcid', 'scholar', 'github'];

export function visibleProfiles(p: Profile): { key: ProfileKey; url: string }[] {
  return PROFILE_ORDER.filter((k) => p.profiles[k]).map((k) => ({ key: k, url: p.profiles[k] }));
}
