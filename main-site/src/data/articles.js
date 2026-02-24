export const articles = [
  {
    id: 'verification-gap',
    title: 'The Verification Gap',
    subtitle: 'Why "Looks Right" Isn\'t "Works Right" When Using AI',
    description: 'An exploration of verification challenges in AI-assisted development. When AI generates code that looks correct, how do humans verify it actually works? Examines the gap between generation and validation.',
    author: 'Matthew Scott',
    date: 'February 2026',
    dateISO: '2026-02-01',
    pageCount: 7,
    coverImage: '/articles/verification-gap/page-1.png',
    pdfUrl: '/articles/verification-gap/the-verification-gap.pdf',
    pages: Array.from({ length: 7 }, (_, i) => `/articles/verification-gap/page-${i + 1}.png`),
  },
];
