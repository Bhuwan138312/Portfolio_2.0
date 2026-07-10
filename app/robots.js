export default function robots() {
  const baseUrl = 'https://www.bhuwanshrestha01.com.np';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      // Explicitly allow all major AI training & search crawlers
      { userAgent: 'GPTBot',         allow: '/' },
      { userAgent: 'ChatGPT-User',   allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Anthropic-ai',   allow: '/' },
      { userAgent: 'Claude-Web',     allow: '/' },
      { userAgent: 'CCBot',          allow: '/' },
      { userAgent: 'PerplexityBot',  allow: '/' },
      { userAgent: 'Applebot',       allow: '/' },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
