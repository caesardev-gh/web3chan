// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./utils/Ownable.sol";

contract Channel is Ownable {
    string private _name;
    string[] _posts;
    mapping(uint => string[]) _comments;

    event NewPost(uint indexed id, string message);
    event NewComment(address indexed sender, uint indexed id, uint indexed postId, string message);

    constructor(string memory channelName){
        _name = channelName;
    }

    function name() external view returns (string memory) {
        return _name;
    }

    function addPost(string calldata message) external onlyOwner returns (uint postId) {
        uint _postId = _posts.length;
        _posts.push(message);
        emit NewPost(_postId, message);
        return _postId;
    }

    function getPostById(uint postId) external view returns (string memory post) {
        return _posts[postId];
    }

    function getAllPosts() external view returns (string[] memory) {
        return _posts;
    }

    function addComment(uint postId, string calldata message) external returns (uint commentId) {
        commentId = _comments[postId].length;
        _comments[postId].push(message);
        emit NewComment(msg.sender, commentId, postId, message);
        return commentId;
    }

    function getCommentById(uint postId, uint commentId) external view returns (string memory comment) {
        return _comments[postId][commentId];
    }

    function getAllComments(uint postId) external view returns (string[] memory) {
        return _comments[postId];
    }
}