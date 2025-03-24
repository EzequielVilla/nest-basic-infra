// import { NestFactory } from '@nestjs/core';

// import { AppModule } from '../app.module'; // Adjust the path to your AppModule

// async function runSync() {
//   const appContext = await NestFactory.createApplicationContext(AppModule);

//   const syncType = process.env.SYNC_TYPE || 'alter';

//   try {
//     if (syncType === 'force') {
//       await sequelize.sync({ force: true });
//       console.log('Database synchronized using FORCE.');
//     } else if (syncType === 'alter') {
//       await sequelize.sync({ alter: true });
//       console.log('Database synchronized using ALTER.');
//     } else {
//       console.warn(
//         `SYNC_TYPE '${syncType}' is not recognized. Defaulting to ALTER sync.`,
//       );
//       await sequelize.sync({ alter: true });
//     }
//   } catch (error) {
//     console.error('Error synchronizing database:', error);
//   } finally {
//     await appContext.close();
//   }
// }

// runSync();
