// src/components/Header.tsx

function Header() {
  return (
    <header className='w-full bg-slate-900/70 border-b border-slate-800 backdrop-blur'>
      <div className='mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6'>
        <div>
          <p className='text-lg font-semibold text-slate-50'>Bitcoin Receipts</p>
          <p className='text-xs text-slate-400'>
            View human-readable receipts for Bitcoin transactions using live
            mempool.space data.
          </p>
        </div>
      </div>
    </header>
  );
}

export default Header;
