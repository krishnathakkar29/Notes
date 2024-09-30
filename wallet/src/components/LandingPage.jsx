import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Wallet from "./Wallet";
import { Buffer } from "buffer";

function LandingPage() {
  const [isGenerated, setIsGenerated] = useState(false);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Wallet</h1>
      {!isGenerated && (
        <Button onClick={() => setIsGenerated(true)}>Generate Wallet</Button>
      )}
      {isGenerated && (
        <Wallet isGenerated={isGenerated} setIsGenerated={setIsGenerated} />
      )}
    </>
  );
}

export default LandingPage;
