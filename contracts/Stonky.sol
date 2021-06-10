pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// STONKY
contract Stonky is Ownable, ERC20('stonky.farm STONKY', 'Stonky') {

    // Dev address.
    address public devaddr;
    uint256 public burnPercent;  //1e18 for 1% burn

    constructor(
        address _devaddr,
        uint256 _burnPercent
    ) public {
        require(_burnPercent <= 10e18 && _burnPercent>=1e18 || _burnPercent == 0, 'burn: wut?');
        devaddr = _devaddr;
        burnPercent = _burnPercent;
    }

    function mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }

    function transfer(address to, uint256 amount) override virtual public returns (bool) {
        return super.transfer(to, partialBurn(amount));
    }

     function partialBurn(uint256 amount) internal returns (uint256) {
        uint256 burnAmount = 0;
        burnAmount = amount.mul(burnPercent).div(100e18);

        if (burnAmount > 0) {
            _burn(msg.sender, burnAmount);
        }

        return amount.sub(burnAmount);
    }

    // Update burnPercent by the previous dev.
    function setBurnPercent(uint256 _burnPercent) public {
        require(msg.sender == devaddr, "dev: wut?");
        require(_burnPercent <= 10e18 && _burnPercent>=1e18 || _burnPercent == 0, 'burn: wut?');
        burnPercent = _burnPercent;
    }

    // Update burnPercent by the previous dev.
    function getBurnPercent() external view returns (uint256){
        return burnPercent;
    }
}