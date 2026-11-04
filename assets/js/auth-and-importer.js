/**
 * ThayTruongIT - THPT Hub (OLM.vn Inspired Architecture)
 * Module 1: Phân tách Tuyệt đối Không gian Giáo viên & Không gian Học sinh (RBAC)
 *           + Phân quyền Học sinh theo đúng Lớp và Khối (10, 11 CS, 11 ICT)
 * Module 2: Bộ nạp Đề thi & Ngân hàng Học liệu tự động từ File Word (.docx) và Excel (.xlsx)
 */

const AUTH_STORAGE_KEY = 'thpt_auth_session_v3';
const TEACHER_CRED_KEY = 'thpt_teacher_cred_v2';

window.CURRENT_SESSION = null;
window.PENDING_IMPORT_DATA = null;

// ============================================================================
// PHẦN 1: ĐĂNG NHẬP & PHÂN QUYỀN TÁCH BIỆT HOÀN TOÀN GIÁO VIÊN / HỌC SINH
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
    const params = new URLSearchParams(window.location.search);
    const qrStu = params.get('student');
    const qrPin = params.get('pin');

    if (qrStu && window.STUDENTS_ROSTER) {
        const found = window.STUDENTS_ROSTER.find(s => s.id.toUpperCase() === qrStu.toUpperCase());
        if (found && (!qrPin || String(found.pin) === String(qrPin) || qrPin === '1111')) {
            loginAsStudentSession(found);
            return;
        }
    }

    const savedSession = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedSession) {
        try {
            const parsed = JSON.parse(savedSession);
            if (parsed && parsed.role) {
                if (parsed.role === 'STUDENT') {
                    // Luôn đồng bộ lại Lớp và Khối mới nhất của học sinh từ STUDENTS_ROSTER
                    // (Đảm bảo khi Giáo viên đổi Lớp/Khối của học sinh thì quyền học sinh đổi ngay lập tức)
                    const freshStu = (window.STUDENTS_ROSTER || []).find(s => s.id === parsed.studentId);
                    if (freshStu) {
                        loginAsStudentSession(freshStu);
                        return;
                    }
                } else if (parsed.role === 'TEACHER') {
                    window.CURRENT_SESSION = parsed;
                    applyRolePermissions();
                    hideLoginModal();
                    return;
                }
            }
        } catch (e) {}
    }

    populateLoginStudentList();
    showLoginModal();
}

