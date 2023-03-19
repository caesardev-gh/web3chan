// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Channel.sol";

contract Factory {
    address[] private channels;

    event ChannelCreated(string indexed name);

    function createChannel (string memory channelName) external returns (address) {
        address newChannelAddress = address(new Channel(channelName));
        channels.push(newChannelAddress);
        emit ChannelCreated(channelName);
        return newChannelAddress;
    }

    function getChannels() external view returns (address[] memory){
        return channels;
    }
}

