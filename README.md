# portfolio_nguyenvanlinh

Portfolio prototype cho Nguyễn Văn Linh, theo phong cách tối giản với hoa vàng và cánh hoa rơi.

## Hosting

Giữ repo GitHub ở chế độ Private. Prototype được chuẩn bị để triển khai trên Netlify; URL chính thức sẽ được cập nhật sau khi deploy.

## Chạy trên máy

```sh
python3 -m http.server 4173
```

Mở http://localhost:4173 trong trình duyệt.

## Triển khai Netlify

Website dùng HTML, CSS và JavaScript thuần. Lệnh `node build.mjs` tạo thư mục `public/` với đúng các file cần đưa lên hosting. Không cần cài thư viện hoặc cấu hình API key.

`netlify.toml` đã khai báo:

- Build command: `node build.mjs`
- Publish directory: `public`
- Production branch khi kết nối Git: `main`

Có thể tải thư mục `public/` lên Netlify Drop sau khi đăng nhập tài khoản của chủ dự án. Cách này không yêu cầu Netlify quyền truy cập GitHub. Nếu muốn tự deploy khi push, kết nối riêng repo Private này từ Netlify và chỉ cấp quyền cho repo cần thiết.

Prototype có `robots.txt` và header `X-Robots-Tag: noindex, nofollow` để đề nghị công cụ tìm kiếm không lập chỉ mục. Đây không phải cơ chế mật khẩu hay giới hạn người truy cập.

Tham khảo [Netlify deploy](https://docs.netlify.com/deploy/create-deploys/) và [file-based configuration](https://docs.netlify.com/build/configure-builds/file-based-configuration/).

## Nội dung prototype

Ảnh cá nhân, nội dung giới thiệu chi tiết, dự án và số liệu đang là ví dụ minh họa. Thông tin liên hệ chưa được cấu hình gửi tin nhắn.

Các file cấu hình API Claude và công cụ làm việc cục bộ không được đưa vào repo website.
