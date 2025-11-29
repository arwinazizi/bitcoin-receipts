import type { MempoolTx } from "./types";

export const mockTx: MempoolTx = {
  txid: 'bb744ff6ae4d27783c2b05c9d897e4ce026670ba326aac7230928b07724d8be6',
  fee: 482,
  status: {
    confirmed: true,
    block_time: 1730730344, // example unix time (seconds)
  },
  vin: [
    {
      prevout: {
        value: 269838,
        scriptpubkey_address: 'bc1qexamplefrom',
      },
    },
  ],
  vout: [
    {
      value: 269356,
      scriptpubkey_address: 'bc1qexampleto1',
    },
    {
      value: 482,
      scriptpubkey_address: 'bc1qexamplefee',
    },
  ],
};