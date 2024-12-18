import { createContext, useContext } from "react";

const TokenContext = createContext(undefined);

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {

    

    return (
        <TokenContext.Provider value={}>
          {children}
        </TokenContext.Provider>
      );

}

export const useBurnClose = () => {
    const context = useContext(TokenContext);
    if (!context) {
      throw new Error(
        "useClusterWallet must be used within a ClusterWalletProvider"
      );
    }
    return context;
  };