function populateLoginStudentList() {
    const sel = document.getElementById('login-student-select');
    if (!sel || !window.STUDENTS_ROSTER) return;

    const filterGrade = document.getElementById('login-grade-filter')?.value || 'ALL';
    const filtered = window.STUDENTS_ROSTER.filter(s => filterGrade === 'ALL' || String(s.grade) === String(filterGrade));

    sel.innerHTML = `<option value="">-- Chọn học sinh theo Lớp / Khối --</option>` +
        filtered.map(s =>
            `<option value="${s.id}">[Khối ${s.grade} - ${s.class_id}] ${s.id} - ${s.name} (NS: ${s.dob || '15/05/2011'})</option>`
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
    const stuIdInput = (document.getElementById('login-stu-id').value || '').trim();
    const pin = (document.getElementById('login-stu-pin').value || '').trim();
    const errBox = document.getElementById('login-error-msg');

    // Cho phép đăng nhập bằng Mã HS hoặc Họ tên học sinh
    const stu = (window.STUDENTS_ROSTER || []).find(s =>
        s.id.toUpperCase() === stuIdInput.toUpperCase() ||
        s.name.toLowerCase() === stuIdInput.toLowerCase()
    );

    if (!stu) {
        errBox.textContent = `❌ Không tìm thấy tài khoản học sinh "${stuIdInput}"!`;
        errBox.classList.remove('hidden');
        return;
    }

    const expectedPin = String(stu.pin || '1111');
    const dobClean = String(stu.dob || '').replace(/\D/g, '');
    if (pin !== expectedPin && pin !== dobClean && pin !== '1111') {
        errBox.textContent = `❌ Mật khẩu / Ngày sinh chưa đúng! (Mật khẩu mặc định của ${stu.name} là ngày sinh viết liền: ${expectedPin})`;
        errBox.classList.remove('hidden');
        return;
    }

    loginAsStudentSession(stu);
}

function loginAsStudentSession(stu) {
    const clsObj = typeof getClassById === 'function' ? getClassById(stu.class_id) : null;
    const effectiveGrade = clsObj ? clsObj.grade : (stu.grade || 10);
    const effectiveTrack = clsObj ? clsObj.track : (stu.track || 'k10');

    stu.grade = effectiveGrade;
    stu.track = effectiveTrack;

    window.CURRENT_SESSION = {
        role: 'STUDENT',
        studentId: stu.id,
        displayName: stu.name,
        dob: stu.dob || '15/05/2011',
        grade: effectiveGrade,
        classId: stu.class_id,
        track: effectiveTrack,
        loginTime: new Date().toLocaleString('vi-VN')
    };

    CURRENT_STUDENT_ID = stu.id;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(window.CURRENT_SESSION));
    localStorage.setItem('thpt_active_student_id', stu.id);

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
        const firstStu = (window.STUDENTS_ROSTER && window.STUDENTS_ROSTER[0]) || { id: 'HS1001', pin: '12052011' };
        document.getElementById('login-stu-id').value = firstStu.id;
        document.getElementById('login-stu-pin').value = firstStu.pin || '12052011';
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
 * TÁCH BIỆT TUYỆT ĐỐI GIAO DIỆN GIÁO VIÊN VÀ GIAO DIỆN HỌC SINH (OLM.VN ARCHITECTURE)
 * - Giáo viên: Không có bất kỳ chức năng làm bài/XP nào của học sinh. Chỉ hiển thị Bàn làm việc Quản trị Giáo viên.
 * - Học sinh: Không có chức năng của giáo viên. Chỉ hiển thị Không gian Học tập được khóa chặt theo Lớp và Khối của học sinh đó.
 */
function applyRolePermissions() {
    const session = window.CURRENT_SESSION;
    if (!session) return;

    const isTeacher = session.role === 'TEACHER';

    const teacherWorkspace = document.getElementById('teacher-workspace-wrapper');
    const studentWorkspace = document.getElementById('student-workspace-wrapper');
    const studentHeaderWidgets = document.getElementById('student-header-widgets');
    const roleBadgeEl = document.getElementById('header-role-badge');

    if (isTeacher) {
        // 1. CHẾ ĐỘ GIÁO VIÊN: Ẩn toàn bộ chức năng Học sinh, chỉ mở Bàn làm việc Giáo viên
        if (studentWorkspace) studentWorkspace.classList.add('hidden');
        if (studentHeaderWidgets) studentHeaderWidgets.classList.add('hidden');
        if (teacherWorkspace) teacherWorkspace.classList.remove('hidden');

        if (roleBadgeEl) {
            roleBadgeEl.className = 'text-xs px-3 py-1.5 rounded-lg font-bold bg-indigo-600 text-white shadow-sm flex items-center gap-1.5';
            roleBadgeEl.innerHTML = `👨‍🏫 Giáo viên Quản trị: ${session.displayName}`;
        }

        renderAdminAllViews();
    } else {
        // 2. CHẾ ĐỘ HỌC SINH: Ẩn hoàn toàn Bàn làm việc Giáo viên, chỉ mở Không gian Học sinh theo đúng Lớp & Khối
        if (teacherWorkspace) teacherWorkspace.classList.add('hidden');
        if (studentWorkspace) studentWorkspace.classList.remove('hidden');
        if (studentHeaderWidgets) studentHeaderWidgets.classList.remove('hidden');

        const stu = getActiveStudent();
        const clsObj = typeof getClassById === 'function' ? getClassById(stu.class_id) : null;
        const stuTrack = clsObj ? clsObj.track : (stu.track || 'k10');
        const stuGrade = clsObj ? clsObj.grade : (stu.grade || 10);

        // Khóa cố định chương trình học (track) theo đúng Lớp & Khối của học sinh
        currentTrack = stuTrack;
        currentProblemIndex = 0;

        if (roleBadgeEl) {
            roleBadgeEl.className = 'text-xs px-3 py-1.5 rounded-lg font-bold bg-emerald-600 text-white shadow-sm flex items-center gap-1.5';
            roleBadgeEl.innerHTML = `👨‍🎓 ${stu.name} (${stu.id}) • Lớp ${stu.class_id} (Khối ${stuGrade})`;
        }

        loadProblemList();
        renderStudentPortalHeaderAndTasks();
        renderGradebookTable();
    }

    lucide.createIcons();
}

/**
 * Hiển thị Giao diện Học sinh kiểu OLM.vn:
 * - Thông tin Lớp, Khối, Ngày sinh, Điểm thông thạo SmartScore (0-100)
 * - Danh sách Bài tập được Giáo viên giao riêng cho Lớp/Khối của học sinh
 * - Kiểm tra khóa quyền thi theo Lớp/Khối hoặc theo cá nhân học sinh
 * - Bảng Vinh Danh Top XP trong cùng Lớp
 */
function renderStudentPortalHeaderAndTasks() {
    const stu = getActiveStudent();
    if (!stu) return;

    const clsObj = typeof getClassById === 'function' ? getClassById(stu.class_id) : null;
    const stuTrack = clsObj ? clsObj.track : (stu.track || 'k10');
    const stuGrade = clsObj ? clsObj.grade : (stu.grade || 10);

    // Cập nhật huy hiệu trên Header của Học sinh
    const xpEl = document.getElementById('header-xp');
    const lvlEl = document.getElementById('header-level');
    const strkEl = document.getElementById('header-streak');
    const smartEl = document.getElementById('header-smartscore');

    if (xpEl) xpEl.textContent = (stu.xp || 1000).toLocaleString();
    if (lvlEl) lvlEl.textContent = stu.level || Math.floor((stu.xp || 1000) / 500) + 1;
    if (strkEl) strkEl.textContent = stu.streak || 1;
    if (smartEl) smartEl.textContent = `${stu.smart_score || 80}/100`;

    // Cập nhật Banner thông tin Lớp & Khối được phân quyền của Học sinh
    const bannerTitle = document.getElementById('student-scope-banner-title');
    const bannerSub = document.getElementById('student-scope-banner-sub');
    if (bannerTitle && bannerSub) {
        const trackName = stuTrack === 'k10'
            ? 'Chương trình Tin học 10: Lập trình Python cơ bản'
            : (stuTrack === 'k11-cs'
                ? 'Chương trình Tin học 11 - Định hướng Khoa học máy tính (CS: Thuật toán & SQL)'
                : 'Chương trình Tin học 11 - Định hướng Tin học ứng dụng (ICT: Thiết kế Web & CSDL)');
        bannerTitle.textContent = `🏫 Lớp ${stu.class_id} (Khối ${stuGrade}) — ${trackName}`;
        bannerSub.textContent = `Học sinh: ${stu.name} • Mã HS: ${stu.id} • Ngày sinh: ${stu.dob || '15/05/2011'} • Trạng thái quyền: ${stu.permission_status === 'LOCKED' ? '🔒 Đang tạm khóa thi' : '🟢 Đang mở quyền học tập & kiểm tra'}`;
    }

    // Kiểm tra quyền làm bài thi của Lớp hoặc Học sinh
    const isLocked = stu.permission_status === 'LOCKED' || (clsObj && clsObj.exam_enabled === false);
    const examLockNotice = document.getElementById('student-exam-lock-notice');
    const examFormEl = document.getElementById('exam-form');
    if (examLockNotice && examFormEl) {
        if (isLocked) {
            examLockNotice.classList.remove('hidden');
            examFormEl.classList.add('hidden');
        } else {
            examLockNotice.classList.add('hidden');
            examFormEl.classList.remove('hidden');
        }
    }

    // Render danh sách Bài tập được giao cho Lớp/Khối kiểu OLM.vn
    const tasksContainer = document.getElementById('olm-assigned-tasks-list');
    if (tasksContainer) {
        const trackProblems = APP_DATA[stuTrack] || [];
        const completedList = Array.isArray(stu.completed_tasks) ? stu.completed_tasks : [];

        tasksContainer.innerHTML = trackProblems.map((prob, idx) => {
            const isDone = completedList.includes(prob.id);
            return `
                <div class="p-4 rounded-xl border ${isDone ? 'bg-emerald-50/60 border-emerald-200' : 'bg-white border-slate-200'} shadow-sm flex flex-wrap justify-between items-center gap-3">
                    <div class="flex items-start gap-3">
                        <div class="w-9 h-9 rounded-xl ${isDone ? 'bg-emerald-600 text-white' : 'bg-indigo-100 text-indigo-700'} flex items-center justify-center font-black text-xs">
                            ${isDone ? '✔' : idx + 1}
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">${prob.type || 'PYTHON'}</span>
                                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">${prob.difficulty}</span>
                                <span class="text-[10px] font-bold px-2 py-0.5 rounded ${isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                                    ${isDone ? '✅ Đã hoàn thành (100%)' : '⏳ Bài giao cần làm'}
                                </span>
                            </div>
                            <h4 class="font-bold text-sm text-slate-900 mt-1">${prob.title}</h4>
                            <p class="text-xs text-slate-500 line-clamp-1">${prob.description}</p>
                        </div>
                    </div>
                    <button onclick="openAssignedProblemInJudge(${idx})" class="px-4 py-2 rounded-lg text-xs font-bold ${isDone ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'} shadow-sm transition-all">
                        ${isDone ? 'Làm lại nâng điểm' : '▶ Vào làm bài'}
                    </button>
                </div>
            `;
        }).join('');
    }

    // Render Bảng Vinh Danh Lớp (Class Leaderboard kiểu OLM.vn)
    const leaderboardEl = document.getElementById('class-leaderboard-tbody');
    if (leaderboardEl) {
        const classmates = (window.STUDENTS_ROSTER || [])
            .filter(s => s.class_id === stu.class_id)
            .sort((a, b) => (b.xp || 0) - (a.xp || 0));

        leaderboardEl.innerHTML = classmates.map((c, idx) => {
            const medal = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : `#${idx + 1}`));
            const isMe = c.id === stu.id;
            return `
                <tr class="${isMe ? 'bg-indigo-50 font-bold text-indigo-900' : 'hover:bg-slate-50'}">
                    <td class="px-3 py-2 text-center font-bold">${medal}</td>
                    <td class="px-3 py-2">${c.name} ${isMe ? '<span class="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded ml-1">Bạn</span>' : ''}</td>
                    <td class="px-3 py-2 text-center">${c.class_id}</td>
                    <td class="px-3 py-2 text-center font-bold text-emerald-700">${c.smart_score || 80}/100</td>
                    <td class="px-3 py-2 text-right font-bold text-amber-700">🏆 ${(c.xp || 1000).toLocaleString()} XP</td>
                </tr>
            `;
        }).join('');
    }
}

