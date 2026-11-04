/**
 * ThayTruongIT - THPT Hub
 * CƠ SỞ DỮ LIỆU TOÀN BỘ 34 BÀI HỌC TIN HỌC 10 - BỘ SÁCH KẾT NỐI TRI THỨC VỚI CUỘC SỐNG
 * Mỗi bài học tích hợp đầy đủ 4 thành phần:
 *   1. Kiến thức trọng tâm theo bài học (knowledge)
 *   2. Bài tập thực hành / Auto-Judge theo bài học (exercise)
 *   3. Bài kiểm tra thường xuyên 15 phút theo bài học (regular_quiz)
 *   4. Liên kết Bài kiểm tra định kỳ theo Khối / Lớp (periodic_exam)
 */

const KNTT10_TOPICS = [
    { id: 'ALL', name: 'Tất cả 34 Bài học (Chủ đề 1 ➔ 6)', short: 'Tất cả 34 Bài' },
    { id: 'CD1', name: 'Chủ đề 1: Máy tính và xã hội tri thức (Bài 1 - Bài 7)', short: 'CĐ1: Máy tính & XH' },
    { id: 'CD2', name: 'Chủ đề 2: Mạng máy tính và Internet (Bài 8 - Bài 10)', short: 'CĐ2: Mạng & Internet' },
    { id: 'CD3', name: 'Chủ đề 3: Đạo đức, pháp luật và văn hoá số (Bài 11)', short: 'CĐ3: Đạo đức số' },
    { id: 'CD4', name: 'Chủ đề 4: Ứng dụng tin học - Đồ hoạ Inkscape (Bài 12 - Bài 15)', short: 'CĐ4: Đồ hoạ Vector' },
    { id: 'CD5', name: 'Chủ đề 5: Giải quyết vấn đề - Lập trình Python (Bài 16 - Bài 32)', short: 'CĐ5: Lập trình Python' },
    { id: 'CD6', name: 'Chủ đề 6: Hướng nghiệp với tin học (Bài 33 - Bài 34)', short: 'CĐ6: Hướng nghiệp' }
];

