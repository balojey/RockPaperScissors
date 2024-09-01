import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { Flex } from "antd";

const Header = ({ connected, account, balance, network } : any) => {
    return (
        <Flex align="center" justify="space-between">
            <WalletSelector />
            {connected && account ? (
                <>
                    <p>Network: {network ? network.name : 'Unknown'}</p>
                    <p>Testnet Balance: {balance !== null ? `${balance} APT` : 'Loading...'}</p>
                </>
            ) : (
                <p>No wallet connected</p>
            )}
        </Flex>
    );
}

export default Header