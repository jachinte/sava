import { useState } from "react";

export default function useGasPrice(targetNetwork, speed) {
  const [gasPrice, setGasPrice] = useState();
  const loadGasPrice = async () => {};
  return gasPrice;
}
