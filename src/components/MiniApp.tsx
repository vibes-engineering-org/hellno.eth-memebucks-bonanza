"use client";

import { useState } from "react";
import FileUploadCard from "~/components/FileUploadCard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { DaimoPayButton } from "@daimo/pay";
import { Label } from "~/components/ui/label";
import { useFrameSDK } from "~/hooks/useFrameSDK";
import { baseUSDC } from "@daimo/contract";
import { getAddress } from "viem";
import BucketExplorer from "./BucketExplorer";
import { RECIPIENT_ADDRESS } from "../lib/constants";

function ContestCard() {
  return (
    <Card className="bg-gradient-to-r from-pink-100 to-purple-100">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">🎨 Meme Masters Contest 🏆</CardTitle>
        <CardDescription className="text-center text-lg">
          Show us your best memes! Win eternal glory (and maybe prizes) 🌟
          <br/>
          <span className="font-semibold">How to enter:</span>
          <br/>
          1. Pay 1 USDC entry fee 🪙
          <br/>
          2. Upload your dankest meme 🖼️
          <br/>
          3. Cross fingers and wait for results! 🤞
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

function EntryFeeComponent() {
  return (
    <Card className="mt-4 bg-gradient-to-r from-green-100 to-blue-100">
      <CardHeader>
        <CardTitle className="text-center">Entry Fee: 1 USDC 🪙</CardTitle>
        <CardDescription className="text-center">Pay with USDC on Base to enter the contest!</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <DaimoPayButton
          appId="meme-masters"
          toChain={baseUSDC.chainId}
          toUnits="1.00"
          toToken={getAddress(baseUSDC.token)}
          toAddress={RECIPIENT_ADDRESS}
          onPaymentStarted={(e) => console.log("Payment started:", e)}
          onPaymentCompleted={(e) => {
            console.log("Payment completed:", e);
            // Could store payment success in localStorage here
          }}
        />
      </CardContent>
    </Card>
  );
}

export default function MiniApp() {
  const { isSDKLoaded } = useFrameSDK();

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[400px] mx-auto py-2 px-2 space-y-4">
      <ContestCard />
      <EntryFeeComponent />
      <FileUploadCard />
      <BucketExplorer />
    </div>
  );
}
