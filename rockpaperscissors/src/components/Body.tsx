import { useState } from "react";
import { Flex, Button } from "antd";
import { Aptos, MoveStructId, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const Body = ({ connected, account, balance, network, signAndSubmitTransaction } : any) => {

    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(aptosConfig);

    const [playerMove, setPlayerMove] = useState<number | null>(null);
    const [computerMove, setComputerMove] = useState<number | null>(null);
    const [gameResult, setGameResult] = useState<number | null>(null);
    const exp = Math.floor(Date.now() / 1000) + 60 * 10

    const handleStartGame = async () => {
        const func: MoveStructId = "0x8a25712c73adb887339dd88a5f46512133bd927a5555f045257496752353f918::RockPaperScissors::start_game"
        const response = await signAndSubmitTransaction({
            sender: account.address,
            data: {
                function: func,
            },
            options: {
                expireTimestamp: exp,
            }
        });
        try {
            await aptos.waitForTransaction({ transactionHash: response.hash });
        } catch (error) {
            console.error(error);
        }
    }

    const handleSetPlayerMove = async (num: number) => {
        const func: MoveStructId = "0x8a25712c73adb887339dd88a5f46512133bd927a5555f045257496752353f918::RockPaperScissors::set_player_move"
        const response = await signAndSubmitTransaction({
            sender: account.address,
            data: {
                function: func,
                functionArguments: [String(num)]
            },
            options: {
                expireTimestamp: exp,
            }
        });
        try {
            await aptos.waitForTransaction({ transactionHash: response.hash });
            console.log(response)
            setPlayerMove(num)
        } catch (error) {
            console.error(error);
        }
    }
    const handleSetComputerMove = async () => {
        const func: MoveStructId = "0x8a25712c73adb887339dd88a5f46512133bd927a5555f045257496752353f918::RockPaperScissors::randomly_set_computer_move"
        const response = await signAndSubmitTransaction({
            sender: account.address,
            data: {
                function: func,
            },
            options: {
                expireTimestamp: exp,
            }
        });
        try {
            // await aptos.waitForTransaction({ transactionHash: response.hash });
            console.log(response)
        } catch (error) {
            console.error(error);
        }
    }
    const handleSetComputerMove2 = async () => {
        const func: MoveStructId = "0x8a25712c73adb887339dd88a5f46512133bd927a5555f045257496752353f918::RockPaperScissors::get_computer_move"
        const response = await signAndSubmitTransaction({
            sender: account.address,
            data: {
                function: func,
            },
            options: {
                expireTimestamp: exp,
            }
        });
        try {
            console.log(response)
        } catch (error) {
            console.error(error);
        }
    }
    const handleFinalizeGameResults = async () => {
        const func: MoveStructId = "0x8a25712c73adb887339dd88a5f46512133bd927a5555f045257496752353f918::RockPaperScissors::finalize_game_results"
        const response = await signAndSubmitTransaction({
            sender: account.address,
            data: {
                function: func,
            },
            options: {
                expireTimestamp: exp,
            }
        });
        try {
            await aptos.waitForTransaction({ transactionHash: response.hash });
            console.log(response)
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            {connected && account ? 
                <Flex align="center" justify="space-around">
                    <div id="player">
                        <Button onClick={async () => await handleStartGame}>Start Game</Button><br /><br />
                        <div>Set Player Move</div>
                        <Button onClick={async () => await handleSetPlayerMove(1)}>1</Button>
                        <Button onClick={async () => await handleSetPlayerMove(2)}>2</Button><br /><br />
                        <Button onClick={async () => await handleSetComputerMove()}>Randomly Set Computer Move</Button><br /><br />
                        <Button onClick={async () => await handleFinalizeGameResults()}>Finalize Game Results</Button><br />
                    </div>

                    <div id="results">
                        <p>-</p>
                        <p>{playerMove}</p>
                        <p>Get Computer Move</p>
                        <p>Get Game Results</p>
                    </div>
                </Flex> : (
                    <div>Connect wallet to continue...</div>
                )
            }
        </>
    );
}

export default Body