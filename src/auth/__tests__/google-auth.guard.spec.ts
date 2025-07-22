// Unit test cho GoogleAuthGuard
// Giải thích: Guard này chỉ kế thừa AuthGuard('google'), chỉ cần kiểm tra khởi tạo và instance.

import { GoogleAuthGuard } from '../passport/google-auth.guard';
import { AuthGuard } from '@nestjs/passport';

describe('GoogleAuthGuard', () => {
  it('should be defined and instance of AuthGuard', () => {
    const guard = new GoogleAuthGuard();
    expect(guard).toBeInstanceOf(AuthGuard);
  });
});
