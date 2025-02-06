import { UUID } from 'crypto';
import { UUIDV4 } from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Auth } from './../../auth/entities/auth.entity';

@Table({ timestamps: true })
export class User extends Model<User> {
  @Column({ defaultValue: UUIDV4, allowNull: false, primaryKey: true })
  id: UUID;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  // TODO Declare an enum to use in this cases and change the default from "User" to the enum value
  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'User' })
  role: string;

  @ForeignKey(() => Auth)
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  authId: string;

  @BelongsTo(() => Auth)
  auth: Auth;
}
