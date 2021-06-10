const Migrations = artifacts.require("Migrations");
const Token3 = artifacts.require("Token3");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Token3);
};
