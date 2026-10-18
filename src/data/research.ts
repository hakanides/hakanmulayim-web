import type { Lang } from '../i18n/ui';

export interface ResearchItem { kind: string; title: string; with: string; venue: string; note: string; pdf?: string }
export interface ResearchContent {
  intro: string;
  interestsHeading: string;
  interests: string[];
  items: ResearchItem[];
  mathHeading: string;
  mathIntro: string;
  math: { title: string; detail: string; period: string }[];
}

export const research: Record<Lang, ResearchContent> = {
  tr: {
    intro: 'Araştırmalarım mikroekonomi teorisi ile ulaşım ve kent ekonomisinin kesişiminde yer alıyor: toplu taşımanın nasıl finanse edilmesi gerektiği, piyasa tasarımı ve kesikli tercih modelleri.',
    interestsHeading: 'İlgi alanları',
    interests: ['Mikroekonomi teorisi', 'Oyun teorisi', 'Endüstriyel organizasyon', 'Eşleşme ve piyasa tasarımı', 'Ulaşım ve kent ekonomisi'],
    items: [
      { kind: 'Çalışma kağıdı', title: 'Financing Transit Through Economic Activity', with: 'Kevin Hasker ve Eren İnci ile', venue: 'Transportation Research Part B: Methodological dergisine sunuldu',
        note: 'Alışveriş yolculuklarına hizmet eden toplu taşımanın bilet ücreti ve satış vergisiyle finanse edildiği bir denge modeli geliştirir. Gelirin biletten satış vergisine kaydırılması refahı artırır; refahı en çoklayan bilet ücreti sıfırdır. Sonucu bir sigorta etkisi (bilet, alışveriş yapılsın yapılmasın ödenir; vergi yalnızca alışverişte) sürükler ve ölçek ekonomileri altında katılım etkisi pekiştirir.' },
      { kind: 'Yüksek lisans tezi', title: 'Toplu Taşımanın Optimal Finansmanı', with: 'Danışman: Eren İnci', venue: 'Sabancı Üniversitesi, 2027 (beklenen)', note: '' },
      { kind: 'Devam eden proje', title: 'Zorunlu Askerlikte Zaman ve Para: Türkiye’de Bedelli Askerliğin Hibrit Tercih Analizi', with: 'Dört kişilik ekip, ECON 635 Kesikli Tercih Yöntemleri', venue: 'Sabancı Üniversitesi, Güz 2025',
        note: 'Altı aylık standart hizmet ile üç haftalık bedelli muafiyet arasındaki tercihi, gizli tutumların zaman ve maliyet duyarlılığını kaydırdığı bir hibrit tercih (ICLV) modeliyle inceleyerek zamanın değerini tahmin etmeyi amaçlar. Tahmin Biogeme (Python) ile sürüyor.' },
    ],
    mathHeading: 'Matematik geçmişi',
    mathIntro: 'Ekonomiye geçmeden önce düşük boyutlu topoloji ve homolojik yöntemler üzerine çalıştım.',
    math: [
      { title: 'Khovanov homolojisi', detail: 'Lisans bitirme projesi (danışman: Mustafa Topkara), Mimar Sinan GSÜ.', period: '2023 – 2024' },
      { title: '4-topta egzotik diskler', detail: 'Directed Reading Program Turkey (mentor: Eylem Zeliha Yıldız, Duke). Konuşma: Bahar Matematik Buluşması, İstanbul Üniversitesi.', period: '2022' },
      { title: 'Okuma seminerleri ve lisansüstü dersler', detail: 'Galatasaray Üniversitesi: kalıcı homoloji, Young örgüleri, modüler grupoidler ve örgüler; Homolojik Cebir ve Reel Cebirsel Eğriler dersleri (dinleyici).', period: '2021 – 2022' },
      { title: 'Nesin Matematik Köyü', detail: 'Yaz ve kış programlarında burslu öğrenci; Antalya Cebir Günleri XXII; GGTI çalıştayları (Gökova) ve Young Topologists Meeting (Münster) katılımı.', period: '2017 – 2024' },
    ],
  },
  en: {
    intro: 'My research sits at the intersection of microeconomic theory and transportation and urban economics: how public transit should be financed, market design, and discrete choice models.',
    interestsHeading: 'Interests',
    interests: ['Microeconomic theory', 'Game theory', 'Industrial organization', 'Matching and market design', 'Transportation and urban economics'],
    items: [
      { kind: 'Working paper', title: 'Financing Transit Through Economic Activity', with: 'with Kevin Hasker and Eren İnci', venue: 'Submitted to Transportation Research Part B: Methodological',
        note: 'Develops an equilibrium model in which transit serving shopping trips is financed by a fare and a sales tax. Shifting revenue from the fare to the sales tax raises welfare; the welfare-maximizing fare is zero. The result is driven by an insurance effect (the fare is paid regardless of whether a purchase occurs, the tax only upon purchase) and reinforced by a participation effect under economies of scale.' },
      { kind: 'M.A. thesis', title: 'Optimal Financing of Public Transit', with: 'Advisor: Eren İnci', venue: 'Sabancı University, expected 2027', note: '' },
      { kind: 'Ongoing project', title: 'Time vs. Money Under Conscription: A Hybrid Choice Analysis of Turkey’s Paid Military Service', with: 'Team of four, ECON 635 Discrete Choice Methods', venue: 'Sabancı University, Fall 2025',
        note: 'Proposes a hybrid choice (ICLV) specification of the choice between six-month standard service and a three-week paid exemption to estimate the value of time, with latent attitudes shifting time and cost sensitivities. Estimation in Biogeme (Python) is in progress.' },
    ],
    mathHeading: 'Mathematics background',
    mathIntro: 'Before moving to economics I worked on low-dimensional topology and homological methods.',
    math: [
      { title: 'Khovanov homology', detail: 'Undergraduate graduation project (advisor: Mustafa Topkara), Mimar Sinan Fine Arts University.', period: '2023 – 2024' },
      { title: 'Exotic discs in the 4-ball', detail: 'Directed Reading Program Turkey (mentor: Eylem Zeliha Yıldız, Duke). Talk at the Bahar Mathematics Meeting, Istanbul University.', period: '2022' },
      { title: 'Reading seminars and graduate courses', detail: 'Galatasaray University: persistent homology, Young’s lattices, modular groupoids and braids; audited Homological Algebra and Real Algebraic Curves.', period: '2021 – 2022' },
      { title: 'Nesin Mathematics Village', detail: 'Scholarship student in summer and winter programs; Antalya Algebra Days XXII; GGTI workshops (Gökova) and the Young Topologists Meeting (Münster).', period: '2017 – 2024' },
    ],
  },
};
