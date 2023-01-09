// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract ChatApp {

    // user struct
    struct User {
        string name;
        Friend[] friendList;
    }

    struct Friend {
        address pubkey;
        string name;
    }

    struct Message {
        address sender;
        uint256 timestamp;
        string message;
    }

    struct AllUser{
        string name;
        address accountAddress;
    }
    AllUser[] getAllUser;

    mapping(address => User) userList;
    mapping(bytes32 => Message[] ) allMessages;

    // Check if the user exists
    function checkUserExists(address pubkey) public view returns(bool) {
        return bytes(userList[pubkey].name).length > 0;
    }

    // Create account
    function createAccount(string calldata name) external {
        require(checkUserExists(msg.sender) == false, "User already exists");
        require (bytes(name).length >0, "Username can not be empty");

        userList[msg.sender].name = name;
        getAllUser.push(AllUser(name, msg.sender));
    }

    // Get username
    function getUsername(address pubkey) external view returns(string memory) {
        require (checkUserExists(pubkey), "User is not registered");
        return userList[pubkey].name;
    }

    function addFriend(address friendKey, string calldata name) external {
        require(checkUserExists(msg.sender), "Create an account first");
        require(checkUserExists(friendKey), "User is not registered");
        require (msg.sender != friendKey, "User can not add themeselves as a friend");
        require(checkAlreadyFriends(msg.sender, friendKey) == false, "These users are already friends");

        _addFriend(msg.sender, friendKey, name);
        _addFriend(friendKey, msg.sender, userList[msg.sender].name);
    }

    function checkAlreadyFriends(address pubkey1, address pubkey2) internal view returns(bool){
        if(userList[pubkey1].friendList.length > userList[pubkey2].friendList.length) {
            address tmp = pubkey1;
            pubkey1 = pubkey2;
            pubkey2 = tmp;
        }

        for (uint i = 0; i < userList[pubkey1].friendList.length; i++) {
            if(userList[pubkey1].friendList[i].pubkey == pubkey2)
                return true;
        }
        return false;
    }

    function _addFriend(address me, address friendKey, string memory name) internal {
        Friend memory newFriend = Friend(friendKey, name);
        userList[me].friendList.push(newFriend);
    }

    // Get my friends list
    function getMyFriendList() external view returns(Friend[] memory){
        return userList[msg.sender].friendList;
    }

    // Get chat code
    function _getChatCode(address pubkey1, address pubkey2) internal pure returns(bytes32){
        if(pubkey1 < pubkey2){
            return keccak256(abi.encodePacked(pubkey1,pubkey2));
        }
        else {
            return keccak256(abi.encodePacked(pubkey2,pubkey1));
        }
    }

    // Send message
    function sendMessage(address friendKey, string calldata _message) external {
        require(checkUserExists(msg.sender), "Create an account first");
        require(checkUserExists(friendKey), "User is not registered");
        require(checkAlreadyFriends(msg.sender, friendKey), "You are not the friend of given user");

        bytes32 chatCode = _getChatCode(msg.sender, friendKey);
        Message memory newMessage = Message(msg.sender, block.timestamp, _message);
        allMessages[chatCode].push(newMessage);
    }

    // Read Message
    function readMessage(address friendKey) external view returns(Message[] memory) {
        bytes32 chatCode = _getChatCode(msg.sender, friendKey);
        return allMessages[chatCode];
    }

    function getAllAppUser() public view returns(AllUser[] memory){
        return getAllUser;
    }
}
