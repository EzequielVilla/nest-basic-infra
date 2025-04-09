import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection } from 'mongoose';

@Injectable()
export class DbService {
  constructor(@InjectConnection() private readonly connection: Connection) {}
  getDbHandle(): Connection {
    return this.connection;
  }
  async getSessionWithTransaction(): Promise<ClientSession> {
    const session = await this.getDbHandle().startSession();
    session.startTransaction();
    return session;
  }
}
