/**
 * ThayTruongIT - THPT Hub
 * Module 1: Hệ thống Đăng nhập & Phân quyền Tài khoản (RBAC: TEACHER vs STUDENT)
 * Module 2: Bộ nạp Đề thi & Ngân hàng Học liệu tự động từ File Word (.docx) và Excel (.xlsx)
 */

const AUTH_STORAGE_KEY = 'thpt_auth_session_v2';
const TEACHER_CRED_KEY = 'thpt_teacher_cred_v2';

// Trạng thái phiên đăng nhập hiện tại
window.CURRENT_SESSION = null;

// Bộ nhớ tạm khi nạp file DOCX / XLSX chờ giáo viên xác nhận
window.PENDING_IMPORT_DATA = null;

// ============================================================================
// PHẦN 1: HỆ THỐNG XÁC THỰC & PHÂN QUYỀN (ROLE-BASED ACCESS CONTROL - RBAC)
// ============================================================================

function getTeacherCredentials() {
    const saved = localStorage.getItem(TEACHER_CRED_KEY);
    if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
    }
    return {
        username: 'thaytruongit',
        altUsername: 'admin',
        password: '123456',
        displayName: 'Thầy Trương IT (Giáo viên Quản trị)'
    };
}

function initAuthSystem() {
    // Kiểm tra đăng nhập nhanh bằng QR URL (?student=HS1001&pin=1111)
    const params = new URLSearchParams(window.location.search);
    const qrStu = params.get('student');
    const qrPin = params.get('pin');

    if (qrStu && window.STUDENTS_ROSTER) {
        const found = window.STUDENTS_ROSTER.find(s => s.id.toUpperCase() === qrStu.toUpperCase());
        if (found && (!qrPin || String(found.pin) === String(qrPin))) {
            loginAsStudentSession(found);
            return;
        }
    }

    // Kiểm tra phiên đã lưu trong LocalStorage
    const savedSession = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedSession) {
        try {
            const parsed = JSON.parse(savedSession);
            if (parsed && parsed.role) {
                window.CURRENT_SESSION = parsed;
                if (parsed.role === 'STUDENT' && parsed.studentId) {
                    CURRENT_STUDENT_ID = parsed.studentId;
                }
                applyRolePermissions();
                hideLoginModal();
                return;
            }
        } catch (e) {}
    }

    // Nếu chưa đăng nhập -> Hiển thị màn hình đăng nhập
    populateLoginStudentList();
    showLoginModal();
}

function populateLoginStudentList() {
    const sel = document.getElementById('login-student-select');
    if (!sel || !window.STUDENTS_ROSTER) return;
    sel.innerHTML = `<option value="">-- Chọn nhanh học sinh trong danh sách lớp --</option>` +
        window.STUDENTS_ROSTER.map(s =>
            `<option value="${s.id}">${s.id} - ${s.name} (Lớp ${s.class_id} - PIN: ${s.pin || '1111'})</option>`
        ).join('');
}

function onSelectStudentQuickLogin(stuId) {
    if (!stuId) return;
    const idInput = document.getElementById('login-stu-id');
    const pinInput = document.getElementById('login-stu-pin');
    const stu = (window.STUDENTS_ROSTER || []).find(s => s.id === stuId);
    if (idInput) idInput.value = stuId;
    if (pinInput && stu) pinInput.value = stu.pin || '1111';
}

function switchLoginRoleTab(role) {
    const stuForm = document.getElementById('login-form-student');
    const teaForm = document.getElementById('login-form-teacher');
    const stuBtn = document.getElementById('login-tab-student-btn');
    const teaBtn = document.getElementById('login-tab-teacher-btn');
    const errBox = document.getElementById('login-error-msg');
    if (errBox) errBox.classList.add('hidden');

    if (role === 'TEACHER') {
        stuForm.classList.add('hidden');
        teaForm.classList.remove('hidden');
        teaBtn.className = 'flex-1 py-2.5 rounded-lg text-xs font-bold bg-indigo-600 text-white shadow transition-all';
        stuBtn.className = 'flex-1 py-2.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all';
    } else {
        teaForm.classList.add('hidden');
        stuForm.classList.remove('hidden');
        stuBtn.className = 'flex-1 py-2.5 rounded-lg text-xs font-bold bg-emerald-600 text-white shadow transition-all';
        teaBtn.className = 'flex-1 py-2.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all';
    }
}

