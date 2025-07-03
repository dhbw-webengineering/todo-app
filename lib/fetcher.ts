export const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    });