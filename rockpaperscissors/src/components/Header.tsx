import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { Flex } from "antd";

const Header = ({ connected, account, balance, network } : any) => {
    return (
        <Flex align="center" justify="space-evenly">
            <WalletSelector />
            {connected && account ? (
                <Flex align="center" justify="space-around">
                    <p>Network: {network ? network.name : 'Unknown'}</p>
                    <p>Testnet Balance: {balance !== null ? `${balance} APT` : 'Loading...'}</p>
                </Flex>
            ) : (
                <p>No wallet connected</p>
            )}
        </Flex>
    );
}

export default Header