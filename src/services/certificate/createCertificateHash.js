import stringify from "json-stable-stringify";
export async function createCertificateHash(certificateData) {
  const stableJsonString = stringify(certificateData);
  const encoder = new TextEncoder();
  const data = encoder.encode(stableJsonString);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex =
    "0x" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  return hashHex;
}
