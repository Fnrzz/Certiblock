export const shortenHash = (hash, startLength = 6, endLength = 4) => {
  if (!hash) return "";
  return `${hash.substring(0, startLength)}...${hash.substring(
    hash.length - endLength
  )}`;
};
