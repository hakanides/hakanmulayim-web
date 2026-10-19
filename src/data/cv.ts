import type { Lang } from '../i18n/ui';

export interface CvEntry { title: string; org: string; period: string; details?: string[] }
export interface CvSection { heading: string; entries: CvEntry[] }
export interface CvContent { sections: CvSection[]; skills: { label: string; value: string }[]; skillsHeading: string }

export const cv: Record<Lang, CvContent> = {
  tr: {
    skillsHeading: 'Beceriler',
    skills: [
      { label: 'Hesaplama', value: 'Python (NumPy, pandas, Biogeme), Stata, MATLAB, LaTeX, Lean 4 (biçimsel doğrulama)' },
      { label: 'Diller', value: 'Türkçe (ana dil), İngilizce (akıcı), Fransızca (temel)' },
    ],
    sections: [
      {
        heading: 'Eğitim',
        entries: [
          { title: 'Ekonomi Yüksek Lisansı (tezli)', org: 'Sabancı Üniversitesi', period: '2024 – Haziran 2027 (beklenen)',
            details: ['Tez: Optimal Financing of Public Transit (Danışman: Eren İnci)', 'Seçilmiş dersler: Kesikli Tercih Yöntemleri, Eşleşmeler ve Piyasalar, Mikroekonomi I, İleri Makroekonomi'] },
          { title: 'Matematik Lisansı', org: 'Mimar Sinan Güzel Sanatlar Üniversitesi', period: '2021 – 2024',
            details: ['Seçilmiş dersler: Reel Analiz (İleri Kalkülüs I–II), Lineer Cebir, Soyut Cebir, Kompleks Analiz, Metrik Uzaylar, Cebirsel Topoloji, Diferansiyel Geometri, Olasılık, Stokastik Modelleme'] },
          { title: 'Matematik dersleri', org: 'İstanbul Bilgi Üniversitesi', period: '2016 – 2021' },
        ],
      },
      {
        heading: 'Araştırma İlgi Alanları',
        entries: [
          { title: 'Mikroekonomi teorisi; oyun teorisi; endüstriyel organizasyon; eşleşme ve piyasa tasarımı; ulaşım ve kent ekonomisine uygulamalar', org: '', period: '' },
        ],
      },
      {
        heading: 'Araştırma',
        entries: [
          { title: '“Financing Transit Through Economic Activity” (Kevin Hasker ve Eren İnci ile)', org: 'Çalışma kağıdı', period: '',
            details: ['Alışveriş yolculuklarına hizmet eden toplu taşımanın bilet ücreti ve satış vergisiyle finanse edildiği bir denge modeli geliştirir; gelirin biletten vergiye kaydırılmasının refahı artırdığını, refahı en çoklayan bilet ücretinin sıfır olduğunu gösterir.'] },
          { title: '“Time vs. Money Under Conscription: A Hybrid Choice Analysis of Turkey’s Paid Military Service”', org: 'Ders projesi (dört kişilik ekip), ECON 635 Kesikli Tercih Yöntemleri, Sabancı Üniversitesi', period: 'Güz 2025',
            details: ['Altı aylık standart hizmet ile üç haftalık bedelli muafiyet arasındaki tercihi, gizli tutumların zaman ve maliyet duyarlılığını kaydırdığı bir hibrit tercih (ICLV) modeliyle inceleyerek zamanın değerini tahmin etmeyi önerir; Biogeme (Python) ile tahmin devam ediyor.'] },
        ],
      },
      {
        heading: 'Öğretim Deneyimi',
        entries: [
          { title: 'Araştırma Görevlisi', org: 'Sabancı Üniversitesi', period: '2024 – 2026',
            details: ['ECON 201 Oyunlar ve Stratejiler (Eren İnci) — Bahar 2026', 'MATH 306 İstatistiksel Modelleme, üç dönem (E. Aydın, S. O. Sezer, T. Bayraktar) — Güz 2024 – Güz 2025'] },
          { title: 'Eğitmen, Yaz Programı', org: 'Nesin Matematik Köyü', period: 'Yaz 2026' },
          { title: 'Asistan, Mustafa Yağcı Dönem Programı', org: 'Nesin Matematik Köyü', period: '2020' },
        ],
      },
      {
        heading: 'Matematik Araştırma Deneyimi',
        entries: [
          { title: 'Bitirme projesi: Khovanov homolojisi', org: 'Danışman: Mustafa Topkara', period: '2023 – 2024' },
          { title: 'Directed Reading Program Turkey: 4-topta egzotik diskler', org: 'Mentor: Eylem Zeliha Yıldız (Duke)', period: '2022',
            details: ['Konuşma: Bahar Matematik Buluşması, İstanbul Üniversitesi — Ekim 2022'] },
          { title: 'Okuma seminerleri', org: 'Galatasaray Üniversitesi', period: '2021 – 2022',
            details: ['Kalıcı homoloji (Serap Gürer), Young örgüleri (Meral Tosun), modüler grupoidler ve örgüler (Ayberk Zeytin)'] },
          { title: 'Dinleyici olarak lisansüstü dersler', org: 'Galatasaray Üniversitesi', period: 'Bahar 2022',
            details: ['MATH 509 Homolojik Cebir (Serap Gürer), MATH 532 Reel Cebirsel Eğriler (Meral Tosun)'] },
        ],
      },
      {
        heading: 'Ödüller, Burslar ve Destekler',
        entries: [
          { title: 'Tam burs ve barınma desteği, Ekonomi Yüksek Lisansı', org: 'Sabancı Üniversitesi', period: '2024 – 2027' },
          { title: 'Seyahat desteği, Young Topologists Meeting', org: 'Münster Üniversitesi', period: '2024' },
          { title: 'Program desteği', org: 'Directed Reading Program Turkey', period: '2022' },
          { title: 'Seyahat ve konaklama desteği, GGTI Çalıştayları', org: 'Gökova Geometri–Topoloji Enstitüsü', period: '2021, 2022' },
          { title: 'Tam destek, Antalya Cebir Günleri XXII', org: 'Nesin Matematik Köyü', period: '2023' },
          { title: 'Burslu öğrenci, yaz ve kış matematik programları', org: 'Nesin Matematik Köyü', period: '2017 – 2024' },
        ],
      },
    ],
  },
  en: {
    skillsHeading: 'Skills',
    skills: [
      { label: 'Computing', value: 'Python (NumPy, pandas, Biogeme), Stata, MATLAB, LaTeX, Lean 4 (formal verification)' },
      { label: 'Languages', value: 'Turkish (native), English (fluent), French (basic)' },
    ],
    sections: [
      {
        heading: 'Education',
        entries: [
          { title: 'M.A. in Economics (with thesis)', org: 'Sabancı University', period: '2024 – June 2027 (expected)',
            details: ['Thesis: Optimal Financing of Public Transit (Advisor: Eren İnci)', 'Selected coursework: Discrete Choice Methods, Matchings and Markets, Microeconomics I, Advanced Macroeconomics'] },
          { title: 'B.Sc. in Mathematics', org: 'Mimar Sinan Fine Arts University', period: '2021 – 2024',
            details: ['Selected coursework: Real Analysis (Advanced Calculus I–II), Linear Algebra, Abstract Algebra, Complex Analysis, Metric Spaces, Algebraic Topology, Differential Geometry, Probability, Stochastic Modelling'] },
          { title: 'Coursework in Mathematics', org: 'Istanbul Bilgi University', period: '2016 – 2021' },
        ],
      },
      {
        heading: 'Research Interests',
        entries: [
          { title: 'Microeconomic theory; game theory; industrial organization; matching and market design; applications to transportation and urban economics', org: '', period: '' },
        ],
      },
      {
        heading: 'Research',
        entries: [
          { title: '“Financing Transit Through Economic Activity” (with Kevin Hasker and Eren İnci)', org: 'Working paper', period: '',
            details: ['Develops an equilibrium model in which transit serving shopping trips is financed by a fare and a sales tax, and shows that shifting revenue from the fare to the sales tax raises welfare; the welfare-maximizing fare is zero.'] },
          { title: '“Time vs. Money Under Conscription: A Hybrid Choice Analysis of Turkey’s Paid Military Service”', org: 'Course project (team of four), ECON 635 Discrete Choice Methods, Sabancı University', period: 'Fall 2025',
            details: ['Proposes a hybrid choice (ICLV) specification of the choice between six-month standard service and a three-week paid exemption to estimate the value of time, with latent attitudes shifting time and cost sensitivities; estimation in Biogeme (Python) in progress.'] },
        ],
      },
      {
        heading: 'Teaching Experience',
        entries: [
          { title: 'Teaching Assistant', org: 'Sabancı University', period: '2024 – 2026',
            details: ['ECON 201 Games and Strategies (Eren İnci) — Spring 2026', 'MATH 306 Statistical Modelling, three terms (E. Aydın, S. O. Sezer, T. Bayraktar) — Fall 2024 – Fall 2025'] },
          { title: 'Instructor, Summer Program', org: 'Nesin Mathematics Village', period: 'Summer 2026' },
          { title: 'Teaching Assistant, Mustafa Yağcı Semester Program', org: 'Nesin Mathematics Village', period: '2020' },
        ],
      },
      {
        heading: 'Mathematics Research Experience',
        entries: [
          { title: 'Graduation project on Khovanov homology', org: 'Advisor: Mustafa Topkara', period: '2023 – 2024' },
          { title: 'Directed Reading Program Turkey: exotic discs in the 4-ball', org: 'Mentor: Eylem Zeliha Yıldız (Duke)', period: '2022',
            details: ['Talk at the Bahar Mathematics Meeting, Istanbul University — Oct. 2022'] },
          { title: 'Reading seminars', org: 'Galatasaray University', period: '2021 – 2022',
            details: ['Persistent homology (Serap Gürer), Young’s lattices (Meral Tosun), modular groupoids and braids (Ayberk Zeytin)'] },
          { title: 'Audited graduate courses', org: 'Galatasaray University', period: 'Spring 2022',
            details: ['MATH 509 Homological Algebra (Serap Gürer), MATH 532 Real Algebraic Curves (Meral Tosun)'] },
        ],
      },
      {
        heading: 'Honors, Scholarships and Funding',
        entries: [
          { title: 'Full Tuition Waiver and Housing Scholarship, M.A. in Economics', org: 'Sabancı University', period: '2024 – 2027' },
          { title: 'Travel Funding, Young Topologists Meeting', org: 'University of Münster', period: '2024' },
          { title: 'Funding', org: 'Directed Reading Program Turkey', period: '2022' },
          { title: 'Travel and Accommodation Funding, GGTI Workshops', org: 'Gökova Geometry–Topology Institute', period: '2021, 2022' },
          { title: 'Full Funding, Antalya Algebra Days XXII', org: 'Nesin Mathematics Village', period: '2023' },
          { title: 'Scholarship Student, summer and winter mathematics programs', org: 'Nesin Mathematics Village', period: '2017 – 2024' },
        ],
      },
    ],
  },
};