function handleStudentLoginSubmit(e) {
    if (e) e.preventDefault();
    const stuId = (document.getElementById('login-stu-id').value || '').trim().toUpperCase();
    const pin = (document.getElementById('login-stu-pin').value || '').trim();
    const errBox = document.getElementById('login-error-msg');

    const stu = (window.STUDENTS_ROSTER || []).find(s => s.id.toUpperCase() === stuId);
    if (!stu) {
        errBox.textContent = `❌ Không tìm thấy Mã học sinh "${stuId}" trong danh sách lớp!`;
        errBox.classList.remove('hidden');
        return;
    }

    const expectedPin = String(stu.pin || '1111');
    if (pin !== expectedPin) {
        errBox.textContent = `❌ Mã PIN không chính xác! (Gợi ý mặc định cho ${stu.id} là ${expectedPin})`;
        errBox.classList.remove('hidden');
        return;
    }

    loginAsStudentSession(stu);
}

function loginAsStudentSession(stu) {
    window.CURRENT_SESSION = {
        role: 'STUDENT',
        studentId: stu.id,
        displayName: stu.name,
        classId: stu.class_id,
        track: stu.track || (stu.class_id.includes('10') ? 'k10' : (stu.class_id.includes('CS') ? 'k11-cs' : 'k11-ict')),
        loginTime: new Date().toLocaleString('vi-VN')
    };
    CURRENT_STUDENT_ID = stu.id;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(window.CURRENT_SESSION));
    localStorage.setItem('thpt_active_student_id', stu.id);

    // Tự động chuyển đúng khối/nhánh của học sinh
    if (typeof switchTrack === 'function' && window.CURRENT_SESSION.track) {
        switchTrack(window.CURRENT_SESSION.track);
    }

    applyRolePermissions();
    hideLoginModal();

    if (window.cloudPipeline) {
        window.cloudPipeline.pushEvent('LAB_HEARTBEAT', {
            ...stu,
            status: 'ONLINE'
        });
    }
}

function handleTeacherLoginSubmit(e) {
    if (e) e.preventDefault();
    const user = (document.getElementById('login-tea-user').value || '').trim().toLowerCase();
    const pass = (document.getElementById('login-tea-pass').value || '').trim();
    const errBox = document.getElementById('login-error-msg');

    const cred = getTeacherCredentials();
    const validUsers = [cred.username.toLowerCase(), cred.altUsername.toLowerCase(), 'gv'];

    if (!validUsers.includes(user) || pass !== cred.password) {
        errBox.textContent = '❌ Tài khoản hoặc mật khẩu Giáo viên chưa đúng! (Mặc định: thaytruongit / 123456)';
        errBox.classList.remove('hidden');
        return;
    }

    window.CURRENT_SESSION = {
        role: 'TEACHER',
        username: user,
        displayName: cred.displayName,
        loginTime: new Date().toLocaleString('vi-VN')
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(window.CURRENT_SESSION));

    applyRolePermissions();
    hideLoginModal();
}

function fillQuickDemoLogin(role) {
    if (role === 'TEACHER') {
        switchLoginRoleTab('TEACHER');
        document.getElementById('login-tea-user').value = 'thaytruongit';
        document.getElementById('login-tea-pass').value = getTeacherCredentials().password;
    } else {
        switchLoginRoleTab('STUDENT');
        const firstStu = (window.STUDENTS_ROSTER && window.STUDENTS_ROSTER[0]) || { id: 'HS1001', pin: '1111' };
        document.getElementById('login-stu-id').value = firstStu.id;
        document.getElementById('login-stu-pin').value = firstStu.pin || '1111';
    }
}

function logoutCurrentSession() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.CURRENT_SESSION = null;
    populateLoginStudentList();
    showLoginModal();
}

function showLoginModal() {
    const modal = document.getElementById('auth-login-overlay');
    if (modal) {
        populateLoginStudentList();
        modal.classList.remove('hidden');
    }
}

function hideLoginModal() {
    const modal = document.getElementById('auth-login-overlay');
    if (modal) modal.classList.add('hidden');
}

/**
 * Thực thi phân quyền chặt chẽ giữa GIÁO VIÊN (TEACHER) và HỌC SINH (STUDENT)
 */
