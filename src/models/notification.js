module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define("Notification", {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
  
    Notification.associate = function (models) {
      Notification.belongsTo(models.User, { foreignKey: "user_id" });
    };
  
    return Notification;
  };
  