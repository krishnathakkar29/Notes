import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import bs58 from "bs58";
import { derivePath } from "ed25519-hd-key";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import nacl from "tweetnacl";
import { Button } from "./ui/button";
function Wallet({ isGenerated, setIsGenerated }) {
  const [output, setOutput] = useState([]);
  const [walletsList, setWalletsList] = useState([]);
  const [seed, setSeed] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  console.log(walletsList);
  const generateWords = () => {
    const words = generateMnemonic(128);
    console.log("words", words);

    setOutput(words.split(" "));

    setSeed(mnemonicToSeedSync(words));
  };

  useEffect(() => {
    if (isGenerated) {
      generateWords();
    }
  }, [isGenerated]);

  const addWallet = async () => {
    const path = `m/44'/501'/${currentIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed);

    const publicKey = bs58.encode(secret.publicKey);

    // const publicKey2 = Keypair.fromSecretKey(
    //   secret.secretKey
    // ).publicKey.toBase58();
    const privateKey = bs58.encode(secret.secretKey.slice(0, 32));

    setWalletsList((prev) => [
      ...prev,
      {
        id: currentIndex,
        privateKey,
        publicKey,
      },
    ]);

    setCurrentIndex((prev) => prev + 1);
  };

  const deleteAccount = (index) => {
    console.log(index);

    setWalletsList((prev) => prev.filter((item) => item.id != index));
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
            Add Account
          </Button>
          <Button
            variant="destructive"
            className="ml-4"
            onClick={() => setIsGenerated(false)}
          >
            Delete Wallet
          </Button>
        </div>
      </div>
      {walletsList.length != 0 &&
        walletsList.map((item, index) => (
          <div
            className=" p-4 my-4 border-2 border-slate-500 rounded-xl"
            key={index}
          >
            <div className="flex justify-between items-center">
              <p className="border-b border-slate-500">Wallet {item.id + 1}</p>
              <Trash
                className="hover:bg-slate-200 hover:cursor-pointer p-2 rounded-sm hover:text-black h-10 w-10 transition-all duration-100"
                onClick={() => deleteAccount(item.id)}
              />
            </div>
            <p>Private key : {item.privateKey}</p>
            <p>Private key : {item.publicKey}</p>
          </div>
        ))}
    </>
  );
}

export default Wallet;