const KNTT10_LESSONS_DEFAULT = [
    // ==================== CHỦ ĐỀ 1 (BÀI 1 -> BÀI 7) ====================
    {
        id: 'k10_b01', num: 1, topic_id: 'CD1', badge: 'CHỦ ĐỀ 1', difficulty: 'Nhận biết', art: 'prism',
        title: 'Bài 1: Thông tin và xử lí thông tin',
        summary: 'Phân biệt thông tin và dữ liệu, các bước xử lí thông tin trong máy tính và đơn vị đo dung lượng thông tin (Bit, Byte, KB, MB, GB, TB).',
        knowledge: `
            <h4>1. Thông tin và Dữ liệu</h4>
            <ul class="list-disc pl-5 space-y-1">
                <li><strong>Dữ liệu (Data):</strong> Là các con số, văn bản, hình ảnh, âm thanh... được ghi lên vật mang tin.</li>
                <li><strong>Thông tin (Information):</strong> Là ý nghĩa của dữ liệu đem lại hiểu biết cho con người.</li>
                <li><strong>Vật mang tin:</strong> Phương tiện dùng để lưu trữ và truyền tải dữ liệu (giấy, ổ cứng, thẻ nhớ...).</li>
            </ul>
            <h4 class="mt-3">2. Đơn vị đo lượng thông tin</h4>
            <p>Đơn vị cơ bản nhất là <strong>Bit</strong> (0 hoặc 1). <code>1 Byte = 8 Bit</code>. Các bội số theo hệ nhị phân: <code>1 KB = 1024 Byte</code>, <code>1 MB = 1024 KB</code>, <code>1 GB = 1024 MB</code>, <code>1 TB = 1024 GB</code>.</p>
        `,
        exercise: {
            id: 'ex_b01', type: 'ALGORITHM', title: 'Đổi dung lượng từ Gigabyte (GB) sang Megabyte (MB) và Kilobyte (KB)',
            description: 'Viết chương trình Python nhập vào một số nguyên N là dung lượng bộ nhớ tính theo GB. Hãy tính và in ra dung lượng tương ứng theo MB và KB (biết 1 GB = 1024 MB, 1 MB = 1024 KB).',
            sample_in: '2', sample_out: 'MB: 2048\nKB: 2097152',
            starter_code: 'gb = int(input())\nmb = gb * 1024\nkb = mb * 1024\nprint(f"MB: {mb}")\nprint(f"KB: {kb}")',
            testcases: [
                { input: '2', output: 'MB: 2048\nKB: 2097152', hidden: false },
                { input: '1', output: 'MB: 1024\nKB: 1048576', hidden: false },
                { input: '5', output: 'MB: 5120\nKB: 5242880', hidden: true }
            ],
            hint: 'Nhân với 1024 cho mỗi cấp đơn vị từ GB -> MB -> KB.'
        },
        regular_quiz: [
            { q: 'Phát biểu nào sau đây đúng về mối quan hệ giữa thông tin và dữ liệu?', options: ['Dữ liệu là thông tin đã được xử lí', 'Thông tin là ý nghĩa của dữ liệu', 'Dữ liệu và thông tin hoàn toàn giống nhau', 'Vật mang tin chính là thông tin'], ans: 1, exp: 'Dữ liệu là cái biểu đạt, còn thông tin là nội dung/ý nghĩa rút ra từ dữ liệu.' },
            { q: 'Một thẻ nhớ dung lượng 2 GB chứa được tối đa bao nhiêu ảnh, biết mỗi ảnh có dung lượng 4 MB?', options: ['256 ảnh', '500 ảnh', '512 ảnh', '1024 ảnh'], ans: 2, exp: '2 GB = 2 * 1024 = 2048 MB. Số ảnh = 2048 / 4 = 512 ảnh.' }
        ]
    },
    {
        id: 'k10_b02', num: 2, topic_id: 'CD1', badge: 'CHỦ ĐỀ 1', difficulty: 'Nhận biết', art: 'timer',
        title: 'Bài 2: Vai trò của thiết bị thông minh và tin học đối với xã hội',
        summary: 'Nhận biết đặc trưng của thiết bị thông minh, vai trò trong cuộc cách mạng công nghiệp 4.0 và các thành tựu của Tin học.',
        knowledge: `
            <h4>1. Thiết bị thông minh (Smart Devices)</h4>
            <p>Là thiết bị điện tử có thể hoạt động tự chủ ở một mức độ nhất định, có khả năng kết nối mạng, tương tác với người dùng và thiết bị khác (VD: Điện thoại thông minh, đồng hồ thông minh, robot hút bụi AI).</p>
            <h4 class="mt-3">2. Vai trò trong Cách mạng công nghiệp 4.0</h4>
            <p>Thiết bị thông minh là thành phần cốt lõi của hệ thống <strong>IoT (Internet vạn vật)</strong>, giúp thu thập dữ liệu lớn (Big Data) và ứng dụng Trí tuệ nhân tạo (AI).</p>
        `,
        exercise: {
            id: 'ex_b02', type: 'ALGORITHM', title: 'Kiểm tra ngưỡng nhiệt độ cảnh báo của Cảm biến IoT thông minh',
            description: 'Một cảm biến nhiệt độ thông minh đo nhiệt độ phòng T (số thực). Nếu T > 35.0 thì in ra "CANH BAO NONG", ngược lại in ra "BINH THUONG".',
            sample_in: '37.5', sample_out: 'CANH BAO NONG',
            starter_code: 't = float(input())\nif t > 35.0:\n    print("CANH BAO NONG")\nelse:\n    print("BINH THUONG")',
            testcases: [
                { input: '37.5', output: 'CANH BAO NONG', hidden: false },
                { input: '28.0', output: 'BINH THUONG', hidden: false }
            ],
            hint: 'Dùng câu lệnh rẽ nhánh if t > 35.0.'
        },
        regular_quiz: [
            { q: 'Thiết bị nào sau đây KHÔNG phải là thiết bị thông minh?', options: ['Điện thoại Smartphone', 'Đồng hồ vạn năng cơ học', 'Camera AI nhận diện khuôn mặt', 'Robot hút bụi tự lập bản đồ'], ans: 1, exp: 'Đồng hồ cơ học không có bộ xử lí số, không kết nối mạng và không tự chủ.' },
            { q: 'Công nghệ nào kết nối các thiết bị thông minh lại với nhau qua Internet?', options: ['IoT (Internet of Things)', 'BIOS', 'VGA', 'ROM'], ans: 0, exp: 'IoT là mạng lưới vạn vật kết nối Internet.' }
        ]
    },
    {
        id: 'k10_b03', num: 3, topic_id: 'CD1', badge: 'CHỦ ĐỀ 1', difficulty: 'Thông hiểu', art: 'code',
        title: 'Bài 3: Một số kiểu dữ liệu và dữ liệu văn bản',
        summary: 'Tìm hiểu bảng mã ASCII, bảng mã chuẩn quốc tế Unicode, cách số hoá văn bản và định dạng tệp văn bản trong máy tính.',
        knowledge: `
            <h4>1. Mã hoá kí tự và Văn bản</h4>
            <ul class="list-disc pl-5 space-y-1">
                <li><strong>Bảng mã ASCII:</strong> Dùng 7 bit (mở rộng là 8 bit = 1 byte) mã hoá 256 kí tự tiếng Anh cơ bản.</li>
                <li><strong>Bảng mã Unicode (UTF-8):</strong> Bộ mã chuẩn quốc tế hỗ trợ đa ngôn ngữ (bao gồm tiếng Việt có dấu), dùng từ 1 đến 4 byte cho mỗi kí tự.</li>
            </ul>
        `,
        exercise: {
            id: 'ex_b03', type: 'ALGORITHM', title: 'Tra cứu mã ASCII / Unicode của kí tự bằng Python',
            description: 'Viết chương trình nhập vào một kí tự C. In ra mã số nguyên trong bảng mã ASCII/Unicode của kí tự đó bằng hàm ord(C).',
            sample_in: 'A', sample_out: '65',
            starter_code: 'c = input().strip()\nprint(ord(c[0]))',
            testcases: [
                { input: 'A', output: '65', hidden: false },
                { input: 'a', output: '97', hidden: false },
                { input: '0', output: '48', hidden: true }
            ],
            hint: 'Hàm ord(c) trả về mã Unicode của kí tự c.'
        },
        regular_quiz: [
            { q: 'Bảng mã nào hiện nay là chuẩn quốc tế để biểu diễn văn bản tiếng Việt trong máy tính?', options: ['ASCII 7-bit', 'Unicode', 'BCD', 'Morse'], ans: 1, exp: 'Unicode là bộ mã chuẩn quốc tế thống nhất cho mọi ngôn ngữ trên thế giới.' },
            { q: 'Trong bảng mã ASCII, kí tự "A" có mã thập phân là 65 thì kí tự "C" có mã thập phân là bao nhiêu?', options: ['66', '67', '68', '97'], ans: 1, exp: 'A=65, B=66, C=67.' }
        ]
    },
    {
        id: 'k10_b04', num: 4, topic_id: 'CD1', badge: 'CHỦ ĐỀ 1', difficulty: 'Vận dụng', art: 'numbers',
        title: 'Bài 4: Hệ nhị phân và dữ liệu số nguyên',
        summary: 'Chuyển đổi giữa hệ thập phân và hệ nhị phân, thực hiện phép cộng và phép nhân trong hệ nhị phân, biểu diễn số nguyên trong máy tính.',
        knowledge: `
            <h4>1. Hệ nhị phân (Binary System - Cơ số 2)</h4>
            <p>Chỉ sử dụng hai chữ số <code>0</code> và <code>1</code>. Giá trị của dãy bit $b_n b_{n-1} ... b_1 b_0$ ở hệ thập phân là: $\\sum b_i \\times 2^i$.</p>
            <h4 class="mt-3">2. Quy tắc cộng nhị phân</h4>
            <p><code>0 + 0 = 0</code> | <code>0 + 1 = 1</code> | <code>1 + 0 = 1</code> | <code>1 + 1 = 10</code> (viết 0 nhớ 1).</p>
        `,
        exercise: {
            id: 'ex_b04', type: 'ALGORITHM', title: 'Đổi số nguyên dương N từ hệ thập phân sang hệ nhị phân',
            description: 'Viết chương trình nhập vào một số nguyên dương N ở hệ thập phân. Hãy in ra biểu diễn nhị phân của N (không có tiền tố 0b).',
            sample_in: '13', sample_out: '1101',
            starter_code: 'n = int(input())\nprint(bin(n)[2:])',
            testcases: [
                { input: '13', output: '1101', hidden: false },
                { input: '8', output: '1000', hidden: false },
                { input: '255', output: '11111111', hidden: true }
            ],
            hint: 'Sử dụng hàm bin(n)[2:] trong Python hoặc chia liên tiếp cho 2 lấy phần dư.'
        },
        regular_quiz: [
            { q: 'Số nhị phân 1101₂ biểu diễn giá trị nào trong hệ thập phân?', options: ['11', '12', '13', '15'], ans: 2, exp: '1*2³ + 1*2² + 0*2¹ + 1*2⁰ = 8 + 4 + 0 + 1 = 13.' },
            { q: 'Kết quả của phép cộng hai số nhị phân 101₂ + 011₂ là bao nhiêu?', options: ['1000₂', '110₂', '111₂', '1010₂'], ans: 0, exp: '101 (5) + 011 (3) = 1000₂ (8).' }
        ]
    },
    {
        id: 'k10_b05', num: 5, topic_id: 'CD1', badge: 'CHỦ ĐỀ 1', difficulty: 'Thông hiểu', art: 'prism',
        title: 'Bài 5: Dữ liệu lôgic',
        summary: 'Các giá trị chân lí Đúng (True / 1) và Sai (False / 0), các phép toán lôgic cơ bản: AND (Hội), OR (Tuyển), NOT (Phủ định).',
        knowledge: `
            <h4>1. Ba phép toán lôgic cơ bản</h4>
            <ul class="list-disc pl-5 space-y-1">
                <li><strong>AND (Và):</strong> Chỉ nhận giá trị <code>True (1)</code> khi cả hai toán hạng đều là <code>True (1)</code>.</li>
                <li><strong>OR (Hoặc):</strong> Nhận giá trị <code>True (1)</code> khi có ít nhất một toán hạng là <code>True (1)</code>.</li>
                <li><strong>NOT (Phủ định):</strong> Đảo ngược giá trị lôgic (<code>NOT 1 = 0</code>, <code>NOT 0 = 1</code>).</li>
            </ul>
        `,
        exercise: {
            id: 'ex_b05', type: 'ALGORITHM', title: 'Mô phỏng Cổng lôgic (A AND B) OR (NOT A)',
            description: 'Nhập vào hai số nguyên A và B chỉ nhận giá trị 0 hoặc 1. Tính và in ra kết quả (0 hoặc 1) của biểu thức: (A and B) or (not A).',
            sample_in: '0 1', sample_out: '1',
            starter_code: 'a, b = map(int, input().split())\nres = (bool(a) and bool(b)) or (not bool(a))\nprint(1 if res else 0)',
            testcases: [
                { input: '0 1', output: '1', hidden: false },
                { input: '1 0', output: '0', hidden: false },
                { input: '1 1', output: '1', hidden: true }
            ],
            hint: 'Khi A = 0 thì not A = 1 nên biểu thức trả về 1.'
        },
        regular_quiz: [
            { q: 'Với p = True và q = False, biểu thức (p AND q) OR (NOT q) có giá trị là gì?', options: ['True', 'False', '0', 'Không xác định'], ans: 0, exp: '(True AND False) = False; (NOT False) = True -> False OR True = True.' },
            { q: 'Để biểu diễn một giá trị lôgic (Đúng/Sai), máy tính cần tối thiểu bao nhiêu bit?', options: ['1 bit', '8 bit', '16 bit', '32 bit'], ans: 0, exp: 'Về mặt lí thuyết, chỉ cần tối thiểu 1 bit (0 hoặc 1) để biểu diễn trạng thái lôgic.' }
        ]
    },
    {
        id: 'k10_b06', num: 6, topic_id: 'CD1', badge: 'CHỦ ĐỀ 1', difficulty: 'Thông hiểu', art: 'timer',
        title: 'Bài 6: Dữ liệu âm thanh và hình ảnh',
        summary: 'Nguyên lí số hoá âm thanh (tần số lấy mẫu, độ sâu bit) và số hoá hình ảnh bitmap (điểm ảnh pixel, độ phân giải, hệ màu RGB).',
        knowledge: `
            <h4>1. Số hoá hình ảnh (Ảnh Bitmap)</h4>
            <p>Hình ảnh được chia thành lưới các điểm ảnh (<strong>Pixel</strong>). Trong hệ màu <strong>RGB 24-bit</strong>, mỗi màu (Đỏ - Red, Xanh lá - Green, Xanh dương - Blue) dùng 8 bit (0..255), tạo ra $2^{24} \\approx 16,7$ triệu màu.</p>
            <h4 class="mt-3">2. Số hoá âm thanh</h4>
            <p>Thực hiện lấy mẫu biên độ sóng âm theo chu kì. <strong>Tần số lấy mẫu</strong> càng cao và <strong>thang đo mẫu (bit depth)</strong> càng chi tiết thì âm thanh số càng trung thực.</p>
        `,
        exercise: {
            id: 'ex_b06', type: 'ALGORITHM', title: 'Tính dung lượng tệp ảnh Bitmap không nén (Byte)',
            description: 'Nhập chiều rộng W, chiều cao H (số pixel) của bức ảnh màu 24-bit (mỗi pixel chiếm 3 Byte). Hãy tính và in ra dung lượng ảnh tính theo Byte.',
            sample_in: '800 600', sample_out: '1440000',
            starter_code: 'w, h = map(int, input().split())\nprint(w * h * 3)',
            testcases: [
                { input: '800 600', output: '1440000', hidden: false },
                { input: '1920 1080', output: '6220800', hidden: false }
            ],
            hint: 'Số pixel = W * H. Mỗi pixel 24-bit = 3 Byte => Dung lượng = W * H * 3.'
        },
        regular_quiz: [
            { q: 'Trong hệ màu RGB 24-bit, bộ ba giá trị (255, 0, 0) biểu diễn màu gì?', options: ['Màu Đỏ (Red)', 'Màu Xanh lá (Green)', 'Màu Xanh dương (Blue)', 'Màu Trắng'], ans: 0, exp: 'R = 255, G = 0, B = 0 là màu Đỏ thuần khiết.' },
            { q: 'Độ phân giải của màn hình hoặc hình ảnh được xác định bằng:', options: ['Số lượng điểm ảnh theo chiều ngang và chiều dọc', 'Kích thước vật lí tính bằng mét', 'Tần số lấy mẫu âm thanh', 'Tốc độ truyền mạng'], ans: 0, exp: 'Ví dụ Full HD 1920 x 1080 điểm ảnh (pixel).' }
        ]
    },
    {
        id: 'k10_b07', num: 7, topic_id: 'CD1', badge: 'CHỦ ĐỀ 1', difficulty: 'Vận dụng', art: 'code',
        title: 'Bài 7: Thực hành sử dụng thiết bị số thông dụng',
        summary: 'Thực hành kết nối thiết bị số, trao đổi dữ liệu qua mã QR, Bluetooth, đám mây và quản lí tệp an toàn trên điện thoại/máy tính.',
        knowledge: `
            <h4>1. Các phương thức truyền dữ liệu nhanh giữa các thiết bị số</h4>
            <p>Sử dụng cáp USB, Bluetooth/AirDrop/Quick Share trong phạm vi gần, hoặc đồng bộ qua dịch vụ lưu trữ đám mây (Google Drive, OneDrive) và quét mã QR.</p>
        `,
        exercise: {
            id: 'ex_b07', type: 'ALGORITHM', title: 'Tính thời gian truyền tệp dữ liệu qua mạng không dây',
            description: 'Nhập dung lượng tệp S (tính bằng MB) và tốc độ truyền mạng V (tính bằng MB/giây). Tính và in ra thời gian truyền (giây) làm tròn 2 chữ số thập phân.',
            sample_in: '150 12.5', sample_out: '12.00',
            starter_code: 's, v = map(float, input().split())\nprint(f"{s / v:.2f}")',
            testcases: [
                { input: '150 12.5', output: '12.00', hidden: false },
                { input: '100 8', output: '12.50', hidden: false }
            ],
            hint: 'Thời gian T = Dung lượng S / Tốc độ V.'
        },
        regular_quiz: [
            { q: 'Tiện ích nào giúp mở nhanh một liên kết trang web trên điện thoại thông minh bằng camera?', options: ['Quét mã QR', 'Bật chế độ máy bay', 'Định dạng thẻ nhớ', 'Tắt màn hình'], ans: 0, exp: 'Mã QR mã hoá URL giúp truy cập tức thì qua camera.' }
        ]
    },

    // ==================== CHỦ ĐỀ 2 (BÀI 8 -> BÀI 10) ====================
    {
        id: 'k10_b08', num: 8, topic_id: 'CD2', badge: 'CHỦ ĐỀ 2', difficulty: 'Nhận biết', art: 'numbers',
        title: 'Bài 8: Mạng máy tính trong cuộc sống hiện đại',
        summary: 'Phân biệt mạng cục bộ (LAN) và mạng diện rộng (WAN/Internet), vai trò của điện toán đám mây (Cloud Computing) và IoT.',
        knowledge: `
            <h4>1. Mạng LAN và Mạng Internet</h4>
            <p><strong>LAN (Local Area Network):</strong> Mạng cục bộ trong phạm vi nhỏ (phòng máy, tòa nhà, trường học). <strong>Internet:</strong> Mạng toàn cầu kết nối hàng tỉ thiết bị qua bộ giao thức TCP/IP.</p>
            <h4 class="mt-3">2. Điện toán đám mây (Cloud Computing)</h4>
            <p>Cung cấp tài nguyên máy tính (lưu trữ, phần mềm, máy chủ) qua Internet như SaaS (Google Docs), PaaS, IaaS.</p>
        `,
        exercise: {
            id: 'ex_b08', type: 'ALGORITHM', title: 'Phân loại quy mô mạng theo số lượng trạm kết nối',
            description: 'Nhập số lượng thiết bị N trong mạng. Nếu N <= 50 in "MANG LAN PHONG MAY", ngược lại in "MANG QUY MO LON".',
            sample_in: '45', sample_out: 'MANG LAN PHONG MAY',
            starter_code: 'n = int(input())\nprint("MANG LAN PHONG MAY" if n <= 50 else "MANG QUY MO LON")',
            testcases: [
                { input: '45', output: 'MANG LAN PHONG MAY', hidden: false },
                { input: '200', output: 'MANG QUY MO LON', hidden: false }
            ],
            hint: 'So sánh n <= 50.'
        },
        regular_quiz: [
            { q: 'Dịch vụ nào sau đây là ví dụ điển hình của Điện toán đám mây (Cloud Storage)?', options: ['Google Drive', 'Microsoft Paint cài trên máy', 'Ổ đĩa cứng gắn trong HDD', 'Bàn phím cơ'], ans: 0, exp: 'Google Drive lưu trữ và xử lí dữ liệu trực tuyến trên đám mây.' }
        ]
    },
    {
        id: 'k10_b09', num: 9, topic_id: 'CD2', badge: 'CHỦ ĐỀ 2', difficulty: 'Thông hiểu', art: 'prism',
        title: 'Bài 9: An toàn trong không gian mạng',
        summary: 'Nhận diện các mối đe doạ trên không gian mạng (Virus, Trojan, Ransomware, Lừa đảo Phishing) và biện pháp phòng vệ an toàn.',
        knowledge: `
            <h4>1. Phần mềm độc hại (Malware)</h4>
            <p>Bao gồm <strong>Virus</strong> (lây qua tệp), <strong>Worm/Sâu máy tính</strong> (tự nhân bản qua mạng), <strong>Trojan</strong> (ẩn dưới phần mềm hợp pháp để đánh cắp dữ liệu) và <strong>Ransomware</strong> (mã hoá dữ liệu đòi tiền chuộc).</p>
            <h4 class="mt-3">2. Nguyên tắc bảo mật tài khoản</h4>
            <p>Sử dụng mật khẩu mạnh (tối thiểu 8 kí tự gồm chữ hoa, chữ thường, chữ số, kí hiệu đặc biệt) và bật xác thực 2 lớp (2FA).</p>
        `,
        exercise: {
            id: 'ex_b09', type: 'ALGORITHM', title: 'Kiểm tra độ mạnh của Mật khẩu an toàn mạng',
            description: 'Nhập một chuỗi mật khẩu S. Nếu độ dài S >= 8 thì in "MAT KHAU DAT DO DAI", ngược lại in "MAT KHAU YEU".',
            sample_in: 'TinHoc10@2026', sample_out: 'MAT KHAU DAT DO DAI',
            starter_code: 's = input().strip()\nprint("MAT KHAU DAT DO DAI" if len(s) >= 8 else "MAT KHAU YEU")',
            testcases: [
                { input: 'TinHoc10@2026', output: 'MAT KHAU DAT DO DAI', hidden: false },
                { input: '12345', output: 'MAT KHAU YEU', hidden: false }
            ],
            hint: 'Sử dụng hàm len(s) >= 8.'
        },
        regular_quiz: [
            { q: 'Loại phần mềm độc hại nào chuyên mã hoá dữ liệu của nạn nhân để tống tiền?', options: ['Ransomware', 'Firewall', 'Antivirus', 'Unikey'], ans: 0, exp: 'Ransomware là mã độc tống tiền bằng cách khóa/mã hóa dữ liệu.' }
        ]
    },
    {
        id: 'k10_b10', num: 10, topic_id: 'CD2', badge: 'CHỦ ĐỀ 2', difficulty: 'Vận dụng', art: 'timer',
        title: 'Bài 10: Thực hành khai thác tài nguyên trên Internet',
        summary: 'Thực hành tìm kiếm thông tin nâng cao, sử dụng các học liệu mở, phần mềm dịch thuật và lưu trữ trực tuyến.',
        knowledge: `
            <h4>1. Khai thác học liệu số hiệu quả</h4>
            <p>Sử dụng từ khoá chính xác (đặt trong dấu ngoặc kép <code>"..."</code> hoặc giới hạn định dạng <code>filetype:pdf</code>) để tra cứu tài liệu học tập chính thống.</p>
        `,
        exercise: {
            id: 'ex_b10', type: 'ALGORITHM', title: 'Chuẩn hoá từ khoá tìm kiếm nâng cao đặt trong ngoặc kép',
            description: 'Nhập vào một cụm từ khoá S. Hãy in ra cụm từ đó được bao quanh bởi cặp dấu ngoặc kép để tìm kiếm chính xác trên máy tìm kiếm.',
            sample_in: 'Tin hoc 10 Ket noi tri thuc', sample_out: '"Tin hoc 10 Ket noi tri thuc"',
            starter_code: 's = input().strip()\nprint(f\'"{s}"\')',
            testcases: [
                { input: 'Tin hoc 10 Ket noi tri thuc', output: '"Tin hoc 10 Ket noi tri thuc"', hidden: false }
            ],
            hint: 'Sử dụng f\'"{s}"\' để in chuỗi trong cặp ngoặc kép.'
        },
        regular_quiz: [
            { q: 'Để tìm kiếm chính xác cả cụm từ không tách rời trên Google, ta đặt cụm từ đó trong cặp kí hiệu nào?', options: ['Dấu ngoặc kép "..."', 'Dấu ngoặc đơn (...)', 'Dấu chấm than !...!', 'Dấu phần trăm %...%'], ans: 0, exp: 'Dấu ngoặc kép bắt buộc máy tìm kiếm khớp đúng toàn bộ cụm từ.' }
        ]
    },

    // ==================== CHỦ ĐỀ 3 (BÀI 11) ====================
    {
        id: 'k10_b11', num: 11, topic_id: 'CD3', badge: 'CHỦ ĐỀ 3', difficulty: 'Thông hiểu', art: 'code',
        title: 'Bài 11: Ứng xử trên môi trường số. Nghĩa vụ tôn trọng bản quyền',
        summary: 'Quy tắc ứng xử văn minh trên mạng xã hội, Luật An ninh mạng, Luật Sở hữu trí tuệ và phân biệt phần mềm nguồn mở / thương mại.',
        knowledge: `
            <h4>1. Tôn trọng bản quyền sản phẩm số</h4>
            <p>Không sao chép, bẻ khoá (crack) phần mềm có bản quyền; trích dẫn nguồn đầy đủ khi sử dụng tư liệu của tác giả khác.</p>
            <h4 class="mt-3">2. Quy tắc ứng xử trên mạng</h4>
            <p>Tuân thủ Luật An ninh mạng: không tung tin giả (Fake News), không xúc phạm danh dự, nhân phẩm hoặc xâm phạm đời tư của người khác.</p>
        `,
        exercise: {
            id: 'ex_b11', type: 'ALGORITHM', title: 'Tự động tạo dòng trích dẫn nguồn bản quyền tác giả chuẩn',
            description: 'Nhập tên Tác giả ở dòng 1 và Năm xuất bản ở dòng 2. Hãy in ra dòng bản quyền theo mẫu: "Ban quyen (c) <Nam> thuoc ve <TacGia>".',
            sample_in: 'NXB Giao Duc\n2026', sample_out: 'Ban quyen (c) 2026 thuoc ve NXB Giao Duc',
            starter_code: 'author = input().strip()\nyear = input().strip()\nprint(f"Ban quyen (c) {year} thuoc ve {author}")',
            testcases: [
                { input: 'NXB Giao Duc\n2026', output: 'Ban quyen (c) 2026 thuoc ve NXB Giao Duc', hidden: false }
            ],
            hint: 'Đọc 2 dòng bằng 2 lệnh input() và ghép bằng f-string.'
        },
        regular_quiz: [
            { q: 'Hành vi nào sau đây VI PHẠM pháp luật và đạo đức trên môi trường số?', options: ['Chia sẻ phần mềm bẻ khóa (crack) lên mạng', 'Trích dẫn rõ tên tác giả khi dùng ảnh tư liệu', 'Sử dụng phần mềm mã nguồn mở miễn phí', 'Bảo mật thông tin cá nhân của bạn bè'], ans: 0, exp: 'Phát tán phần mềm bẻ khóa vi phạm quyền sở hữu trí tuệ.' }
        ]
    },

    // ==================== CHỦ ĐỀ 4: ĐỒ HOẠ INKSCAPE (BÀI 12 -> BÀI 15) ====================
    {
        id: 'k10_b12', num: 12, topic_id: 'CD4', badge: 'CHỦ ĐỀ 4', difficulty: 'Nhận biết', art: 'numbers',
        title: 'Bài 12: Phần mềm thiết kế đồ hoạ',
        summary: 'Phân biệt đồ hoạ điểm ảnh (Bitmap) và đồ hoạ Vector, làm quen giao diện phần mềm thiết kế đồ hoạ vector Inkscape.',
        knowledge: `
            <h4>1. Đồ hoạ Vector và Đồ hoạ Bitmap</h4>
            <ul class="list-disc pl-5 space-y-1">
                <li><strong>Đồ hoạ Vector (Inkscape, Illustrator):</strong> Tạo từ các công thức toán học (điểm, đoạn thẳng, đường cong Bézier). Phóng to vô hạn không bị vỡ hình, định dạng chuẩn là <code>.svg</code>.</li>
                <li><strong>Đồ hoạ Bitmap (Photoshop, Paint):</strong> Tạo từ ma trận điểm ảnh (pixel), phóng to quá mức sẽ bị răng cưa/mờ.</li>
            </ul>
        `,
        exercise: {
            id: 'ex_b12', type: 'ALGORITHM', title: 'Tính kích thước khung vẽ Vector sau khi phóng to tỉ lệ K lần',
            description: 'Một đối tượng đồ hoạ vector có chiều rộng W và chiều cao H. Khi phóng to theo tỉ lệ nguyên K lần, hãy in ra chiều rộng mới và chiều cao mới cách nhau 1 dấu cách.',
            sample_in: '120 80 3', sample_out: '360 240',
            starter_code: 'w, h, k = map(int, input().split())\nprint(w * k, h * k)',
            testcases: [
                { input: '120 80 3', output: '360 240', hidden: false },
                { input: '50 50 4', output: '200 200', hidden: false }
            ],
            hint: 'Nhân cả chiều rộng W và chiều cao H với hệ số tỉ lệ K.'
        },
        regular_quiz: [
            { q: 'Định dạng tệp mặc định của phần mềm thiết kế đồ hoạ vector Inkscape là gì?', options: ['.svg', '.bmp', '.mp3', '.exe'], ans: 0, exp: 'SVG (Scalable Vector Graphics) là định dạng chuẩn của Inkscape.' },
            { q: 'Ưu điểm lớn nhất của đồ hoạ Vector so với đồ hoạ Bitmap là gì?', options: ['Phóng to hoặc thu nhỏ tuỳ ý mà không bị vỡ hình', 'Chụp ảnh phong cảnh tự nhiên dễ hơn', 'Không cần máy tính để vẽ', 'Chỉ có màu đen trắng'], ans: 0, exp: 'Đồ hoạ vector tính toán lại đường nét bằng toán học nên không vỡ nét khi phóng đại.' }
        ]
    },
    {
        id: 'k10_b13', num: 13, topic_id: 'CD4', badge: 'CHỦ ĐỀ 4', difficulty: 'Thông hiểu', art: 'prism',
        title: 'Bài 13: Bổ sung các đối tượng đồ hoạ',
        summary: 'Các thuộc tính của đối tượng hình học trong Inkscape, tô màu (Fill, Stroke) và các phép ghép đối tượng (Union, Difference, Intersection).',
        knowledge: `
            <h4>1. Các phép toán ghép đối tượng hình học (Path Operations)</h4>
            <ul class="list-disc pl-5 space-y-1">
                <li><strong>Union (<code>Ctrl + +</code>):</strong> Hợp các hình thành một hình duy nhất.</li>
                <li><strong>Difference (<code>Ctrl + -</code>):</strong> Hiệu hai hình (lấy hình dưới trừ phần giao với hình trên).</li>
                <li><strong>Intersection (<code>Ctrl + *</code>):</strong> Lấy phần giao nhau của các hình.</li>
            </ul>
        `,
        exercise: {
            id: 'ex_b13', type: 'ALGORITHM', title: 'Tính diện tích hình tạo bởi phép Hợp (Union) không giao nhau',
            description: 'Cho hai hình chữ nhật rời nhau có diện tích lần lượt là S1 và S2. Tính diện tích đối tượng sau khi thực hiện phép Hợp (Union).',
            sample_in: '150 250', sample_out: '400',
            starter_code: 's1, s2 = map(int, input().split())\nprint(s1 + s2)',
            testcases: [
                { input: '150 250', output: '400', hidden: false }
            ],
            hint: 'Hai hình rời nhau khi Union có tổng diện tích là S1 + S2.'
        },
        regular_quiz: [
            { q: 'Trong Inkscape, phép toán nào dùng để cắt bỏ phần giao nhau bằng cách lấy hình dưới trừ đi hình trên?', options: ['Difference (Hiệu)', 'Union (Hợp)', 'Intersection (Giao)', 'Group (Nhóm)'], ans: 0, exp: 'Difference (Ctrl + -) thực hiện phép trừ hình học.' }
        ]
    },
    {
        id: 'k10_b14', num: 14, topic_id: 'CD4', badge: 'CHỦ ĐỀ 4', difficulty: 'Thông hiểu', art: 'timer',
        title: 'Bài 14: Làm việc với đối tượng đường và văn bản',
        summary: 'Sử dụng công cụ Pen vẽ đường cong Bézier, chỉnh sửa điểm neo (Node) và đặt văn bản uốn theo đường dẫn (Put on Path).',
        knowledge: `
            <h4>1. Đối tượng đường (Path) và Điểm neo (Node)</h4>
            <p>Mỗi đường cong Bézier gồm các đoạn nối giữa các <strong>điểm neo (Node)</strong>: điểm neo góc (Corner/Cusp node) tạo góc nhọn và điểm neo trơn (Smooth node) tạo đường uốn mềm mại.</p>
        `,
        exercise: {
            id: 'ex_b14', type: 'ALGORITHM', title: 'Tính số đoạn cong nối giữa N điểm neo liên tiếp không khép kín',
            description: 'Một đường Path hở được tạo bởi N điểm neo (N >= 2) nối liên tiếp nhau. Hãy in ra số đoạn nối giữa chúng (N - 1).',
            sample_in: '6', sample_out: '5',
            starter_code: 'n = int(input())\nprint(n - 1)',
            testcases: [
                { input: '6', output: '5', hidden: false },
                { input: '10', output: '9', hidden: false }
            ],
            hint: 'Đường hở gồm N điểm neo sẽ có N - 1 đoạn.'
        },
        regular_quiz: [
            { q: 'Để đặt một dòng chữ uốn lượn theo một đường cong có sẵn trong Inkscape, ta chọn cả chữ và đường cong rồi dùng lệnh nào?', options: ['Text -> Put on Path', 'Path -> Union', 'File -> Export PNG', 'Object -> Group'], ans: 0, exp: 'Lệnh Text -> Put on Path gắn văn bản chạy dọc theo đường dẫn.' }
        ]
    },
    {
        id: 'k10_b15', num: 15, topic_id: 'CD4', badge: 'CHỦ ĐỀ 4', difficulty: 'Vận dụng', art: 'code',
        title: 'Bài 15: Hoàn thiện hình ảnh đồ hoạ',
        summary: 'Thực hành thiết kế sản phẩm đồ hoạ hoàn chỉnh (Poster, Logo, Banner), căn chỉnh bố cục và xuất tệp ảnh PNG chất lượng cao.',
        knowledge: `
            <h4>1. Xuất sản phẩm đồ hoạ (Export PNG Image)</h4>
            <p>Trong Inkscape, tệp gốc lưu dưới dạng <code>.svg</code> để chỉnh sửa về sau; khi đem in ấn hoặc đăng web cần dùng lệnh <strong>File ➔ Export PNG Image (<code>Shift + Ctrl + E</code>)</strong>.</p>
        `,
        exercise: {
            id: 'ex_b15', type: 'ALGORITHM', title: 'Kiểm tra tỉ lệ khung hình chuẩn 16:9 của Banner đồ hoạ',
            description: 'Nhập chiều rộng W và chiều cao H của tấm Banner. Kiểm tra xem W : H có đúng tỉ lệ 16 : 9 không (tức là W * 9 == H * 16). In "CHUAN 16:9" hoặc "KHONG PHAI 16:9".',
            sample_in: '1920 1080', sample_out: 'CHUAN 16:9',
            starter_code: 'w, h = map(int, input().split())\nprint("CHUAN 16:9" if w * 9 == h * 16 else "KHONG PHAI 16:9")',
            testcases: [
                { input: '1920 1080', output: 'CHUAN 16:9', hidden: false },
                { input: '1280 720', output: 'CHUAN 16:9', hidden: false },
                { input: '1000 1000', output: 'KHONG PHAI 16:9', hidden: true }
            ],
            hint: 'Kiểm tra đẳng thức chéo w * 9 == h * 16.'
        },
        regular_quiz: [
            { q: 'Phím tắt nào trong Inkscape dùng để mở hộp thoại xuất ảnh sang định dạng PNG?', options: ['Shift + Ctrl + E', 'Ctrl + Z', 'Alt + F4', 'Ctrl + C'], ans: 0, exp: 'Shift + Ctrl + E mở bảng Export PNG Image.' }
        ]
    },

    // ==================== CHỦ ĐỀ 5: LẬP TRÌNH PYTHON (BÀI 16 -> BÀI 32) ====================
    {
        id: 'k10_b16', num: 16, topic_id: 'CD5', badge: 'ALGORITHM', difficulty: 'Nhận biết', art: 'prism',
        title: 'Bài 16: Ngôn ngữ lập trình bậc cao và Python',
        summary: 'Khái niệm ngôn ngữ lập trình bậc cao, chương trình dịch (Thông dịch & Biên dịch), môi trường lập trình Python và lệnh print().',
        knowledge: `
            <h4>1. Ngôn ngữ lập trình bậc cao Python</h4>
            <p>Python là ngôn ngữ lập trình bậc cao có cú pháp ngắn gọn, gần với ngôn ngữ tự nhiên, sử dụng trình <strong>thông dịch (Interpreter)</strong> để dịch và thực hiện từng câu lệnh.</p>
            <pre class="bg-slate-900 text-emerald-300 p-3 rounded-xl mt-2 text-xs font-mono">print("Xin chao Python 10!")\nprint(15 + 25)</pre>
        `,
        exercise: {
            id: 'py10_01', type: 'ALGORITHM', title: 'Tính chu vi và diện tích hình chữ nhật',
            description: 'Viết chương trình nhập vào hai số thực a và b là chiều dài và chiều rộng của hình chữ nhật. Tính và in ra chu vi và diện tích trên hai dòng, làm tròn 2 chữ số thập phân.',
            sample_in: '5.0 3.0', sample_out: 'Chu vi: 16.00\nDien tich: 15.00',
            starter_code: 'a, b = map(float, input().split())\ncv = 2 * (a + b)\ndt = a * b\nprint(f"Chu vi: {cv:.2f}")\nprint(f"Dien tich: {dt:.2f}")',
            testcases: [
                { input: '5.0 3.0', output: 'Chu vi: 16.00\nDien tich: 15.00', hidden: false },
                { input: '10 4.5', output: 'Chu vi: 29.00\nDien tich: 45.00', hidden: false },
                { input: '123.45 67.89', output: 'Chu vi: 382.68\nDien tich: 8381.02', hidden: true }
            ],
            hint: 'Dùng công thức cv = 2 * (a + b) và dt = a * b.'
        },
        regular_quiz: [
            { q: 'Python thuộc loại ngôn ngữ lập trình nào sau đây?', options: ['Ngôn ngữ máy', 'Hợp ngữ', 'Ngôn ngữ lập trình bậc cao', 'Ngôn ngữ đánh dấu siêu văn bản'], ans: 2, exp: 'Python là ngôn ngữ lập trình bậc cao dùng trình thông dịch.' },
            { q: 'Câu lệnh print(10 + 5 * 2) trong Python in ra kết quả nào?', options: ['30', '20', '17', '10 + 5 * 2'], ans: 1, exp: 'Thực hiện phép nhân trước: 5 * 2 = 10, sau đó 10 + 10 = 20.' }
        ]
    },
    {
        id: 'k10_b17', num: 17, topic_id: 'CD5', badge: 'ALGORITHM', difficulty: 'Nhận biết', art: 'timer',
        title: 'Bài 17: Biến và lệnh gán',
        summary: 'Quy tắc đặt tên biến trong Python, câu lệnh gán tổng quát, phép gán đồng thời và các phép toán số học (//, %, **).',
        knowledge: `
            <h4>1. Quy tắc đặt tên biến và Phép toán số học</h4>
            <ul class="list-disc pl-5 space-y-1">
                <li>Tên biến chỉ gồm chữ cái, chữ số và dấu gạch dưới <code>_</code>, <strong>không bắt đầu bằng chữ số</strong> và không trùng từ khoá.</li>
                <li>Các phép toán đặc biệt trong Python: <code>//</code> (chia lấy phần nguyên), <code>%</code> (chia lấy phần dư), <code>**</code> (luỹ thừa).</li>
            </ul>
        `,
        exercise: {
            id: 'ex_b17', type: 'ALGORITHM', title: 'Chia kẹo: Tính thương nguyên và số dư bằng phép toán // và %',
            description: 'Có N chiếc kẹo chia đều cho K học sinh. Hãy in ra số kẹo mỗi học sinh nhận được (N // K) và số kẹo còn dư (N % K) trên cùng một dòng cách nhau bởi dấu cách.',
            sample_in: '25 4', sample_out: '6 1',
            starter_code: 'n, k = map(int, input().split())\nprint(n // k, n % k)',
            testcases: [
                { input: '25 4', output: '6 1', hidden: false },
                { input: '30 5', output: '6 0', hidden: false }
            ],
            hint: 'Sử dụng toán tử // (chia lấy nguyên) và % (chia lấy dư).'
        },
        regular_quiz: [
            { q: 'Tên biến nào sau đây là HỢP LỆ trong ngôn ngữ lập trình Python?', options: ['diem_toan_10', '10_diem_toan', 'diem-toan', 'for'], ans: 0, exp: 'Tên biến không được bắt đầu bằng số, không chứa dấu gạch ngang và không trùng từ khoá for.' },
            { q: 'Kết quả của biểu thức 17 // 5 và 17 % 5 trong Python lần lượt là:', options: ['3 và 2', '3.4 và 2', '2 và 3', '3 và 5'], ans: 0, exp: '17 chia 5 được thương nguyên là 3 và dư 2.' }
        ]
    },
    {
        id: 'k10_b18', num: 18, topic_id: 'CD5', badge: 'ALGORITHM', difficulty: 'Thông hiểu', art: 'code',
        title: 'Bài 18: Các lệnh vào ra đơn giản',
        summary: 'Nhập dữ liệu từ bàn phím bằng hàm input(), chuyển đổi kiểu dữ liệu int(), float(), str() và kiểm tra kiểu bằng hàm type().',
        knowledge: `
            <h4>1. Hàm input() và Ép kiểu dữ liệu</h4>
            <p>Hàm <code>input()</code> luôn trả về giá trị kiểu <strong>xâu kí tự (`str`)</strong>. Muốn tính toán số học, ta cần chuyển sang số nguyên bằng <code>int()</code> hoặc số thực bằng <code>float()</code>.</p>
        `,
        exercise: {
            id: 'ex_b18', type: 'ALGORITHM', title: 'Tính điểm trung bình môn Tin học từ 3 đầu điểm',
            description: 'Nhập 3 số thực a, b, c trên một dòng lần lượt là điểm Thường xuyên (hệ số 1), Giữa kì (hệ số 2) và Cuối kì (hệ số 3). Tính điểm trung bình = (a + 2*b + 3*c) / 6 làm tròn 1 chữ số thập phân.',
            sample_in: '8.0 8.5 9.0', sample_out: '8.7',
            starter_code: 'a, b, c = map(float, input().split())\ndtb = (a + 2 * b + 3 * c) / 6\nprint(f"{dtb:.1f}")',
            testcases: [
                { input: '8.0 8.5 9.0', output: '8.7', hidden: false },
                { input: '7.0 7.0 7.0', output: '7.0', hidden: false }
            ],
            hint: 'Dùng công thức (a + 2*b + 3*c) / 6 và f"{dtb:.1f}".'
        },
        regular_quiz: [
            { q: 'Hàm input() trong Python luôn trả về dữ liệu thuộc kiểu nào?', options: ['str (Xâu kí tự)', 'int (Số nguyên)', 'float (Số thực)', 'bool (Lôgic)'], ans: 0, exp: 'Mọi dữ liệu nhập qua input() mặc định đều là kiểu str.' }
        ]
    },
    {
        id: 'k10_b19', num: 19, topic_id: 'CD5', badge: 'ALGORITHM', difficulty: 'Thông hiểu', art: 'timer',
        title: 'Bài 19: Câu lệnh rẽ nhánh If',
        summary: 'Biểu thức lôgic, các phép toán so sánh và cấu trúc rẽ nhánh khuyết (if) và rẽ nhánh đủ (if - elif - else) trong Python.',
        knowledge: `
            <h4>1. Cấu trúc rẽ nhánh If - Else trong Python</h4>
            <pre class="bg-slate-900 text-emerald-300 p-3 rounded-xl mt-2 text-xs font-mono">if &lt;điều_kiện&gt;:\n    &lt;khối_lệnh_1&gt;\nelse:\n    &lt;khối_lệnh_2&gt;</pre>
            <p class="mt-2">Lưu ý: Khối lệnh bên trong <code>if</code> và <code>else</code> bắt buộc phải <strong>thụt lề (indentation)</strong> thống nhất (thường là 4 dấu cách).</p>
        `,
        exercise: {
            id: 'py10_02', type: 'ALGORITHM', title: 'Kiểm tra năm nhuận',
            description: 'Một năm là năm nhuận nếu năm đó chia hết cho 400 HOẶC (chia hết cho 4 và không chia hết cho 100). Viết chương trình nhập vào một năm N và kiểm tra có phải năm nhuận không.',
            sample_in: '2024', sample_out: 'NAM NHUAN',
            starter_code: 'year = int(input())\nif (year % 400 == 0) or (year % 4 == 0 and year % 100 != 0):\n    print("NAM NHUAN")\nelse:\n    print("KHONG PHAI NAM NHUAN")',
            testcases: [
                { input: '2024', output: 'NAM NHUAN', hidden: false },
                { input: '1900', output: 'KHONG PHAI NAM NHUAN', hidden: false },
                { input: '2000', output: 'NAM NHUAN', hidden: true }
            ],
            hint: 'Lưu ý năm tròn thế kỷ: 1900 không nhuận nhưng 2000 là năm nhuận.'
        },
        regular_quiz: [
            { q: 'Trong Python, phép toán nào dùng để kiểm tra hai giá trị có BẰNG NHAU hay không?', options: ['==', '=', '!=', ':='], ans: 0, exp: 'Toán tử == dùng để so sánh bằng, còn = là phép gán.' },
            { q: 'Sau dòng tiêu đề if <điều kiện> trong Python bắt buộc phải có dấu câu nào?', options: ['Dấu hai chấm (:)', 'Dấu chấm phẩy (;)', 'Dấu phẩy (,)', 'Dấu chấm (.)'], ans: 0, exp: 'Mọi cấu trúc khối lệnh trong Python đều kết thúc dòng tiêu đề bằng dấu hai chấm (:).' }
        ]
    },
    {
        id: 'k10_b20', num: 20, topic_id: 'CD5', badge: 'ALGORITHM', difficulty: 'Vận dụng', art: 'numbers',
        title: 'Bài 20: Câu lệnh lặp For',
        summary: 'Cấu trúc vòng lặp với số lần biết trước for i in range(...), cách hoạt động của hàm range(start, stop, step) và bài toán tính tổng.',
        knowledge: `
            <h4>1. Vòng lặp For và hàm range()</h4>
            <ul class="list-disc pl-5 space-y-1">
                <li><code>range(n)</code>: Tạo dãy số nguyên từ <code>0</code> đến <code>n - 1</code>.</li>
                <li><code>range(a, b)</code>: Tạo dãy số nguyên từ <code>a</code> đến <code>b - 1</code>.</li>
                <li><code>range(a, b, step)</code>: Tạo dãy từ <code>a</code> đến <code>b - 1</code> với bước nhảy <code>step</code>.</li>
            </ul>
        `,
        exercise: {
            id: 'py10_03', type: 'ALGORITHM', title: 'Tìm số nguyên tố trong khoảng [a, b]',
            description: 'Viết chương trình nhập hai số tự nhiên a và b (2 <= a <= b <= 1000). In ra tất cả các số nguyên tố trong đoạn [a, b] trên một dòng cách nhau bởi dấu cách.',
            sample_in: '10 30', sample_out: '11 13 17 19 23 29',
            starter_code: 'import math\ndef is_prime(n):\n    if n < 2: return False\n    for i in range(2, int(math.isqrt(n)) + 1):\n        if n % i == 0: return False\n    return True\n\na, b = map(int, input().split())\nres = [str(x) for x in range(a, b + 1) if is_prime(x)]\nprint(" ".join(res) if res else "KHONG CO")',
            testcases: [
                { input: '10 30', output: '11 13 17 19 23 29', hidden: false },
                { input: '2 10', output: '2 3 5 7', hidden: false },
                { input: '24 28', output: 'KHONG CO', hidden: true }
            ],
            hint: 'Duyệt x trong range(a, b + 1) và kiểm tra tính nguyên tố.'
        },
        regular_quiz: [
            { q: 'Hàm range(2, 10, 2) trong Python tạo ra dãy số nào?', options: ['2, 4, 6, 8', '2, 4, 6, 8, 10', '2, 3, 4, 5, 6, 7, 8, 9', '0, 2, 4, 6, 8'], ans: 0, exp: 'Bắt đầu từ 2, bước nhảy 2 và dừng trước 10 nên gồm: 2, 4, 6, 8.' }
        ]
    },
    {
        id: 'k10_b21', num: 21, topic_id: 'CD5', badge: 'ALGORITHM', difficulty: 'Vận dụng', art: 'prism',
        title: 'Bài 21: Câu lệnh lặp While',
        summary: 'Vòng lặp với số lần chưa biết trước while <điều_kiện>, cách tránh vòng lặp vô hạn và ứng dụng tìm ƯCLN (Thuật toán Euclid).',
        knowledge: `
            <h4>1. Vòng lặp While</h4>
            <p>Lặp lại khối lệnh chừng nào <code>&lt;điều_kiện&gt;</code> còn đúng (<code>True</code>). Cần đảm bảo có câu lệnh làm thay đổi điều kiện để tránh lặp vô hạn.</p>
        `,
        exercise: {
            id: 'ex_b21', type: 'ALGORITHM', title: 'Tìm Ước chung lớn nhất (ƯCLN) của hai số nguyên dương bằng vòng lặp While',
            description: 'Nhập hai số nguyên dương a và b. Sử dụng thuật toán Euclid với vòng lặp while để tìm và in ra Ước chung lớn nhất của a và b.',
            sample_in: '24 36', sample_out: '12',
            starter_code: 'a, b = map(int, input().split())\nwhile b != 0:\n    a, b = b, a % b\nprint(a)',
            testcases: [
                { input: '24 36', output: '12', hidden: false },
                { input: '15 25', output: '5', hidden: false },
                { input: '17 29', output: '1', hidden: true }
            ],
            hint: 'Trong khi b != 0, gán đồng thời a, b = b, a % b.'
        },
        regular_quiz: [
            { q: 'Vòng lặp while kết thúc khi nào?', options: ['Khi biểu thức điều kiện có giá trị False', 'Khi biểu thức điều kiện có giá trị True', 'Sau đúng 10 lần lặp', 'Không bao giờ kết thúc'], ans: 0, exp: 'Khi điều kiện nhận giá trị False thì vòng lặp while dừng lại.' }
        ]
    },
    {
        id: 'k10_b22', num: 22, topic_id: 'CD5', badge: 'ALGORITHM', difficulty: 'Thông hiểu', art: 'timer',
        title: 'Bài 22: Kiểu dữ liệu danh sách (List)',
        summary: 'Cách khởi tạo danh sách A = [...], truy cập phần tử qua chỉ số (index từ 0), hàm len() và duyệt danh sách bằng vòng lặp for.',
        knowledge: `
            <h4>1. Danh sách (List) trong Python</h4>
            <p>Đặt trong cặp ngoặc vuông <code>[ ]</code>. Phần tử đầu tiên có chỉ số <code>0</code>, phần tử cuối cùng có chỉ số <code>len(A) - 1</code> (hoặc <code>-1</code>).</p>
        `,
        exercise: {
            id: 'ex_b22', type: 'ALGORITHM', title: 'Tìm giá trị lớn nhất và tổng các phần tử trong Danh sách',
            description: 'Nhập một dòng gồm các số nguyên cách nhau bởi dấu cách. Đưa vào danh sách A, sau đó in ra Tổng các phần tử và Giá trị lớn nhất cách nhau bởi dấu cách.',
            sample_in: '4 9 2 15 7', sample_out: '37 15',
            starter_code: 'arr = list(map(int, input().split()))\nprint(sum(arr), max(arr))',
            testcases: [
                { input: '4 9 2 15 7', output: '37 15', hidden: false },
                { input: '10 20 30', output: '60 30', hidden: false }
            ],
            hint: 'Sử dụng hàm sum(arr) và max(arr) có sẵn của Python.'
        },
        regular_quiz: [
            { q: 'Cho danh sách A = [10, 20, 30, 40]. Phần tử A[2] có giá trị là bao nhiêu?', options: ['30', '20', '10', '40'], ans: 0, exp: 'Chỉ số tính từ 0: A[0]=10, A[1]=20, A[2]=30.' }
        ]
    },
    {
        id: 'k10_b23', num: 23, topic_id: 'CD5', badge: 'ALGORITHM', difficulty: 'Vận dụng', art: 'code',
        title: 'Bài 23: Một số lệnh làm việc với dữ liệu danh sách',
        summary: 'Các phương thức thao tác trên List: append(), insert(), remove(), pop(), clear(), sort() và toán tử in.',
        knowledge: `
            <h4>1. Các phương thức thông dụng của List</h4>
            <p><code>A.append(x)</code> (thêm vào cuối), <code>A.insert(k, x)</code> (chèn vào vị trí k), <code>A.remove(x)</code> (xóa giá trị x đầu tiên), <code>A.sort()</code> (sắp xếp tăng dần).</p>
        `,
        exercise: {
            id: 'ex_b23', type: 'ALGORITHM', title: 'Sắp xếp danh sách điểm số theo thứ tự tăng dần',
            description: 'Nhập một dãy số nguyên trên một dòng. Sắp xếp dãy theo thứ tự không giảm bằng phương thức .sort() và in ra các phần tử cách nhau bởi dấu cách.',
            sample_in: '9 3 7 1 5', sample_out: '1 3 5 7 9',
            starter_code: 'arr = list(map(int, input().split()))\narr.sort()\nprint(*(arr))',
            testcases: [
                { input: '9 3 7 1 5', output: '1 3 5 7 9', hidden: false },
                { input: '10 2 8 4', output: '2 4 8 10', hidden: false }
            ],
            hint: 'Gọi arr.sort() rồi in bằng print(*arr).'
        },
        regular_quiz: [
            { q: 'Phương thức nào dùng để thêm một phần tử mới vào CUỐI danh sách A trong Python?', options: ['A.append(x)', 'A.remove(x)', 'A.clear()', 'A.pop(0)'], ans: 0, exp: 'append(x) luôn thêm phần tử x vào cuối danh sách.' }
        ]
    },
    {
        id: 'k10_b24', num: 24, topic_id: 'CD5', badge: 'ALGORITHM', difficulty: 'Thông hiểu', art: 'code',
        title: 'Bài 24: Xâu kí tự (String)',
        summary: 'Khái niệm xâu kí tự trong Python, cách truy cập kí tự theo chỉ số, phép nối xâu (+), lặp xâu (*) và tính bất biến của xâu.',
        knowledge: `
            <h4>1. Đặc điểm của Xâu kí tự (str)</h4>
            <p>Xâu kí tự được đặt trong cặp nháy đơn <code>'...'</code> hoặc nháy kép <code>"..."</code>. Xâu trong Python có tính <strong>bất biến (immutable)</strong> — không thể gán trực tiếp <code>s[0] = 'A'</code>.</p>
        `,
        exercise: {
            id: 'ex_b24', type: 'ALGORITHM', title: 'Đảo ngược xâu kí tự và kiểm tra Xâu đối xứng (Palindrome)',
            description: 'Nhập một xâu kí tự S. Nếu S đọc xuôi hay đọc ngược đều giống nhau (S == S[::-1]) thì in "DOI XUNG", ngược lại in "KHONG DOI XUNG".',
            sample_in: 'MADAM', sample_out: 'DOI XUNG',
            starter_code: 's = input().strip()\nprint("DOI XUNG" if s == s[::-1] else "KHONG DOI XUNG")',
            testcases: [
                { input: 'MADAM', output: 'DOI XUNG', hidden: false },
                { input: 'PYTHON', output: 'KHONG DOI XUNG', hidden: false }
            ],
            hint: 'Sử dụng cú pháp cắt xâu s[::-1] để lấy xâu đảo ngược.'
        },
        regular_quiz: [
            { q: 'Cho xâu s = "TinHoc". Biểu thức len(s) trả về giá trị nào?', options: ['6', '5', '7', '0'], ans: 0, exp: 'Xâu "TinHoc" gồm 6 kí tự.' }
        ]
    },
    {
        id: 'k10_b25', num: 25, topic_id: 'CD5', badge: 'ALGORITHM', difficulty: 'Vận dụng', art: 'code',
        title: 'Bài 25: Một số lệnh làm việc với xâu kí tự',
        summary: 'Các phương thức xử lí xâu: find(), split(), join(), upper(), lower(), isupper(), islower(), isdigit() và bài toán chuẩn hoá xâu.',
        knowledge: `
            <h4>1. Cặp lệnh tách và nối xâu: split() và join()</h4>
            <p><code>s.split()</code> tách xâu theo khoảng trắng thành một danh sách (List) các từ. <code>" ".join(L)</code> nối các phần tử trong danh sách L thành một xâu.</p>
        `,
        exercise: {
            id: 'py10_04', type: 'ALGORITHM', title: 'Đếm và xử lý xâu ký tự (Hoa, Thường, Chữ số)',
            description: 'Viết chương trình nhập vào một xâu ký tự S. Đếm xem trong xâu có bao nhiêu chữ cái in hoa, bao nhiêu chữ cái in thường và bao nhiêu chữ số.',
            sample_in: 'TinHoc10_GDPT2018', sample_out: 'Hoa: 8\nThuong: 3\nSo: 6',
            starter_code: 's = input()\nupper_count = sum(1 for c in s if c.isupper())\nlower_count = sum(1 for c in s if c.islower())\ndigit_count = sum(1 for c in s if c.isdigit())\nprint(f"Hoa: {upper_count}")\nprint(f"Thuong: {lower_count}")\nprint(f"So: {digit_count}")',
            testcases: [
                { input: 'TinHoc10_GDPT2018', output: 'Hoa: 8\nThuong: 3\nSo: 6', hidden: false },
                { input: 'Hello World 123!', output: 'Hoa: 2\nThuong: 8\nSo: 3', hidden: false }
            ],
            hint: 'Dùng các phương thức .isupper(), .islower(), .isdigit().'
        },
        regular_quiz: [
            { q: 'Kết quả của lệnh "ha noi viet nam".split() là gì?', options: ['["ha", "noi", "viet", "nam"]', '"hanoivietnam"', '4', 'Lỗi cú pháp'], ans: 0, exp: 'split() không đối số sẽ tách xâu tại các khoảng trắng và trả về danh sách các từ.' }
        ]
    },
    {
        id: 'k10_b26', num: 26, topic_id: 'CD5', badge: 'ALGORITHM', difficulty: 'Thông hiểu', art: 'prism',
        title: 'Bài 26: Hàm trong Python',
        summary: 'Khái niệm chương trình con (Hàm), cách định nghĩa hàm bằng từ khoá def, câu lệnh return trả về giá trị và lợi ích của việc dùng hàm.',
        knowledge: `
            <h4>1. Cú pháp định nghĩa hàm trong Python</h4>
            <pre class="bg-slate-900 text-emerald-300 p-3 rounded-xl mt-2 text-xs font-mono">def ten_ham(danh_sach_tham_so):\n    &lt;các_câu_lệnh&gt;\n    return &lt;giá_trị_trả_về&gt;</pre>
        `,
        exercise: {
            id: 'ex_b26', type: 'ALGORITHM', title: 'Viết hàm tinh_giai_thua(n) tính N! (Giai thừa)',
            description: 'Viết hàm tính giai thừa của số tự nhiên N (0 <= N <= 12), biết 0! = 1 và N! = 1 * 2 * ... * N. Nhập N và in ra kết quả.',
            sample_in: '5', sample_out: '120',
            starter_code: 'def tinh_giai_thua(n):\n    res = 1\n    for i in range(1, n + 1):\n        res *= i\n    return res\n\nn = int(input())\nprint(tinh_giai_thua(n))',
            testcases: [
                { input: '5', output: '120', hidden: false },
                { input: '0', output: '1', hidden: false },
                { input: '6', output: '720', hidden: true }
            ],
            hint: 'Dùng vòng lặp nhân dồn từ 1 đến n bên trong hàm.'
        },
        regular_quiz: [
            { q: 'Từ khoá nào trong Python được dùng để bắt đầu định nghĩa một hàm mới?', options: ['def', 'function', 'func', 'procedure'], ans: 0, exp: 'Từ khoá def (define) dùng để khai báo hàm trong Python.' }
        ]
    },
    {
        id: 'k10_b27', num: 27, topic_id: 'CD5', badge: 'ALGORITHM', difficulty: 'Thông hiểu', art: 'timer',
        title: 'Bài 27: Tham số của hàm',
        summary: 'Phân biệt Tham số hình thức (Parameter) khi khai báo hàm và Đối số thực tế (Argument) khi gọi hàm.',
        knowledge: `
            <h4>1. Tham số (Parameter) và Đối số (Argument)</h4>
            <p>Khi định nghĩa <code>def tong(a, b):</code> thì <code>a, b</code> là <strong>tham số</strong>. Khi gọi hàm <code>tong(3, 5)</code> thì <code>3, 5</code> được truyền vào gọi là <strong>đối số</strong>.</p>
        `,
        exercise: {
            id: 'ex_b27', type: 'ALGORITHM', title: 'Viết hàm lũy thừa luy_thua(x, k) với tham số truyền vào',
            description: 'Định nghĩa hàm luy_thua(x, k) trả về x mũ k. Nhập hai số nguyên x và k trên một dòng, gọi hàm và in kết quả.',
            sample_in: '2 10', sample_out: '1024',
            starter_code: 'def luy_thua(x, k):\n    return x ** k\n\nx, k = map(int, input().split())\nprint(luy_thua(x, k))',
            testcases: [
                { input: '2 10', output: '1024', hidden: false },
                { input: '3 4', output: '81', hidden: false }
            ],
            hint: 'Trả về x ** k trong thân hàm.'
        },
        regular_quiz: [
            { q: 'Trong lời gọi hàm max(12, 45), hai giá trị 12 và 45 được gọi là gì?', options: ['Các đối số (Arguments)', 'Các từ khoá', 'Kiểu dữ liệu', 'Tên hàm'], ans: 0, exp: 'Giá trị thực tế truyền vào khi gọi hàm được gọi là đối số (argument).' }
        ]
    },
    {
        id: 'k10_b28', num: 28, topic_id: 'CD5', badge: 'ALGORITHM', difficulty: 'Thông hiểu', art: 'numbers',
        title: 'Bài 28: Phạm vi của biến',
        summary: 'Phân biệt Biến cục bộ (Local variable) khai báo bên trong hàm và Biến toàn cục (Global variable) cùng từ khoá global.',
        knowledge: `
            <h4>1. Biến cục bộ và Biến toàn cục</h4>
            <p>Biến được tạo bên trong hàm chỉ có tác dụng trong thân hàm đó (<strong>biến cục bộ</strong>). Muốn tác động trực tiếp lên biến toàn cục bên ngoài, ta khai báo từ khoá <code>global &lt;tên_biến&gt;</code>.</p>
        `,
        exercise: {
            id: 'ex_b28', type: 'ALGORITHM', title: 'Minh hoạ phạm vi biến cục bộ và biến toàn cục',
            description: 'Nhập số nguyên X. Viết hàm tang_gap_doi(n) trả về 2 * n mà không làm thay đổi X ban đầu. In ra X ban đầu và giá trị trả về của hàm cách nhau 1 dấu cách.',
            sample_in: '15', sample_out: '15 30',
            starter_code: 'def tang_gap_doi(n):\n    local_val = n * 2\n    return local_val\n\nx = int(input())\nprint(x, tang_gap_doi(x))',
            testcases: [
                { input: '15', output: '15 30', hidden: false },
                { input: '7', output: '7 14', hidden: false }
            ],
            hint: 'Biến local_val trong hàm không làm thay đổi biến x bên ngoài.'
        },
        regular_quiz: [
            { q: 'Từ khoá nào cho phép sửa đổi trực tiếp giá trị của một biến toàn cục bên trong thân hàm Python?', options: ['global', 'local', 'public', 'static'], ans: 0, exp: 'Từ khoá global khai báo biến sử dụng phạm vi toàn cục.' }
        ]
    },
    {
        id: 'k10_b29', num: 29, topic_id: 'CD5', badge: 'ALGORITHM', difficulty: 'Thông hiểu', art: 'prism',
        title: 'Bài 29: Nhận biết lỗi chương trình',
        summary: 'Phân loại 3 nhóm lỗi thường gặp khi lập trình Python: Lỗi cú pháp (SyntaxError), Lỗi ngoại lệ khi chạy (Runtime Exceptions) và Lỗi lôgic.',
        knowledge: `
            <h4>1. Ba loại lỗi chương trình trong Python</h4>
            <ul class="list-disc pl-5 space-y-1">
                <li><strong>SyntaxError (Lỗi cú pháp):</strong> Viết sai quy tắc ngôn ngữ (thiếu dấu <code>:</code>, sai thụt lề <code>IndentationError</code>).</li>
                <li><strong>Exception (Lỗi ngoại lệ khi chạy):</strong> <code>ZeroDivisionError</code> (chia cho 0), <code>IndexError</code> (vượt chỉ số List), <code>ValueError</code>, <code>NameError</code>.</li>
                <li><strong>Logical Error (Lỗi lôgic/ngữ nghĩa):</strong> Chương trình vẫn chạy nhưng cho kết quả sai so với yêu cầu bài toán.</li>
            </ul>
        `,
        exercise: {
            id: 'ex_b29', type: 'ALGORITHM', title: 'Phòng tránh lỗi ZeroDivisionError khi thực hiện phép chia',
            description: 'Nhập hai số nguyên a và b. Nếu b == 0 thì in "LOI CHIA CHO 0", ngược lại in kết quả a / b làm tròn 2 chữ số thập phân.',
            sample_in: '10 0', sample_out: 'LOI CHIA CHO 0',
            starter_code: 'a, b = map(int, input().split())\nif b == 0:\n    print("LOI CHIA CHO 0")\nelse:\n    print(f"{a / b:.2f}")',
            testcases: [
                { input: '10 0', output: 'LOI CHIA CHO 0', hidden: false },
                { input: '10 4', output: '2.50', hidden: false }
            ],
            hint: 'Kiểm tra điều kiện b == 0 trước khi thực hiện phép chia.'
        },
        regular_quiz: [
            { q: 'Khi thực hiện lệnh print(10 / 0) trong Python, chương trình sẽ báo lỗi ngoại lệ nào?', options: ['ZeroDivisionError', 'SyntaxError', 'IndexError', 'TypeError'], ans: 0, exp: 'Chia một số cho 0 gây ra ngoại lệ ZeroDivisionError.' }
        ]
    },
    {
        id: 'k10_b30', num: 30, topic_id: 'CD5', badge: 'ALGORITHM', difficulty: 'Vận dụng', art: 'timer',
        title: 'Bài 30: Kiểm thử và gỡ lỗi chương trình',
        summary: 'Phương pháp thiết kế bộ dữ liệu kiểm thử (Test Cases), theo dõi vết biến (Trace) và công cụ gỡ lỗi (Debugger).',
        knowledge: `
            <h4>1. Kiểm thử chương trình (Testing)</h4>
            <p>Cần xây dựng bộ Test Cases bao phủ cả trường hợp thông thường, <strong>trường hợp biên (Boundary cases)</strong> và trường hợp đặc biệt để phát hiện lỗi lôgic.</p>
        `,
        exercise: {
            id: 'ex_b30', type: 'ALGORITHM', title: 'Sửa lỗi lôgic cho hàm giải phương trình bậc nhất ax + b = 0',
            description: 'Nhập hai số thực a và b của phương trình ax + b = 0. Nếu a == 0 và b == 0 in "VO SO NGHIEM"; nếu a == 0 và b != 0 in "VO NGHIEM"; ngược lại in nghiệm x = -b/a làm tròn 2 chữ số thập phân.',
            sample_in: '2 -8', sample_out: '4.00',
            starter_code: 'a, b = map(float, input().split())\nif a == 0:\n    print("VO SO NGHIEM" if b == 0 else "VO NGHIEM")\nelse:\n    x = -b / a\n    if abs(x) == 0: x = 0.0\n    print(f"{x:.2f}")',
            testcases: [
                { input: '2 -8', output: '4.00', hidden: false },
                { input: '0 5', output: 'VO NGHIEM', hidden: false },
                { input: '0 0', output: 'VO SO NGHIEM', hidden: true }
            ],
            hint: 'Xét riêng trường hợp biên a == 0 trước khi chia -b / a.'
        },
        regular_quiz: [
            { q: 'Mục đích chính của việc chạy bộ dữ liệu kiểm thử (Test Cases) là gì?', options: ['Phát hiện lỗi lôgic và kiểm tra độ đúng đắn ở các trường hợp biên', 'Làm cho máy tính chạy nhanh hơn', 'Tăng dung lượng ổ cứng', 'Thay thế hoàn toàn người lập trình'], ans: 0, exp: 'Kiểm thử giúp phát hiện các trường hợp chương trình xử lí sai.' }
        ]
    },
    {
        id: 'k10_b31', num: 31, topic_id: 'CD5', badge: 'ALGORITHM', difficulty: 'Vận dụng', art: 'code',
        title: 'Bài 31: Thực hành viết chương trình đơn giản',
        summary: 'Phân tích bài toán thực tế, chia nhỏ thành các bước giải quyết vấn đề và viết chương trình Python hoàn chỉnh.',
        knowledge: `
            <h4>1. Quy trình giải bài toán trên máy tính</h4>
            <p>Bước 1: Xác định Input / Output ➔ Bước 2: Thiết kế thuật toán ➔ Bước 3: Viết chương trình Python ➔ Bước 4: Kiểm thử và hiệu chỉnh.</p>
        `,
        exercise: {
            id: 'ex_b31', type: 'ALGORITHM', title: 'Tính tiền điện sinh hoạt theo bậc thang tiêu thụ',
            description: 'Nhập số kWh điện tiêu thụ N (N >= 0). Nếu N <= 50 giá 1500đ/kWh; phần vượt trên 50 kWh tính giá 2000đ/kWh. Hãy tính và in ra tổng số tiền điện phải trả.',
            sample_in: '70', sample_out: '115000',
            starter_code: 'n = int(input())\nif n <= 50:\n    tien = n * 1500\nelse:\n    tien = 50 * 1500 + (n - 50) * 2000\nprint(tien)',
            testcases: [
                { input: '70', output: '115000', hidden: false },
                { input: '40', output: '60000', hidden: false }
            ],
            hint: 'Với N = 70: 50 số đầu = 75000, 20 số tiếp = 40000 => Tổng = 115000.'
        },
        regular_quiz: [
            { q: 'Bước đầu tiên khi giải một bài toán tin học trên máy tính là gì?', options: ['Xác định bài toán (Input và Output)', 'Gõ code ngay lập tức', 'Đóng gói phần mềm', 'Nâng cấp màn hình'], ans: 0, exp: 'Phải xác định rõ dữ liệu đầu vào (Input) và kết quả cần tìm (Output) trước tiên.' }
        ]
    },
    {
        id: 'k10_b32', num: 32, topic_id: 'CD5', badge: 'ALGORITHM', difficulty: 'Vận dụng cao', art: 'numbers',
        title: 'Bài 32: Ôn tập lập trình Python',
        summary: 'Tổng hợp toàn bộ kiến thức Chủ đề 5: Rẽ nhánh, Vòng lặp, Danh sách (List), Xâu kí tự (String) và Chương trình con (Hàm).',
        knowledge: `
            <h4>1. Tổng kết kiến thức cốt lõi Python Lớp 10</h4>
            <p>Kết hợp nhuần nhuyễn cấu trúc dữ liệu <code>list</code>, <code>str</code> cùng hàm <code>def</code> để giải quyết các bài toán tổng hợp trong đề thi định kỳ.</p>
        `,
        exercise: {
            id: 'ex_b32', type: 'ALGORITHM', title: 'Thống kê số lượng số chẵn và tính tổng số chẵn trong dãy',
            description: 'Nhập một dãy các số nguyên trên một dòng. Hãy đếm xem có bao nhiêu số chẵn và tính tổng các số chẵn đó. In ra: "<SoLuong> <Tong>".',
            sample_in: '2 5 8 11 6 3', sample_out: '3 16',
            starter_code: 'arr = list(map(int, input().split()))\nevens = [x for x in arr if x % 2 == 0]\nprint(len(evens), sum(evens))',
            testcases: [
                { input: '2 5 8 11 6 3', output: '3 16', hidden: false },
                { input: '1 3 5', output: '0 0', hidden: false }
            ],
            hint: 'Lọc các phần tử chia hết cho 2 (x % 2 == 0).'
        },
        regular_quiz: [
            { q: 'Cấu trúc dữ liệu nào trong Python cho phép lưu trữ một dãy các phần tử có thể thay đổi (mutable) thông qua chỉ số?', options: ['list', 'str', 'int', 'float'], ans: 0, exp: 'Kiểu list cho phép thêm, sửa, xóa phần tử linh hoạt.' }
        ]
    },

    // ==================== CHỦ ĐỀ 6: HƯỚNG NGHIỆP (BÀI 33 -> BÀI 34) ====================
    {
        id: 'k10_b33', num: 33, topic_id: 'CD6', badge: 'CHỦ ĐỀ 6', difficulty: 'Nhận biết', art: 'prism',
        title: 'Bài 33: Nghề thiết kế đồ hoạ máy tính',
        summary: 'Tìm hiểu công việc, yêu cầu kiến thức, kĩ năng và nhu cầu nhân lực của nghề Thiết kế đồ hoạ trên máy tính (Graphic Designer).',
        knowledge: `
            <h4>1. Nghề Thiết kế đồ hoạ máy tính</h4>
            <p>Người làm nghề thiết kế đồ hoạ kết hợp khả năng sáng tạo thẩm mĩ với công cụ phần mềm (Inkscape, Illustrator, Photoshop, Figma) để tạo ra bộ nhận diện thương hiệu, ấn phẩm truyền thông, giao diện số.</p>
        `,
        exercise: {
            id: 'ex_b33', type: 'ALGORITHM', title: 'Tính tổng chi phí dự án Thiết kế bộ nhận diện thương hiệu',
            description: 'Một dự án thiết kế gồm N hạng mục, mỗi hạng mục có đơn giá P (nghìn đồng). Hãy tính tổng chi phí N * P.',
            sample_in: '5 1200', sample_out: '6000',
            starter_code: 'n, p = map(int, input().split())\nprint(n * p)',
            testcases: [
                { input: '5 1200', output: '6000', hidden: false }
            ],
            hint: 'Nhân số lượng hạng mục N với đơn giá P.'
        },
        regular_quiz: [
            { q: 'Kĩ năng nào sau đây là quan trọng nhất đối với người làm nghề Thiết kế đồ hoạ máy tính?', options: ['Tư duy thẩm mĩ sáng tạo và thành thạo phần mềm đồ hoạ', 'Sửa chữa phần cứng máy cày', 'Hàn mạch điện cao thế', 'Lái xe tải hạng nặng'], ans: 0, exp: 'Thiết kế đồ hoạ đòi hỏi khiếu thẩm mĩ và kĩ năng sử dụng công cụ đồ hoạ số.' }
        ]
    },
    {
        id: 'k10_b34', num: 34, topic_id: 'CD6', badge: 'CHỦ ĐỀ 6', difficulty: 'Nhận biết', art: 'code',
        title: 'Bài 34: Nghề phát triển phần mềm',
        summary: 'Tìm hiểu các công việc trong quy trình phát triển phần mềm (Phân tích hệ thống, Lập trình viên, Kiểm thử viên Tester, Quản trị dự án).',
        knowledge: `
            <h4>1. Các vị trí nghề nghiệp trong Phát triển phần mềm</h4>
            <ul class="list-disc pl-5 space-y-1">
                <li><strong>Business Analyst / System Analyst:</strong> Khảo sát yêu cầu và phân tích thiết kế hệ thống.</li>
                <li><strong>Software Developer (Lập trình viên):</strong> Viết mã nguồn xây dựng phần mềm, ứng dụng Web/Mobile/AI.</li>
                <li><strong>Software Tester / QA:</strong> Kiểm thử chất lượng và phát hiện lỗi phần mềm.</li>
            </ul>
        `,
        exercise: {
            id: 'ex_b34', type: 'ALGORITHM', title: 'Đánh giá năng suất hoàn thành tính năng của Đội phát triển phần mềm',
            description: 'Một nhóm phát triển phần mềm cần hoàn thành M tính năng. Hiện tại nhóm đã làm xong K tính năng. Hãy tính tỉ lệ phần trăm hoàn thành (K / M * 100) làm tròn 1 chữ số thập phân.',
            sample_in: '20 15', sample_out: '75.0%',
            starter_code: 'm, k = map(int, input().split())\nprint(f"{(k / m) * 100:.1f}%")',
            testcases: [
                { input: '20 15', output: '75.0%', hidden: false },
                { input: '10 10', output: '100.0%', hidden: false }
            ],
            hint: 'Tính (k / m) * 100 và định dạng in kèm kí hiệu %.'
        },
        regular_quiz: [
            { q: 'Trong quy trình phát triển phần mềm, ai là người chịu trách nhiệm chính trong việc chạy các kịch bản kiểm thử để tìm lỗi trước khi bàn giao?', options: ['Kiểm thử viên phần mềm (Tester / QA)', 'Nhân viên bảo vệ', 'Kế toán trưởng', 'Nhân viên lễ tân'], ans: 0, exp: 'Kiểm thử viên (Tester/QA) chuyên trách kiểm tra chất lượng và phát hiện lỗi.' }
        ]
    }
];