function applyRolePermissions() {
    const session = window.CURRENT_SESSION;
    if (!session) return;

    const isTeacher = session.role === 'TEACHER';

    // 1. Nút Tab Quản trị & Phòng máy (Chỉ Giáo viên mới thấy và truy cập được)
    const adminTabBtn = document.getElementById('tab-admin-btn');
    const adminSection = document.getElementById('tab-admin');
    if (adminTabBtn) {
        if (isTeacher) {
            adminTabBtn.classList.remove('hidden');
        } else {
            adminTabBtn.classList.add('hidden');
            // Nếu học sinh đang ở tab admin thì chuyển ngay về tab làm bài
            if (adminSection && !adminSection.classList.contains('hidden')) {
                switchTab('judge');
            }
        }
    }

    // 2. Bộ chọn Học sinh trên Header:
    // - Giáo viên: Được chọn xem/kiểm tra bất kỳ học sinh nào
    // - Học sinh: Khóa cố định vào tài khoản của chính mình (không thể làm bài hộ hoặc xem điểm bạn khác)
    const teacherStudentSelectWrap = document.getElementById('teacher-student-switcher-wrap');
    const studentIdentityBadge = document.getElementById('student-locked-identity-badge');

    if (teacherStudentSelectWrap && studentIdentityBadge) {
        if (isTeacher) {
            teacherStudentSelectWrap.classList.remove('hidden');
            studentIdentityBadge.classList.add('hidden');
        } else {
            teacherStudentSelectWrap.classList.add('hidden');
            studentIdentityBadge.classList.remove('hidden');
            studentIdentityBadge.innerHTML = `👨‍🎓 <strong>${session.studentId}</strong> - ${session.displayName} <span class="bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded text-[10px] ml-1">${session.classId}</span>`;
        }
    }

    // 3. Hiển thị Huy hiệu Vai trò (Role Badge) trên Header
    const roleBadgeEl = document.getElementById('header-role-badge');
    if (roleBadgeEl) {
        if (isTeacher) {
            roleBadgeEl.className = 'text-xs px-2.5 py-1 rounded-lg font-bold bg-indigo-600 text-white shadow-sm flex items-center gap-1';
            roleBadgeEl.innerHTML = `👨‍🏫 Giáo viên: ${session.displayName}`;
        } else {
            roleBadgeEl.className = 'text-xs px-2.5 py-1 rounded-lg font-bold bg-emerald-600 text-white shadow-sm flex items-center gap-1';
            roleBadgeEl.innerHTML = `👨‍🎓 Học sinh`;
        }
    }

    // 4. Phân quyền trong Tab 2 (Đề thi):
    // - Học sinh không tự ý đổi mã đề nếu giáo viên đã khóa, nhưng có thể xem mã đề hiện tại
    // 5. Phân quyền trong Tab 3 (Hồ sơ Năng lực & Sổ điểm TT22):
    // - Giáo viên: Xem toàn bộ bảng điểm lớp + Nút Xuất Excel + Nút Đồng bộ Google Sheets
    // - Học sinh: Chỉ xem duy nhất dòng điểm của chính bản thân mình, ẩn các nút quản trị sổ điểm của GV
    const teacherGradebookActions = document.getElementById('teacher-only-gradebook-actions');
    const gradebookSubtitle = document.getElementById('gradebook-role-subtitle');
    if (teacherGradebookActions) {
        if (isTeacher) {
            teacherGradebookActions.classList.remove('hidden');
            if (gradebookSubtitle) gradebookSubtitle.textContent = 'Chế độ Giáo viên: Xem và quản lý toàn bộ bảng điểm các lớp';
        } else {
            teacherGradebookActions.classList.add('hidden');
            if (gradebookSubtitle) gradebookSubtitle.textContent = `Chế độ Học sinh: Kết quả đánh giá thường xuyên & định kỳ cá nhân của ${session.displayName} (${session.studentId})`;
        }
    }

    // 6. Phân quyền trong Tab 4 (Kho Học liệu):
    // - Ẩn các nút tải file JSON nguyên gốc đối với học sinh
    const teacherJsonDownloadBar = document.getElementById('teacher-json-download-bar');
    if (teacherJsonDownloadBar) {
        if (isTeacher) {
            teacherJsonDownloadBar.classList.remove('hidden');
        } else {
            teacherJsonDownloadBar.classList.add('hidden');
        }
    }

    renderActiveStudentSelector();
    renderGradebookTable();
    if (isTeacher) {
        renderAdminAllViews();
    }
}

// ============================================================================
// PHẦN 2: BỘ NẠP ĐỀ THI & NGÂN HÀNG CÂU HỎI TỪ FILE WORD (.DOCX) VÀ EXCEL (.XLSX)
// ============================================================================

/**
 * Tạo và tải về File Excel Mẫu chuẩn (.xlsx) gồm 4 Sheet:
 * 1. DeThi_Phan1_TN (Trắc nghiệm 4 lựa chọn)
 * 2. DeThi_Phan2_DS (Trắc nghiệm Đúng/Sai 4 ý a,b,c,d)
 * 3. DeThi_Phan3_TLN (Trắc nghiệm Trả lời ngắn)
 * 4. BaiTap_Code (Ngân hàng bài tập lập trình Auto-Judge Python / SQL / Web)
 */
