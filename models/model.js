// const { DataTypes, Sequelize } = require('sequelize');
// const sequelize = require("../data/db");

// const User = sequelize.define("user", {
//     id: {
//       type: DataTypes.INTEGER(10),
//       autoIncrement: true,
//       primaryKey: true,
//       allowNull: false,
//     },
//     name: { type: DataTypes.STRING, allowNull: false },
//     phone_num: { type: DataTypes.INTEGER, allowNull: false },
//     password: { type: DataTypes.STRING, allowNull: false },
//     role: { type: DataTypes.ENUM('admin', 'user'), defaultValue: 'user' }
//   });

//   const Book = sequelize.define("book", {
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     description: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     image: {
//       type: DataTypes.STRING, // Stores image filename
//       allowNull: false,
//     },
//     pdf: {
//       type: DataTypes.STRING, // Stores PDF filename
//       allowNull: false,
//     },
//     categoryId: {
//       type: DataTypes.INTEGER,
//       allowNull: false
//   }
//   });

//   const Category = sequelize.define("category", {
//     id: {
//       type: DataTypes.INTEGER(10),
//       autoIncrement: true,
//       primaryKey: true,
//       allowNull: false,
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },

//   });




// module.exports = {
//     User,
//     Book,
//     Category
//   };


const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: { type: DataTypes.STRING, allowNull: false },
    phone_num: { type: DataTypes.INTEGER, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("admin", "user"), defaultValue: "user" }
});

const Book = sequelize.define("Book", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: false },
    pdf: { type: DataTypes.STRING, allowNull: false },
    categoryId: { type: DataTypes.INTEGER, allowNull: false }
});

const Category = sequelize.define("Category", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: { type: DataTypes.STRING, allowNull: false }
});

// **Define Associations**
Category.hasMany(Book, { foreignKey: "categoryId", as: "books" });
Book.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

module.exports = {
    User,
    Book,
    Category,
    sequelize
};