window.KNTT10_LESSONS = [];
window.ALL_GRADE_LESSONS = { '10': [], '11': [], '12': [], '13': [] };
window.ACTIVE_LESSON_ID = 'k10_b16';
window.CURRENT_TOPIC_FILTER = 'ALL';
window.ADMIN_SELECTED_GRADE = '10';
window.ADMIN_SELECTED_CLASS = '10A1';
window.ADMIN_SELECTED_LESSON_ID = 'k10_b16';
window.ADMIN_EDITING_REGQUIZ_INDEX = -1;
window.ADMIN_EDITING_PERIODIC_PART = null;
window.ADMIN_EDITING_PERIODIC_INDEX = -1;

// Danh mục Bài học chuẩn cho Khối 11, Khối 12 và Khối 13 (Bồi dưỡng HSG & Chuyên đề mở rộng)
const GRADE_11_12_13_LESSONS_DEFAULT = {
    '11': [
        { id: 'k11_b01', grade: 11, num: 1, topic_id: 'G11_T1', badge: 'CHỦ ĐỀ 1', difficulty: 'Nhận biết', title: 'Bài 1: Hệ điều hành và Phần mềm nguồn mở', summary: 'Lịch sử phát triển hệ điều hành, phần mềm thương mại và phần mềm nguồn mở.', knowledge: '<h4>1. Hệ điều hành</h4><p>Quản lý tài nguyên phần cứng, giao tiếp với người dùng.</p>', exercise: { id: 'py11_01', title: 'Kiểm tra dung lượng bộ nhớ trống', type: 'ALGORITHM', description: 'Nhập tổng dung lượng RAM (GB) và dung lượng đang dùng. In ra dung lượng còn trống.', sample_in: '16 6', sample_out: '10', starter_code: 'total, used = map(int, input().split())\nprint(total - used)' }, regular_quiz: [{ q: 'Hệ điều hành nào sau đây là phần mềm nguồn mở?', options: ['Windows 11', 'Ubuntu Linux', 'macOS', 'iOS'], ans: 1, exp: 'Ubuntu Linux là hệ điều hành mã nguồn mở.' }] },
        { id: 'k11_b02', grade: 11, num: 2, topic_id: 'G11_T1', badge: 'CHỦ ĐỀ 1', difficulty: 'Thông hiểu', title: 'Bài 2: Bên trong máy tính (CPU, RAM, ROM & Cổng logic)', summary: 'Cấu trúc bộ xử lý trung tâm CPU, bộ nhớ trong và các mạch logic AND, OR, NOT, XOR.', knowledge: '<h4>1. Các cổng logic cơ bản</h4><p>Cổng AND, OR, NOT, XOR và phép cộng trên hệ nhị phân.</p>', exercise: { id: 'py11_02', title: 'Mô phỏng phép toán cổng XOR nhị phân', type: 'ALGORITHM', description: 'Nhập hai bit nhị phân x, y (0 hoặc 1). In ra kết quả x XOR y.', sample_in: '1 0', sample_out: '1', starter_code: 'x, y = map(int, input().split())\nprint(x ^ y)' }, regular_quiz: [{ q: 'Phép cộng nhị phân 1 + 1 bằng bao nhiêu?', options: ['1', '10', '11', '0'], ans: 1, exp: 'Trong hệ nhị phân, 1 + 1 = 10.' }] },
        { id: 'k11_b03', grade: 11, num: 3, topic_id: 'G11_T3', badge: 'SQL', difficulty: 'Thông hiểu', title: 'Bài 3: Khái niệm Hệ Cơ sở dữ liệu & Mô hình Quan hệ', summary: 'Bảng (Table), Bản ghi (Row/Tuple), Trường (Column), Khóa chính (Primary Key) và Khóa ngoại.', knowledge: '<h4>1. Mô hình dữ liệu quan hệ</h4><p>Dữ liệu được tổ chức thành các bảng 2 chiều gồm hàng và cột.</p>', exercise: { id: 'cs11_sql_01', title: 'Truy vấn danh sách học sinh Giỏi bằng SQL', type: 'SQL', description: 'Viết câu lệnh SELECT MaHS, HoTen, DiemTB FROM HOCSINH WHERE DiemTB >= 8.0 ORDER BY DiemTB DESC;', sample_in: 'HOCSINH(MaHS, HoTen, Lop, DiemTB)', sample_out: 'HS03 | Le Hoang Cuong | 9.0', starter_code: 'SELECT MaHS, HoTen, DiemTB\nFROM HOCSINH\nWHERE DiemTB >= 8.0\nORDER BY DiemTB DESC;' }, regular_quiz: [{ q: 'Khóa chính (Primary Key) của bảng có đặc điểm gì?', options: ['Được phép trùng lặp', 'Được phép để trống (NULL)', 'Xác định duy nhất mỗi bản ghi và không được NULL', 'Chỉ chứa kiểu số'], ans: 2, exp: 'Khóa chính bắt buộc duy nhất và NOT NULL.' }] },
        { id: 'k11_b04', grade: 11, num: 4, topic_id: 'G11_T3', badge: 'SQL', difficulty: 'Vận dụng', title: 'Bài 4: Ngôn ngữ truy vấn SQL (SELECT, WHERE, JOIN, GROUP BY)', summary: 'Cú pháp truy vấn dữ liệu từ một hoặc nhiều bảng liên kết bằng INNER JOIN.', knowledge: '<h4>1. Truy vấn SQL</h4><p>Cấu trúc SELECT ... FROM ... WHERE ... GROUP BY ... ORDER BY ...</p>', exercise: { id: 'py11_04', title: 'Đếm số bản ghi thỏa điều kiện điểm chuẩn', type: 'ALGORITHM', description: 'Nhập N điểm số trên một dòng. Đếm số lượng điểm >= 8.0.', sample_in: '7.5 8.0 9.2 6.5 8.5', sample_out: '3', starter_code: 'arr = list(map(float, input().split()))\nprint(sum(1 for x in arr if x >= 8.0))' }, regular_quiz: [{ q: 'Mệnh đề nào dùng để lọc các bản ghi trong SQL?', options: ['ORDER BY', 'WHERE', 'SELECT', 'FROM'], ans: 1, exp: 'WHERE dùng để lọc các dòng thỏa điều kiện.' }] },
        { id: 'k11_b05', grade: 11, num: 5, topic_id: 'G11_T6', badge: 'ALGORITHM', difficulty: 'Thông hiểu', title: 'Bài 5: Kỹ thuật Thiết kế Thuật toán & Đệ quy', summary: 'Thiết kế thuật toán từ trên xuống, hàm đệ quy và bài toán tính giai thừa, dãy Fibonacci.', knowledge: '<h4>1. Đệ quy (Recursion)</h4><p>Hàm tự gọi lại chính nó với kích thước bài toán nhỏ hơn và có điều kiện dừng.</p>', exercise: { id: 'py11_05', title: 'Tính số Fibonacci thứ N bằng đệ quy có nhớ', type: 'ALGORITHM', description: 'Nhập số nguyên N (1 <= N <= 35). In ra số Fibonacci thứ N (F1=1, F2=1).', sample_in: '7', sample_out: '13', starter_code: 'n = int(input())\na, b = 1, 1\nfor _ in range(n - 1):\n    a, b = b, a + b\nprint(a)' }, regular_quiz: [{ q: 'Thành phần bắt buộc phải có trong hàm đệ quy là gì?', options: ['Vòng lặp while', 'Phần cơ sở (Điều kiện dừng)', 'Biến toàn cục', 'Mảng 2 chiều'], ans: 1, exp: 'Thiếu điều kiện dừng sẽ gây đệ quy vô hạn.' }] },
        { id: 'k11_b06', grade: 11, num: 6, topic_id: 'G11_T6', badge: 'ALGORITHM', difficulty: 'Vận dụng', title: 'Bài 6: Thuật toán Tìm kiếm tuần tự & Tìm kiếm nhị phân', summary: 'So sánh tìm kiếm tuần tự O(N) và tìm kiếm nhị phân O(log N) trên dãy đã sắp xếp.', knowledge: '<h4>1. Tìm kiếm nhị phân (Binary Search)</h4><p>Chia đôi khoảng tìm kiếm ở mỗi bước trên mảng đã sắp xếp.</p>', exercise: { id: 'cs11_algo_01', title: 'Cài đặt Tìm kiếm nhị phân (Binary Search)', type: 'ALGORITHM', description: 'Cho dãy N số tăng dần và số X. Tìm vị trí của X (tính từ 0), nếu không có in -1.', sample_in: '6 7\n1 3 5 7 9 11', sample_out: '3', starter_code: 'n, x = map(int, input().split())\narr = list(map(int, input().split()))\nprint(arr.index(x) if x in arr else -1)' }, regular_quiz: [{ q: 'Độ phức tạp thời gian của Tìm kiếm nhị phân là bao nhiêu?', options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'], ans: 1, exp: 'Mỗi bước chia đôi không gian tìm kiếm nên độ phức tạp là O(log N).' }] },
        { id: 'k11_b07', grade: 11, num: 7, topic_id: 'G11_T6', badge: 'ALGORITHM', difficulty: 'Vận dụng', title: 'Bài 7: Các thuật toán Sắp xếp (Chèn, Chọn, Nổi bọt, Chia để trị)', summary: 'Cài đặt Insertion Sort, Selection Sort, Bubble Sort và QuickSort/MergeSort trong Python.', knowledge: '<h4>1. Các thuật toán sắp xếp cơ bản</h4><p>Sắp xếp nổi bọt, chọn, chèn có độ phức tạp O(N^2); MergeSort và QuickSort đạt O(N log N).</p>', exercise: { id: 'py11_07', title: 'Sắp xếp dãy số tăng dần', type: 'ALGORITHM', description: 'Nhập dãy số nguyên trên 1 dòng. In ra dãy sau khi sắp xếp tăng dần.', sample_in: '9 2 7 1 5', sample_out: '1 2 5 7 9', starter_code: 'arr = sorted(map(int, input().split()))\nprint(*(arr))' }, regular_quiz: [{ q: 'Thuật toán nào sau đây áp dụng chiến lược Chia để trị?', options: ['Bubble Sort', 'Selection Sort', 'Merge Sort', 'Linear Search'], ans: 2, exp: 'Merge Sort và Quick Sort áp dụng Chia để trị.' }] },
        { id: 'k11_b08', grade: 11, num: 8, topic_id: 'G11_T6', badge: 'ALGORITHM', difficulty: 'Thông hiểu', title: 'Bài 8: Kiểm thử và Đánh giá độ phức tạp thuật toán', summary: 'Ký hiệu Big-O, phân tích số phép toán cơ bản và thiết kế bộ test kiểm thử chương trình.', knowledge: '<h4>1. Độ phức tạp thời gian</h4><p>Đánh giá tốc độ tăng số phép toán khi kích thước dữ liệu đầu vào N tăng lên.</p>', exercise: { id: 'py11_08', title: 'Tính tổng cấp số cộng trong O(1)', type: 'ALGORITHM', description: 'Nhập số nguyên dương N (N <= 10^9). Tính tổng 1 + 2 + ... + N bằng công thức O(1).', sample_in: '100', sample_out: '5050', starter_code: 'n = int(input())\nprint(n * (n + 1) // 2)' }, regular_quiz: [{ q: 'Hai vòng lặp for lồng nhau từ 1 đến N có độ phức tạp là:', options: ['O(N)', 'O(log N)', 'O(N^2)', 'O(1)'], ans: 2, exp: 'N * N bước lặp tương ứng O(N^2).' }] }
    ],
    '12': [
        { id: 'k12_b01', grade: 12, num: 1, topic_id: 'G12_T1', badge: 'AI & DATA', difficulty: 'Nhận biết', title: 'Bài 1: Làm quen với Trí tuệ nhân tạo (AI) & Học máy', summary: 'Khái niệm AI hẹp, AI tổng quát, các ứng dụng nhận dạng khuôn mặt, xử lý ngôn ngữ tự nhiên.', knowledge: '<h4>1. Trí tuệ nhân tạo (Artificial Intelligence)</h4><p>Khả năng của hệ thống máy tính thực hiện các công việc mang tính trí tuệ của con người.</p>', exercise: { id: 'py12_01', title: 'Phân loại ngưỡng điểm dự đoán mô hình AI', type: 'ALGORITHM', description: 'Nhập xác suất dự đoán p (0.0 <= p <= 1.0). Nếu p >= 0.5 in POSITIVE, ngược lại in NEGATIVE.', sample_in: '0.78', sample_out: 'POSITIVE', starter_code: 'p = float(input())\nprint("POSITIVE" if p >= 0.5 else "NEGATIVE")' }, regular_quiz: [{ q: 'Ứng dụng nào sau đây là ví dụ điển hình của Trí tuệ nhân tạo?', options: ['Soạn văn bản thuần túy trên Notepad', 'Trợ lý ảo nhận diện giọng nói và dịch tự động', 'Máy tính bỏ túi cộng trừ cơ bản', 'Đồng hồ bấm giờ'], ans: 1, exp: 'Nhận diện giọng nói và dịch tự động sử dụng các mô hình AI.' }] },
        { id: 'k12_b02', grade: 12, num: 2, topic_id: 'G12_T2', badge: 'NETWORK', difficulty: 'Thông hiểu', title: 'Bài 2: Giao thức mạng TCP/IP và Thiết bị mạng (Switch, Router)', summary: 'Chức năng của Router, Switch, Access Point, địa chỉ IPv4/IPv6 và giao thức TCP, IP, HTTP, DNS.', knowledge: '<h4>1. Bộ giao thức TCP/IP</h4><p>IP định tuyến gói tin qua địa chỉ IP; TCP đảm bảo truyền dữ liệu tin cậy.</p>', exercise: { id: 'py12_02', title: 'Kiểm tra tính hợp lệ của địa chỉ IPv4', type: 'ALGORITHM', description: 'Nhập một chuỗi IPv4 gồm 4 số cách nhau bởi dấu chấm. Kiểm tra mỗi số có nằm trong đoạn [0, 255] không.', sample_in: '192.168.1.1', sample_out: 'VALID', starter_code: 'parts = list(map(int, input().split(".")))\nprint("VALID" if len(parts)==4 and all(0<=x<=255 for x in parts) else "INVALID")' }, regular_quiz: [{ q: 'Giao thức nào dùng để phân giải tên miền thành địa chỉ IP?', options: ['FTP', 'SMTP', 'DNS', 'DHCP'], ans: 2, exp: 'DNS (Domain Name System) phân giải tên miền sang địa chỉ IP.' }] },
        { id: 'k12_b03', grade: 12, num: 3, topic_id: 'G12_T4', badge: 'WEB HTML5', difficulty: 'Thông hiểu', title: 'Bài 3: Ngôn ngữ đánh dấu siêu văn bản HTML5 & Cấu trúc trang Web', summary: 'Các thẻ cấu trúc HTML5, danh sách, bảng biểu, chèn đa phương tiện và biểu mẫu (Form).', knowledge: '<h4>1. Cấu trúc văn bản HTML5</h4><p>Sử dụng các thẻ ngữ nghĩa header, nav, main, section, article, footer.</p>', exercise: { id: 'ict11_web_01', title: 'Thiết kế Trang giới thiệu bằng HTML5', type: 'WEB', description: 'Sử dụng các thẻ header, main, section, ul, li, footer để tạo bố cục trang web.', sample_in: 'HTML5 Semantics', sample_out: 'Đạt 6/6 thẻ HTML5', starter_code: '<header><h1>Trang chủ Tin học 12</h1></header>\n<main><section><ul><li>HTML5</li><li>CSS3</li></ul></section></main>\n<footer>THPT Hub</footer>' }, regular_quiz: [{ q: 'Thẻ HTML nào dùng để tạo liên kết siêu văn bản?', options: ['<img>', '<a>', '<div>', '<form>'], ans: 1, exp: 'Thẻ <a href="..."> dùng để tạo liên kết.' }] },
        { id: 'k12_b04', grade: 12, num: 4, topic_id: 'G12_T4', badge: 'WEB CSS3', difficulty: 'Vận dụng', title: 'Bài 4: Định dạng trang Web với CSS3, Box Model & Flexbox', summary: 'Bộ chọn CSS (tag, class, id), mô hình hộp (margin, border, padding) và dàn trang Flexbox.', knowledge: '<h4>1. Bộ chọn CSS</h4><p>Bộ chọn lớp (.class), bộ chọn định danh (#id) và thứ tự ưu tiên trong CSS.</p>', exercise: { id: 'py12_04', title: 'Tính tổng chiều rộng phần tử theo CSS Box Model', type: 'ALGORITHM', description: 'Nhập content_width, padding_left_right, border_left_right. In ra tổng chiều rộng hộp.', sample_in: '300 20 2', sample_out: '344', starter_code: 'w, p, b = map(int, input().split())\nprint(w + 2*p + 2*b)' }, regular_quiz: [{ q: 'Trong CSS, ký hiệu nào bắt đầu cho bộ chọn ID?', options: ['Dấu chấm (.)', 'Dấu thăng (#)', 'Dấu sao (*)', 'Dấu hai chấm (:)'], ans: 1, exp: 'Bộ chọn id sử dụng dấu # (ví dụ #header).' }] },
        { id: 'k12_b05', grade: 12, num: 5, topic_id: 'G12_T5', badge: 'DATA SCIENCE', difficulty: 'Vận dụng', title: 'Bài 5: Khoa học dữ liệu & Phân tích dữ liệu với Python', summary: 'Quy trình khoa học dữ liệu, làm sạch dữ liệu, thống kê mô tả và trực quan hóa dữ liệu.', knowledge: '<h4>1. Quy trình Khoa học dữ liệu</h4><p>Thu thập -> Tiền xử lý -> Phân tích khám phá -> Mô hình hóa -> Trực quan hóa.</p>', exercise: { id: 'py12_05', title: 'Tính Trung bình và Trung vị của tập dữ liệu', type: 'ALGORITHM', description: 'Nhập dãy N số thực. In ra giá trị trung bình cộng (làm tròn 2 chữ số thập phân).', sample_in: '5.0 7.0 9.0 8.0', sample_out: '7.25', starter_code: 'arr = list(map(float, input().split()))\nprint(f"{sum(arr)/len(arr):.2f}")' }, regular_quiz: [{ q: 'Bước đầu tiên trong quy trình Khoa học dữ liệu là gì?', options: ['Vẽ biểu đồ', 'Xác định câu hỏi & Thu thập dữ liệu', 'Triển khai phần cứng', 'Xóa toàn bộ CSDL'], ans: 1, exp: 'Xác định bài toán và thu thập dữ liệu là bước khởi đầu.' }] }
    ],
    '13': [
        { id: 'k13_b01', grade: 13, num: 1, topic_id: 'G13_T1', badge: 'HSG & ÔN THI', difficulty: 'Vận dụng cao', title: 'Chuyên đề 1: Quy hoạch động (Dynamic Programming) Bồi dưỡng HSG', summary: 'Bài toán dãy con tăng dài nhất (LIS), bài toán cái túi (Knapsack) và tối ưu hóa tổ hợp.', knowledge: '<h4>1. Phương pháp Quy hoạch động</h4><p>Chia bài toán thành các bài toán con gối nhau và lưu trữ bảng phương án tối ưu.</p>', exercise: { id: 'py13_01', title: 'Tìm độ dài dãy con tăng dài nhất (LIS)', type: 'ALGORITHM', description: 'Nhập dãy số nguyên trên 1 dòng. Tìm độ dài dãy con tăng nghiêm ngặt dài nhất.', sample_in: '10 9 2 5 3 7 101 18', sample_out: '4', starter_code: 'arr = list(map(int, input().split()))\ndp = [1]*len(arr)\nfor i in range(len(arr)):\n    for j in range(i):\n        if arr[j] < arr[i]: dp[i] = max(dp[i], dp[j]+1)\nprint(max(dp) if dp else 0)' }, regular_quiz: [{ q: 'Đặc trưng cốt lõi của Quy hoạch động so với Chia để trị là gì?', options: ['Không dùng mảng', 'Lưu trữ kết quả các bài toán con gối nhau để tránh tính lại', 'Chỉ áp dụng cho xâu ký tự', 'Luôn có độ phức tạp O(1)'], ans: 1, exp: 'Quy hoạch động lưu bảng kết quả các bài toán con.' }] },
        { id: 'k13_b02', grade: 13, num: 2, topic_id: 'G13_T1', badge: 'HSG & ÔN THI', difficulty: 'Vận dụng cao', title: 'Chuyên đề 2: Lý thuyết Đồ thị (BFS, DFS, Đường đi ngắn nhất Dijkstra)', summary: 'Biểu diễn đồ thị bằng danh sách kề, duyệt chiều rộng BFS, duyệt chiều sâu DFS và Dijkstra.', knowledge: '<h4>1. Duyệt đồ thị BFS & DFS</h4><p>BFS sử dụng hàng đợi (Queue) tìm đường đi ngắn nhất trên đồ thị không trọng số.</p>', exercise: { id: 'py13_02', title: 'Tính tổng bậc của các đỉnh trên đồ thị vô hướng', type: 'ALGORITHM', description: 'Nhập số đỉnh N và số cạnh M. Theo tính chất đồ thị vô hướng, in ra tổng bậc của tất cả các đỉnh (2*M).', sample_in: '5 6', sample_out: '12', starter_code: 'n, m = map(int, input().split())\nprint(2 * m)' }, regular_quiz: [{ q: 'Trong đồ thị vô hướng có M cạnh, tổng bậc của tất cả các đỉnh bằng:', options: ['M', '2 * M', 'M / 2', 'M^2'], ans: 1, exp: 'Mỗi cạnh đóng góp 2 vào tổng bậc của đồ thị vô hướng.' }] },
        { id: 'k13_b03', grade: 13, num: 3, topic_id: 'G13_T1', badge: 'HSG & ÔN THI', difficulty: 'Vận dụng cao', title: 'Chuyên đề 3: Luyện Đề Thi Tốt Nghiệp THPT Quốc Gia Chuẩn BGD 2025', summary: 'Tổng ôn 3 phần: Trắc nghiệm 4 lựa chọn, Đúng/Sai 4 ý (chấm lũy tiến) và Trả lời ngắn.', knowledge: '<h4>1. Cấu trúc Đề thi Tốt nghiệp THPT môn Tin học 2025</h4><p>Phần I: 24 câu trắc nghiệm; Phần II: 4 câu Đúng/Sai (định hướng CS & ICT); Phần III: Trả lời ngắn.</p>', exercise: { id: 'py13_03', title: 'Tính điểm Phần II (Đúng/Sai lũy tiến chuẩn BGD 2025)', type: 'ALGORITHM', description: 'Nhập số ý trả lời đúng k (0 <= k <= 4) trong 1 câu Đúng/Sai. In ra số điểm đạt được (0, 0.1, 0.25, 0.5, 1.0).', sample_in: '3', sample_out: '0.5', starter_code: 'k = int(input())\nscores = {0: 0.0, 1: 0.1, 2: 0.25, 3: 0.5, 4: 1.0}\nprint(scores.get(k, 0.0))' }, regular_quiz: [{ q: 'Trong Phần II (Đúng/Sai) đề thi THPT 2025, trả lời đúng 3/4 ý trong một câu được bao nhiêu điểm?', options: ['0.25 điểm', '0.5 điểm', '0.75 điểm', '1.0 điểm'], ans: 1, exp: 'Quy tắc chấm lũy tiến: 1 ý = 0.1đ; 2 ý = 0.25đ; 3 ý = 0.5đ; 4 ý = 1.0đ.' }] }
    ]
};

function initKntt10LessonsDatabase() {
    const saved = localStorage.getItem('thpt_kntt10_lessons_v1');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length >= 34) {
                window.KNTT10_LESSONS = parsed;
            }
        } catch (e) {}
    }

    if (!window.KNTT10_LESSONS || window.KNTT10_LESSONS.length === 0) {
        window.KNTT10_LESSONS = JSON.parse(JSON.stringify(KNTT10_LESSONS_DEFAULT));
    }

    window.KNTT10_LESSONS.forEach(l => { if (!l.grade) l.grade = 10; });

    // Tải danh sách bài học các Khối 11, 12, 13
    const savedMulti = localStorage.getItem('thpt_multi_grade_lessons_v1');
    let parsedMulti = null;
    if (savedMulti) {
        try { parsedMulti = JSON.parse(savedMulti); } catch (e) {}
    }
    window.ALL_GRADE_LESSONS = {
        '10': window.KNTT10_LESSONS,
        '11': (parsedMulti && Array.isArray(parsedMulti['11']) && parsedMulti['11'].length > 0) ? parsedMulti['11'] : JSON.parse(JSON.stringify(GRADE_11_12_13_LESSONS_DEFAULT['11'])),
        '12': (parsedMulti && Array.isArray(parsedMulti['12']) && parsedMulti['12'].length > 0) ? parsedMulti['12'] : JSON.parse(JSON.stringify(GRADE_11_12_13_LESSONS_DEFAULT['12'])),
        '13': (parsedMulti && Array.isArray(parsedMulti['13']) && parsedMulti['13'].length > 0) ? parsedMulti['13'] : JSON.parse(JSON.stringify(GRADE_11_12_13_LESSONS_DEFAULT['13']))
    };

    // Đồng bộ các bài tập từ 34 bài học sang APP_DATA['k10'] để trình chấm Auto-Judge hoạt động xuyên suốt
    if (typeof APP_DATA !== 'undefined') {
        APP_DATA['k10'] = window.KNTT10_LESSONS.map(les => ({
            id: les.exercise.id || `ex_${les.id}`,
            lesson_id: les.id,
            lesson_title: les.title,
            title: `${les.title} — ${les.exercise.title}`,
            type: les.exercise.type || 'ALGORITHM',
            category: les.badge,
            difficulty: les.difficulty,
            competency: 'NLc',
            description: les.exercise.description,
            input_format: 'Nhập từ luồng chuẩn (Standard Input).',
            sample_in: les.exercise.sample_in,
            sample_out: les.exercise.sample_out,
            starter_code: les.exercise.starter_code,
            testcases: les.exercise.testcases || [
                { input: les.exercise.sample_in, output: les.exercise.sample_out, hidden: false }
            ],
            hint: les.exercise.hint || 'Đọc kỹ phần Kiến thức trọng tâm của bài học.'
        }));
    }

    saveKntt10LessonsToStorage();
    renderTopicFilterPills();
    renderKntt10GridView();
    populateTeacherLessonAuthoringSelect();
    renderAdminLeftLessonTree();
    renderAdminTopHorizontalSelectorBars();
    renderPeriodicExamCrudList();
}

