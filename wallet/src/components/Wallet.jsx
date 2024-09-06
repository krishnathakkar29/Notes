import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { useEffect, useState } from "react";
import { hmac } from "@noble/hashes/hmac";
import { sha512 } from "@noble/hashes/sha512";
import { getPublicKey, sign } from "@noble/ed25519"; // Import the specific functions
import { Button } from "./ui/button";
import { Keypair } from "@solana/web3.js";

function Wallet({ isGenerated, setIsGenerated }) {
  const [output, setOutput] = useState([]);
  const [walletsList, setWalletsList] = useState([]);
  const [seed, setSeed] = useState("");

  const generateWords = () => {
    const words = generateMnemonic(128);
    setOutput(words.split(" "));

    setSeed(mnemonicToSeedSync(words));
  };

  useEffect(() => {
    if (isGenerated) {
      generateWords();
    }
  }, [isGenerated]);

  const derivePath = (path, seed) => {
    const segments = path
      .split("/")
      .slice(1)
      .map((v) => parseInt(v.replace("'", ""), 10));
    let derivedSeed = seed;
    for (const segment of segments) {
      const index = Buffer.alloc(4);
      index.writeUInt32BE(segment + 0x80000000, 0);
      derivedSeed = hmac(
        sha512,
        derivedSeed
      )(Buffer.concat([Buffer.from([0]), derivedSeed, index]));
    }
    return derivedSeed;
  };
  const addWallet = async () => {
    const id = walletsList.length + 1;
    const path = `m/44'/501'/${id}'/0'`;
    const derivedSeed = derivePath(path, seed);
    const privateKey = derivedSeed.slice(0, 32);

    // Use the getPublicKey function from @noble/ed25519
    const publicKey = await getPublicKey(privateKey);

    // Combine the private key and public key to create the Keypair
    const secret = new Uint8Array([...privateKey, ...publicKey]);
    const pair = Keypair.fromSecretKey(secret).publicKey.toBase58();

    console.log(pair);
  };

  return (
    <>
      <div className="px-8 mt-4 border-2 border-slate-400 rounded-lg py-4 shadow-sm shadow-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 rounded-lg gap-4">
          {output.map((item, index) => (
            <div
              className="p-4 bg-gray-800 text-white rounded-md shadow-md"
              key={index}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center p-3 mt-4">
        <h1 className="text-xl font-semibold">Eth Wallet</h1>
        <div>
          <Button variant="secondary" onClick={addWallet}>
            Add Wallet
          </Button>
          <Button
            variant="destructive ml-4"
            onClick={() => setIsGenerated(false)}
          >
            Clear Wallet
          </Button>
        </div>
      </div>
    </>
  );
}

export default Wallet;
