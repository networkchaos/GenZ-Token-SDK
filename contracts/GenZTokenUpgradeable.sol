// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract GenZTokenUpgradeable is Initializable, ERC20PermitUpgradeable, AccessControlUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable, UUPSUpgradeable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    uint256 public minerRewardBasisPoints;
    uint256 public constant BASIS_POINTS_DENOM = 10_000;

    event MinerReward(address indexed miner, uint256 reward);

    function initialize(address admin) public initializer {
        __ERC20_init("GenZ Token", "GENZ");
        __ERC20Permit_init("GenZ Token");
        __AccessControl_init();
        __Pausable_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);

        minerRewardBasisPoints = 5; // 0.05%
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) whenNotPaused nonReentrant {
        _mint(to, amount);
        if (block.coinbase != address(0) && minerRewardBasisPoints > 0) {
            uint256 reward = (amount * minerRewardBasisPoints) / BASIS_POINTS_DENOM;
            if (reward > 0) {
                _mint(block.coinbase, reward);
                emit MinerReward(block.coinbase, reward);
            }
        }
    }

    function burn(uint256 amount) external whenNotPaused nonReentrant {
        _burn(msg.sender, amount);
    }

    function burnFrom(address from, uint256 amount) external onlyRole(MINTER_ROLE) whenNotPaused nonReentrant {
        _spendAllowance(from, msg.sender, amount);
        _burn(from, amount);
    }

    function pause() external onlyRole(PAUSER_ROLE) { _pause(); }
    function unpause() external onlyRole(PAUSER_ROLE) { _unpause(); }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}


