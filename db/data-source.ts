import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

ConfigModule.forRoot({ isGlobal: true });
const configService = new ConfigService();

const isTs = __filename.endsWith('.ts');

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql', // ✅ đổi từ 'mssql' sang 'mysql'
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 3306),
  username: configService.get<string>('DB_USER', 'root'),
  password: configService.get<string>('DB_PASSWORD', ''),
  database: configService.get<string>('DB_NAME', 'music_app_db'),
  entities: [isTs ? 'src/**/*.entity.ts' : 'dist/**/*.entity.js'],
  migrations: [isTs ? 'src/db/migrations/*.ts' : 'dist/db/migrations/*.js'],
  synchronize: false,
  charset: 'utf8mb4', // ✅ để hỗ trợ tiếng Việt, emoji...
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
// npm run migration:generate -- db/migrations/ten
// npm run migration:run