function downloadStandardExamTemplateXlsx() {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Phần I - Trắc nghiệm 4 lựa chọn
    const p1Sample = [
        {
            "Câu hỏi": "Trong Python, hàm nào dùng để nhập dữ liệu từ bàn phím?",
            "Phương án A": "print()",
            "Phương án B": "input()",
            "Phương án C": "scan()",
            "Phương án D": "read()",
            "Đáp án đúng": "B",
            "Giải thích": "Hàm input() đọc một dòng văn bản từ bàn phím và trả về kiểu chuỗi (str)."
        },
        {
            "Câu hỏi": "Trong SQL, câu lệnh nào dùng để lấy dữ liệu từ bảng?",
            "Phương án A": "SELECT",
            "Phương án B": "UPDATE",
            "Phương án C": "INSERT",
            "Phương án D": "DELETE",
            "Đáp án đúng": "A",
            "Giải thích": "Câu lệnh SELECT dùng để truy vấn dữ liệu từ một hoặc nhiều bảng."
        }
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(p1Sample), "DeThi_Phan1_TN");

    // Sheet 2: Phần II - Trắc nghiệm Đúng / Sai 4 ý
    const p2Sample = [
        {
            "Câu dẫn (Ngữ cảnh)": "Cho danh sách A = [2, 5, 8, 12, 16, 23, 38] đã được sắp xếp tăng dần.",
            "Ý a": "Có thể áp dụng thuật toán tìm kiếm nhị phân trên danh sách A.",
            "Đ/S a": "Đúng",
            "Giải thích a": "Danh sách A đã sắp xếp tăng dần nên thỏa mãn điều kiện tìm kiếm nhị phân.",
            "Ý b": "Phần tử ở vị trí giữa (mid) trong bước đầu tiên có giá trị là 16.",
            "Đ/S b": "Sai",
            "Giải thích b": "Chỉ số mid = (0 + 6) // 2 = 3, giá trị A[3] là 12 chứ không phải 16.",
            "Ý c": "Độ phức tạp của thuật toán tìm kiếm nhị phân là O(log N).",
            "Đ/S c": "Đúng",
            "Giải thích c": "Mỗi bước phạm vi tìm kiếm giảm đi một nửa.",
            "Ý d": "Nếu thêm số 1 vào cuối danh sách A thì tìm kiếm nhị phân vẫn luôn đúng.",
            "Đ/S d": "Sai",
            "Giải thích d": "Thêm số 1 vào cuối làm mất tính sắp xếp của danh sách."
        }
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(p2Sample), "DeThi_Phan2_DS");

    // Sheet 3: Phần III - Trả lời ngắn
    const p3Sample = [
        {
            "Câu hỏi": "Cho danh sách S = [10, 20, 30, 40]. Kết quả của biểu thức len(S) + S[1] là bao nhiêu?",
            "Đáp số": "24",
            "Giải thích": "len(S) = 4 và S[1] = 20, tổng là 4 + 20 = 24."
        }
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(p3Sample), "DeThi_Phan3_TLN");

    // Sheet 4: Ngân hàng Bài tập Code Auto-Judge
    const codeSample = [
        {
            "Khối": "k10",
            "Loại Engine": "ALGORITHM",
            "Tên bài tập": "Tính tổng hai số nguyên A và B",
            "Mức độ": "Nhận biết",
            "Năng lực": "NLc",
            "Đề bài": "Nhập vào 2 số nguyên a và b trên một dòng. Hãy tính và in ra tổng a + b.",
            "Input mẫu": "15 25",
            "Output mẫu": "40",
            "Code khởi tạo": "a, b = map(int, input().split())\nprint(a + b)",
            "Gợi ý": "Sử dụng hàm map(int, input().split()) để đọc 2 số nguyên trên cùng 1 dòng."
        }
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(codeSample), "BaiTap_Code");

    XLSX.writeFile(wb, "Mau_Nap_NganHang_DeThi_THPT.xlsx");
}

/**
 * Tải về File Mẫu định dạng Word chuẩn (.docx) để giáo viên soạn nhanh trên MS Word
 */
