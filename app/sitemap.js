export default function sitemap() {
  const baseUrl = 'https://www.bhuwanshrestha01.com.np';
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    // Anchor sections — treated as fragment URLs for crawlers
    { url: `${baseUrl}/#about`,      lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/#skills`,     lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/#projects`,   lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/#experience`, lastModified, changeFrequency: 'yearly',  priority: 0.6 },
    { url: `${baseUrl}/#contact`,    lastModified, changeFrequency: 'monthly', priority: 0.7 },
  ];
}
