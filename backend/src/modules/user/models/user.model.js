import {
  STATUS_ACTIVE,
  STATUS_CREATED,
  GENDER_FEMALE,
  GENDER_MALE,
  STATUS_CREATED_STORED,
  STATUS_ACTIVE_STORED,
  GENDER_MALE_STORED,
  GENDER_FEMALE_STORED,
} from '../constants';
import { Sequelize } from 'sequelize';

function initModel(sequelize, DataTypes) {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get() {
        return String(this.getDataValue('id'));
      },
    },
    firstName: {
      type: DataTypes.STRING,
      defaultValue: 'name',
    },
    lastName: {
      type: DataTypes.STRING,
      defaultValue: 'surname',
    },
    mobile: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    firebaseId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: [STATUS_ACTIVE_STORED, STATUS_CREATED_STORED],
      allowNull: false,
      defaultValue: STATUS_CREATED_STORED,
      set(value) {
        if (value === STATUS_CREATED) {
          return this.setDataValue('status', STATUS_CREATED_STORED);
        }
        return this.setDataValue('status', STATUS_ACTIVE_STORED);
      },
      get() {
        const status = this.getDataValue('status');
        if (status === STATUS_CREATED_STORED) {
          return STATUS_CREATED;
        }
        return STATUS_ACTIVE;
      },
    },
    birthDate: {
      type: DataTypes.DATE,
    },
    gender: {
      type: DataTypes.ENUM,
      values: [GENDER_FEMALE_STORED, GENDER_MALE_STORED],
      set(value) {
        if (value === GENDER_MALE) {
          return this.setDataValue('gender', GENDER_MALE_STORED);
        }
        if (value === GENDER_FEMALE) {
          return this.setDataValue('gender', GENDER_FEMALE_STORED);
        }
      },
      get() {
        const gender = this.getDataValue('gender');
        if (gender === GENDER_MALE_STORED) {
          return GENDER_MALE;
        }
        if (gender === GENDER_FEMALE_STORED) {
          return GENDER_FEMALE;
        }
      },
    },
    email: {
      type: DataTypes.STRING,
    },
    shirtNumber: {
      type: DataTypes.INTEGER,
    },
  });

  User.findOrCreateByFirebase = function (firebaseId, mobile) {
    const condition = { where: { firebaseId, mobile } };
    return new Promise((resolve, reject) => {
      this.findOrCreate(condition)
        .then((response) => resolve(response[0]))
        .catch(reject);
    });
  };

  User.findByFirebaseId = function (firebaseId) {
    const condition = { where: { firebaseId } };
    return new Promise((resolve, reject) => {
      this.findOne(condition)
        .then(resolve)
        .catch(reject);
    });
  };

  User.findById = function (id) {
    const condition = { where: { id } };
    return new Promise((resolve, reject) => {
      this.findOne(condition)
        .then(resolve)
        .catch(reject);
    });
  };

  User.associate = function (models) {
    models.user.hasMany(models.game, { foreignKey: 'adminId' });
    models.user.hasMany(models.player);
    models.user.hasMany(models.invitation);
    models.user.hasMany(models.notification);

    models.user.prototype.getGameCollisionInInterval = function (beginning, end) {
      return new Promise((resolve, reject) => {
        const userId = this.id;
        models.game.findAndCountAll({
          where: {
            [Sequelize.Op.or]: [
              {
                date: {
                  [Sequelize.Op.between]: [beginning, end]
                },
              },
              {
                end: {
                  [Sequelize.Op.between]: [beginning, end]
                }
              }
            ]
          },
          include: [
            {
              model: models.team,
              as: 'firstTeam',
              include: [
                {
                  model: models.player,
                  required: true,
                  where: {
                    userId
                  }
                },
              ],
            },
            {
              model: models.team,
              as: 'secondTeam',
              include: [
                {
                  model: models.player,
                  required: true,
                  where: {
                    userId
                  }
                },
              ],
            },
          ],
        })
        .then(({count, _}) => {
          console.log('User has collision', count);
          return count > 0;
        })
        .then(resolve)
        .catch(reject)
      })
    }
  };

  return User;
}

export default initModel;
