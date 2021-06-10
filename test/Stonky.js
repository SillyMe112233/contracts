const { expect, assert } = require("chai");

let token, owner, dev, fee, pOne, pTwo;

describe("Stonky", function() {
  it("Owner should be the deployer", async function() {
    [owner, dev, fee, pOne, pTwo] = await ethers.getSigners();
    
    const Stonky = await ethers.getContractFactory("Stonky");
    token = await Stonky.deploy('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '1500000000000000000');
    
    await token.deployed();

    console.log('Owner address: ', owner.address);

    expect(await token.owner()).to.equal(owner.address);
  });

  describe("Transactions", function(){
    it("Owner should have 1000 Stonky", async function() {
      await token.mint(owner.address, '1000000000000000000000');
      const ownerBalance = await token.balanceOf(owner.address);
      const totalSupply = await token.totalSupply();
      expect(ownerBalance).to.equal(totalSupply);
    });
  
    it("pOne should have 98.5 tokens", async function() {
      await token.transfer(pOne.address, '100000000000000000000');
      const pOneBalance = await token.balanceOf(pOne.address);
      expect(pOneBalance).to.equal('98500000000000000000');
    });
    
    it("Total Supply should be 98.5 tokens", async function() {
  
      const totalSupply = await token.totalSupply(); 
      expect(totalSupply).to.equal('998500000000000000000');
    });

    it("Set Burn to 0", async function() {
      await token.setBurnPercent(0);
      expect(await token.getBurnPercent()).to.equal('0');
    });

    it("pTwo should have 100 tokens", async function() {
      await token.transfer(pTwo.address, '100000000000000000000');
      const pTwoBalance = await token.balanceOf(pTwo.address);
      expect(pTwoBalance).to.equal('100000000000000000000');
    });

    it("Total Supply should be 98.5 tokens", async function() {
      const totalSupply = await token.totalSupply(); 
      expect(totalSupply).to.equal('998500000000000000000');
    });

    it("Fail on 100% Burn ", async function() {
      try{
        await token.setBurnPercent('100000000000000000000');
      }
      catch(err)
      {
      expect(err.message).to.include('revert burn: wut?');
      }
    });
    it("Fail on 0.1% Burn ", async function() {
      try{
        await token.setBurnPercent('100000000000000000');
      }
      catch(err)
      {
      expect(err.message).to.include('revert burn: wut?');
      }
    });



  });

});
