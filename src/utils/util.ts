export const normalizeEmail = (email: string): string => {
  const domains = ['gmail.com', 'googlemail.com'];

  const data = email.toLowerCase();
  const [username, domain] = data.split('@');

  if (domains.includes(domain)) {
    const beforePlus = username.substring(0, username.indexOf('+'));
    const result = beforePlus ? beforePlus.replace(/\./g, '') : username.replace(/\./g, '');

    return `${result}@gmail.com`;
  }

  return data;
}
