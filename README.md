# portfolio_nguyenvanlinh

Portfolio prototype cho Nguyễn Văn Linh, theo phong cách tối giản với hoa vàng và cánh hoa rơi.

## Hosting

Prototype đang chạy trên GitHub Pages: https://giabaocode.github.io/portfolio_nguyenvanlinh/

Repo hiện được công khai để dùng GitHub Pages. Có sẵn cấu hình Netlify nếu cần chuyển hosting sau này.

## Trải nghiệm trên trang

- Đường biểu đồ minh họa được vẽ một lần, sau đó hoa vàng mở cánh và chuyển động nhẹ.
- Bàn 3D Three.js có mặt gỗ, chân bàn, đèn, bàn phím, cây và ly cà phê. Có thể kéo ngang để đổi góc nhìn hoặc chọn hồ sơ, sổ, ảnh và danh thiếp.
- Trên điện thoại, có bốn nút HTML tương đương để dễ chạm và dùng bằng bàn phím. Nếu WebGL hoặc mạng không tải được mô-đun, góc bàn HTML vẫn hoạt động.
- Mô-đun 3D chỉ tải khi gần vùng hiển thị, dừng chuyển động khi ra ngoài màn hình, khi mở cửa sổ hoặc khi người dùng yêu cầu giảm chuyển động.
- Nút dừng chuyển động, chế độ giảm chuyển động của thiết bị và các cửa sổ nội dung được hỗ trợ.
- Nội dung cá nhân trong góc bàn đang là phần chờ bổ sung; biểu đồ trang trí không dùng dữ liệu thị trường thực tế.

## Chạy trên máy

```sh
python3 -m http.server 4173
```

Mở http://localhost:4173 trong trình duyệt.

Sau khi chỉnh `desk3d.source.js`, tạo lại bản đóng gói:

```sh
npm ci
npm run build
```

`desk3d.js` là artifact đã đóng gói và được commit để GitHub Pages phục vụ trực tiếp. Three.js và esbuild được khóa phiên bản trong `package-lock.json`. Bản quyền Three.js nằm trong `THREE-LICENSE.txt`.

## Triển khai Netlify

Website là trang tĩnh HTML/CSS/JavaScript với mô-đun Three.js đã đóng gói. Lệnh `node build.mjs` sao chép bản đã đóng gói cùng các file giao diện vào `public/`. Không cần API key khi khách truy cập website.

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
