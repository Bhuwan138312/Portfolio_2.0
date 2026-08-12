import '../src/index.css';
import '../src/App.css';

export const metadata = {
  title: 'Bhuwan Shrestha | UI/UX Designer & Backend Developer',
  description:
    'Portfolio of Bhuwan Shrestha, a UI/UX Designer and Backend Developer specializing in Figma, Java, Spring Boot, and Python. I build beautiful interfaces and robust backend systems.',
  keywords: [
    'Bhuwan Shrestha',
    'UI/UX Designer',
    'Backend Developer',
    'Figma',
    'Java',
    'Spring Boot',
    'Python',
    'Software Engineer',
    'Nepal',
    'API Development',
    'Systems Architecture',
  ],
  authors: [{ name: 'Bhuwan Shrestha' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://www.bhuwanshrestha01.com.np/',
    title: 'Bhuwan Shrestha | UI/UX Designer & Backend Developer',
    description:
      'Portfolio of Bhuwan Shrestha, a UI/UX Designer and Backend Developer specializing in Figma, Java, Spring Boot, and Python. I build beautiful interfaces and robust backend systems.',
    images: [
      {
        url: 'https://www.bhuwanshrestha01.com.np/bhuwan.jpeg',
        width: 1200,
        height: 630,
        alt: 'Bhuwan Shrestha - UI/UX Designer & Backend Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: 'https://www.bhuwanshrestha01.com.np/',
    title: 'Bhuwan Shrestha | UI/UX Designer & Backend Developer',
    description:
      'Portfolio of Bhuwan Shrestha, a UI/UX Designer and Backend Developer specializing in Figma, Java, Spring Boot, and Python.',
    images: ['https://www.bhuwanshrestha01.com.np/bhuwan.jpeg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