function downloadStandardExamTemplateDocx() {
    const a = document.createElement('a');
    a.href = 'data/templates/Mau_De_Thi_Va_Ngan_Hang_THPT.docx';
    a.download = 'Mau_De_Thi_Va_Ngan_Hang_THPT.docx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

/**
 * Xử lý khi Giáo viên chọn File (.docx, .xlsx, .txt) để nạp vào Ngân hàng Đề thi & Học liệu
 */
async function handleBankFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    const previewBox = document.getElementById('import-preview-container');
    const summaryEl = document.getElementById('import-preview-summary');

    if (ext === 'xlsx' || ext === 'xls') {
        const buffer = await file.arrayBuffer();
        const parsed = parseExcelWorkbookToBank(buffer);
        window.PENDING_IMPORT_DATA = parsed;
        showImportPreviewUI(file.name, parsed);
    } else if (ext === 'docx') {
        if (typeof window.mammoth === 'undefined') {
            alert('Thư viện đọc file Word (.docx) đang tải, vui lòng thử lại sau 2 giây.');
            return;
        }
        const buffer = await file.arrayBuffer();
        const result = await window.mammoth.extractRawText({ arrayBuffer: buffer });
        const parsed = parseStructuredTextToBank(result.value || '');
        window.PENDING_IMPORT_DATA = parsed;
        showImportPreviewUI(file.name, parsed);
    } else if (ext === 'txt') {
        const text = await file.text();
        const parsed = parseStructuredTextToBank(text);
        window.PENDING_IMPORT_DATA = parsed;
        showImportPreviewUI(file.name, parsed);
    } else {
        alert('Vui lòng chọn tệp đúng định dạng .xlsx, .xls, .docx hoặc .txt!');
    }
}

/**
 * Bộ phân tích File Excel (.xlsx) đa Sheet hoặc đơn Sheet
 */
function parseExcelWorkbookToBank(arrayBuffer) {
    const wb = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
    const result = {
        part1: [],
        part2: [],
        part3: [],
        problems: []
    };

    wb.SheetNames.forEach(sheetName => {
        const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
        rows.forEach((r, idx) => {
            // 1. Nhận diện dòng Phần I (Trắc nghiệm 4 lựa chọn)
            if (r['Phương án A'] !== undefined || r['Đáp án A'] !== undefined || sheetName.includes('Phan1')) {
                const qText = String(r['Câu hỏi'] || r['NoiDung'] || '').trim();
                if (!qText) return;
                const optA = String(r['Phương án A'] || r['Đáp án A'] || r['A'] || '').trim();
                const optB = String(r['Phương án B'] || r['Đáp án B'] || r['B'] || '').trim();
                const optC = String(r['Phương án C'] || r['Đáp án C'] || r['C'] || '').trim();
                const optD = String(r['Phương án D'] || r['Đáp án D'] || r['D'] || '').trim();
                const ansChar = String(r['Đáp án đúng'] || r['DapAn'] || 'A').trim().toUpperCase();
                const ansIndex = Math.max(0, ['A', 'B', 'C', 'D'].indexOf(ansChar[0]));

                result.part1.push({
                    id: `p1_imp_${Date.now()}_${idx}`,
                    q: qText,
                    options: [optA, optB, optC, optD],
                    ans: ansIndex,
                    exp: String(r['Giải thích'] || r['GiaiThich'] || 'Đáp án chuẩn theo ma trận đặc tả.').trim()
                });
                return;
            }

            // 2. Nhận diện dòng Phần II (Đúng/Sai 4 ý)
            if (r['Ý a'] !== undefined || r['Câu dẫn (Ngữ cảnh)'] !== undefined || sheetName.includes('Phan2')) {
                const ctx = String(r['Câu dẫn (Ngữ cảnh)'] || r['Câu dẫn'] || r['Câu hỏi'] || '').trim();
                if (!ctx) return;

                const parseBool = (val) => {
                    const s = String(val || '').trim().toLowerCase();
                    return s === 'đúng' || s === 'dung' || s === 'true' || s === 'đ' || s === 'd' || s === '1';
                };

                result.part2.push({
                    id: `p2_imp_${Date.now()}_${idx}`,
                    context: ctx,
                    items: ['a', 'b', 'c', 'd'].map(sub => ({
                        sub,
                        text: String(r[`Ý ${sub}`] || r[sub] || '').trim(),
                        correct: parseBool(r[`Đ/S ${sub}`] || r[`DapAn_${sub}`] || 'Đúng'),
                        exp: String(r[`Giải thích ${sub}`] || r['Giải thích'] || 'Theo chuẩn kiến thức SGK GDPT 2018.').trim()
                    }))
                });
                return;
            }

            // 3. Nhận diện dòng Bài tập Code Auto-Judge
            if (r['Đề bài'] !== undefined || r['Tên bài tập'] !== undefined || sheetName.includes('Code')) {
                const title = String(r['Tên bài tập'] || r['Tiêu đề'] || '').trim();
                if (!title) return;
                const track = String(r['Khối'] || 'k10').trim().toLowerCase();
                const type = String(r['Loại Engine'] || r['Loại'] || 'ALGORITHM').trim().toUpperCase();
                const sampleIn = String(r['Input mẫu'] || r['Input'] || '').trim();
                const sampleOut = String(r['Output mẫu'] || r['Output'] || '').trim();

                result.problems.push({
                    id: `imp_${Date.now()}_${idx}`,
                    track: ['k10', 'k11-cs', 'k11-ict'].includes(track) ? track : 'k10',
                    type: ['ALGORITHM', 'SQL', 'WEB'].includes(type) ? type : 'ALGORITHM',
                    title,
                    category: type === 'SQL' ? 'Cơ sở dữ liệu SQL' : (type === 'WEB' ? 'Thiết kế Web' : 'Thuật toán & Lập trình'),
                    difficulty: String(r['Mức độ'] || 'Thông hiểu').trim(),
                    competency: String(r['Năng lực'] || 'NLc').trim(),
                    description: String(r['Đề bài'] || '').trim(),
                    input_format: 'Dữ liệu vào/ra theo quy chuẩn đề bài.',
                    sample_in: sampleIn,
                    sample_out: sampleOut,
                    starter_code: String(r['Code khởi tạo'] || r['Code'] || '# Viết chương trình của bạn\n'),
                    testcases: [{ input: sampleIn, output: sampleOut, hidden: false }],
                    required_tags: ['header', 'main', 'footer'],
                    hint: String(r['Gợi ý'] || 'Phân tích kỹ yêu cầu đầu vào và đầu ra.').trim()
                });
                return;
            }

            // 4. Nhận diện dòng Phần III (Trả lời ngắn)
            if (r['Đáp số'] !== undefined || sheetName.includes('Phan3')) {
                const qText = String(r['Câu hỏi'] || '').trim();
                if (!qText) return;
                result.part3.push({
                    id: `p3_imp_${Date.now()}_${idx}`,
                    q: qText,
                    ans: String(r['Đáp số'] || r['Đáp án'] || '').trim(),
                    exp: String(r['Giải thích'] || 'Kết quả tính toán chính xác.').trim()
                });
            }
        });
    });

    return result;
}

