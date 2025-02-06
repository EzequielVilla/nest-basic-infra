import { UUID } from 'crypto';
import { UUIDV4 } from 'sequelize';
import { Column, DataType, HasOne, Model, Table } from 'sequelize-typescript';
import { User } from './../../user/entities/user.entity';

@Table({ timestamps: true })
export class Auth extends Model<Auth> {
  @Column({ defaultValue: UUIDV4, allowNull: false, primaryKey: true })
  id: UUID;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @HasOne(() => User, { foreignKey: 'authId' })
  user: User;
}
