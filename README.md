# Bitcoin Receipts

A small prototype tool for viewing human-readable receipts for Bitcoin transactions.

The app fetches live transaction data from the [mempool.space](https://mempool.space) API, calculates key values using the Bitcoin UTXO model, and renders a structured receipt that can be copied or downloaded as a PDF.

> Built as a personal learning project to deepen my understanding of Bitcoin transactions, API integration, and React + TypeScript frontend architecture.


## Features

-  **Live Bitcoin transaction lookup**  
  Paste a Bitcoin transaction ID (TxID) and fetch real data from mempool.space.

-  **UTXO-based calculations**  
  - Sum of all inputs (`totalInput`)  
  - Sum of all outputs (`totalOutput`)  
  - Effective amount sent / debited  
  - Absolute fee and fee percentage

-  **Pending vs confirmed handling**  
  - Detects whether a transaction is confirmed or still pending  
  - Shows human-readable timestamps when available  
  - Falls back to a clear `Pending` state when block time is not yet set

-  **Receipt view**  
  - Clean, dark UI with a “Bitcoin receipts” layout  
  - Clearly separated sections (times, amounts, fees, status)  
  - Shows TxID in monospace format

-  **Copy & export**  
  - Copy transaction ID  
  - Copy the formatted receipt text  
  - Download the receipt as a PDF

---

## Tech stack

- **Frontend:** React, TypeScript, Vite  
- **Styling:** Tailwind CSS (dark theme with Bitcoin-orange accent)  
- **Data source:** [mempool.space API](https://mempool.space/docs/api/rest#get-transactions)  
- **Other:** HTML-to-canvas/PDF generation for receipts, small utility helpers for formatting amounts and timestamps

---

## How it works (high level)

1. The user pastes a Bitcoin TxID into the input field.
2. The app calls a dedicated `fetchTx` function in `api.ts`, which:
   - Calls the mempool.space endpoint for that transaction
   - Validates the response and returns a strongly typed object
3. In `App.tsx`, the transaction data is stored in React state together with loading and error state.
4. The `ReceiptCard` component receives the transaction as props and:
   - Sums the input values to compute `totalInput`
   - Sums output values to compute `totalOutput`
   - Derives the effective sent amount and fee + fee percent
   - Renders a user-friendly receipt with status, times and amounts

The goal is to turn low-level Bitcoin transaction data into something an ordinary user can read as a “receipt”.

---

## Running the project

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
