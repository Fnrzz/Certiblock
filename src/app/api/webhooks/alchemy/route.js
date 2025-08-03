import { NextResponse } from "next/server";
import crypto from "crypto";
import { decodeEventLog, formatEther, hexToBigInt } from "viem";
import { contractABI } from "@/services/blockchain/contractAbi"; // Pastikan path ini benar
import { supabase } from "@/lib/supabaseClient";

function isValidSignature(body, signature, authToken) {
  const hmac = crypto.createHmac("sha256", authToken);
  hmac.update(body, "utf8");
  const digest = hmac.digest("hex");
  return signature === digest;
}

export async function POST(request) {
  try {
    const bodyAsText = await request.text();
    const signature = request.headers.get("x-alchemy-signature");
    const alchemyAuthToken = process.env.NEXT_PUBLIC_ALCHEMY_AUTH_TOKEN;

    if (!isValidSignature(bodyAsText, signature, alchemyAuthToken)) {
      console.warn("Invalid signature received from webhook.");
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 }
      );
    }

    const body = JSON.parse(bodyAsText);

    for (const log of body.event.data.block.logs) {
      try {
        const transactionHash = log.transaction.hash;
        const block = body.event.data.block;
        const blockNumber = block.number;
        const originWallet = log.transaction.from.address;

        const gasUsed = hexToBigInt(log.transaction.gasUsed);
        const effectiveGasPrice = hexToBigInt(
          log.transaction.effectiveGasPrice
        );
        const transactionFeeInWei = gasUsed * effectiveGasPrice;
        const transactionFeeInPol = formatEther(transactionFeeInWei);

        const decodedLog = decodeEventLog({
          abi: contractABI,
          data: log.data,
          topics: log.topics,
        });

        const { eventName, args } = decodedLog;

        console.log(`⚡️ Event Diterima: ${eventName}`);

        if (eventName === "CertificateIssued") {
          const { nim, certificateHash, timestamp } = args;

          const { error: insertError } = await supabase
            .from("transactions")
            .insert({
              studentId: nim,
              transactionHash: transactionHash,
              transactionType: "ISSUE",
              status: "SUCCESS",
              certificateHashOnchain: certificateHash,
              blockNumber: blockNumber,
              transactionFee: transactionFeeInPol,
              confirmedAt: new Date(Number(timestamp) * 1000),
              originWallet: originWallet,
            });

          if (insertError) {
            console.error(
              "❌ Error saat menyimpan transaksi:",
              insertError.message
            );
          } else {
            console.log("✅ Transaksi berhasil disimpan.");
          }
        } else if (eventName === "CertificateRevoked") {
          const { nim, timestamp } = args;

          const { data: certificateToRevoke, error: findError } = await supabase
            .from("transactions")
            .select("id")
            .eq("studentId", nim)
            .eq("status", "SUCCESS")
            .eq("transactionType", "ISSUE")
            .order("confirmedAt", { ascending: false })
            .limit(1)
            .single();

          if (findError) {
            console.error(
              `Gagal menemukan sertifikat untuk NIM ${nim}:`,
              findError.message
            );
          }

          if (certificateToRevoke) {
            const { error: updateError } = await supabase
              .from("transactions")
              .update({
                status: "REVOKED",
                failedAt: new Date(Number(timestamp) * 1000).toISOString(),
              })
              .eq("id", certificateToRevoke.id);

            if (updateError)
              throw new Error(`Supabase update error: ${updateError.message}`);
            console.log(
              `✅ Status sertifikat untuk NIM ${nim} berhasil diubah menjadi REVOKED.`
            );
          }

          const { error: insertError } = await supabase
            .from("transactions")
            .insert({
              studentId: nim,
              transactionHash: transactionHash,
              transactionType: "REVOKE",
              status: "SUCCESS",
              blockNumber: blockNumber,
              transactionFee: transactionFeeInPol,
              confirmedAt: new Date(Number(timestamp) * 1000),
              originWallet: originWallet,
            });

          if (insertError) {
            console.error("❌ Error saat menyimpan transaksi:", insertError);
          } else {
            console.log("✅ Transaksi berhasil disimpan.");
          }
        }
      } catch (decodeError) {
        console.log("Mengabaikan event yang tidak relevan.", decodeError);
      }
    }

    return NextResponse.json(
      { message: "Webhook processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fatal saat memproses webhook:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