/**
 * Bộ phân tích Văn bản có cấu trúc từ File Word (.docx) hoặc (.txt)
 */
function parseStructuredTextToBank(rawText) {
    const result = {
        part1: [],
        part2: [],
        part3: [],
        problems: []
    };

    const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith('===='));
    let currentSection = 'PART1';
    let currentObj = null;

    const flushCurrent = () => {
        if (!currentObj) return;
        if (currentObj._kind === 'P1' && currentObj.q && currentObj.options.length > 0) {
            while (currentObj.options.length < 4) currentObj.options.push('');
            result.part1.push(currentObj);
        } else if (currentObj._kind === 'P2' && currentObj.context && currentObj.items.length > 0) {
            result.part2.push(currentObj);
        } else if (currentObj._kind === 'P3' && currentObj.q) {
            result.part3.push(currentObj);
        } else if (currentObj._kind === 'CODE' && currentObj.title) {
            currentObj.testcases = [{ input: currentObj.sample_in || '', output: currentObj.sample_out || '', hidden: false }];
            result.problems.push(currentObj);
        }
        currentObj = null;
    };

    for (const line of lines) {
        const upper = line.toUpperCase();
        if (upper.startsWith('PHẦN I') || upper.includes('TRẮC NGHIỆM NHIỀU LỰA CHỌN')) {
            flushCurrent();
            currentSection = 'PART1';
            continue;
        }
        if (upper.startsWith('PHẦN II') || upper.includes('TRẮC NGHIỆM ĐÚNG SAI') || upper.includes('ĐÚNG / SAI')) {
            flushCurrent();
            currentSection = 'PART2';
            continue;
        }
        if (upper.startsWith('PHẦN III') || upper.includes('TRẢ LỜI NGẮN')) {
            flushCurrent();
            currentSection = 'PART3';
            continue;
        }
        if (upper.startsWith('PHẦN IV') || upper.includes('BÀI TẬP LẬP TRÌNH') || upper.includes('AUTO-JUDGE')) {
            flushCurrent();
            currentSection = 'CODE';
            continue;
        }

        // Bắt đầu Câu hỏi mới trong PHẦN I, II, III
        const qMatch = line.match(/^Câu\s+\d+\s*[:.](.*)/i);
        if (qMatch && currentSection !== 'CODE') {
            flushCurrent();
            const qContent = qMatch[1].trim();
            if (currentSection === 'PART1') {
                currentObj = { _kind: 'P1', id: 'p1_doc_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5), q: qContent, options: [], ans: 0, exp: 'Theo chuẩn kiến thức GDPT 2018.' };
            } else if (currentSection === 'PART2') {
                currentObj = { _kind: 'P2', id: 'p2_doc_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5), context: qContent, items: [] };
            } else if (currentSection === 'PART3') {
                currentObj = { _kind: 'P3', id: 'p3_doc_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5), q: qContent, ans: '', exp: 'Kết quả tính toán chuẩn.' };
            }
            continue;
        }

        // Bắt đầu Bài tập Code mới trong PHẦN IV
        const probMatch = line.match(/^Bài\s+\d+\s*[:.](.*)/i);
        if (probMatch) {
            flushCurrent();
            currentSection = 'CODE';
            currentObj = {
                _kind: 'CODE',
                id: 'code_doc_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
                track: 'k10',
                type: 'ALGORITHM',
                title: probMatch[1].trim(),
                category: 'Thuật toán & Lập trình',
                difficulty: 'Thông hiểu',
                competency: 'NLc',
                description: '',
                input_format: 'Nhập từ luồng chuẩn.',
                sample_in: '',
                sample_out: '',
                starter_code: '',
                hint: 'Phân tích kỹ đề bài.'
            };
            continue;
        }

        if (!currentObj) continue;

        // Xử lý chi tiết bên trong PHẦN I
        if (currentObj._kind === 'P1') {
            const optMatch = line.match(/^(\*?)([A-D])[.)]\s*(.*)/i);
            if (optMatch) {
                const isStarred = optMatch[1] === '*';
                const letter = optMatch[2].toUpperCase();
                const text = optMatch[3].trim();
                const idx = ['A', 'B', 'C', 'D'].indexOf(letter);
                currentObj.options[idx] = text;
                if (isStarred) currentObj.ans = idx;
                continue;
            }
            const ansMatch = line.match(/^Đáp\s*(?:án|số)\s*[:.]\s*([A-D])/i);
            if (ansMatch) {
                currentObj.ans = ['A', 'B', 'C', 'D'].indexOf(ansMatch[1].toUpperCase());
                continue;
            }
            const expMatch = line.match(/^Giải\s*thích\s*[:.]\s*(.*)/i);
            if (expMatch) {
                currentObj.exp = expMatch[1].trim();
                continue;
            }
        }

        // Xử lý chi tiết bên trong PHẦN II (Đúng/Sai 4 ý)
        if (currentObj._kind === 'P2') {
            const subMatch = line.match(/^([a-d])[.)]\s*(.*)/i);
            if (subMatch) {
                const subLetter = subMatch[1].toLowerCase();
                let rawStmt = subMatch[2].trim();
                let isTrue = true;
                if (/\[(sai|s|false)\]/i.test(rawStmt)) {
                    isTrue = false;
                }
                rawStmt = rawStmt.replace(/\[(đúng|dung|đ|d|sai|s|true|false)\]/gi, '').trim();
                currentObj.items.push({
                    sub: subLetter,
                    text: rawStmt,
                    correct: isTrue,
                    exp: 'Theo chuẩn kiến thức SGK GDPT 2018.'
                });
                continue;
            }
            const expMatch = line.match(/^Giải\s*thích\s*[:.]\s*(.*)/i);
            if (expMatch) {
                const expText = expMatch[1].trim();
                currentObj.items.forEach(it => { it.exp = expText; });
                continue;
            }
        }

        // Xử lý chi tiết bên trong PHẦN III (Trả lời ngắn)
        if (currentObj._kind === 'P3') {
            const ansMatch = line.match(/^Đáp\s*(?:án|số)\s*[:.]\s*(.*)/i);
            if (ansMatch) {
                currentObj.ans = ansMatch[1].trim();
                continue;
            }
            const expMatch = line.match(/^Giải\s*thích\s*[:.]\s*(.*)/i);
            if (expMatch) {
                currentObj.exp = expMatch[1].trim();
                continue;
            }
        }

        // Xử lý chi tiết bên trong PHẦN IV (Bài tập Code)
        if (currentObj._kind === 'CODE') {
            if (/^Khối\s*:/i.test(line)) {
                currentObj.track = line.split(':')[1].trim().toLowerCase();
            } else if (/^Loại\s*:/i.test(line)) {
                currentObj.type = line.split(':')[1].trim().toUpperCase();
            } else if (/^Mức\s*độ\s*:/i.test(line)) {
                currentObj.difficulty = line.split(':')[1].trim();
            } else if (/^Năng\s*lực\s*:/i.test(line)) {
                currentObj.competency = line.split(':')[1].trim();
            } else if (/^Đề\s*bài\s*:/i.test(line)) {
                currentObj.description = line.replace(/^Đề\s*bài\s*:\s*/i, '').trim();
            } else if (/^Input\s*:/i.test(line)) {
                currentObj.sample_in = line.replace(/^Input\s*:\s*/i, '').trim();
            } else if (/^Output\s*:/i.test(line)) {
                currentObj.sample_out = line.replace(/^Output\s*:\s*/i, '').trim();
            } else if (/^Code\s*:/i.test(line)) {
                currentObj.starter_code = line.replace(/^Code\s*:\s*/i, '').trim();
            } else if (/^Gợi\s*ý\s*:/i.test(line)) {
                currentObj.hint = line.replace(/^Gợi\s*ý\s*:\s*/i, '').trim();
            } else if (currentObj.starter_code) {
                currentObj.starter_code += '\n' + line;
            }
        }
    }

    flushCurrent();
    return result;
}

