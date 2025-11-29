export function formatSats(sats: number) {
  return sats.toLocaleString('en-US');
}

export function formatTime(unixSeconds: number | null): string {
  if (!unixSeconds) {
    return 'Pending';
  }

  const d = new Date(unixSeconds * 1000);
  return d.toISOString().replace('T', ' ').slice(0, 19);
}
