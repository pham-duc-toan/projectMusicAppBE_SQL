// Unit test cho LocalAuthGuard
// Giải thích: Guard này chỉ kế thừa AuthGuard('local'), chỉ cần kiểm tra khởi tạo và instance.

import { LocalAuthGuard } from '../passport/local-auth.guard';

describe('LocalAuthGuard', () => {
  it('should be defined', () => {
    const guard = new LocalAuthGuard();
    expect(guard).toBeDefined();
  });
});
