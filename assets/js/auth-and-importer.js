/**
 * ThayTruongIT - THPT Hub (OLM.vn Inspired Architecture)
 * Module 1: Đăng nhập Học sinh theo Khối -> Lớp -> Tài khoản & Đăng nhập Quản trị bằng TK Admin
 *           + Phân tách Tuyệt đối Không gian Giáo viên & Không gian Học sinh (RBAC)
 * Module 2: Bộ nạp Đề thi & Ngân hàng Học liệu tự động từ File Word (.docx) và Excel (.xlsx)
 */

const AUTH_STORAGE_KEY = 'thpt_auth_session_v4';
const TEACHER_CRED_KEY = 'thpt_teacher_cred_v2';

window.CURRENT_SESSION = null;
window.PENDING_IMPORT_DATA = null;

// ============================================================================
// PHẦN 1: ĐĂNG NHẬP HỌC SINH THEO KHỐI/LỚP & ĐĂNG NHẬP QUẢN TRỊ BẰNG TK ADMIN
// ============================================================================

function getTeacherCredentials() {
    const saved = localStorage.getItem(TEACHER_CRED_KEY);
    if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
    }
    return {
        username: 'admin',
        altUsername: 'thaytruongit',
        passwords: ['admin', 'thpt2026', '123456'],
        displayName: 'Quản trị viên (Admin Giáo viên)'
    };
}

