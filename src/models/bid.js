module.exports = (sequelize, DataTypes) => {
    const Bid = sequelize.define("Bid", {
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bid_amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
  
    Bid.associate = function (models) {
      Bid.belongsTo(models.User, { foreignKey: "user_id" });
      Bid.belongsTo(models.Item, { foreignKey: "item_id" });
    };
  
    return Bid;
  };
  