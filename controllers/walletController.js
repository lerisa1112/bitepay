const Wallet = require("../models/Wallet");

// ===============================
// GET WALLET (BALANCE + HISTORY)
// ===============================
const getWallet = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ user: req.user._id });

    // AUTO CREATE IF NOT EXISTS (IMPORTANT FIX)
    if (!wallet) {
      wallet = await Wallet.create({
        user: req.user._id,
        balance: 0,
        transactions: [],
      });
    }

    res.json({
      success: true,
      balance: wallet.balance,
      transactions: wallet.transactions.sort(
        (a, b) => b.createdAt - a.createdAt
      ),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// ADD MONEY TO WALLET
// ===============================
const addMoney = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    let wallet = await Wallet.findOne({ user: req.user._id });

    if (!wallet) {
      wallet = await Wallet.create({
        user: req.user._id,
        balance: 0,
        transactions: [],
      });
    }

    wallet.balance += amount;

    wallet.transactions.push({
      type: "credit",
      amount,
      note: "Wallet Recharge",
      canteenName: "Self Top-up",
    });

    await wallet.save();

    res.json({
      success: true,
      message: "Money added successfully",
      balance: wallet.balance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getWallet,
  addMoney,
};