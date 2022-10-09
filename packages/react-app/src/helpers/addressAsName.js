export function addressAsName(address) {
  const length = address.length;
  return `${address.substring(0, 4)}...${address.substring(length - 4)}`;
}
