import { Sequelize, DataTypes } from 'sequelize'
import sequelize from '../db/index.js'

const Item = sequelize.define('items', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING
  },
  userID: {
    type: DataTypes.INTEGER
  },
  status: {
    type: DataTypes.ENUM('0', '1') // 0未完成,1已完成
  }
})

export default Item