function saveKntt10LessonsToStorage() {
    localStorage.setItem('thpt_kntt10_lessons_v1', JSON.stringify(window.KNTT10_LESSONS));
    if (window.ALL_GRADE_LESSONS) {
        window.ALL_GRADE_LESSONS['10'] = window.KNTT10_LESSONS;
        localStorage.setItem('thpt_multi_grade_lessons_v1', JSON.stringify({
            '11': window.ALL_GRADE_LESSONS['11'] || [],
            '12': window.ALL_GRADE_LESSONS['12'] || [],
            '13': window.ALL_GRADE_LESSONS['13'] || []
        }));
    }
}

function getAllLessonsFlat() {
    const g = window.ALL_GRADE_LESSONS || {};
    return [
        ...(g['10'] || window.KNTT10_LESSONS || []),
        ...(g['11'] || []),
        ...(g['12'] || []),
        ...(g['13'] || [])
    ];
}

function getLessonById(lessonId) {
    const all = getAllLessonsFlat();
    return all.find(l => l.id === lessonId) || (window.KNTT10_LESSONS && window.KNTT10_LESSONS[0]);
}

// ============================================================================
// HÌNH MINH HOẠ VECTOR 3D GÓC DƯỚI PHẢI CHO TỪNG THẺ BÀI HỌC (NHƯ ẢNH MẪU)
// ============================================================================
function getCardCornerIllustrationSvg(artType, idx) {
    const types = ['prism', 'timer', 'numbers', 'code'];
    const kind = artType || types[idx % 4];

    if (kind === 'prism') {
        return `
            <svg viewBox="0 0 90 80" class="w-20 h-16 opacity-90 pointer-events-none select-none">
                <defs>
                    <linearGradient id="pg1_${idx}" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#ec4899" stop-opacity="0.35"/>
                        <stop offset="100%" stop-color="#6366f1" stop-opacity="0.55"/>
                    </linearGradient>
                </defs>
                <polygon points="45,6 82,64 12,68" fill="url(#pg1_${idx})" stroke="#8b5cf6" stroke-width="2"/>
                <line x1="45" y1="6" x2="36" y2="48" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3,2"/>
                <polygon points="45,6 36,48 82,64" fill="#38bdf8" fill-opacity="0.22" stroke="#6366f1" stroke-width="1.5"/>
            </svg>
        `;
    }
    if (kind === 'timer') {
        return `
            <svg viewBox="0 0 96 76" class="w-20 h-16 opacity-90 pointer-events-none select-none">
                <rect x="14" y="18" width="68" height="42" rx="10" transform="rotate(-12 48 39)" fill="#e0e7ff" stroke="#6366f1" stroke-width="2"/>
                <rect x="20" y="24" width="56" height="30" rx="6" transform="rotate(-12 48 39)" fill="#312e81"/>
                <text x="27" y="44" transform="rotate(-12 48 39)" fill="#38bdf8" font-family="JetBrains Mono" font-weight="800" font-size="13">00:00</text>
            </svg>
        `;
    }
    if (kind === 'numbers') {
        return `
            <svg viewBox="0 0 90 80" class="w-20 h-16 opacity-90 pointer-events-none select-none font-mono font-extrabold">
                <text x="15" y="26" fill="#06b6d4" font-size="18">2</text>
                <text x="40" y="22" fill="#8b5cf6" font-size="16">0</text>
                <text x="62" y="30" fill="#ec4899" font-size="18">5</text>
                <text x="22" y="50" fill="#10b981" font-size="20">3</text>
                <text x="48" y="48" fill="#f59e0b" font-size="19">1</text>
                <text x="66" y="56" fill="#6366f1" font-size="16">7</text>
                <text x="34" y="72" fill="#ec4899" font-size="18">4</text>
                <text x="56" y="74" fill="#14b8a6" font-size="17">8</text>
            </svg>
        `;
    }
    return `
        <svg viewBox="0 0 96 80" class="w-20 h-16 opacity-90 pointer-events-none select-none font-sans font-black">
            <text x="12" y="34" fill="#a855f7" font-size="22">A</text>
            <line x1="32" y1="26" x2="54" y2="26" stroke="#38bdf8" stroke-width="3"/>
            <text x="58" y="34" fill="#06b6d4" font-size="22">Z</text>
            <text x="18" y="64" fill="#94a3b8" font-size="20">{</text>
            <circle cx="44" cy="57" r="10" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
            <text x="64" y="64" fill="#94a3b8" font-size="20">}</text>
        </svg>
    `;
}

