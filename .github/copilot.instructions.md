# Tổng quan dự án

Đây là một dự án backend được phát triển bằng **NestJS**, đã đạt mức độ khá hoàn chỉnh về chức năng. Dự án tuân theo kiến trúc module hóa (controllers, services, DTO, pipes...) và đã được tích hợp với hệ thống frontend. Vì vậy, các API endpoint hiện tại **không được thay đổi** (bao gồm route, phương thức HTTP, tên parameters).

Tuy nhiên, mã nguồn vẫn còn **thiếu clean code và chưa tối ưu** về kiến trúc nội bộ. Đồng thời, dự án **chưa được tích hợp đầy đủ hệ thống kiểm thử**.

# Mục tiêu sử dụng Copilot

1. **Tối ưu và làm sạch code**:

   - Refactor các phần logic phức tạp, lặp lại hoặc viết chưa đúng best practices.
   - Ưu tiên áp dụng các nguyên lý SOLID, viết code rõ ràng, dễ đọc và dễ bảo trì.
   - Giữ nguyên interface API đang có để không phá vỡ frontend.

2. **Tự động sinh test chuyên nghiệp** với 3 loại:

   - **Unit test**: kiểm tra service, pipes, guards, helpers.
   - **Integration test**: kiểm tra phối hợp thực giữa các module, service thật hoặc DB thật.
   - **End-to-end test (e2e)**: kiểm tra toàn bộ luồng qua HTTP request thực tế.

3. **Luôn phản hồi bằng tiếng Việt**:
   - Khi được yêu cầu sinh code, refactor, viết test, hãy giải thích trước bằng tiếng Việt ngắn gọn.
   - Sau phần giải thích, hãy cung cấp đoạn code đầy đủ.
   - Nếu code dài, có thể chia thành nhiều phần hợp lý.

# Công nghệ sử dụng

- **NestJS** (modular architecture)
- **Jest** cho tất cả các loại test
- **Prisma ORM** (nếu có)
- Có thể chạy trên Docker (nếu cần), nhưng ưu tiên chạy test độc lập

# Tiêu chuẩn mã nguồn

- Sử dụng `PascalCase` cho class, `camelCase` cho biến và hàm
- Không sử dụng `var`
- Tách logic ra service, tránh viết trong controller
- Dùng DTO cho validate đầu vào và sinh tài liệu Swagger

# Lưu ý

- Nếu sửa hoặc viết file mới bị lỗi hiện đỏ tùm lum thì hãy fix cho tới khi hết lỗi.
- Không viết code hoặc tạo test gây thay đổi endpoint hiện có
- Không tạo mock quá phức tạp, hãy ưu tiên cách viết dễ hiểu, rõ ràng
- Tự động sinh code, đừng trả lời bằng cách viết tay code, trừ khi ở chế độ ask
