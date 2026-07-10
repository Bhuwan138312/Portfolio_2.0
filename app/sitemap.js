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
  ];
}
