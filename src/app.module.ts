import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { AuthModule } from './resources/auth/auth.module';
import { UserModule } from './resources/user/user.module';

@Module({
  imports: [DbModule, AuthModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