function showImportPreviewUI(fileName, parsed) {
    const previewBox = document.getElementById('import-preview-container');
    const summaryEl = document.getElementById('import-preview-summary');
    const detailEl = document.getElementById('import-preview-details');
    if (!previewBox || !summaryEl) return;

    const p1Len = parsed.part1.length;
    const p2Len = parsed.part2.length;
    const p3Len = parsed.part3.length;
    const probLen = parsed.problems.length;

    previewBox.classList.remove('hidden');
    summaryEl.innerHTML = `
        📄 Tệp <strong>${fileName}</strong> đã được bóc tách tự động:
        <span class="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold ml-1">Phần I: ${p1Len} câu</span>
        <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold ml-1">Phần II (Đ/S): ${p2Len} câu</span>
        <span class="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold ml-1">Phần III: ${p3Len} câu</span>
        <span class="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold ml-1">Bài tập Code: ${probLen} bài</span>
    `;

    let samplePreviewHtml = '';
    if (p1Len > 0) {
        samplePreviewHtml += `<div class="text-xs text-slate-700">• <strong>Mẫu Phần I:</strong> ${parsed.part1[0].q} (Đáp án: ${String.fromCharCode(65 + parsed.part1[0].ans)})</div>`;
    }
    if (p2Len > 0) {
        samplePreviewHtml += `<div class="text-xs text-slate-700">• <strong>Mẫu Phần II:</strong> ${parsed.part2[0].context} (${parsed.part2[0].items.length} ý Đúng/Sai)</div>`;
    }
    if (p3Len > 0) {
        samplePreviewHtml += `<div class="text-xs text-slate-700">• <strong>Mẫu Phần III:</strong> ${parsed.part3[0].q} (Đáp số: ${parsed.part3[0].ans})</div>`;
    }
    if (probLen > 0) {
        samplePreviewHtml += `<div class="text-xs text-slate-700">• <strong>Mẫu Bài Code:</strong> [${parsed.problems[0].track.toUpperCase()}] ${parsed.problems[0].title}</div>`;
    }
    if (detailEl) {
        detailEl.innerHTML = samplePreviewHtml || `<div class="text-xs text-rose-600">Không tìm thấy câu hỏi nào khớp cấu trúc mẫu. Hãy tải File Mẫu về để xem định dạng chuẩn!</div>`;
    }
}

