import { ReactNode, useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Footer from "@/components/Utilities/Footer";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";

const navigation = [
  { name: "Home", href: "/#home" },
  { name: "The Problem", href: "/#problem" },
  { name: "Why Electra?", href: "/#why" },
  { name: "FAQ", href: "/#faq" },
  { name: "Contact", href: "/#contact" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  children?: ReactNode;
}

export default function Layout({ children }: Props) {
  const [token, setToken] = useState("");

  const login = useGoogleLogin({
    scope:
      "https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl",
    onSuccess: (codeResponse) => {
      setToken(codeResponse.access_token);
      console.log(codeResponse);

      localStorage.setItem("token", codeResponse.access_token);
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  const logOut = () => {
    googleLogout();
    setToken("");
    localStorage.removeItem("token");
  };
  const router = useRouter();
  const { address } = useAccount();
  // useAccount({
  //   onConnect() {
  //     router.push("/home");
  //   },
  // });

  useEffect(() => {
    if (token && address) {
      router.push("/home");
    }
  }, [token, address]);

  return (
    <>
      <div className="min-h-full">
        <div className="fixed w-full top-0 z-10">
          <Disclosure
            as="nav"
            className="bg-transparent"
            style={{
              backdropFilter: "saturate(180%) blur(10px)",
              WebkitBackdropFilter: "saturate(180%) blur(10px)",
            }}
          >
            {() => (
              <>
                <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                  <div className="relative flex h-24 items-center justify-between">
                    <div className="flex items-center px-2 lg:px-0">
                      <div className="flex-shrink-0 flex items-center gap-x-3">
                        <Image
                          className="h-14 w-auto"
                          height={512}
                          width={512}
                          src="/logos/logo.png"
                          alt="Revnu"
                        />
                        <div className="font-black text-white text-3xl tracking-wide">
                          Revnu
                          <div className="font-medium text-zinc-400 text-xs">
                            By BlitzCraft
                          </div>
                        </div>
                      </div>
                      <div className="hidden lg:ml-10 lg:block">
                        <div className="flex space-x-4">
                          {navigation.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className={classNames(
                                item.href === router.pathname
                                  ? "bg-white text-zinc-900"
                                  : "text-zinc-200 hover:text-zinc-900 hover:bg-zinc-100",
                                "rounded-md py-2 px-3 text-lg font-medium transition-all duration-200 ease-in-out"
                              )}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <ConnectButton />
                      {token ? (
                        <button
                          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          onClick={logOut}
                        >
                          Log out
                        </button>
                      ) : (
                        <button
                          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          onClick={() => login()}
                        >
                          Sign in with Google 🚀{" "}
                        </button>
                      )}
                      {/* {isDisconnected && (
                        <div>
                          {openConnectModal && (
                            <button
                              onClick={openConnectModal}
                              className="rounded-md bg-white px-3.5 py-2.5 text-lg font-semibold text-zinc-900 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50"
                            >
                              Connect Wallet
                            </button>
                          )}
                        </div>
                      )} */}

                      {/* {address !== null && (
                        <div>
                          {openAccountModal && (
                            <button onClick={openAccountModal} type="button">
                              Open Account Modal
                            </button>
                          )}

                          {openChainModal && (
                            <button onClick={openChainModal} type="button">
                              Open Chain Modal
                            </button>
                          )}

                          {!openConnectModal && (
                            <button onClick={() => disconnect()}>
                              Disconnect
                            </button>
                          )}

                          {address}
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>
              </>
            )}
          </Disclosure>
        </div>

        {/* <div className="h-24 bg-gradient-to-r from-cyan-950 to-sky-950" /> */}
        <main>{children}</main>

        <Footer />
      </div>
    </>
  );
}
