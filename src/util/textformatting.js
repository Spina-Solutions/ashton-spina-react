export const toTitleCase = (sentence) =>
  typeof sentence === 'string'
    ? sentence.replace(/\b[a-zA-Z]/g, (match) => match.toUpperCase())
    : '';

export const structuredBlogPostSchemaElement = (name, description, imgPath) => {
  return JSON.stringify({
    '@context': 'http://schema.org',
    '@type': 'BlogPosting',
    name: name,
    description: description,
    url: window.location.href,
  });
};
