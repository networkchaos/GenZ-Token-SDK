// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title GenZ Stable Token (GENZ)
 * @notice 1 GENZ = 1 KES (soft-pegged via custodial reserves)
 * @dev Centralized mint/burn roles handle issuance and redemption.
 */

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract GenZToken is ERC20Permit, AccessControl, Pausable, ReentrancyGuard {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // Optional miner reward (small percentage of minted tokens)
    uint256 public minerRewardBasisPoints = 5; // 0.05% by default (5 basis points)
    uint256 public constant BASIS_POINTS_DENOM = 10_000;

    event MinerReward(address indexed miner, uint256 reward);

    constructor(address admin)
        ERC20("GenZ Token", "GENZ")
        ERC20Permit("GenZ Token")
    {
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(MINTER_ROLE, admin);
        _setupRole(PAUSER_ROLE, admin);
    }

    /**
     * @notice Mint GENZ tokens to a specific address.
     * @dev Only callable by MINTER_ROLE, used by issuer backend.
     */
    function mint(address to, uint256 amount)
        external
        onlyRole(MINTER_ROLE)
        whenNotPaused
        nonReentrant
    {
        _mint(to, amount);

        // optional: miner reward (incentivizes decentralization of transactions)
        if (block.coinbase != address(0) && minerRewardBasisPoints > 0) {
            uint256 reward = (amount * minerRewardBasisPoints) / BASIS_POINTS_DENOM;
            if (reward > 0) {
                _mint(block.coinbase, reward);
                emit MinerReward(block.coinbase, reward);
            }
        }
    }

    /**
     * @notice Burn your GENZ tokens (e.g. for redemption).
     */
    function burn(uint256 amount) external whenNotPaused nonReentrant {
        _burn(msg.sender, amount);
    }

    /**
     * @notice Burn tokens from another address if you have allowance.
     */
    function burnFrom(address from, uint256 amount)
        external
        onlyRole(MINTER_ROLE)
        whenNotPaused
        nonReentrant
    {
        _spendAllowance(from, msg.sender, amount);
        _burn(from, amount);
    }

    /**
     * @notice Pause all transfers (emergency use).
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @notice Resume transfers.
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @dev Override transfer checks for paused state.
     */
    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        override
        whenNotPaused
    {
        super._beforeTokenTransfer(from, to, amount);
    }
}