// ============================================================================
// RENDER THANH LỌC CHỦ ĐỀ & GRIDVIEW 4 CỘT TOÀN BỘ 34 BÀI HỌC TIN HỌC 10 KNTT
// ============================================================================
function renderTopicFilterPills() {
    const bar = document.getElementById('kntt10-topic-filter-bar');
    if (!bar) return;

    bar.innerHTML = KNTT10_TOPICS.map(t => {
        const active = window.CURRENT_TOPIC_FILTER === t.id;
        return `
            <button type="button" onclick="filterKntt10ByTopic('${t.id}')"
                class="px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${active
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md scale-[1.02]'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-400 hover:text-blue-700'}">
                ${t.short}
            </button>
        `;
    }).join('');
}

function filterKntt10ByTopic(topicId) {
    window.CURRENT_TOPIC_FILTER = topicId;
    renderTopicFilterPills();
    renderKntt10GridView();
}

function renderKntt10GridView() {
    const grid = document.getElementById('olm-assigned-tasks-list');
    if (!grid) return;

    const stu = typeof getActiveStudent === 'function' ? getActiveStudent() : null;
    const completedList = (stu && Array.isArray(stu.completed_tasks)) ? stu.completed_tasks : [];
    const searchKw = (document.getElementById('kntt10-search-input')?.value || '').trim().toLowerCase();

    const borderPalettes = [
        { border: 'border-cyan-400/90 hover:border-cyan-500', numBg: 'bg-cyan-50 text-cyan-700 border-cyan-200', glow: 'shadow-cyan-100/60' },
        { border: 'border-orange-300/90 hover:border-orange-400', numBg: 'bg-amber-50 text-amber-700 border-amber-200', glow: 'shadow-orange-100/60' },
        { border: 'border-purple-400/90 hover:border-purple-500', numBg: 'bg-purple-50 text-purple-700 border-purple-200', glow: 'shadow-purple-100/60' },
        { border: 'border-emerald-400/90 hover:border-emerald-500', numBg: 'bg-emerald-50 text-emerald-700 border-emerald-200', glow: 'shadow-emerald-100/60' }
    ];

    const filtered = (window.KNTT10_LESSONS || []).filter(les => {
        const matchTopic = window.CURRENT_TOPIC_FILTER === 'ALL' || les.topic_id === window.CURRENT_TOPIC_FILTER;
        const matchKw = !searchKw || les.title.toLowerCase().includes(searchKw) || les.summary.toLowerCase().includes(searchKw);
        return matchTopic && matchKw;
    });

    grid.innerHTML = filtered.map((les, idx) => {
        const pal = borderPalettes[idx % 4];
        const isDone = completedList.includes(les.id) || completedList.includes(les.exercise?.id);
        const quizLen = Array.isArray(les.regular_quiz) ? les.regular_quiz.length : 0;

        return `
            <div class="relative bg-white/95 rounded-2xl border-2 ${pal.border} p-4 shadow-md ${pal.glow} hover:shadow-xl hover:-translate-y-0.5 transition-all flex flex-col justify-between overflow-hidden min-h-[225px]">
                <!-- Top Row: Number Badge + Tags -->
                <div>
                    <div class="flex items-center gap-1.5 flex-wrap">
                        <span class="w-7 h-7 rounded-lg border ${pal.numBg} font-extrabold text-xs flex items-center justify-center shrink-0">
                            ${les.num}
                        </span>
                        <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 tracking-wide">
                            ${les.badge === 'ALGORITHM' ? 'ALGORITHM' : les.badge}
                        </span>
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                            ${les.difficulty}
                        </span>
                        <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-md ${isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100/90 text-amber-800'} ml-auto">
                            ${isDone ? '✅ Đã hoàn thành' : '🏆 Bài giao cần làm'}
                        </span>
                    </div>

                    <!-- Lesson Title & Description -->
                    <h3 class="font-extrabold text-[15px] text-slate-900 mt-2.5 leading-snug pr-2">
                        ${les.title}
                    </h3>
                    <p class="text-xs text-slate-600 mt-1.5 line-clamp-3 leading-relaxed pr-14">
                        ${les.summary}
                    </p>
                </div>

                <!-- Sub-components pill indicators -->
                <div class="mt-3 pt-2 border-t border-slate-100/90 flex items-center justify-between gap-2 relative z-10">
                    <button type="button" onclick="openUnifiedLessonHub('${les.id}')"
                        class="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all">
                        <span>🚀 Vào làm bài</span>
                    </button>
                    <div class="text-[10px] font-bold text-slate-500 flex flex-col items-end">
                        <span>📖 Lý thuyết • 💻 1 Bài tập</span>
                        <span class="text-indigo-600">⚡ ${quizLen} câu KT thường xuyên</span>
                    </div>
                </div>

                <!-- Decorative 3D Corner SVG Illustration (Exactly like reference screenshot) -->
                <div class="absolute bottom-9 right-1 pointer-events-none">
                    ${getCardCornerIllustrationSvg(les.art, idx)}
                </div>
            </div>
        `;
    }).join('');
}

