const Wallet = require("../models/Wallet");
const User = require("../models/User");
const Notification = require("../models/Notification");

// 💰 CREATE / GET WALLET
const getWallet = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({
      user: req.user._id,
    });

    // create wallet if not exists
    if (!wallet) {
      wallet = await Wallet.create({
        user: req.user._id,
        balance: 0,
        transactions: [],
      });
    }

    res.json(wallet);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// 💸 ADD MONEY (TOP-UP)
const addMoney = async (req, res) => {
  try {
    const { amount } = req.body;

    let wallet = await Wallet.findOne({
      user: req.user._id,
    });

    // create wallet if not exists
    if (!wallet) {
      wallet = await Wallet.create({
        user: req.user._id,
        balance: 0,
        transactions: [],
      });
    }

    // add balance
    wallet.balance += amount;

    // transaction history
    wallet.transactions.push({
      type: "credit",
      amount,
      note: "Wallet Top-Up",
    });

    await wallet.save();

    // 🔔 notification
    await Notification.create({
      user: req.user._id,
      title: "Wallet Top-Up",
      message: `₹${amount} added successfully`,
      type: "wallet",
    });

    res.json({
      message: "Money added successfully",
      wallet,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// 💳 DEDUCT MONEY (ORDER PAYMENT)
const deductMoney = async (req, res) => {
  try {
    const { amount, note } = req.body;

    const wallet = await Wallet.findOne({
      user: req.user._id,
    });

    // insufficient balance
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    // deduct money
    wallet.balance -= amount;

    // transaction history
    wallet.transactions.push({
      type: "debit",
      amount,
      note: note || "Order Payment",
    });

    await wallet.save();

    // 🔔 low balance notification
    if (wallet.balance < 50) {
      await Notification.create({
        user: req.user._id,
        title: "Low Balance Alert",
        message:
          "Your wallet balance is low. Please recharge.",
        type: "wallet",
      });
    }

    res.json({
      message: "Money deducted successfully",
      wallet,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getWallet,
  addMoney,
  deductMoney,
};