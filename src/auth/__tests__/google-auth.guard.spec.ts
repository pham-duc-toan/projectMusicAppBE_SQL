// Unit test cho GoogleAuthGuard
// Giải thích: Guard này chỉ kế thừa AuthGuard('google'), chỉ cần kiểm tra khởi tạo và instance.

import { GoogleAuthGuard } from '../passport/google-auth.guard';

describe('GoogleAuthGuard', () => {
  it('should be defined', () => {
    const guard = new GoogleAuthGuard();
    expect(guard).toBeDefined();
  });
});
