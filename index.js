const crypto=require('crypto');

hash256=message => crypto.createHash("sha256").update(message).digest("hex");


class block{
    constructor( timestamp='', data=[]){

     this.timestamp=timestamp;
     this.hash = this.getHash();
     this.prevHash = "";
        this.data=data;



    }

    getHash(){
        return  hash256(this.prevHash + this.timestamp + JSON.stringify(this.data)).toString();
    }



}
//GENESIS BLOCK
class Blockchain{

constructor(){
this.chain=[new block(Date.now().toString(),'Genesis Block')];



}

//geeting the latest block

getLastBlock() {
    return this.chain[this.chain.length - 1];
}

addBlock(block) {
    // Since we are adding a new block, prevHash will be the hash of the old latest block
    block.prevHash = this.getLastBlock().hash;
    // Since now prevHash has a value, we must reset the block's hash
    block.hash = block.getHash();

    // Object.freeze ensures immutability in our code
    this.chain.push(Object.freeze(block));
}


isValid(blockchain = this) {
    // Iterate over the chain, we need to set i to 1 because there are nothing before the genesis block, so we start at the second block.
    for (let i = 1; i < blockchain.chain.length; i++) {
        const currentBlock = blockchain.chain[i];
        const prevBlock = blockchain.chain[i-1];

        // Check validation
        if (currentBlock.hash !== currentBlock.getHash() || prevBlock.hash !== currentBlock.prevHash) {
            return false;
        }
    }

    return true;
}

}


//proof of works
class Block {
    constructor(timestamp = "", data = []) {
        this.timestamp = timestamp;
        this.data = data;
        this.hash = this.getHash();
        this.prevHash = ""; // previous block's hash
        this.nonce = 0;
    this.difficulty = 1;

    }

    // Our hash function.
    getHash() {
        return hash256(this.prevHash + this.timestamp + JSON.stringify(this.data) + this.nonce);
    }

    mine(difficulty) {
        // Basically, it loops until our hash starts with 
        // the string 0...000 with length of <difficulty>.
        while (!this.hash.startsWith(Array(difficulty + 1).join("0"))) {
            // We increases our nonce so that we can get a whole different hash.
            this.nonce++;
            // Update our new hash with the new nonce value.
            this.hash = this.getHash();
        }
    }
    addBlock(block) {
        block.prevHash = this.getLastBlock().hash;
        block.hash = block.getHash();
        block.mine(this.difficulty);
        this.chain.push(Object.freeze(block));
    }
}
blockchain = new Blockchain();
blockchain.addBlock(new Block(Date.now().toString(), "Hello, world!"));

console.log(blockchain);