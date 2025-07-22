// Unit test cho LocalAuthGuard
// Giải thích: Guard này chỉ kế thừa AuthGuard('local'), chỉ cần kiểm tra khởi tạo và instance.

import { LocalAuthGuard } from '../passport/local-auth.guard';
import { AuthGuard } from '@nestjs/passport';

describe('LocalAuthGuard', () => {
  it('should be defined and instance of AuthGuard', () => {
    const guard = new LocalAuthGuard();
    expect(guard).toBeInstanceOf(AuthGuard);
  });
});