async function confirmAndApplyImportedBank(mode = 'APPEND') {
    const parsed = window.PENDING_IMPORT_DATA;
    if (!parsed) return;

    if (mode === 'REPLACE') {
        if (parsed.part1.length > 0) EXAM_DATA.part1 = parsed.part1;
        if (parsed.part2.length > 0) EXAM_DATA.part2 = parsed.part2;
        if (parsed.part3.length > 0) EXAM_DATA.part3 = parsed.part3;
    } else {
        EXAM_DATA.part1.push(...parsed.part1);
        EXAM_DATA.part2.push(...parsed.part2);
        EXAM_DATA.part3.push(...parsed.part3);
    }

    // Lưu đề thi vào LocalStorage
    localStorage.setItem('thpt_custom_exam_v2', JSON.stringify(EXAM_DATA));

    // Gộp các bài tập Code Auto-Judge vào đúng khối
    const customProbs = JSON.parse(localStorage.getItem('thpt_custom_problems_v2') || '{}');
    parsed.problems.forEach(p => {
        const t = p.track || 'k10';
        if (!APP_DATA[t]) APP_DATA[t] = [];
        APP_DATA[t].push(p);
        if (!customProbs[t]) customProbs[t] = [];
        customProbs[t].push(p);
    });
    localStorage.setItem('thpt_custom_problems_v2', JSON.stringify(customProbs));

    // Cập nhật toàn bộ giao diện
    renderExamQuestions();
    loadProblemList();
    renderAdminProblemList();

    // Tự động đẩy lên GitHub data/exam-2025.json nếu đã cấu hình GitHub Token
    if (window.cloudPipeline) {
        await window.cloudPipeline.commitJsonToGitHub(
            'data/exam-2025.json',
            EXAM_DATA,
            'Cap nhat De thi & Ngan hang cau hoi tu file DOCX/XLSX'
        );
    }

    document.getElementById('import-preview-container').classList.add('hidden');
    window.PENDING_IMPORT_DATA = null;

    alert('🎉 Đã nạp thành công Đề thi & Ngân hàng Học liệu vào hệ thống!');
}
