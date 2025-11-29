import { useState, type FormEvent } from 'react';
import { jsPDF } from 'jspdf';
import { mockTx } from './mockTx';
import type { MempoolTx } from './types';
import { fetchTx } from './api';
import Header from './components/Header';
import ReceiptCard from './components/ReceiptCard';
import { formatSats, formatTime } from './utils/format';

function App() {
  const [tx, setTx] = useState<MempoolTx>(mockTx);
  const [txidInput, setTxidInput] = useState<string>(mockTx.txid);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  async function handleGetReceipt(e: FormEvent) {
    e.preventDefault();
    const trimmed = txidInput.trim();
    if (!trimmed) return;

    try {
      setLoading(true);
      setError(null);

      const liveTx = await fetchTx(trimmed);
      setTx(liveTx);
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : 'Failed to load transaction';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function showCopyMessage(msg: string) {
    setCopyMessage(msg);
    setTimeout(() => setCopyMessage(null), 1500);
  }

  async function handleCopyTxid() {
    try {
      await navigator.clipboard.writeText(tx.txid);
      showCopyMessage('TxID copied');
    } catch (err) {
      console.error(err);
      showCopyMessage('Copy failed');
    }
  }

  function buildReceiptText(tx: MempoolTx): string {
    const totalInput = tx.vin.reduce(
      (sum, vin) => sum + (vin.prevout?.value ?? 0),
      0
    );
    const totalOutput = tx.vout.reduce((sum, vout) => sum + vout.value, 0);
    const sent = totalInput;
    const received = totalOutput - tx.fee;
    const feePercent = totalInput ? (tx.fee / totalInput) * 100 : 0;

    return [
      `TxID: ${tx.txid}`,
      `Sent: ${formatSats(sent)} sats`,
      `Received: ${formatSats(received)} sats`,
      `Fee: ${formatSats(tx.fee)} sats (${feePercent.toFixed(2)}%)`,
      `Time (confirmed): ${formatTime(tx.status.block_time)}`,
    ].join('\n');
  }

  async function handleCopyReceipt() {
    try {
      const text = buildReceiptText(tx);
      await navigator.clipboard.writeText(text);
      showCopyMessage('Receipt copied');
    } catch (err) {
      console.error(err);
      showCopyMessage('Copy failed');
    }
  }

  function handleDownloadPdf() {
    const totalInput = tx.vin.reduce(
      (sum, vin) => sum + (vin.prevout?.value ?? 0),
      0
    );
    const totalOutput = tx.vout.reduce((sum, vout) => sum + vout.value, 0);
    const sent = totalInput;
    const received = totalOutput - tx.fee;
    const feePercent = totalInput ? (tx.fee / totalInput) * 100 : 0;

    const pdf = new jsPDF();

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text('Bitcoin Receipts - Bitcoin Transaction Receipt', 10, 20);

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');

    let y = 35;

    pdf.text(`TxID: ${tx.txid}`, 10, y);
    y += 8;
    pdf.text(`Sent: ${formatSats(sent)} sats`, 10, y);
    y += 8;
    pdf.text(`Received: ${formatSats(received)} sats`, 10, y);
    y += 8;
    pdf.text(
      `Fee: ${formatSats(tx.fee)} sats (${feePercent.toFixed(2)}%)`,
      10,
      y
    );
    y += 8;
    pdf.text(`Time (confirmed): ${formatTime(tx.status.block_time)}`, 10, y);

    const shortId = tx.txid.slice(0, 8);
    pdf.save(`bitcoin-receipt-${shortId}.pdf`);
  }

  return (
    <div className='min-h-screen bg-slate-950 text-slate-50'>
      <Header />
      <main className='flex justify-center items-start py-12 px-4'>
        <div className='w-full max-w-3xl space-y-8'>
          <ReceiptCard
            tx={tx}
            txidInput={txidInput}
            onChangeTxid={setTxidInput}
            onGetReceipt={handleGetReceipt}
            loading={loading}
            error={error}
            onCopyTxid={handleCopyTxid}
            onCopyReceipt={handleCopyReceipt}
            onDownloadPdf={handleDownloadPdf}
            copyMessage={copyMessage}
          />
          <footer className='text-center text-[11px] text-slate-500 border-t border-slate-800 pt-3'>
            Built as a personal prototype to learn Bitcoin transaction flows,
            mempool.space, React and TypeScript.
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
