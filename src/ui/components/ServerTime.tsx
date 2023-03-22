async function ServerTime() {
  const time = await getTime();

  return <strong>{time}</strong>;
}

async function getTime(): Promise<number> {
  return new Promise((res) => {
    setTimeout(() => res(Date.now()), 2000);
  });
}

export { ServerTime };
