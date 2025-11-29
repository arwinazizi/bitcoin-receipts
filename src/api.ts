import type { MempoolTx } from './types';

const BASE_URL = 'https://mempool.space/api';

export async function fetchTx(txid: string): Promise<MempoolTx> {
  const trimmed = txid.trim();
  if (!trimmed) {
    throw new Error('Missing txid');
  }

  const res = await fetch(`${BASE_URL}/tx/${trimmed}`);

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const data = (await res.json()) as MempoolTx;
  return data;
}
