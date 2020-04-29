// @ts-ignore
import SHA256 from 'crypto-js/sha256';
// @ts-ignore
import bc from 'blockchain.info/blockexplorer';
import MerkleTree from 'merkletreejs';

// Max hashes count
const M = 50;
// Lead hash zeroes
const N = 5;
// Prototype for comparing
const proto = String().padStart(N, '0');

// Get last unconfirmed transactions from blockchain explorer
const explorer = bc.usingNetwork(0);
explorer.getUnconfirmedTx().then((data: any) => {
  // Convert BC explorer DTO to list of hashes
  const transactions = data.txs;
  const hashesLen = Math.min(transactions.length, M);
  console.log(`Fetching ${hashesLen} hashes`);
  let hashes = transactions.slice(0, hashesLen).map((el: any) => el.hash);

  // Create Merkle tree
  const tree = new MerkleTree(hashes, SHA256);
  const root = tree.getRoot().toString('hex');
  console.log(`Merkle tree root: ${root}`);

  let nonce = 0;
  let iter = 0;
  let startTime = Date.now()

  // Brute force nonce until a hash with the number of zeros equal to the prototype is found
  while (true) {
    iter++;
    // Increase nonce by random value (0;1000)
    nonce += Math.floor(Math.random() * 1000);
    let hash = SHA256(nonce.toString() + root).toString();
    if (hash.slice(0, N) === proto) {
      console.log(`Hash: ${hash}`)
      break;
    }
  }
  console.log(`Nonce: ${nonce} Iter:${iter} Time: ${(Date.now() - startTime) / 1000} sec`);
});
