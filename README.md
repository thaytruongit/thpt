# 🎓 ThayTruongIT - Nền Tảng Dạy Học & Chấm Code Tin Học THPT

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GDPT 2018](https://img.shields.io/badge/Chương%20trình-GDPT%202018-blue.svg)]()
[![Khung Năng Lực](https://img.shields.io/badge/Chuẩn-CV%203456%20%7C%20QĐ%203439-emerald.svg)]()
[![Đánh Giá](https://img.shields.io/badge/Quy%20chế-Thông%20tư%2022%2FBGDĐT-purple.svg)]()
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages%20Ready-brightgreen.svg)]()

> **Nền tảng EdTech nguồn mở chuyên sâu phục vụ giảng dạy môn Tin học THPT (Lớp 10 & Lớp 11) theo chương trình GDPT 2018.**  
> Tích hợp bộ chấm code tự động chạy trực tiếp trên trình duyệt bằng công nghệ **WebAssembly (WASM)**, ngân hàng đề thi chuẩn cấu trúc mới của Bộ GD&ĐT (từ năm 2025), và sổ điểm điện tử theo **Thông tư 22/2021/TT-BGDĐT**.

🔗 **Trang trải nghiệm trực tiếp:** [https://thaytruongit.github.io/thpt/](https://thaytruongit.github.io/thpt/)

---

## 🌟 ĐẶC ĐIỂM NỔI BẬT

### 1. ⚡ Hệ Thống Nộp Bài và Chấm Code Tự Động (Client-Side Auto-Judge)
- **$0\text{ VNĐ}$ Chi phí vận hành:** Toàn bộ quá trình biên dịch và chạy code được xử lý trực tiếp trên trình duyệt máy trạm của học sinh bằng **Pyodide WebAssembly (Python 3)** và **SQL.js (SQLite WASM)**.
- **Không lo nghẽn server phòng máy:** 45 học sinh nộp bài cùng lúc vẫn phản hồi trong $< 50\text{ ms}$, không gây quá tải mạng trường học.
- **Chấm điểm đa tầng:** Tự động đối soát từng bộ test case (Public Test & Hidden Test), tính điểm thành phần (Partial scoring), báo cáo trạng thái chuẩn quốc tế: `AC` (Accepted), `WA` (Wrong Answer), `TLE` (Time Limit Exceeded).
- **Trợ lý Sư phạm AI:** Cung cấp gợi ý dạng mở (Scaffolding Hint), hướng dẫn học sinh tư duy thuật toán mà không lộ đáp án mẫu.

### 2. 📝 Đề Kiểm Tra Định Kỳ Chuẩn Cấu Trúc Mới Bộ GD&ĐT (Áp dụng từ 2025)
- **Phần I (Trắc nghiệm 4 lựa chọn):** Đánh giá mức độ Nhận biết và Thông hiểu.
- **Phần II (Trắc nghiệm Đúng/Sai 4 ý a, b, c, d):** Tích hợp công thức tính điểm lũy tiến chuẩn xác của Bộ GD&ĐT (Đúng 1 ý: 0.1đ; 2 ý: 0.25đ; 3 ý: 0.5đ; 4 ý: 1.0đ).
- **Phần III (Trắc nghiệm Trả lời ngắn):** Điền đáp số thuật toán và kết quả truy vấn dữ liệu.

### 3. 📊 Đánh Giá Năng Lực & Sổ Điểm Điện Tử Thông Tư 22
- **Biểu đồ Radar Năng lực Đa chiều:** Trực quan hóa 5 miền Năng lực Tin học GDPT 2018 (NLa $\rightarrow$ NLe), Khung Năng lực Số học sinh (**Công văn 3456/BGDĐT-GDTrH**) và Năng lực AI (**Quyết định 3439/QĐ-BGDĐT**).
- **Sổ điểm điện tử TT 22:** Tự động gom các cột điểm ĐĐGtx (Tự học, Quiz, Code Lab, Dự án), ĐĐGgk, ĐĐGck theo đúng công thức quy định.
- **Xuất file Excel:** Tích hợp thư viện SheetJS kết xuất file `.xlsx` chuẩn mẫu phòng GD và nhà trường chỉ với 1 cú nhấp chuột.

### 4. 📚 Kho Học Liệu Số Phân Luồng THPT
- 🐍 **Khối 10:** Nền tảng lập trình Python (Cơ bản, rẽ nhánh, vòng lặp, mảng/danh sách, hàm, gỡ lỗi).
- ⚡ **Khối 11 - Định hướng Khoa học máy tính (CS):** Cấu trúc dữ liệu & Thuật toán nâng cao (Binary Search, QuickSort, Đệ quy) + Cơ sở dữ liệu quan hệ SQL (DDL, DML, JOIN, GROUP BY).
- 🌐 **Khối 11 - Định hướng Tin học ứng dụng (ICT):** Thiết kế Web (HTML5 chuẩn ngữ nghĩa, CSS3 Flexbox) + Ứng dụng CSDL và phân tích dữ liệu số.
- 🎮 **Không gian Tự học Gamification:** Tích lũy XP, tăng cấp, chuỗi học tập (Streak) và hệ thống Flashcards lật thẻ ghi nhớ thuật ngữ.

---

## 📁 CẤU TRÚC DỰ ÁN

```text
thpt/
├── index.html                 # Ứng dụng Web App chính (Giao diện THPT tích hợp SPA)
├── index.htm                  # Bản đồng bộ phục vụ GitHub Pages
├── OGK1T6.htm                 # Lưu trữ tài liệu Ôn thi Giữa kỳ 1 Tin học 6
├── README.md                  # Hướng dẫn chi tiết & tài liệu dự án
├── LICENSE                    # Giấy phép nguồn mở MIT License
└── data/
    ├── grade10-python.json    # Ngân hàng bài tập thuật toán Python Khối 10
    ├── grade11-cs.json        # Bài tập Thuật toán & Truy vấn SQL Khối 11 (Nhánh CS)
    ├── grade11-ict.json       # Bài tập Thiết kế Web & Xử lý số Khối 11 (Nhánh ICT)
    └── exam-2025.json         # Đề thi định kỳ mẫu theo chuẩn 3 phần mới 2025
```

---

## 🚀 HƯỚNG DẪN KÍCH HOẠT GITHUB PAGES (TRIỂN KHAI 0 ĐỒNG)

Để đưa trang web hoạt động online công khai cho học sinh toàn trường truy cập:

1. Đẩy mã nguồn lên repository:
   ```bash
   git add .
   git commit -m "Nang cap toan dien nen tang Tin hoc THPT 10 & 11"
   git push origin main
   ```
2. Vào **Settings** trên GitHub repo: `https://github.com/thaytruongit/thpt/settings/pages`
3. Tại mục **Build and deployment**:
   - **Source:** Chọn `Deploy from a branch`
   - **Branch:** Chọn `main` và thư mục `/(root)`
   - Nhấn **Save**.
4. Sau 1 phút, trang web sẽ tự động xuất bản tại địa chỉ:  
   👉 **`https://thaytruongit.github.io/thpt/`**

---

## 👨‍🏫 TÁC GIẢ & BẢN QUYỀN

- **Tác giả:** Thầy Trương IT (`thaytruongit`)
- **Email:** `manhtruongdo1984@gmail.com`
- **Mã nguồn mở:** Phát hành theo giấy phép **[MIT License](LICENSE)** - Tự do sử dụng, tùy biến và chia sẻ cho mục đích giáo dục.
