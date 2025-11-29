import type { FormEvent } from 'react';
import type { MempoolTx } from '../types';
import { formatSats, formatTime } from '../utils/format';

export interface ReceiptCardProps {
  tx: MempoolTx;
  txidInput: string;
  onChangeTxid: (value: string) => void;
  onGetReceipt: (e: FormEvent) => void;
  loading: boolean;
  error: string | null;
  onCopyTxid: () => void;
  onCopyReceipt: () => void;
  onDownloadPdf: () => void;
  copyMessage: string | null;
}

function ReceiptCard({
  tx,
  txidInput,
  onChangeTxid,
  onGetReceipt,
  loading,
  error,
  onCopyTxid,
  onCopyReceipt,
  onDownloadPdf,
  copyMessage,
}: ReceiptCardProps) {
  // Sum UTXO inputs/outputs to derive sent/received amounts.
  const totalInput = tx.vin.reduce(
    (sum, vin) => sum + (vin.prevout?.value ?? 0),
    0
  );
  const totalOutput = tx.vout.reduce((sum, vout) => sum + vout.value, 0);

  const sent = totalInput;
  const received = totalOutput - tx.fee;
  const feePercent = totalInput ? (tx.fee / totalInput) * 100 : 0;

  const hasTime = tx.status.confirmed && tx.status.block_time != null;

  const sentTimeText = hasTime
    ? formatTime(tx.status.block_time! - 60)
    : 'Pending';

  const recdTimeText = hasTime ? formatTime(tx.status.block_time!) : 'Pending';

  const statusText = tx.status.confirmed ? 'Confirmed' : 'Pending';

  return (
    <div className='w-full rounded-xl border border-slate-800 bg-slate-900 shadow-xl shadow-black/20'>
      <main className='space-y-6 px-6 py-6 sm:px-8 sm:py-8'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
          <div className='space-y-1'>
            <p className='text-base font-semibold text-slate-100'>Receipt</p>
            <p className='break-all font-mono text-xs text-slate-400'>
              {tx.txid}
            </p>
          </div>
          <div className='flex flex-wrap justify-end gap-2'>
            <button
              type='button'
              onClick={onCopyTxid}
              className='inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800'
            >
              Copy TxID
            </button>
            <button
              type='button'
              onClick={onCopyReceipt}
              className='inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800'
            >
              Copy receipt
            </button>
            <button
              type='button'
              onClick={onDownloadPdf}
              className='inline-flex items-center justify-center rounded-md border border-amber-400/40 bg-slate-900 px-3 py-1.5 text-xs text-amber-200 hover:bg-slate-800'
            >
              Download PDF
            </button>
          </div>
        </div>

        <section className='space-y-3 rounded-lg border border-slate-800 bg-slate-950/50 p-4'>
          <div>
            <h2 className='text-sm font-semibold text-slate-100'>
              Enter Bitcoin transaction ID
            </h2>
            <p className='text-xs text-slate-500'>
              Paste a Bitcoin TxID from mempool.space or your wallet to generate
              a receipt.
            </p>
          </div>
          <form
            onSubmit={onGetReceipt}
            className='flex flex-col gap-3 sm:flex-row sm:items-center'
          >
            <input
              className='flex-1 rounded-md border border-slate-800 bg-slate-900 px-3 py-2 font-mono text-xs text-slate-100 placeholder:text-slate-600 focus:border-amber-400/70 focus:outline-none focus:ring-2 focus:ring-amber-400/40'
              value={txidInput}
              onChange={(e) => onChangeTxid(e.target.value)}
              placeholder='Paste transaction ID...'
            />
            <button
              type='submit'
              className='inline-flex items-center justify-center rounded-md bg-[#f7931a] px-4 py-2 text-sm font-medium text-slate-950 hover:bg-amber-400 disabled:opacity-50'
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Get receipt'}
            </button>
          </form>
          {copyMessage && (
            <p className='text-right text-xs text-slate-400'>{copyMessage}</p>
          )}
          {error && (
            <p className='text-xs text-amber-300'>
              {error} (check txid or try again)
            </p>
          )}
        </section>

        <section className='grid gap-6 text-sm sm:grid-cols-2'>
          <div className='space-y-3'>
            <div className='text-xs uppercase tracking-wide text-slate-500'>
              Timing
            </div>
            <div className='flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 px-4 py-3'>
              <span className='text-slate-300'>Sent time</span>
              <span className='font-mono text-xs text-slate-200'>
                {sentTimeText}
              </span>
            </div>
            <div className='flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 px-4 py-3'>
              <span className='text-slate-300'>Received time</span>
              <span className='font-mono text-xs text-slate-200'>
                {recdTimeText}
              </span>
            </div>
            <div className='flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 px-4 py-3'>
              <span className='text-slate-300'>Status</span>
              <span className='font-semibold text-slate-100'>{statusText}</span>
            </div>
          </div>

          <div className='space-y-3'>
            <div className='text-xs uppercase tracking-wide text-slate-500'>
              Amounts
            </div>
            <div className='flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 px-4 py-3'>
              <span className='text-slate-300'>Amount sent / debited</span>
              <span className='font-mono text-xs text-slate-200'>
                {formatSats(sent)} sats
              </span>
            </div>
            <div className='flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 px-4 py-3'>
              <span className='text-slate-300'>Fee</span>
              <span className='font-mono text-xs text-slate-200'>
                {formatSats(tx.fee)} sats
              </span>
            </div>
            <div className='flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 px-4 py-3'>
              <span className='text-slate-300'>Fee %</span>
              <span className='font-mono text-xs text-slate-200'>
                {feePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </section>

        <p className='text-center text-[11px] uppercase tracking-wide text-slate-500'>
          Source: mempool.space API
        </p>
      </main>
    </div>
  );
}

export default ReceiptCard;
