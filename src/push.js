import React, {useState, useEffect} from "react"
import { createSocketConnection, EVENTS } from '@pushprotocol/socket';
import { NotificationItem, chainNameType } from "@pushprotocol/uiweb";
import { Chat } from "@pushprotocol/uiweb";

export PushChat = function(){
    const [notifs, setNotifs] = useState([])
    const [account, setAccount] = useState(null)
    const [sdkSocket, setSDKSocket] = useState<any>(null);
    const [isConnected, setIsConnected] = useState(sdkSocket?.connected);

    let currentAccount = null;
    ethereum
    .request({ method: 'eth_accounts' })
    .then(handleAccountsChanged)
    .catch((err) => {
        // Some unexpected error.
        // For backwards compatibility reasons, if no accounts are available,
        // eth_accounts will return an empty array.
        console.error(err);
    });

    // Note that this event is emitted on page load.
    // If the array of accounts is non-empty, you're already
    // connected.
    // For now, 'eth_accounts' will continue to always return an array
    function handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
            // MetaMask is locked or the user has not connected any accounts
            alert('Please connect to MetaMask.');
        } else if (accounts[0] !== currentAccount) {
            setAccount(accounts[0]);
            // Do any other work!
        }
    }
    ethereum.on('accountsChanged', handleAccountsChanged);
    const connectionObject = createSocketConnection({
        user: userCAIP,
        env: 'dev',
        socketOptions: { autoConnect: false }
    })

    setSDKSocket(connectionObject);

    const addSocketEvents = () => {
        sdkSocket?.connect();
        sdkSocket?.on(EVENTS.CONNECT, () => {
            setIsConnected(true);
        })

        sdkSocket?.on(EVENTS.DISCONNECT, () => {
            setIsConnected(false);
        })

        sdkSocket?.on(EVENTS.USER_FEEDS, (notif) => {
            setNotifs((prevNotifs) => {
                prevNotifs.push(notif)
                return prevNotifs
            })
        }
    }

    const removeSocketEvents = () => {
        sdkSocket?.off(EVENTS.CONNECT);
        sdkSocket?.off(EVENTS.DISCONNECT);
        sdkSocket?.disconnect();
    };

    // get account here
    useEffect(() => {
        PushAPI.user.getFeeds({
            user: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // user address in CAIP
            env: 'staging'
            }).then(prevNotifs => {
                setNotifs(() => prevNotifs)
        });

        addSocketEvents()

        if (account) { // 'your connected wallet address'
            EmbedSDK.init({
            headerText: 'Hello DeFi', // optional
            targetID: 'sdk-trigger-id', // mandatory
            appName: 'consumerApp', // mandatory
            user: account, // mandatory
            chainId: 1, // mandatory
            viewOptions: {
                type: 'sidebar', // optional [default: 'sidebar', 'modal']
                showUnreadIndicator: true, // optional
                unreadIndicatorColor: '#cc1919',
                unreadIndicatorPosition: 'bottom-right',
            },
            theme: 'light',
            onOpen: () => {
                console.log('-> client dApp onOpen callback');
            },
            onClose: () => {
                console.log('-> client dApp onClose callback');
            }
            });
        }

        return () => {
            EmbedSDK.cleanup();
            removeSocketEvents();
        };
        
    
    }, [])

    return (
        <>
            <button id="sdk-trigger-id">trigger button</button>
            <Chat
                account={account} //user address
                supportAddress="0xd9c1CCAcD4B8a745e191b62BA3fcaD87229CB26d" //support address
                apiKey="jVPMCRom1B.iDRMswdehJG7NpHDiECIHwYMMv6k2KzkPJscFIDyW8TtSnk4blYnGa8DIkfuacU0"
                env="staging"
            />
            <div>
                {notifications.map((oneNotification, id) => {
                    const { 
                        cta,
                        title,
                        message,
                        app,
                        icon,
                        image,
                        url,
                        blockchain,
                        notification
                    } = oneNotification;

                    return (
                        <NotificationItem
                            key={id}
                            notificationTitle={title}
                            notificationBody={message}
                            cta={cta}
                            app={app}
                            icon={icon}
                            image={image}
                            url={url}
                            theme={theme}
                            chainName={blockchain}
                        />
                        );
                    })}
            </div>
        </>
    )
}