'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `
        CREATE TYPE  "enum_Users_role" AS ENUM ('ADMIN', 'USER');
      `,
    );
    await queryInterface.sequelize.query(
      `
        UPDATE "Users" SET "role" = 'USER' WHERE "role" = 'User';
        UPDATE "Users" Set "role" = 'ADMIN' WHERE "role" = 'Admin';
      `,
    );
    await queryInterface.sequelize.query(
      `
        ALTER TABLE "Users" ALTER COLUMN "role" TYPE "enum_Users_role" USING "role"::"enum_Users_role";
      `,
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.STRING,
      defaultValue: 'User',
      allowNull: false,
    });

    await queryInterface.sequelize.query(
      `
        DROP TYPE IF EXISTS "enum_Users_role";
      `,
    );
  },
};