// ============================================================================
// KHÔNG GIAN HỌC TẬP TRỌN VẸN QUA BÀI HỌC (LÝ THUYẾT + BÀI TẬP + KT THƯỜNG XUYÊN + KT ĐỊNH KỲ)
// ============================================================================
function openUnifiedLessonHub(lessonId, initialMode = 'KNOWLEDGE') {
    const les = getLessonById(lessonId);
    if (!les) return;
    window.ACTIVE_LESSON_ID = les.id;

    // Chuyển sang Tab 2 (Không gian Học bài, Bài tập & Kiểm tra qua Bài học)
    switchTab('judge');

    // Đồng bộ selector bài học trên đầu trang
    const lessonSel = document.getElementById('active-lesson-selector');
    if (lessonSel) {
        lessonSel.innerHTML = (window.KNTT10_LESSONS || []).map(l =>
            `<option value="${l.id}" ${l.id === les.id ? 'selected' : ''}>${l.title} (${l.badge})</option>`
        ).join('');
    }

    // 1. Đổ nội dung Kiến thức trọng tâm của Bài học
    const titleEl = document.getElementById('lesson-hub-title');
    const summaryEl = document.getElementById('lesson-hub-summary');
    const knowEl = document.getElementById('lesson-knowledge-body');
    if (titleEl) titleEl.textContent = les.title;
    if (summaryEl) summaryEl.textContent = les.summary;
    if (knowEl) knowEl.innerHTML = les.knowledge || `<p>${les.summary}</p>`;

    // 2. Đổ bài tập của Bài học vào trình chấm Auto-Judge
    const probIdx = (APP_DATA['k10'] || []).findIndex(p => p.lesson_id === les.id);
    if (probIdx >= 0) {
        currentTrack = 'k10';
        const probSel = document.getElementById('problem-select');
        if (probSel) {
            loadProblemList();
            probSel.value = probIdx;
            loadSelectedProblem();
        }
    }

    // 3. Đổ câu hỏi Kiểm tra thường xuyên (15 phút - ĐĐGtx) của Bài học
    renderLessonRegularQuiz(les);

    switchLessonInnerMode(initialMode);
}

function switchLessonInnerMode(mode) {
    ['KNOWLEDGE', 'EXERCISE', 'REGULAR_QUIZ', 'PERIODIC_LINK'].forEach(m => {
        const panel = document.getElementById(`lesson-mode-panel-${m}`);
        const btn = document.getElementById(`lesson-mode-btn-${m}`);
        if (panel) {
            if (m === mode) panel.classList.remove('hidden');
            else panel.classList.add('hidden');
        }
        if (btn) {
            btn.className = m === mode
                ? 'px-4 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md flex items-center gap-1.5 transition-all'
                : 'px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 transition-all';
        }
    });
}

