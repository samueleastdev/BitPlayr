async function getUrl(url: string | undefined): Promise<any> {
  if (!url) {
    throw new Error(`Url is undefined`);
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    throw new Error(`Fetching error: ${error}`);
  }
}

export { getUrl };
