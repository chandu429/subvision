export const GET = async (url) => {
  let data, error, ok;
  try {
    const rawResponse = await fetch(url);
    ok = rawResponse?.ok;
    data = await rawResponse.json();
  } catch (error) {
    console.error('GET error', error);
    error = error;
  }

  return { data, error, ok };
};

export const POST = async (url, body, headerOptions = {}) => {
  let data, error, ok;
  try {
    const rawResponse = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headerOptions
      },
      body: JSON.stringify(body)
    });
    ok = rawResponse?.ok;
    data = await rawResponse.json();
  } catch (error) {
    console.error('POST error', error);
    error = error;
  }

  return { data, error, ok };
};
