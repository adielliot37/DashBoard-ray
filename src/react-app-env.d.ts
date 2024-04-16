/// <reference types="react-scripts" />
interface Window {
    solana?: {
      isPhantom: boolean;
      connect: (options: { onlyIfTrusted: boolean }) => Promise<{ publicKey: PublicKey }>;
      on: (event: string, callback: (args: any) => void) => void;
      disconnect: () => Promise<void>;
    };
  }
  