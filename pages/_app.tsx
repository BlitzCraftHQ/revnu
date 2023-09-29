import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import {
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "@rainbow-me/rainbowkit/styles.css";
import "@/styles/globals.css";
import "@/styles/index.scss";

// const AltheaEVM = {
//   id: 417834,
//   name: "AltheaEVM DevNet",
//   network: "AltheaEVM DevNet",
//   iconUrl:
//     "https://cdn.dorahacks.io/static/files/188c028468557368d12717c46b1bd63e.jpg",
//   iconBackground: "#fff",
//   nativeCurrency: {
//     decimals: 18,
//     name: "AltheaEVM GAS",
//     symbol: "GAS",
//   },
//   rpcUrls: {
//     public: { http: ["https://althea.zone:8545/"] },
//     default: { http: ["https://althea.zone:8545/"] },
//   },
//   blockExplorers: {
//     default: { name: "AltheaTrace", url: "https://evm.ngd.network/" },
//   },
//   testnet: false,
// };
const MumbaiEVM = {
  id: 80001,
  name: "Mumbai",
  network: "Mumbai Testnet",
  iconUrl:
    "https://cdn.dorahacks.io/static/files/188c028468557368d12717c46b1bd63e.jpg",
  iconBackground: "#fff",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
  rpcUrls: {
    public: { http: ["https://polygon-mumbai-bor.publicnode.com"] },
    default: { http: ["https://polygon-mumbai-bor.publicnode.com"] },
  },
  blockExplorers: {
    default: { name: "polygonscan", url: "https://mumbai.polygonscan.com" },
  },
  testnet: true,
};

const pegoTestNet = {
  id: 123456,
  name: "PEGOTestNet",
  network: "PEGO Testnet",
  iconUrl:
    "https://cdn.dorahacks.io/static/files/188c028468557368d12717c46b1bd63e.jpg",
  iconBackground: "#fff",
  nativeCurrency: {
    name: "PG",
    symbol: "PG",
    decimals: 18,
  },
  rpcUrls: {
    public: { http: ["https://rpc.pegotest.net"] },
    default: { http: ["https://rpc.pegotest.net"] },
  },
  blockExplorers: {
    default: { name: "pegoscan", url: "https://scan.pegotest.net/" },
  },
  testnet: true,
};

export default function App({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false);

  const { publicClient, chains } = configureChains(
    [pegoTestNet],
    [publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: "",
    projectId: "2588db3d04914636093b01d564610991",
    chains,
  });

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      {ready ? (
        <GoogleOAuthProvider clientId="276764548749-kp580h77fv3bg9ofoeu5563saggg7jpo.apps.googleusercontent.com">
          <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider
              chains={chains}
              theme={lightTheme({
                accentColor: "#9333ea",
                accentColorForeground: "white",
                borderRadius: "medium",
                fontStack: "system",
                overlayBlur: "small",
              })}
            >
              <Component {...pageProps} />
            </RainbowKitProvider>
          </WagmiConfig>
        </GoogleOAuthProvider>
      ) : null}
    </>
  );
}