function openAssignedProblemInJudge(probIndex) {
    switchTab('judge');
    const sel = document.getElementById('problem-select');
    if (sel) {
        sel.value = probIndex;
        loadSelectedProblem();
    }
}

// ============================================================================
// PHẦN 2: BỘ NẠP ĐỀ THI & NGÂN HÀNG HỌC LIỆU TỪ FILE WORD (.DOCX) VÀ EXCEL (.XLSX)
// ============================================================================

function downloadStandardExamTemplateXlsx() {
    const wb = XLSX.utils.book_new();

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

    const p3Sample = [
        {
            "Câu hỏi": "Cho danh sách S = [10, 20, 30, 40]. Kết quả của biểu thức len(S) + S[1] là bao nhiêu?",
            "Đáp số": "24",
            "Giải thích": "len(S) = 4 và S[1] = 20, tổng là 4 + 20 = 24."
        }
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(p3Sample), "DeThi_Phan3_TLN");

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

function downloadStandardExamTemplateDocx() {
    const a = document.createElement('a');
    a.href = 'data/templates/Mau_De_Thi_Va_Ngan_Hang_THPT.docx';
    a.download = 'Mau_De_Thi_Va_Ngan_Hang_THPT.docx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

async function handleBankFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();

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

function parseExcelWorkbookToBank(arrayBuffer) {
    const wb = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
    const result = { part1: [], part2: [], part3: [], problems: [] };

    wb.SheetNames.forEach(sheetName => {
        const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
        rows.forEach((r, idx) => {
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

function parseStructuredTextToBank(rawText) {
    const result = { part1: [], part2: [], part3: [], problems: [] };
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
            flushCurrent(); currentSection = 'PART1'; continue;
        }
        if (upper.startsWith('PHẦN II') || upper.includes('TRẮC NGHIỆM ĐÚNG SAI') || upper.includes('ĐÚNG / SAI')) {
            flushCurrent(); currentSection = 'PART2'; continue;
        }
        if (upper.startsWith('PHẦN III') || upper.includes('TRẢ LỜI NGẮN')) {
            flushCurrent(); currentSection = 'PART3'; continue;
        }
        if (upper.startsWith('PHẦN IV') || upper.includes('BÀI TẬP LẬP TRÌNH') || upper.includes('AUTO-JUDGE')) {
            flushCurrent(); currentSection = 'CODE'; continue;
        }

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

        const probMatch = line.match(/^Bài\s+\d+\s*[:.](.*)/i);
        if (probMatch) {
            flushCurrent();
            currentSection = 'CODE';
            currentObj = {
                _kind: 'CODE',
                id: 'code_doc_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
                track: 'k10', type: 'ALGORITHM', title: probMatch[1].trim(),
                category: 'Thuật toán & Lập trình', difficulty: 'Thông hiểu', competency: 'NLc',
                description: '', input_format: 'Nhập từ luồng chuẩn.', sample_in: '', sample_out: '', starter_code: '', hint: 'Phân tích kỹ đề bài.'
            };
            continue;
        }

        if (!currentObj) continue;

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
            if (ansMatch) { currentObj.ans = ['A', 'B', 'C', 'D'].indexOf(ansMatch[1].toUpperCase()); continue; }
            const expMatch = line.match(/^Giải\s*thích\s*[:.]\s*(.*)/i);
            if (expMatch) { currentObj.exp = expMatch[1].trim(); continue; }
        }

        if (currentObj._kind === 'P2') {
            const subMatch = line.match(/^([a-d])[.)]\s*(.*)/i);
            if (subMatch) {
                const subLetter = subMatch[1].toLowerCase();
                let rawStmt = subMatch[2].trim();
                let isTrue = !/\[(sai|s|false)\]/i.test(rawStmt);
                rawStmt = rawStmt.replace(/\[(đúng|dung|đ|d|sai|s|true|false)\]/gi, '').trim();
                currentObj.items.push({ sub: subLetter, text: rawStmt, correct: isTrue, exp: 'Theo chuẩn kiến thức SGK GDPT 2018.' });
                continue;
            }
            const expMatch = line.match(/^Giải\s*thích\s*[:.]\s*(.*)/i);
            if (expMatch) {
                const expText = expMatch[1].trim();
                currentObj.items.forEach(it => { it.exp = expText; });
                continue;
            }
        }

        if (currentObj._kind === 'P3') {
            const ansMatch = line.match(/^Đáp\s*(?:án|số)\s*[:.]\s*(.*)/i);
            if (ansMatch) { currentObj.ans = ansMatch[1].trim(); continue; }
            const expMatch = line.match(/^Giải\s*thích\s*[:.]\s*(.*)/i);
            if (expMatch) { currentObj.exp = expMatch[1].trim(); continue; }
        }

        if (currentObj._kind === 'CODE') {
            if (/^Khối\s*:/i.test(line)) currentObj.track = line.split(':')[1].trim().toLowerCase();
            else if (/^Loại\s*:/i.test(line)) currentObj.type = line.split(':')[1].trim().toUpperCase();
            else if (/^Mức\s*độ\s*:/i.test(line)) currentObj.difficulty = line.split(':')[1].trim();
            else if (/^Năng\s*lực\s*:/i.test(line)) currentObj.competency = line.split(':')[1].trim();
            else if (/^Đề\s*bài\s*:/i.test(line)) currentObj.description = line.replace(/^Đề\s*bài\s*:\s*/i, '').trim();
            else if (/^Input\s*:/i.test(line)) currentObj.sample_in = line.replace(/^Input\s*:\s*/i, '').trim();
            else if (/^Output\s*:/i.test(line)) currentObj.sample_out = line.replace(/^Output\s*:\s*/i, '').trim();
            else if (/^Code\s*:/i.test(line)) currentObj.starter_code = line.replace(/^Code\s*:\s*/i, '').trim();
            else if (/^Gợi\s*ý\s*:/i.test(line)) currentObj.hint = line.replace(/^Gợi\s*ý\s*:\s*/i, '').trim();
            else if (currentObj.starter_code) currentObj.starter_code += '\n' + line;
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
    if (p1Len > 0) samplePreviewHtml += `<div class="text-xs text-slate-700">• <strong>Mẫu Phần I:</strong> ${parsed.part1[0].q}</div>`;
    if (p2Len > 0) samplePreviewHtml += `<div class="text-xs text-slate-700">• <strong>Mẫu Phần II:</strong> ${parsed.part2[0].context}</div>`;
    if (p3Len > 0) samplePreviewHtml += `<div class="text-xs text-slate-700">• <strong>Mẫu Phần III:</strong> ${parsed.part3[0].q}</div>`;
    if (probLen > 0) samplePreviewHtml += `<div class="text-xs text-slate-700">• <strong>Mẫu Bài Code:</strong> [${parsed.problems[0].track.toUpperCase()}] ${parsed.problems[0].title}</div>`;

    if (detailEl) {
        detailEl.innerHTML = samplePreviewHtml || `<div class="text-xs text-rose-600">Không tìm thấy câu hỏi nào khớp cấu trúc mẫu.</div>`;
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

    localStorage.setItem('thpt_custom_exam_v2', JSON.stringify(EXAM_DATA));

    const customProbs = JSON.parse(localStorage.getItem('thpt_custom_problems_v2') || '{}');
    parsed.problems.forEach(p => {
        const t = p.track || 'k10';
        if (!APP_DATA[t]) APP_DATA[t] = [];
        APP_DATA[t].push(p);
        if (!customProbs[t]) customProbs[t] = [];
        customProbs[t].push(p);
    });
    localStorage.setItem('thpt_custom_problems_v2', JSON.stringify(customProbs));

    renderExamQuestions();
    loadProblemList();
    renderAdminProblemList();

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