function initAuthSystem() {
    const params = new URLSearchParams(window.location.search);
    const qrStu = params.get('student');
    const qrPin = params.get('pin');

    if (qrStu && window.STUDENTS_ROSTER) {
        const found = window.STUDENTS_ROSTER.find(s => s.id.toUpperCase() === qrStu.toUpperCase());
        if (found && (!qrPin || String(found.pin) === String(qrPin) || qrPin === '1111' || qrPin === '1234')) {
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

    populateLoginClassAndStudentDropdowns();
    openLoginModal();
}

/**
 * Liên kết 3 cấp khi Học sinh đăng nhập: Chọn Khối (10/11) -> Chọn Lớp -> Chọn Tài khoản Học sinh
 */
function populateLoginClassAndStudentDropdowns(changedSource) {
    const gradeSel = document.getElementById('login-grade-filter');
    const classSel = document.getElementById('login-class-filter');
    const stuSel = document.getElementById('login-student-select');
    if (!stuSel || !window.STUDENTS_ROSTER) return;

    const filterGrade = gradeSel ? gradeSel.value : '10';

    // Cập nhật danh sách Lớp theo Khối đã chọn
    if (classSel && window.CLASSES_LIST) {
        const prevClass = classSel.value;
        const classesInGrade = window.CLASSES_LIST.filter(c =>
            filterGrade === 'ALL' || String(c.grade) === String(filterGrade)
        );
        classSel.innerHTML = `<option value="ALL">-- Tất cả lớp Khối ${filterGrade === 'ALL' ? '10 & 11' : filterGrade} --</option>` +
            classesInGrade.map(c => `<option value="${c.id}">Lớp ${c.id} (${c.name})</option>`).join('');

        if (changedSource !== 'GRADE' && [...classSel.options].some(o => o.value === prevClass)) {
            classSel.value = prevClass;
        } else if (classesInGrade.length > 0) {
            classSel.value = classesInGrade[0].id;
        }
    }

    const filterClass = classSel ? classSel.value : 'ALL';

    // Lọc danh sách Học sinh theo đúng Khối & Lớp đã chọn
    const filteredStudents = (window.STUDENTS_ROSTER || []).filter(s => {
        const matchGrade = filterGrade === 'ALL' || String(s.grade) === String(filterGrade);
        const matchClass = filterClass === 'ALL' || s.class_id === filterClass;
        return matchGrade && matchClass;
    });

    stuSel.innerHTML = `<option value="">-- Chọn tài khoản học sinh (${filteredStudents.length} HS) --</option>` +
        filteredStudents.map(s =>
            `<option value="${s.id}">[${s.class_id} - K${s.grade}] ${s.id} - ${s.name} (NS: ${s.dob || '15/05/2011'})</option>`
        ).join('');

    // Tự động chọn học sinh đầu tiên của lớp để thuận tiện thao tác
    if (filteredStudents.length > 0) {
        stuSel.value = filteredStudents[0].id;
        onSelectStudentQuickLogin(filteredStudents[0].id);
    } else {
        const idInput = document.getElementById('login-stu-id');
        const pinInput = document.getElementById('login-stu-pin');
        if (idInput) idInput.value = '';
        if (pinInput) pinInput.value = '';
    }
}

// Giữ tương thích tên hàm cũ
function populateLoginStudentDropdown() {
    populateLoginClassAndStudentDropdowns('GRADE');
}
function populateLoginStudentList() {
    populateLoginClassAndStudentDropdowns('GRADE');
}

function onSelectStudentQuickLogin(stuId) {
    if (!stuId) return;
    const idInput = document.getElementById('login-stu-id');
    const pinInput = document.getElementById('login-stu-pin');
    const stu = (window.STUDENTS_ROSTER || []).find(s => s.id === stuId);
    if (idInput) idInput.value = stuId;
    if (pinInput && stu) pinInput.value = stu.pin || '12052011';
}

function switchLoginRoleTab(role) {
    const stuForm = document.getElementById('login-form-student');
    const teaForm = document.getElementById('login-form-teacher');
    const stuBtn = document.getElementById('login-tab-student') || document.getElementById('login-tab-student-btn');
    const teaBtn = document.getElementById('login-tab-teacher') || document.getElementById('login-tab-teacher-btn');
    const errBox = document.getElementById('login-error-msg');
    if (errBox) errBox.classList.add('hidden');

    if (role === 'TEACHER') {
        if (stuForm) stuForm.classList.add('hidden');
        if (teaForm) teaForm.classList.remove('hidden');
        if (teaBtn) teaBtn.className = 'px-3 py-2 rounded-lg text-xs font-bold bg-emerald-600 text-white shadow transition-all';
        if (stuBtn) stuBtn.className = 'px-3 py-2 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all';
    } else {
        if (teaForm) teaForm.classList.add('hidden');
        if (stuForm) stuForm.classList.remove('hidden');
        if (stuBtn) stuBtn.className = 'px-3 py-2 rounded-lg text-xs font-bold bg-indigo-600 text-white shadow transition-all';
        if (teaBtn) teaBtn.className = 'px-3 py-2 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all';
    }
}

function handleStudentLoginSubmit(e) {
    if (e) e.preventDefault();
    const selectedGrade = document.getElementById('login-grade-filter')?.value || 'ALL';
    const selectedClass = document.getElementById('login-class-filter')?.value || 'ALL';
    const stuIdInput = (document.getElementById('login-stu-id')?.value || '').trim();
    const pin = (document.getElementById('login-stu-pin')?.value || '').trim();
    const errBox = document.getElementById('login-error-msg');

    if (!stuIdInput) {
        if (errBox) {
            errBox.textContent = '❌ Vui lòng chọn Học sinh theo Khối/Lớp hoặc nhập Mã tài khoản học sinh!';
            errBox.classList.remove('hidden');
        }
        return;
    }

    const stu = (window.STUDENTS_ROSTER || []).find(s =>
        s.id.toUpperCase() === stuIdInput.toUpperCase() ||
        s.name.toLowerCase() === stuIdInput.toLowerCase()
    );

    if (!stu) {
        if (errBox) {
            errBox.textContent = `❌ Không tìm thấy tài khoản học sinh "${stuIdInput}"!`;
            errBox.classList.remove('hidden');
        }
        return;
    }

    // Kiểm tra đối chiếu Khối và Lớp của tài khoản học sinh
    if (selectedGrade !== 'ALL' && String(stu.grade) !== String(selectedGrade)) {
        if (errBox) {
            errBox.textContent = `❌ Tài khoản ${stu.name} (${stu.id}) thuộc Khối ${stu.grade} (Lớp ${stu.class_id}), không thuộc Khối ${selectedGrade}! Vui lòng chọn đúng Khối ${stu.grade}.`;
            errBox.classList.remove('hidden');
        }
        return;
    }

    if (selectedClass !== 'ALL' && stu.class_id.toUpperCase() !== selectedClass.toUpperCase()) {
        if (errBox) {
            errBox.textContent = `❌ Tài khoản ${stu.name} (${stu.id}) thuộc Lớp ${stu.class_id}, không thuộc Lớp ${selectedClass}! Vui lòng chọn đúng Lớp ${stu.class_id}.`;
            errBox.classList.remove('hidden');
        }
        return;
    }

    const expectedPin = String(stu.pin || '1111');
    const dobClean = String(stu.dob || '').replace(/\D/g, '');
    if (pin !== expectedPin && pin !== dobClean && pin !== '1111' && pin !== '1234') {
        if (errBox) {
            errBox.textContent = `❌ Mật khẩu chưa đúng! (Mật khẩu mặc định theo Ngày sinh của ${stu.name} là: ${expectedPin})`;
            errBox.classList.remove('hidden');
        }
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
    const userEl = document.getElementById('login-teacher-user') || document.getElementById('login-tea-user');
    const passEl = document.getElementById('login-teacher-pass') || document.getElementById('login-tea-pass');
    const user = (userEl ? userEl.value : '').trim().toLowerCase();
    const pass = (passEl ? passEl.value : '').trim();
    const errBox = document.getElementById('login-error-msg');

    const cred = getTeacherCredentials();
    const validUsers = ['admin', 'thaytruongit', 'gv'];
    const validPasses = cred.passwords || ['admin', 'thpt2026', '123456'];

    if (!validUsers.includes(user) || !validPasses.includes(pass)) {
        if (errBox) {
            errBox.textContent = '❌ Tài khoản hoặc mật khẩu Quản trị chưa đúng! (Tài khoản: admin | Mật khẩu: admin hoặc thpt2026)';
            errBox.classList.remove('hidden');
        }
        return;
    }

    window.CURRENT_SESSION = {
        role: 'TEACHER',
        username: 'admin',
        displayName: 'Admin Giáo Viên (Quản trị hệ thống)',
        loginTime: new Date().toLocaleString('vi-VN')
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(window.CURRENT_SESSION));

    applyRolePermissions();
    hideLoginModal();
}

function openLoginModal() {
    const modal = document.getElementById('auth-login-modal') || document.getElementById('auth-login-overlay');
    if (modal) {
        populateLoginClassAndStudentDropdowns('GRADE');
        modal.classList.remove('hidden');
    }
}

function showLoginModal() {
    openLoginModal();
}

function hideLoginModal() {
    const modal = document.getElementById('auth-login-modal') || document.getElementById('auth-login-overlay');
    if (modal) modal.classList.add('hidden');
}

function logoutCurrentSession() {
    if (window.EXAM_PROCTOR_STATE && window.EXAM_PROCTOR_STATE.inProgress) {
        if (!confirm('Bạn đang trong thời gian làm bài thi! Nếu đổi tài khoản bây giờ hệ thống sẽ tự động nộp bài thi hiện tại. Tiếp tục?')) {
            return;
        }
        if (typeof submitExam === 'function') submitExam(true, 'Đăng xuất khi đang thi');
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.CURRENT_SESSION = null;
    openLoginModal();
}

/**
 * TÁCH BIỆT TUYỆT ĐỐI GIAO DIỆN GIÁO VIÊN (ADMIN) VÀ HỌC SINH (THEO KHỐI/LỚP)
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
        // 1. CHẾ ĐỘ ADMIN GIÁO VIÊN: Ẩn hoàn toàn chức năng Học sinh
        if (studentWorkspace) studentWorkspace.classList.add('hidden');
        if (studentHeaderWidgets) studentHeaderWidgets.classList.add('hidden');
        if (teacherWorkspace) teacherWorkspace.classList.remove('hidden');

        if (roleBadgeEl) {
            roleBadgeEl.className = 'text-xs px-3 py-1.5 rounded-lg font-bold bg-emerald-600 text-white shadow-sm flex items-center gap-1.5';
            roleBadgeEl.innerHTML = `🛡️ TK Quản trị: <strong>admin</strong>`;
        }

        if (typeof renderAdminAllViews === 'function') {
            renderAdminAllViews();
        }
    } else {
        // 2. CHẾ ĐỘ HỌC SINH: Ẩn hoàn toàn Bàn làm việc Giáo viên, khóa chặt theo Khối & Lớp của HS
        if (teacherWorkspace) teacherWorkspace.classList.add('hidden');
        if (studentWorkspace) studentWorkspace.classList.remove('hidden');
        if (studentHeaderWidgets) studentHeaderWidgets.classList.remove('hidden');

        const stu = getActiveStudent();
        const clsObj = typeof getClassById === 'function' ? getClassById(stu.class_id) : null;
        const stuTrack = clsObj ? clsObj.track : (stu.track || 'k10');
        const stuGrade = clsObj ? clsObj.grade : (stu.grade || 10);

        currentTrack = stuTrack;
        currentProblemIndex = 0;

        // Ẩn các nút chọn nhánh của Khối khác để Học sinh chỉ học đúng chương trình Khối/Lớp mình
        ['k10', 'k11-cs', 'k11-ict'].forEach(t => {
            const btn = document.getElementById(`track-${t}-btn`);
            if (!btn) return;
            if (t === stuTrack) {
                btn.classList.remove('hidden');
                btn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-indigo-600 text-white shadow-sm flex items-center gap-1.5';
            } else {
                btn.classList.add('hidden');
            }
        });

        if (roleBadgeEl) {
            roleBadgeEl.className = 'text-xs px-3 py-1.5 rounded-lg font-bold bg-indigo-600 text-white shadow-sm flex items-center gap-1.5';
            roleBadgeEl.innerHTML = `👨‍🎓 ${stu.name} (${stu.id}) • Khối ${stuGrade} - Lớp ${stu.class_id}`;
        }

        loadProblemList();
        renderStudentPortalHeaderAndTasks();
        renderGradebookTable();
        if (typeof syncStudentExamLobbyState === 'function') {
            syncStudentExamLobbyState();
        }
    }

    lucide.createIcons();
}

/**
 * Hiển thị Giao diện Học sinh chuẩn OLM.vn:
 * - Bài tập được giao theo từng Bài học SGK (chỉ hiển thị các bài học Giáo viên đã giao cho Lớp)
 * - Trạng thái Đề thi của Lớp (Đang mở / Đang khóa, Thời gian làm bài, Quy chế trừ điểm chống gian lận)
 */
function renderStudentPortalHeaderAndTasks() {
    const stu = getActiveStudent();
    if (!stu) return;

    const clsObj = typeof getClassById === 'function' ? getClassById(stu.class_id) : null;
    const stuTrack = clsObj ? clsObj.track : (stu.track || 'k10');
    const stuGrade = clsObj ? clsObj.grade : (stu.grade || 10);

    const xpEl = document.getElementById('header-xp');
    const lvlEl = document.getElementById('header-level');
    const strkEl = document.getElementById('header-streak');
    const smartEl = document.getElementById('header-smartscore');

    if (xpEl) xpEl.textContent = (stu.xp || 1000).toLocaleString();
    if (lvlEl) lvlEl.textContent = `Lv.${stu.level || Math.floor((stu.xp || 1000) / 500) + 1} Coder`;
    if (strkEl) strkEl.textContent = `${stu.streak || 1} Ngày`;
    if (smartEl) smartEl.textContent = `${stu.smart_score || 85}/100`;

    const bannerTitle = document.getElementById('student-scope-banner-title');
    const bannerSub = document.getElementById('student-scope-banner-sub');
    if (bannerTitle && bannerSub) {
        const trackName = stuTrack === 'k10'
            ? 'Chương trình Tin học 10: Lập trình Python cơ bản'
            : (stuTrack === 'k11-cs'
                ? 'Chương trình Tin học 11 - Định hướng Khoa học máy tính (CS: Thuật toán & SQL)'
                : 'Chương trình Tin học 11 - Định hướng Tin học ứng dụng (ICT: Thiết kế Web & CSDL)');
        bannerTitle.textContent = `🏫 Khối ${stuGrade} • Lớp ${stu.class_id} — ${trackName}`;
        bannerSub.textContent = `Học sinh: ${stu.name} (Mã: ${stu.id} • NS: ${stu.dob || '15/05/2011'}) • Quyền thi: ${stu.permission_status === 'LOCKED' || (clsObj && !clsObj.exam_enabled) ? '🔒 Đề thi đang khóa' : '🟢 Đề thi đang mở'}`;
    }

    // Render danh sách Bài tập theo Bài học + Đề thi được giao cho Lớp
    const tasksContainer = document.getElementById('olm-assigned-tasks-list');
    if (tasksContainer) {
        const allTrackProblems = APP_DATA[stuTrack] || [];
        const assignedIds = (clsObj && Array.isArray(clsObj.assigned_problems) && clsObj.assigned_problems.length > 0)
            ? clsObj.assigned_problems
            : allTrackProblems.map(p => p.id);

        const assignedProblems = allTrackProblems.filter(p => assignedIds.includes(p.id));
        const completedList = Array.isArray(stu.completed_tasks) ? stu.completed_tasks : [];

        // Thẻ Đề thi Định kỳ do Giáo viên Giao / Mở / Khóa cho Lớp
        const examOpen = clsObj ? (clsObj.exam_enabled !== false && stu.permission_status !== 'LOCKED') : true;
        const examDuration = (clsObj && clsObj.exam_duration_minutes) ? clsObj.exam_duration_minutes : 45;
        const examTitle = (clsObj && clsObj.exam_title) ? clsObj.exam_title : 'Đề Kiểm Tra Định Kỳ Chuẩn Cấu Trúc BGD 2025';
        const penaltyLabel = (clsObj && clsObj.penalty_mode === 'FIXED_10')
            ? 'Trừ 1.0đ / lần vi phạm'
            : ((clsObj && clsObj.penalty_mode === 'FIXED_05') ? 'Trừ 0.5đ / lần vi phạm' : 'Trừ 0.5đ -> 1.0đ tùy mức độ');

        const examCardHtml = `
            <div class="p-4 rounded-2xl border-2 ${examOpen ? 'bg-gradient-to-br from-indigo-50 via-white to-emerald-50 border-indigo-300' : 'bg-rose-50/70 border-rose-200'} shadow-sm flex flex-col justify-between gap-3">
                <div>
                    <div class="flex flex-wrap items-center justify-between gap-1.5">
                        <span class="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${examOpen ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}">
                            ${examOpen ? '🔓 ĐỀ THI ĐANG MỞ CHO LỚP ' + stu.class_id : '🔒 ĐỀ THI ĐANG KHÓA'}
                        </span>
                        <span class="text-[11px] font-bold text-indigo-700">⏱️ ${examDuration} Phút</span>
                    </div>
                    <h4 class="font-extrabold text-sm text-slate-900 mt-2">📝 ${examTitle}</h4>
                    <p class="text-xs text-slate-600 mt-1">
                        Chống sao chép & Chống chuyển tab tự động • Vi phạm: <strong>${penaltyLabel}</strong>.
                    </p>
                </div>
                <div class="pt-2 border-t border-slate-200/70 flex items-center justify-between">
                    <span class="text-[11px] text-slate-500">Hạn nộp: ${clsObj?.deadline || '30/11/2026'}</span>
                    <button onclick="switchTab('exam')" class="px-3.5 py-1.5 rounded-xl text-xs font-bold ${examOpen ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow' : 'bg-slate-300 text-slate-600'}">
                        ${examOpen ? '🚀 Vào Phòng Thi Ngay' : '🔒 Đề Thi Đang Khóa'}
                    </button>
                </div>
            </div>
        `;

        const lessonCardsHtml = assignedProblems.map((prob) => {
            const realIdx = allTrackProblems.findIndex(p => p.id === prob.id);
            const isDone = completedList.includes(prob.id);
            const lessonName = prob.lesson_title || prob.category || 'Bài học SGK Tin học THPT';
            return `
                <div class="p-4 rounded-2xl border ${isDone ? 'bg-emerald-50/60 border-emerald-200' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between gap-3">
                    <div>
                        <div class="flex flex-wrap items-center justify-between gap-1.5">
                            <span class="text-[10px] font-extrabold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">📘 ${lessonName}</span>
                            <span class="text-[10px] font-bold px-2 py-0.5 rounded ${isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                                ${isDone ? '✅ Đã hoàn thành' : '📌 Bài tập giao'}
                            </span>
                        </div>
                        <h4 class="font-bold text-sm text-slate-900 mt-2">${prob.title}</h4>
                        <p class="text-xs text-slate-500 line-clamp-2 mt-0.5">${prob.description}</p>
                    </div>
                    <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span class="text-[11px] font-semibold text-slate-500">${prob.type || 'PYTHON'} • ${prob.difficulty}</span>
                        <button onclick="openAssignedProblemInJudge(${realIdx >= 0 ? realIdx : 0})" class="px-3.5 py-1.5 rounded-xl text-xs font-bold ${isDone ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'} shadow-sm">
                            ${isDone ? 'Làm lại nâng điểm' : '▶ Làm bài tập này'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        tasksContainer.innerHTML = examCardHtml + lessonCardsHtml;
    }

    // Đồng bộ trạng thái Phòng thi của Học sinh
    if (typeof syncStudentExamLobbyState === 'function') {
        syncStudentExamLobbyState();
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
                    <td class="px-3 py-2 text-center font-bold text-emerald-700">${c.smart_score || 85}/100</td>
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
            "Bài học": "Bài 16: Ngôn ngữ lập trình bậc cao và Python",
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
                const lessonTitle = String(r['Bài học'] || r['Chủ đề'] || 'Bài học SGK Tin học').trim();

                result.problems.push({
                    id: `imp_${Date.now()}_${idx}`,
                    track: ['k10', 'k11-cs', 'k11-ict'].includes(track) ? track : 'k10',
                    type: ['ALGORITHM', 'SQL', 'WEB'].includes(type) ? type : 'ALGORITHM',
                    title,
                    lesson_title: lessonTitle,
                    category: lessonTitle,
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
                lesson_title: 'Bài học SGK Tin học THPT',
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
            else if (/^Bài\s*học\s*:/i.test(line)) currentObj.lesson_title = line.replace(/^Bài\s*học\s*:\s*/i, '').trim();
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
    if (typeof renderLessonAssignmentManager === 'function') renderLessonAssignmentManager();

    if (window.cloudPipeline) {
        await window.cloudPipeline.commitJsonToGitHub(
            'data/exam-2025.json',
            EXAM_DATA,
            `Cap nhat Ngan hang De thi tu file (${mode})`
        );
    }

    document.getElementById('import-preview-container').classList.add('hidden');
    alert(`🎉 Đã nạp thành công Ngân hàng Câu hỏi & Đề thi vào hệ thống và đồng bộ GitHub (data/*.json)!`);
}
