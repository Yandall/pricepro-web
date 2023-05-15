export function fetcher(url: string, options?: RequestInit) {
  if (url !== "")
    return fetch(url, options)
      .then(async (res) => {
        return res.json();
      })
      .then((res) => {
        if (res.error) throw res;
        return res;
      });
  return new Promise<any>((resolve) => resolve(undefined));
}
