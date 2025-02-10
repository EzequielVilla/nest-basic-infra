import { UUIDV4 } from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Auth } from './../../auth/entities/auth.entity';

@Table({ timestamps: true })
export class User extends Model<User> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  // TODO Declare an enum to use in this cases and change the default from "User" to the enum value
  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'USER' })
  role: string;

  @ForeignKey(() => Auth)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  authId: string;

  @BelongsTo(() => Auth, { foreignKey: 'authId', as: 'auth' })
  auth: Auth;
}