function renderLessonRegularQuiz(les) {
    const container = document.getElementById('lesson-regular-quiz-container');
    const scoreBadge = document.getElementById('lesson-regular-quiz-score');
    if (!container) return;

    if (scoreBadge) scoreBadge.textContent = 'Chưa nộp bài';
    const quizList = Array.isArray(les.regular_quiz) ? les.regular_quiz : [];

    if (quizList.length === 0) {
        container.innerHTML = `<div class="p-4 rounded-xl bg-slate-50 text-xs text-slate-500">Chưa có câu hỏi kiểm tra thường xuyên cho bài học này.</div>`;
        return;
    }

    container.innerHTML = quizList.map((q, qIdx) => `
        <div class="p-4 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-2.5">
            <div class="font-extrabold text-sm text-slate-900">Câu ${qIdx + 1}: ${q.q}</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                ${(q.options || []).map((opt, oIdx) => `
                    <label class="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl hover:border-blue-400 cursor-pointer">
                        <input type="radio" name="reg_quiz_${les.id}_${qIdx}" value="${oIdx}" class="text-blue-600">
                        <span><strong>${String.fromCharCode(65 + oIdx)}.</strong> ${opt}</span>
                    </label>
                `).join('')}
            </div>
            <div id="reg_quiz_exp_${les.id}_${qIdx}" class="hidden p-2.5 rounded-xl text-xs"></div>
        </div>
    `).join('');
}

async function submitLessonRegularQuiz() {
    const les = getLessonById(window.ACTIVE_LESSON_ID);
    if (!les || !Array.isArray(les.regular_quiz)) return;

    let correct = 0;
    const total = Math.max(1, les.regular_quiz.length);

    les.regular_quiz.forEach((q, qIdx) => {
        const sel = document.querySelector(`input[name="reg_quiz_${les.id}_${qIdx}"]:checked`);
        const expEl = document.getElementById(`reg_quiz_exp_${les.id}_${qIdx}`);
        if (!expEl) return;
        expEl.classList.remove('hidden');

        if (sel && parseInt(sel.value) === Number(q.ans)) {
            correct++;
            expEl.className = 'p-2.5 rounded-xl text-xs bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold';
            expEl.innerHTML = `✔ <strong>Chính xác!</strong> ${q.exp || ''}`;
        } else {
            expEl.className = 'p-2.5 rounded-xl text-xs bg-rose-50 border border-rose-200 text-rose-900 font-semibold';
            expEl.innerHTML = `✖ <strong>Chưa đúng!</strong> Đáp án đúng là <strong>${String.fromCharCode(65 + Number(q.ans))}</strong>. ${q.exp || ''}`;
        }
    });

    const score10 = Number(((correct / total) * 10).toFixed(1));
    const scoreBadge = document.getElementById('lesson-regular-quiz-score');
    if (scoreBadge) {
        scoreBadge.textContent = `Đạt ${score10} / 10.0 điểm (${correct}/${total} câu)`;
        scoreBadge.className = 'px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800';
    }

    if (score10 >= 5.0 && typeof confetti === 'function') {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    }

    // Lưu điểm Kiểm tra thường xuyên vào cột ĐĐGtx1 và đánh dấu hoàn thành bài học
    const stu = typeof getActiveStudent === 'function' ? getActiveStudent() : null;
    if (stu) {
        stu.tx1 = Math.max(Number(stu.tx1 || 0), score10);
        if (!Array.isArray(stu.completed_tasks)) stu.completed_tasks = [];
        if (!stu.completed_tasks.includes(les.id)) stu.completed_tasks.push(les.id);
    }

    if (typeof recordAndSyncStudentSubmission === 'function') {
        await recordAndSyncStudentSubmission({
            problemId: les.id,
            problemTitle: `KT Thường xuyên — ${les.title}`,
            submissionType: 'AUTO_JUDGE',
            verdict: score10 >= 5.0 ? 'AC' : 'PARTIAL',
            score: score10,
            xpAdded: Math.round(score10 * 10)
        });
    }
    renderKntt10GridView();
}

// ============================================================================
// CHỨC NĂNG CHO GIÁO VIÊN: CÂY THƯ MỤC KHỐI 10, 11, 12, 13 BÊN TRÁI + THANH CHỌN NGANG + SOẠN BÀI / NẠP DOCX / SỬA XÓA
// ============================================================================

window.EXPANDED_ADMIN_GRADES = { '10': true, '11': false, '12': false, '13': false };

function toggleAdminTreeGrade(gradeStr) {
    const g = String(gradeStr);
    window.EXPANDED_ADMIN_GRADES[g] = !window.EXPANDED_ADMIN_GRADES[g];
    window.ADMIN_SELECTED_GRADE = g;
    const gradeLessons = (window.ALL_GRADE_LESSONS && window.ALL_GRADE_LESSONS[g]) || [];
    if (gradeLessons.length > 0 && !gradeLessons.some(l => l.id === window.ADMIN_SELECTED_LESSON_ID)) {
        window.ADMIN_SELECTED_LESSON_ID = gradeLessons[0].id;
    }
    renderAdminLeftLessonTree();
    renderAdminTopHorizontalSelectorBars();
    populateTeacherLessonAuthoringSelect();
}

function selectLessonFromAdminTree(lessonId, gradeStr) {
    if (gradeStr) {
        window.ADMIN_SELECTED_GRADE = String(gradeStr);
        window.EXPANDED_ADMIN_GRADES[String(gradeStr)] = true;
    }
    window.ADMIN_SELECTED_LESSON_ID = lessonId;

    // Chuyển sang khu vực biên soạn Bài học & Đề thi nếu đang ở tab khác
    if (typeof switchAdminSubTab === 'function') {
        switchAdminSubTab('curriculum');
    }

    renderAdminLeftLessonTree();
    renderAdminTopHorizontalSelectorBars();

    const sel = document.getElementById('teacher-author-lesson-select');
    if (sel) {
        populateTeacherLessonAuthoringSelect();
        sel.value = lessonId;
    }
    onSelectLessonForTeacherAuthoring(lessonId);

    const studioEl = document.getElementById('teacher-lesson-studio-anchor');
    if (studioEl) {
        studioEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function selectAdminGradeHorizontalPill(gradeStr) {
    const g = String(gradeStr);
    window.ADMIN_SELECTED_GRADE = g;
    window.EXPANDED_ADMIN_GRADES[g] = true;

    const gradeLessons = (window.ALL_GRADE_LESSONS && window.ALL_GRADE_LESSONS[g]) || [];
    if (gradeLessons.length > 0) {
        window.ADMIN_SELECTED_LESSON_ID = gradeLessons[0].id;
    }

    // Đồng bộ bộ lọc Khối ở tất cả các phân hệ Quản trị (không dùng dropdown ẩn)
    const rosterGradeEl = document.getElementById('roster-filter-grade');
    if (rosterGradeEl) rosterGradeEl.value = (g === '10' || g === '11') ? g : 'ALL';
    const gbGradeEl = document.getElementById('gradebook-filter-grade');
    if (gbGradeEl) gbGradeEl.value = (g === '10' || g === '11') ? g : 'ALL';
    const examGradeEl = document.getElementById('exam-cfg-grade-select');
    if (examGradeEl) {
        examGradeEl.value = (g === '10' || g === '11') ? g : 'ALL';
        if (typeof onChangeExamConfigGradeFilter === 'function') onChangeExamConfigGradeFilter();
    }

    renderAdminLeftLessonTree();
    renderAdminTopHorizontalSelectorBars();
    populateTeacherLessonAuthoringSelect();
    if (typeof renderAdminRosterTable === 'function') renderAdminRosterTable();
    if (typeof renderAdminGradebookEditor === 'function') renderAdminGradebookEditor();
}

function selectAdminClassHorizontalPill(classId) {
    window.ADMIN_SELECTED_CLASS = classId;

    // Đồng bộ trực tiếp sang các bộ chọn lớp trong Quản trị
    ['roster-filter-class', 'gradebook-filter-class', 'lab-filter-class', 'exam-cfg-class-select', 'assign-lesson-class-select'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if ([...el.options].some(o => o.value === classId)) {
                el.value = classId;
            }
        }
    });

    if (typeof renderLessonAssignmentManager === 'function') renderLessonAssignmentManager();
    if (typeof onChangeExamConfigClassSelect === 'function') onChangeExamConfigClassSelect();
    if (typeof renderAdminRosterTable === 'function') renderAdminRosterTable();
    if (typeof renderLabHeatmap45 === 'function') renderLabHeatmap45();
    if (typeof renderAdminGradebookEditor === 'function') renderAdminGradebookEditor();

    renderAdminTopHorizontalSelectorBars();
}

function renderAdminTopHorizontalSelectorBars() {
    const gradeBar = document.getElementById('admin-horizontal-grade-pills');
    const classBar = document.getElementById('admin-horizontal-class-pills');

    const gradeMeta = [
        { g: '10', label: 'Khối 10 (34 Bài KNTT)', color: 'from-blue-600 to-indigo-600' },
        { g: '11', label: 'Khối 11 (CS & ICT)', color: 'from-emerald-600 to-teal-600' },
        { g: '12', label: 'Khối 12 (AI, Mạng & Web)', color: 'from-purple-600 to-indigo-600' },
        { g: '13', label: 'Khối 13 (HSG & Luyện Đề THPT)', color: 'from-amber-500 to-orange-600' }
    ];

    if (gradeBar) {
        gradeBar.innerHTML = gradeMeta.map(item => {
            const active = String(window.ADMIN_SELECTED_GRADE) === item.g;
            const count = ((window.ALL_GRADE_LESSONS && window.ALL_GRADE_LESSONS[item.g]) || []).length;
            return `
                <button type="button" onclick="selectAdminGradeHorizontalPill('${item.g}')"
                    class="px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 ${active
                        ? `bg-gradient-to-r ${item.color} text-white shadow-md scale-[1.02]`
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'}">
                    <span>🎓 ${item.label}</span>
                    <span class="px-1.5 py-0.2 rounded-full text-[10px] ${active ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'}">${count} bài</span>
                </button>
            `;
        }).join('');
    }

    if (classBar) {
        const classes = window.CLASSES_LIST || [];
        const allBtnActive = window.ADMIN_SELECTED_CLASS === 'ALL';
        const allBtnHtml = `
            <button type="button" onclick="selectAdminClassHorizontalPill('ALL')"
                class="px-3 py-1.5 rounded-full text-xs font-extrabold transition-all ${allBtnActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300'}">
                🏫 Tất cả các Lớp (${classes.length})
            </button>
        `;
        const classBtnsHtml = classes.map(c => {
            const isAct = window.ADMIN_SELECTED_CLASS === c.id;
            return `
                <button type="button" onclick="selectAdminClassHorizontalPill('${c.id}')"
                    class="px-3 py-1.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-1 ${isAct
                        ? 'bg-emerald-600 text-white shadow-sm scale-[1.02]'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40'}">
                    <span>Lớp ${c.id}</span>
                    <span class="text-[10px] opacity-80">(K${c.grade})</span>
                </button>
            `;
        }).join('');
        classBar.innerHTML = allBtnHtml + classBtnsHtml;
    }

    // Render thêm các dãy nút chọn Lớp ngang ở khu vực Giao bài & Giao đề định kỳ
    const assignClassPills = document.getElementById('assign-lesson-class-pills');
    if (assignClassPills) {
        const curCls = document.getElementById('assign-lesson-class-select')?.value || window.ADMIN_SELECTED_CLASS || '10A1';
        assignClassPills.innerHTML = (window.CLASSES_LIST || []).map(c => {
            const active = c.id === curCls;
            return `
                <button type="button" onclick="document.getElementById('assign-lesson-class-select').value='${c.id}'; selectAdminClassHorizontalPill('${c.id}');"
                    class="px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${active
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-400'}">
                    🏫 Lớp ${c.id} (Khối ${c.grade})
                </button>
            `;
        }).join('');
    }

    const examGradePills = document.getElementById('exam-cfg-grade-pills');
    if (examGradePills) {
        const curG = document.getElementById('exam-cfg-grade-select')?.value || 'ALL';
        const gOpts = [
            { val: 'ALL', label: 'Tất cả Khối' },
            { val: '10', label: 'Khối 10' },
            { val: '11', label: 'Khối 11' },
            { val: '12', label: 'Khối 12' },
            { val: '13', label: 'Khối 13' }
        ];
        examGradePills.innerHTML = gOpts.map(o => `
            <button type="button" onclick="document.getElementById('exam-cfg-grade-select').value='${o.val}'; onChangeExamConfigGradeFilter(); renderAdminTopHorizontalSelectorBars();"
                class="px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all ${curG === o.val
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-400'}">
                ${o.label}
            </button>
        `).join('');
    }

    const examClassPills = document.getElementById('exam-cfg-class-pills');
    if (examClassPills) {
        const curC = document.getElementById('exam-cfg-class-select')?.value || 'ALL';
        const allC = [{ id: 'ALL', label: 'Tất cả Lớp' }, ...(window.CLASSES_LIST || []).map(c => ({ id: c.id, label: `Lớp ${c.id}` }))];
        examClassPills.innerHTML = allC.map(c => `
            <button type="button" onclick="document.getElementById('exam-cfg-class-select').value='${c.id}'; onChangeExamConfigClassSelect(); renderAdminTopHorizontalSelectorBars();"
                class="px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all ${curC === c.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-400'}">
                ${c.label}
            </button>
        `).join('');
    }
}

function renderAdminLeftLessonTree() {
    const treeEl = document.getElementById('admin-left-grade-lesson-tree');
    if (!treeEl) return;

    const gradesInfo = [
        { g: '10', title: 'Khối 10 • Tin học 10 KNTT', badgeClass: 'bg-blue-100 text-blue-800 border-blue-200' },
        { g: '11', title: 'Khối 11 • Định hướng CS & ICT', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
        { g: '12', title: 'Khối 12 • AI, Mạng & Web', badgeClass: 'bg-purple-100 text-purple-800 border-purple-200' },
        { g: '13', title: 'Khối 13 • Bồi dưỡng HSG & Đề BGD', badgeClass: 'bg-amber-100 text-amber-800 border-amber-200' }
    ];

    treeEl.innerHTML = gradesInfo.map(info => {
        const lessons = (window.ALL_GRADE_LESSONS && window.ALL_GRADE_LESSONS[info.g]) || [];
        const isExpanded = !!window.EXPANDED_ADMIN_GRADES[info.g];
        const isCurrentGrade = String(window.ADMIN_SELECTED_GRADE) === info.g;

        const lessonsListHtml = isExpanded ? `
            <div class="mt-1.5 pl-2.5 border-l-2 border-indigo-200 space-y-1 max-h-72 overflow-y-auto pr-1">
                ${lessons.map(les => {
                    const isSelected = les.id === window.ADMIN_SELECTED_LESSON_ID;
                    const qCount = Array.isArray(les.regular_quiz) ? les.regular_quiz.length : 0;
                    return `
                        <button type="button" onclick="selectLessonFromAdminTree('${les.id}', '${info.g}')"
                            class="w-full text-left px-2.5 py-1.5 rounded-xl text-[11px] transition-all flex items-start justify-between gap-1.5 ${isSelected
                                ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
                                : 'bg-white/80 hover:bg-indigo-50 text-slate-700 font-semibold border border-slate-100'}">
                            <span class="line-clamp-2 leading-snug">${les.title}</span>
                            <span class="shrink-0 text-[10px] px-1.5 py-0.2 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}">${qCount} câu</span>
                        </button>
                    `;
                }).join('')}
            </div>
        ` : '';

        return `
            <div class="rounded-2xl border ${isCurrentGrade ? 'border-indigo-300 bg-indigo-50/40' : 'border-slate-200 bg-slate-50/70'} p-2 transition-all">
                <button type="button" onclick="toggleAdminTreeGrade('${info.g}')"
                    class="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-xl text-left font-extrabold text-xs text-slate-900 hover:bg-white/80">
                    <div class="flex items-center gap-1.5">
                        <span class="text-indigo-600 font-mono">${isExpanded ? '▼' : '▶'}</span>
                        <span>${info.title}</span>
                    </div>
                    <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${info.badgeClass}">${lessons.length} bài</span>
                </button>
                ${lessonsListHtml}
            </div>
        `;
    }).join('');
}

function populateTeacherLessonAuthoringSelect() {
    const sel = document.getElementById('teacher-author-lesson-select');
    const g = String(window.ADMIN_SELECTED_GRADE || '10');
    const gradeLessons = (window.ALL_GRADE_LESSONS && window.ALL_GRADE_LESSONS[g]) || window.KNTT10_LESSONS || [];

    if (sel) {
        sel.innerHTML = gradeLessons.map(l =>
            `<option value="${l.id}" ${l.id === window.ADMIN_SELECTED_LESSON_ID ? 'selected' : ''}>[Khối ${l.grade || g} - Bài ${l.num}] ${l.title}</option>`
        ).join('');
    }

    // Hiển thị thêm các pill bài học chọn nhanh không cần mở dropdown
    const quickBar = document.getElementById('teacher-author-lesson-pills');
    if (quickBar) {
        quickBar.innerHTML = gradeLessons.map(l => {
            const active = l.id === window.ADMIN_SELECTED_LESSON_ID;
            return `
                <button type="button" onclick="selectLessonFromAdminTree('${l.id}', '${l.grade || g}')"
                    class="px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${active
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-indigo-50 text-slate-700 border border-slate-200'}">
                    Bài ${l.num}
                </button>
            `;
        }).join('');
    }

    onSelectLessonForTeacherAuthoring(window.ADMIN_SELECTED_LESSON_ID);
}

function onSelectLessonForTeacherAuthoring(forcedLessonId) {
    const sel = document.getElementById('teacher-author-lesson-select');
    const targetId = forcedLessonId || (sel ? sel.value : window.ADMIN_SELECTED_LESSON_ID);
    const les = getLessonById(targetId);
    if (!les) return;

    window.ADMIN_SELECTED_LESSON_ID = les.id;
    window.ADMIN_EDITING_REGQUIZ_INDEX = -1;

    const activeBadge = document.getElementById('teacher-studio-active-lesson-badge');
    if (activeBadge) {
        activeBadge.textContent = `Đang biên soạn: Khối ${les.grade || 10} — ${les.title}`;
    }

    const titleEl = document.getElementById('teacher-lesson-title-input');
    const sumEl = document.getElementById('teacher-lesson-summary');
    const knowEl = document.getElementById('teacher-lesson-knowledge');
    const exTitleEl = document.getElementById('teacher-ex-title');
    const exDiffEl = document.getElementById('teacher-ex-diff');
    const exDescEl = document.getElementById('teacher-ex-desc');
    const exInEl = document.getElementById('teacher-ex-in');
    const exOutEl = document.getElementById('teacher-ex-out');
    const exCodeEl = document.getElementById('teacher-ex-code');

    if (titleEl) titleEl.value = les.title || '';
    if (sumEl) sumEl.value = les.summary || '';
    if (knowEl) knowEl.value = (les.knowledge || '').replace(/<[^>]+>/g, '\n').trim();
    if (les.exercise) {
        if (exTitleEl) exTitleEl.value = les.exercise.title || '';
        if (exDiffEl && les.difficulty) exDiffEl.value = les.difficulty;
        if (exDescEl) exDescEl.value = les.exercise.description || '';
        if (exInEl) exInEl.value = les.exercise.sample_in || '';
        if (exOutEl) exOutEl.value = les.exercise.sample_out || '';
        if (exCodeEl) exCodeEl.value = les.exercise.starter_code || '';
    }

    renderTeacherLessonRegularQuizList(les);
}

