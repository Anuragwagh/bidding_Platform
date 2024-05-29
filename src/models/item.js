module.exports = (sequelize, DataTypes) => {
    const Item = sequelize.define("Item", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      starting_price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      current_price: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      image_url: {
        type: DataTypes.STRING,
      },
      end_time: {
        type: DataTypes.DATE,
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
  
    return Item;
  };
  