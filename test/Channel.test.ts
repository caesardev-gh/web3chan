import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { expect } from "chai";

describe("Channel", function () {
    let channel: Contract;
    let owner: Signer;
    let addr1: Signer;

    beforeEach(async function () {
        const Channel = await ethers.getContractFactory("Channel");
        [owner, addr1] = await ethers.getSigners();
        channel = await Channel.deploy("MyChannel");
        await channel.deployed();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await channel.owner()).to.equal(await owner.getAddress());
        });

        it("Should set the right channel name", async function () {
            expect(await channel.name()).to.equal("MyChannel");
        });
    });

    describe("addPost", function () {
        it("Should add a new post", async function () {
            const tx1 = await channel.addPost("Hello, World!");
            const tx2 = await channel.addPost("Hello, World, but again!");
            const rc1 = await tx1.wait();
            const rc2 = await tx2.wait();
            const postId1 = rc1.events[0].args.id;
            const postId2 = rc2.events[0].args.id;
            expect(await channel.getAllPosts()).to.have.lengthOf(2);
            expect(await channel.getPostById(postId1)).to.equal("Hello, World!");
            expect(await channel.getPostById(postId2)).to.equal("Hello, World, but again!");

        });

        it("Should only allow the owner to add a post", async function () {
            await expect(channel.connect(addr1).addPost("Hello, World!")).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });

    describe("addComment", function () {
        it("Should add a new comment to a post", async function () {
            const tx = await channel.addPost("Hello, World!");
            const rc = await tx.wait();
            const postId = rc.events[0].args.id;
            const commentTx = await channel.addComment(postId, "Nice post!");
            const commentRc = await commentTx.wait();
            const commentId = commentRc.events[0].args.id;
            expect(await channel.getCommentById(postId, commentId)).to.equal("Nice post!");
            expect(await channel.getAllComments(postId)).to.have.lengthOf(1);
        });
    });
});
