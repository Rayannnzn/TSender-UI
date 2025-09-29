"use client"

import { useAccount } from "wagmi";
import HomeContents from "@/components/HomeContents";
export default function Home() {
  const {isConnected} =  useAccount()

  return (
    <div>

     {isConnected ? (
      <div>
        <HomeContents/>
      </div>
     ) : (

      <div>
        Please Connect Your Wallet
      </div>
     )



     } 




    </div>

  );
}
