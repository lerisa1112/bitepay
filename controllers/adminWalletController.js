const Wallet = require("../models/Wallet");

//
// 🚀 GET WALLET DATA
//
const getWalletData = async (req, res) => {
  try {

    // 💰 TOTAL WALLET BALANCE
    const totalWalletResult = await Wallet.aggregate([
      {
        $group: {
          _id: null,
          totalBalance: {
            $sum: "$balance",
          },
        },
      },
    ]);

    const totalWalletBalance =
      totalWalletResult.length > 0
        ? totalWalletResult[0].totalBalance
        : 0;

    // 💳 TOTAL CREDITS
    const totalCreditsResult = await Wallet.aggregate([
      { $unwind: "$transactions" },

      {
        $match: {
          "transactions.type": "credit",
        },
      },

      {
        $group: {
          _id: null,
          totalCredits: {
            $sum: "$transactions.amount",
          },
        },
      },
    ]);

    const totalCredits =
      totalCreditsResult.length > 0
        ? totalCreditsResult[0].totalCredits
        : 0;

    // 💸 TOTAL DEBITS
    const totalDebitsResult = await Wallet.aggregate([
      { $unwind: "$transactions" },

      {
        $match: {
          "transactions.type": "debit",
        },
      },

      {
        $group: {
          _id: null,
          totalDebits: {
            $sum: "$transactions.amount",
          },
        },
      },
    ]);

    const totalDebits =
      totalDebitsResult.length > 0
        ? totalDebitsResult[0].totalDebits
        : 0;

    // 📋 ALL TRANSACTIONS
    const wallets = await Wallet.find()
      .populate("user", "name email");

    let transactions = [];

    wallets.forEach((wallet) => {

      wallet.transactions.forEach((txn) => {

        transactions.push({
          user: wallet.user?.name,
          email: wallet.user?.email,
          type: txn.type,
          amount: txn.amount,
          description: txn.note,
          date: txn.createdAt || wallet.createdAt,
        });

      });

    });

    // 🕒 SORT LATEST
    transactions.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    // ✅ RESPONSE
    res.json({
      totalWalletBalance,
      growth: "+8.4% from last month",
      totalCredits,
      totalDebits,
      transactions,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getWalletData,
};