import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { celo, celoAlfajores } from "wagmi/chains";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "@rainbow-me/rainbowkit/styles.css";
import "@/styles/globals.css";
import "@/styles/index.scss";
const dotenv = require("dotenv");
dotenv.config();

export default function App({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false);

  const { publicClient, chains } = configureChains(
    [celo, celoAlfajores],
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
            <Component {...pageProps} />
          </WagmiConfig>
        </GoogleOAuthProvider>
      ) : null}
    </>
  );
}