// ============================================================================
// SỬA & XÓA CÂU HỎI KIỂM TRA THƯỜNG XUYÊN TRONG BÀI HỌC + NẠP TỪ FILE WORD (.DOCX)
// ============================================================================
function renderTeacherLessonRegularQuizList(lesObj) {
    const les = lesObj || getLessonById(window.ADMIN_SELECTED_LESSON_ID);
    const listContainer = document.getElementById('teacher-lesson-regquiz-list');
    if (!listContainer || !les) return;

    const quizArr = Array.isArray(les.regular_quiz) ? les.regular_quiz : [];
    if (quizArr.length === 0) {
        listContainer.innerHTML = `<div class="p-3 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-400 text-center">Chưa có câu hỏi kiểm tra thường xuyên. Hãy thêm mới hoặc nạp từ file .docx!</div>`;
        return;
    }

    listContainer.innerHTML = quizArr.map((q, idx) => {
        const ansLetter = String.fromCharCode(65 + (Number(q.ans) || 0));
        return `
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-2 text-xs">
                <div class="space-y-0.5 flex-1">
                    <div class="font-bold text-slate-900">Câu ${idx + 1}: ${q.q}</div>
                    <div class="text-[11px] text-slate-600">
                        ${(q.options || []).map((opt, oIdx) => `<span class="${oIdx === Number(q.ans) ? 'text-emerald-700 font-extrabold underline' : ''} mr-2">${String.fromCharCode(65 + oIdx)}. ${opt}</span>`).join('')}
                    </div>
                    <div class="text-[10px] text-indigo-700 font-semibold">✔ Đáp án: ${ansLetter} • ${q.exp || ''}</div>
                </div>
                <div class="flex items-center gap-1 shrink-0">
                    <button type="button" onclick="editTeacherRegularQuizQuestion(${idx})" class="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-extrabold">
                        ✏️ Sửa
                    </button>
                    <button type="button" onclick="deleteTeacherRegularQuizQuestion(${idx})" class="px-2 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 text-[11px] font-extrabold">
                        🗑️ Xóa
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function editTeacherRegularQuizQuestion(qIdx) {
    const les = getLessonById(window.ADMIN_SELECTED_LESSON_ID);
    if (!les || !Array.isArray(les.regular_quiz) || !les.regular_quiz[qIdx]) return;

    const q = les.regular_quiz[qIdx];
    window.ADMIN_EDITING_REGQUIZ_INDEX = qIdx;

    document.getElementById('teacher-regq-text').value = q.q || '';
    document.getElementById('teacher-regq-a').value = (q.options && q.options[0]) || '';
    document.getElementById('teacher-regq-b').value = (q.options && q.options[1]) || '';
    document.getElementById('teacher-regq-c').value = (q.options && q.options[2]) || '';
    document.getElementById('teacher-regq-d').value = (q.options && q.options[3]) || '';
    document.getElementById('teacher-regq-ans').value = String(q.ans ?? 0);
    document.getElementById('teacher-regq-exp').value = q.exp || '';

    const btn = document.getElementById('teacher-regq-submit-btn');
    if (btn) {
        btn.innerHTML = `<span>💾 Cập Nhật Câu Hỏi #${qIdx + 1} Đang Sửa</span>`;
    }
}

function deleteTeacherRegularQuizQuestion(qIdx) {
    const les = getLessonById(window.ADMIN_SELECTED_LESSON_ID);
    if (!les || !Array.isArray(les.regular_quiz)) return;
    if (!confirm(`Bạn có chắc chắn muốn xóa Câu ${qIdx + 1} khỏi Bài kiểm tra thường xuyên của "${les.title}"?`)) return;

    les.regular_quiz.splice(qIdx, 1);
    window.ADMIN_EDITING_REGQUIZ_INDEX = -1;
    saveKntt10LessonsToStorage();
    renderTeacherLessonRegularQuizList(les);
    renderAdminLeftLessonTree();
    renderKntt10GridView();
}

function clearTeacherLessonExercise() {
    const les = getLessonById(window.ADMIN_SELECTED_LESSON_ID);
    if (!les) return;
    if (!confirm(`Xóa nội dung Bài tập thực hành hiện tại của "${les.title}" để soạn lại từ đầu?`)) return;

    document.getElementById('teacher-ex-title').value = '';
    document.getElementById('teacher-ex-desc').value = '';
    document.getElementById('teacher-ex-in').value = '';
    document.getElementById('teacher-ex-out').value = '';
    document.getElementById('teacher-ex-code').value = '# Nhập code mẫu tại đây\n';
}

function saveTeacherLessonContentAndExercise() {
    const les = getLessonById(window.ADMIN_SELECTED_LESSON_ID);
    if (!les) return;

    const newTitle = document.getElementById('teacher-lesson-title-input')?.value.trim() || les.title;
    const summary = document.getElementById('teacher-lesson-summary')?.value.trim() || les.summary;
    const rawKnow = document.getElementById('teacher-lesson-knowledge')?.value.trim() || '';
    const exTitle = document.getElementById('teacher-ex-title')?.value.trim() || les.exercise.title;
    const exDiff = document.getElementById('teacher-ex-diff')?.value || les.difficulty || 'Thông hiểu';
    const exDesc = document.getElementById('teacher-ex-desc')?.value.trim() || les.exercise.description;
    const exIn = document.getElementById('teacher-ex-in')?.value.trim() || '';
    const exOut = document.getElementById('teacher-ex-out')?.value.trim() || '';
    const exCode = document.getElementById('teacher-ex-code')?.value || '';

    les.title = newTitle;
    les.summary = summary;
    les.difficulty = exDiff;
    if (rawKnow) {
        les.knowledge = rawKnow.split(/\r?\n/).filter(Boolean).map(line => `<p class="mb-1.5">${line}</p>`).join('');
    }
    les.exercise = {
        ...les.exercise,
        title: exTitle,
        description: exDesc,
        sample_in: exIn,
        sample_out: exOut,
        starter_code: exCode,
        testcases: [{ input: exIn, output: exOut, hidden: false }]
    };

    saveKntt10LessonsToStorage();
    initKntt10LessonsDatabase();
    alert(`✅ Đã lưu cập nhật Kiến thức & Bài tập thực hành cho "${les.title}"!`);
}

function addTeacherRegularQuizQuestionToLesson() {
    const les = getLessonById(window.ADMIN_SELECTED_LESSON_ID);
    if (!les) return;

    const qText = (document.getElementById('teacher-regq-text')?.value || '').trim();
    const optA = (document.getElementById('teacher-regq-a')?.value || '').trim();
    const optB = (document.getElementById('teacher-regq-b')?.value || '').trim();
    const optC = (document.getElementById('teacher-regq-c')?.value || '').trim();
    const optD = (document.getElementById('teacher-regq-d')?.value || '').trim();
    const ansIdx = parseInt(document.getElementById('teacher-regq-ans')?.value) || 0;
    const expText = (document.getElementById('teacher-regq-exp')?.value || '').trim();

    if (!qText || !optA || !optB) {
        alert('Vui lòng nhập nội dung câu hỏi và ít nhất 2 phương án trả lời!');
        return;
    }

    if (!Array.isArray(les.regular_quiz)) les.regular_quiz = [];
    const newQ = {
        q: qText,
        options: [optA, optB, optC || 'Phương án C', optD || 'Phương án D'],
        ans: ansIdx,
        exp: expText || 'Theo kiến thức chuẩn SGK Tin học THPT.'
    };

    if (window.ADMIN_EDITING_REGQUIZ_INDEX >= 0 && window.ADMIN_EDITING_REGQUIZ_INDEX < les.regular_quiz.length) {
        les.regular_quiz[window.ADMIN_EDITING_REGQUIZ_INDEX] = newQ;
        window.ADMIN_EDITING_REGQUIZ_INDEX = -1;
        const btn = document.getElementById('teacher-regq-submit-btn');
        if (btn) btn.innerHTML = `<i data-lucide="plus-circle" class="w-4 h-4"></i><span>➕ Thêm / Lưu Câu Hỏi Kiểm Tra Thường Xuyên</span>`;
    } else {
        les.regular_quiz.push(newQ);
    }

    saveKntt10LessonsToStorage();
    renderTeacherLessonRegularQuizList(les);
    renderAdminLeftLessonTree();
    renderKntt10GridView();

    document.getElementById('teacher-regq-text').value = '';
    document.getElementById('teacher-regq-a').value = '';
    document.getElementById('teacher-regq-b').value = '';
    document.getElementById('teacher-regq-c').value = '';
    document.getElementById('teacher-regq-d').value = '';
    document.getElementById('teacher-regq-exp').value = '';
}

// ============================================================================
// NẠP TỪ FILE WORD (.DOCX) CHO TỪNG PHẦN TRONG BÀI HỌC:
// 1. Kiến thức trọng tâm (.docx)
// 2. Bài tập thực hành (.docx)
// 3. Bài kiểm tra thường xuyên (.docx)
// ============================================================================
async function extractTextFromDocxOrTxtFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'docx' && typeof mammoth !== 'undefined') {
        const arrayBuffer = await file.arrayBuffer();
        const res = await mammoth.extractRawText({ arrayBuffer });
        return (res.value || '').trim();
    }
    return (await file.text()).trim();
}

async function importLessonKnowledgeFromDocx(event) {
    const file = event.target.files[0];
    if (!file) return;
    const les = getLessonById(window.ADMIN_SELECTED_LESSON_ID);
    if (!les) return;

    try {
        const rawText = await extractTextFromDocxOrTxtFile(file);
        if (!rawText) {
            alert('Tệp Word (.docx) rỗng hoặc không đọc được nội dung!');
            return;
        }
        const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        const firstLine = lines[0] || les.summary;

        document.getElementById('teacher-lesson-summary').value = firstLine.slice(0, 160);
        document.getElementById('teacher-lesson-knowledge').value = rawText;

        les.summary = firstLine.slice(0, 160);
        les.knowledge = lines.map(l => `<p class="mb-1.5">${l}</p>`).join('');
        saveKntt10LessonsToStorage();
        renderKntt10GridView();

        alert(`✅ Đã nạp thành công Kiến thức trọng tâm từ file "${file.name}" vào "${les.title}"!`);
    } catch (err) {
        alert('Lỗi đọc file Word (.docx): ' + err.message);
    } finally {
        event.target.value = '';
    }
}

async function importLessonExerciseFromDocx(event) {
    const file = event.target.files[0];
    if (!file) return;
    const les = getLessonById(window.ADMIN_SELECTED_LESSON_ID);
    if (!les) return;

    try {
        const rawText = await extractTextFromDocxOrTxtFile(file);
        if (!rawText) return;

        let exTitle = les.exercise?.title || `Bài tập thực hành ${les.title}`;
        let exDesc = '';
        let exIn = '';
        let exOut = '';
        let exCode = '';
        let mode = 'DESC';

        const lines = rawText.split(/\r?\n/);
        for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line) continue;
            if (/^(Tên bài|Bài tập|Tiêu đề)\s*[:.]/i.test(line)) {
                exTitle = line.replace(/^(Tên bài|Bài tập|Tiêu đề)\s*[:.]\s*/i, '').trim();
            } else if (/^(Đề bài|Mô tả|Yêu cầu)\s*[:.]/i.test(line)) {
                exDesc = line.replace(/^(Đề bài|Mô tả|Yêu cầu)\s*[:.]\s*/i, '').trim();
                mode = 'DESC';
            } else if (/^Input(\s*mẫu)?\s*[:.]/i.test(line)) {
                exIn = line.replace(/^Input(\s*mẫu)?\s*[:.]\s*/i, '').trim();
                mode = 'IN';
            } else if (/^Output(\s*mẫu)?\s*[:.]/i.test(line)) {
                exOut = line.replace(/^Output(\s*mẫu)?\s*[:.]\s*/i, '').trim();
                mode = 'OUT';
            } else if (/^Code(\s*mẫu)?\s*[:.]/i.test(line)) {
                exCode = line.replace(/^Code(\s*mẫu)?\s*[:.]\s*/i, '').trim();
                mode = 'CODE';
            } else {
                if (mode === 'CODE') exCode += (exCode ? '\n' : '') + rawLine;
                else if (mode === 'DESC') exDesc += (exDesc ? '\n' : '') + line;
            }
        }

        if (!exDesc) exDesc = rawText;

        document.getElementById('teacher-ex-title').value = exTitle;
        document.getElementById('teacher-ex-desc').value = exDesc;
        if (exIn) document.getElementById('teacher-ex-in').value = exIn;
        if (exOut) document.getElementById('teacher-ex-out').value = exOut;
        if (exCode) document.getElementById('teacher-ex-code').value = exCode;

        saveTeacherLessonContentAndExercise();
        alert(`✅ Đã nạp Bài tập thực hành từ file "${file.name}" vào "${les.title}"!`);
    } catch (err) {
        alert('Lỗi nạp Bài tập từ file .docx: ' + err.message);
    } finally {
        event.target.value = '';
    }
}

async function importLessonRegularQuizFromDocx(event) {
    const file = event.target.files[0];
    if (!file) return;
    const les = getLessonById(window.ADMIN_SELECTED_LESSON_ID);
    if (!les) return;

    try {
        const rawText = await extractTextFromDocxOrTxtFile(file);
        if (!rawText) return;

        let importedQuestions = [];
        if (typeof parseStructuredTextToBank === 'function') {
            const parsed = parseStructuredTextToBank(rawText);
            if (Array.isArray(parsed.part1) && parsed.part1.length > 0) {
                importedQuestions = parsed.part1.map(q => ({
                    q: q.q,
                    options: q.options,
                    ans: q.ans || 0,
                    exp: q.exp || 'Theo chuẩn kiến thức SGK.'
                }));
            }
        }

        if (importedQuestions.length === 0) {
            alert('Không tìm thấy câu hỏi trắc nghiệm nào trong file Word. Hãy định dạng câu hỏi theo mẫu:\nCâu 1: Nội dung câu hỏi?\n*A. Đáp án đúng\nB. Đáp án B\nC. Đáp án C\nD. Đáp án D');
            return;
        }

        if (!Array.isArray(les.regular_quiz)) les.regular_quiz = [];
        les.regular_quiz.push(...importedQuestions);

        saveKntt10LessonsToStorage();
        renderTeacherLessonRegularQuizList(les);
        renderAdminLeftLessonTree();
        renderKntt10GridView();

        alert(`✅ Đã nạp thành công ${importedQuestions.length} câu hỏi Kiểm tra thường xuyên từ file "${file.name}" vào "${les.title}"!`);
    } catch (err) {
        alert('Lỗi nạp Kiểm tra thường xuyên từ file .docx: ' + err.message);
    } finally {
        event.target.value = '';
    }
}

// ============================================================================
// QUẢN LÝ SỬA / XÓA / THÊM CÂU HỎI ĐỀ KIỂM TRA ĐỊNH KỲ (PHẦN I, II, III)
// ============================================================================
function renderPeriodicExamCrudList() {
    const container = document.getElementById('periodic-exam-crud-list');
    if (!container || typeof EXAM_DATA === 'undefined') return;

    const p1Html = (EXAM_DATA.part1 || []).map((q, idx) => `
        <div class="p-3 rounded-xl bg-white border border-slate-200 flex items-start justify-between gap-3 text-xs">
            <div class="space-y-1 flex-1">
                <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-extrabold text-[10px]">PHẦN I • Câu ${idx + 1}</span>
                    <span class="font-bold text-slate-900">${q.q}</span>
                </div>
                <div class="text-[11px] text-slate-600">
                    ${(q.options || []).map((opt, oIdx) => `<span class="${oIdx === Number(q.ans) ? 'text-emerald-700 font-extrabold underline' : ''} mr-3">${String.fromCharCode(65 + oIdx)}. ${opt}</span>`).join('')}
                </div>
            </div>
            <div class="flex items-center gap-1 shrink-0">
                <button type="button" onclick="editPeriodicExamQuestion('part1', ${idx})" class="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-[11px]">✏️ Sửa</button>
                <button type="button" onclick="deletePeriodicExamQuestion('part1', ${idx})" class="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-extrabold text-[11px]">🗑️ Xóa</button>
            </div>
        </div>
    `).join('');

    const p2Html = (EXAM_DATA.part2 || []).map((q, idx) => `
        <div class="p-3 rounded-xl bg-white border border-slate-200 flex items-start justify-between gap-3 text-xs">
            <div class="space-y-1 flex-1">
                <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">PHẦN II (Đ/S) • Câu ${idx + 1}</span>
                    <span class="font-bold text-slate-900">${q.context}</span>
                </div>
                <div class="text-[11px] text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-1">
                    ${(q.items || []).map(it => `<span><strong>${it.sub})</strong> ${it.text} <em class="font-bold ${it.correct ? 'text-emerald-700' : 'text-rose-600'}">[${it.correct ? 'Đúng' : 'Sai'}]</em></span>`).join('')}
                </div>
            </div>
            <div class="flex items-center gap-1 shrink-0">
                <button type="button" onclick="editPeriodicExamQuestion('part2', ${idx})" class="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-[11px]">✏️ Sửa</button>
                <button type="button" onclick="deletePeriodicExamQuestion('part2', ${idx})" class="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-extrabold text-[11px]">🗑️ Xóa</button>
            </div>
        </div>
    `).join('');

    const p3Html = (EXAM_DATA.part3 || []).map((q, idx) => `
        <div class="p-3 rounded-xl bg-white border border-slate-200 flex items-start justify-between gap-3 text-xs">
            <div class="space-y-1 flex-1">
                <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-extrabold text-[10px]">PHẦN III (Trả lời ngắn) • Câu ${idx + 1}</span>
                    <span class="font-bold text-slate-900">${q.q}</span>
                </div>
                <div class="text-[11px] text-emerald-700 font-extrabold">Đáp số chuẩn: ${q.ans} <span class="text-slate-500 font-normal">(${q.exp || ''})</span></div>
            </div>
            <div class="flex items-center gap-1 shrink-0">
                <button type="button" onclick="editPeriodicExamQuestion('part3', ${idx})" class="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-[11px]">✏️ Sửa</button>
                <button type="button" onclick="deletePeriodicExamQuestion('part3', ${idx})" class="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-extrabold text-[11px]">🗑️ Xóa</button>
            </div>
        </div>
    `).join('');

    container.innerHTML = (p1Html + p2Html + p3Html) || `<div class="p-4 text-center text-xs text-slate-400">Đề thi định kỳ hiện đang trống.</div>`;
}

function deletePeriodicExamQuestion(partKey, idx) {
    if (!EXAM_DATA[partKey] || !EXAM_DATA[partKey][idx]) return;
    if (!confirm(`Bạn có chắc chắn muốn xóa câu hỏi số ${idx + 1} thuộc ${partKey.toUpperCase()} khỏi Đề kiểm tra định kỳ?`)) return;

    EXAM_DATA[partKey].splice(idx, 1);
    localStorage.setItem('thpt_custom_exam_v2', JSON.stringify(EXAM_DATA));
    if (typeof renderExamQuestions === 'function') renderExamQuestions();
    renderPeriodicExamCrudList();
}

function editPeriodicExamQuestion(partKey, idx) {
    const q = EXAM_DATA[partKey] && EXAM_DATA[partKey][idx];
    if (!q) return;

    if (partKey === 'part1') {
        const newQ = prompt('Sửa nội dung câu hỏi Phần I:', q.q);
        if (newQ === null) return;
        const optA = prompt('Phương án A:', q.options[0] || '');
        const optB = prompt('Phương án B:', q.options[1] || '');
        const optC = prompt('Phương án C:', q.options[2] || '');
        const optD = prompt('Phương án D:', q.options[3] || '');
        const ansLetter = prompt('Đáp án đúng (A, B, C hoặc D):', String.fromCharCode(65 + (q.ans || 0)));
        const ansIdx = Math.max(0, ['A', 'B', 'C', 'D'].indexOf((ansLetter || 'A').trim().toUpperCase()));

        q.q = newQ.trim() || q.q;
        q.options = [optA || q.options[0], optB || q.options[1], optC || q.options[2], optD || q.options[3]];
        q.ans = ansIdx;
    } else if (partKey === 'part2') {
        const newCtx = prompt('Sửa ngữ cảnh Câu hỏi Đúng/Sai (Phần II):', q.context);
        if (newCtx === null) return;
        q.context = newCtx.trim() || q.context;
        (q.items || []).forEach(it => {
            const t = prompt(`Nội dung ý ${it.sub}):`, it.text);
            if (t !== null && t.trim()) it.text = t.trim();
            const c = prompt(`Đáp án ý ${it.sub}) (Nhập D = Đúng, S = Sai):`, it.correct ? 'D' : 'S');
            if (c !== null) it.correct = c.trim().toUpperCase().startsWith('D');
        });
    } else if (partKey === 'part3') {
        const newQ = prompt('Sửa câu hỏi Trả lời ngắn (Phần III):', q.q);
        if (newQ === null) return;
        const newAns = prompt('Sửa đáp số chuẩn:', q.ans);
        q.q = newQ.trim() || q.q;
        if (newAns !== null) q.ans = newAns.trim();
    }

    localStorage.setItem('thpt_custom_exam_v2', JSON.stringify(EXAM_DATA));
    if (typeof renderExamQuestions === 'function') renderExamQuestions();
    renderPeriodicExamCrudList();
}
