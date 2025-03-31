import { MigrationInterface, QueryRunner } from "typeorm";

export class DbV11743382724662 implements MigrationInterface {
    name = 'DbV11743382724662'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`singer\` (\`id\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`fullName\` varchar(255) NOT NULL, \`avatar\` varchar(255) NOT NULL, \`status\` enum ('active', 'inactive') NOT NULL, \`slug\` varchar(255) NOT NULL, \`deleted\` tinyint NOT NULL DEFAULT 0, \`deletedAt\` datetime NULL, UNIQUE INDEX \`IDX_14331e0743dc31c1638650bebb\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`song\` (\`id\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`title\` varchar(255) NOT NULL, \`avatar\` varchar(255) NULL, \`description\` varchar(255) NULL, \`like\` int NOT NULL DEFAULT '0', \`listen\` int NOT NULL DEFAULT '0', \`lyrics\` varchar(255) NULL, \`audio\` varchar(255) NOT NULL, \`status\` enum ('active', 'inactive') NOT NULL, \`slug\` varchar(255) NOT NULL, \`deleted\` tinyint NOT NULL DEFAULT 0, \`deletedAt\` datetime NULL, \`singerId\` varchar(36) NULL, \`topicId\` varchar(36) NULL, UNIQUE INDEX \`IDX_c311b415cb9f62143604b60aab\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`topic\` (\`id\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`title\` varchar(255) NOT NULL, \`avatar\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL DEFAULT '', \`status\` enum ('active', 'inactive') NOT NULL, \`slug\` varchar(255) NOT NULL, \`deleted\` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX \`IDX_b4f72509919eef20d3f54eedc3\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`play_list\` (\`id\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`title\` varchar(255) NOT NULL, \`deleted\` tinyint NOT NULL DEFAULT 0, \`deletedAt\` datetime NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`permission\` (\`id\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`pathName\` varchar(255) NOT NULL, \`method\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`role\` (\`id\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`roleName\` varchar(255) NOT NULL, \`deleted\` tinyint NOT NULL DEFAULT 0, \`deletedAt\` datetime NULL, UNIQUE INDEX \`IDX_a6142dcc61f5f3fb2d6899fa26\` (\`roleName\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`fullName\` varchar(255) NOT NULL, \`password\` varchar(255) NULL, \`username\` varchar(255) NOT NULL, \`userId\` varchar(255) NOT NULL, \`avatar\` varchar(255) NOT NULL DEFAULT 'https://res.cloudinary.com/dsi9ercdo/image/upload/v1731207669/oagc6qxabksf7lzv2wy9.jpg', \`type\` enum ('SYSTEM', 'GITHUB', 'GOOGLE') NOT NULL, \`refreshToken\` varchar(255) NULL, \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active', \`deleted\` tinyint NOT NULL DEFAULT 0, \`deletedAt\` datetime NULL, \`roleId\` varchar(36) NULL, \`singerIdId\` varchar(36) NULL, UNIQUE INDEX \`IDX_d72ea127f30e21753c9e229891\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`song_for_you\` (\`id\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order\` (\`id\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`orderId\` varchar(255) NOT NULL, \`userId\` varchar(255) NOT NULL, \`resultCode\` varchar(255) NOT NULL, \`status\` enum ('init', 'done') NOT NULL DEFAULT 'init', \`message\` varchar(255) NOT NULL, \`shortLink\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`forgot_password\` (\`id\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`email\` varchar(255) NOT NULL, \`otp\` varchar(255) NOT NULL, \`expiredAt\` datetime NOT NULL, UNIQUE INDEX \`IDX_e193e226d1b1295f32ccec5114\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`play_list_list_song_song\` (\`playListId\` varchar(36) NOT NULL, \`songId\` varchar(36) NOT NULL, INDEX \`IDX_5b4de4286f3e9797a88a1c0246\` (\`playListId\`), INDEX \`IDX_b50ac82ad316b81d7c482aa4e2\` (\`songId\`), PRIMARY KEY (\`playListId\`, \`songId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`role_permissions_permission\` (\`roleId\` varchar(36) NOT NULL, \`permissionId\` varchar(36) NOT NULL, INDEX \`IDX_b36cb2e04bc353ca4ede00d87b\` (\`roleId\`), INDEX \`IDX_bfbc9e263d4cea6d7a8c9eb3ad\` (\`permissionId\`), PRIMARY KEY (\`roleId\`, \`permissionId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_list_playlist_play_list\` (\`userId\` varchar(36) NOT NULL, \`playListId\` varchar(36) NOT NULL, INDEX \`IDX_8addf0c0b6f1e2c39e61b81d1d\` (\`userId\`), INDEX \`IDX_a2dbfcd65dbd2370fdf4b61072\` (\`playListId\`), PRIMARY KEY (\`userId\`, \`playListId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_list_favorite_song_song\` (\`userId\` varchar(36) NOT NULL, \`songId\` varchar(36) NOT NULL, INDEX \`IDX_af8584d5e047f815ae38194e07\` (\`userId\`), INDEX \`IDX_333de6f16d2dcab090ebc86681\` (\`songId\`), PRIMARY KEY (\`userId\`, \`songId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`song_for_you_list_song_song\` (\`songForYouId\` varchar(36) NOT NULL, \`songId\` varchar(36) NOT NULL, INDEX \`IDX_8fe35e1c26f46b3f960d4123f2\` (\`songForYouId\`), INDEX \`IDX_7c65b8b0c131a9e3dffdf74cd8\` (\`songId\`), PRIMARY KEY (\`songForYouId\`, \`songId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`song\` ADD CONSTRAINT \`FK_f2343efcc33d8bdbcffda2a777a\` FOREIGN KEY (\`singerId\`) REFERENCES \`singer\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`song\` ADD CONSTRAINT \`FK_8579bf9bed238198c2349c217c2\` FOREIGN KEY (\`topicId\`) REFERENCES \`topic\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`play_list\` ADD CONSTRAINT \`FK_fd872a93c13bfaecc18111a47e6\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_c28e52f758e7bbc53828db92194\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_c79b947bd74e21899903bdda128\` FOREIGN KEY (\`singerIdId\`) REFERENCES \`singer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`play_list_list_song_song\` ADD CONSTRAINT \`FK_5b4de4286f3e9797a88a1c02463\` FOREIGN KEY (\`playListId\`) REFERENCES \`play_list\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`play_list_list_song_song\` ADD CONSTRAINT \`FK_b50ac82ad316b81d7c482aa4e2a\` FOREIGN KEY (\`songId\`) REFERENCES \`song\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`role_permissions_permission\` ADD CONSTRAINT \`FK_b36cb2e04bc353ca4ede00d87b9\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`role_permissions_permission\` ADD CONSTRAINT \`FK_bfbc9e263d4cea6d7a8c9eb3ad2\` FOREIGN KEY (\`permissionId\`) REFERENCES \`permission\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_list_playlist_play_list\` ADD CONSTRAINT \`FK_8addf0c0b6f1e2c39e61b81d1d1\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_list_playlist_play_list\` ADD CONSTRAINT \`FK_a2dbfcd65dbd2370fdf4b610720\` FOREIGN KEY (\`playListId\`) REFERENCES \`play_list\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_list_favorite_song_song\` ADD CONSTRAINT \`FK_af8584d5e047f815ae38194e076\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_list_favorite_song_song\` ADD CONSTRAINT \`FK_333de6f16d2dcab090ebc86681a\` FOREIGN KEY (\`songId\`) REFERENCES \`song\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`song_for_you_list_song_song\` ADD CONSTRAINT \`FK_8fe35e1c26f46b3f960d4123f2e\` FOREIGN KEY (\`songForYouId\`) REFERENCES \`song_for_you\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`song_for_you_list_song_song\` ADD CONSTRAINT \`FK_7c65b8b0c131a9e3dffdf74cd8f\` FOREIGN KEY (\`songId\`) REFERENCES \`song\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`song_for_you_list_song_song\` DROP FOREIGN KEY \`FK_7c65b8b0c131a9e3dffdf74cd8f\``);
        await queryRunner.query(`ALTER TABLE \`song_for_you_list_song_song\` DROP FOREIGN KEY \`FK_8fe35e1c26f46b3f960d4123f2e\``);
        await queryRunner.query(`ALTER TABLE \`user_list_favorite_song_song\` DROP FOREIGN KEY \`FK_333de6f16d2dcab090ebc86681a\``);
        await queryRunner.query(`ALTER TABLE \`user_list_favorite_song_song\` DROP FOREIGN KEY \`FK_af8584d5e047f815ae38194e076\``);
        await queryRunner.query(`ALTER TABLE \`user_list_playlist_play_list\` DROP FOREIGN KEY \`FK_a2dbfcd65dbd2370fdf4b610720\``);
        await queryRunner.query(`ALTER TABLE \`user_list_playlist_play_list\` DROP FOREIGN KEY \`FK_8addf0c0b6f1e2c39e61b81d1d1\``);
        await queryRunner.query(`ALTER TABLE \`role_permissions_permission\` DROP FOREIGN KEY \`FK_bfbc9e263d4cea6d7a8c9eb3ad2\``);
        await queryRunner.query(`ALTER TABLE \`role_permissions_permission\` DROP FOREIGN KEY \`FK_b36cb2e04bc353ca4ede00d87b9\``);
        await queryRunner.query(`ALTER TABLE \`play_list_list_song_song\` DROP FOREIGN KEY \`FK_b50ac82ad316b81d7c482aa4e2a\``);
        await queryRunner.query(`ALTER TABLE \`play_list_list_song_song\` DROP FOREIGN KEY \`FK_5b4de4286f3e9797a88a1c02463\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_c79b947bd74e21899903bdda128\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_c28e52f758e7bbc53828db92194\``);
        await queryRunner.query(`ALTER TABLE \`play_list\` DROP FOREIGN KEY \`FK_fd872a93c13bfaecc18111a47e6\``);
        await queryRunner.query(`ALTER TABLE \`song\` DROP FOREIGN KEY \`FK_8579bf9bed238198c2349c217c2\``);
        await queryRunner.query(`ALTER TABLE \`song\` DROP FOREIGN KEY \`FK_f2343efcc33d8bdbcffda2a777a\``);
        await queryRunner.query(`DROP INDEX \`IDX_7c65b8b0c131a9e3dffdf74cd8\` ON \`song_for_you_list_song_song\``);
        await queryRunner.query(`DROP INDEX \`IDX_8fe35e1c26f46b3f960d4123f2\` ON \`song_for_you_list_song_song\``);
        await queryRunner.query(`DROP TABLE \`song_for_you_list_song_song\``);
        await queryRunner.query(`DROP INDEX \`IDX_333de6f16d2dcab090ebc86681\` ON \`user_list_favorite_song_song\``);
        await queryRunner.query(`DROP INDEX \`IDX_af8584d5e047f815ae38194e07\` ON \`user_list_favorite_song_song\``);
        await queryRunner.query(`DROP TABLE \`user_list_favorite_song_song\``);
        await queryRunner.query(`DROP INDEX \`IDX_a2dbfcd65dbd2370fdf4b61072\` ON \`user_list_playlist_play_list\``);
        await queryRunner.query(`DROP INDEX \`IDX_8addf0c0b6f1e2c39e61b81d1d\` ON \`user_list_playlist_play_list\``);
        await queryRunner.query(`DROP TABLE \`user_list_playlist_play_list\``);
        await queryRunner.query(`DROP INDEX \`IDX_bfbc9e263d4cea6d7a8c9eb3ad\` ON \`role_permissions_permission\``);
        await queryRunner.query(`DROP INDEX \`IDX_b36cb2e04bc353ca4ede00d87b\` ON \`role_permissions_permission\``);
        await queryRunner.query(`DROP TABLE \`role_permissions_permission\``);
        await queryRunner.query(`DROP INDEX \`IDX_b50ac82ad316b81d7c482aa4e2\` ON \`play_list_list_song_song\``);
        await queryRunner.query(`DROP INDEX \`IDX_5b4de4286f3e9797a88a1c0246\` ON \`play_list_list_song_song\``);
        await queryRunner.query(`DROP TABLE \`play_list_list_song_song\``);
        await queryRunner.query(`DROP INDEX \`IDX_e193e226d1b1295f32ccec5114\` ON \`forgot_password\``);
        await queryRunner.query(`DROP TABLE \`forgot_password\``);
        await queryRunner.query(`DROP TABLE \`order\``);
        await queryRunner.query(`DROP TABLE \`song_for_you\``);
        await queryRunner.query(`DROP INDEX \`IDX_d72ea127f30e21753c9e229891\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_a6142dcc61f5f3fb2d6899fa26\` ON \`role\``);
        await queryRunner.query(`DROP TABLE \`role\``);
        await queryRunner.query(`DROP TABLE \`permission\``);
        await queryRunner.query(`DROP TABLE \`play_list\``);
        await queryRunner.query(`DROP INDEX \`IDX_b4f72509919eef20d3f54eedc3\` ON \`topic\``);
        await queryRunner.query(`DROP TABLE \`topic\``);
        await queryRunner.query(`DROP INDEX \`IDX_c311b415cb9f62143604b60aab\` ON \`song\``);
        await queryRunner.query(`DROP TABLE \`song\``);
        await queryRunner.query(`DROP INDEX \`IDX_14331e0743dc31c1638650bebb\` ON \`singer\``);
        await queryRunner.query(`DROP TABLE \`singer\``);
    }

}
