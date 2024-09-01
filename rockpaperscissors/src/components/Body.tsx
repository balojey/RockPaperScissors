import { useState } from "react";
import { Flex, Button } from "antd";
import { Aptos, MoveStructId, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const Body = ({ connected, account, balance, network, signAndSubmitTransaction, submitTransaction } : any) => {

    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(aptosConfig);

    const [playerMove, setPlayerMove] = useState<number | null>(null);
    const [computerMove, setComputerMove] = useState<number | null>(null);
    const [gameResult, setGameResult] = useState<String | null>(null);
    const exp = Math.floor(Date.now() / 1000) + 60 * 10

    const handleStartGame = async () => {
        const func: MoveStructId = "0x8a25712c73adb887339dd88a5f46512133bd927a5555f045257496752353f918::RockPaperScissors::start_game"
        const response = await signAndSubmitTransaction({
            sender: account.address,
            data: {
                function: func,
                functionArguments: []
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
                functionArguments: []
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
    const getComputerMove = async () => {
        const func: MoveStructId = "0x8a25712c73adb887339dd88a5f46512133bd927a5555f045257496752353f918::RockPaperScissors::get_computer_move"
        const response = await aptos.view({ 
            payload: {
                function: func,
                functionArguments: [account.address]
            }
         })
        console.log(response)
        setComputerMove(Number(response[0]))
    }
    const handleFinalizeGameResults = async () => {
        const func: MoveStructId = "0x8a25712c73adb887339dd88a5f46512133bd927a5555f045257496752353f918::RockPaperScissors::finalize_game_results"
        const response = await signAndSubmitTransaction({
            sender: account.address,
            data: {
                function: func,
                functionArguments: []
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

    const getGameResults = async () => {
        const func: MoveStructId = "0x8a25712c73adb887339dd88a5f46512133bd927a5555f045257496752353f918::RockPaperScissors::get_game_results"
        const response = await aptos.view({ 
            payload: {
                function: func,
                functionArguments: [account.address]
            }
         })
        console.log(response)
        if (Number(response[0]) === 1) setGameResult("Draw!")
        if (Number(response[0]) === 2) setGameResult("You win!")
        if (Number(response[0]) === 3) setGameResult("Computer wins!")
    }

    return (
        <>
            {connected && account ? (
                <div>
                    <Flex align="center" justify="space-between">
                        <p>Start Game</p>
                        <Button onClick={async () => await handleStartGame}>Start Game</Button>
                        <p></p>
                    </Flex>
                    <Flex align="center" justify="space-between">
                        <p>Set Player Move</p>
                        <div>
                            <Button onClick={async () => await handleSetPlayerMove(1)}>1</Button>
                            <Button onClick={async () => await handleSetPlayerMove(2)}>2</Button>
                        </div>
                        <p>{playerMove}</p>
                    </Flex>
                    <Flex align="center" justify="space-between">
                        <p>Randomly Set Computer Move</p>
                        <Button onClick={async () => {await handleSetComputerMove(); await getComputerMove()}}>Randomly Set Computer Move</Button>
                        <p>{computerMove}</p>
                    </Flex>
                    <Flex align="center" justify="space-between">
                        <p>Finalize Game Results</p>
                        <Button onClick={async () => {await handleFinalizeGameResults(); await getGameResults()}}>Finalize Game Results</Button>
                        <p>{gameResult}</p>
                    </Flex>
                </div>
                ) : (
                <div>Connect wallet to continue...</div>
                )
            }
        </>
    );
}

export default Body