import React, {useState, useEffect, useContext} from "react";
import { useRouter } from "next/router";

// Internal imports
import { checkIfWalletConnected, connectWallet, connectingWithContract } from "../Utils/apiFeature";

export const ChatAppContext = React.createContext();

export const ChatAppProvider = ({children}) => {

    // Usestates...
    const [account, setAccount] = useState("");
    const [userName, setUserName] = useState("");
    const [friendList, setFriendList] = useState([]);
    const [friendMessage, setFriendMessage] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userList, setUserList] = useState([]);
    const [error, setError] = useState("");

    // Chat user data...
    const [currentUserName, setCurrentUserName] = useState("");
    const [currentUserAddress, setCurrentUserAddress] = useState("");

    // To redirect to different pages or Home page
    const router = useRouter();

    // Fetch data at the time of page load
    const fetchData = async() => {
        try {
            // Get contract
            const contract = await connectingWithContract();

            // Get account
            const connectAccount = await connectWallet();
            setAccount(connectAccount);

            // Get username
            const userName = await contract.getUsername(connectAccount);
            setUserName(userName);

            // Get my friend list
            const friendList = await contract.getMyFriendList();
            setFriendList(friendList);

            // Get all app users list
            const userList = await contract.getAllAppUser();
            setUserList(userList);
            
        } catch (error) {
            setError("Please install and connect your wallet")
        }
    };

    // Calling useEffect when someone reloads or refresh the page
    useEffect(() =>{
        //  fetchData();
    },[])

    // Read message
    const readMessage = async(friendAddress) => {
        try {
            const contract = await connectingWithContract();
            const readMsg = await contract.readMessage(friendAddress);
            setFriendMessage(readMsg);

        } catch (error) {
            setError("Currently, You have no messsages")
        }
    }

    // Create new account
    const createAccount = async({name, accountAddress}) => {
        try {
            if(name || accountAddress){
                return setError("Name and account address can not be empty")
            }
            const contract = await connectingWithContract();
            const getCreatedUser = await contract.createAccount(name);
            setLoading(true);
            await getCreatedUser.wait();
            setLoading(false);
            window.location.reload();
            
        } catch (error) {
            setError("Error while creating the account, Please reload the browser")
            
        }
    }

    // Add your friends
    const addFriends = async({accountAddress, name}) => {
        try {
            if(name || accountAddress){
                return setError("Please provide the required details")
            }
            const contract = await connectingWithContract();
            const addMyFriend = await contract.addFriend(accountAddress, name);
            setLoading(true);
            await addMyFriend.wait();
            setLoading(false);
            router.push("/");
            window.location.reload();
            
        } catch (error) {
            setError("Something went wrong while adding friends, Try again")
            
        }
    }

    // Send Message to your friend
    const sendMessage = async({accountAddress, message}) => {
        try {
            if(accountAddress || message){
                return setError("Please type your message")
            }
            
            const contract = await connectingWithContract();
            const sendMessages = await contract.sendMessage(accountAddress, message);
            setLoading(true);
            await sendMessages.wait();
            setLoading(false);
            window.location.reload();
            
        } catch (error) {
            setError("Please reload and try again")
        }

    }

    // Read user info
    const readUserInfo = async(userAddress) => {
        const contract = await connectingWithContract();
        const userName = await contract.getUsername(userAddress);
        setCurrentUserName(userName);
        setCurrentUserAddress(userAddress);
    }


    return (
        <ChatAppContext.Provider value={{readMessage, createAccount, addFriends, sendMessage, readUserInfo, account, userName, friendList, friendMessage, loading, userList, error, currentUserAddress, currentUserName}}>
            {children}
        </ChatAppContext.Provider>
    );
}