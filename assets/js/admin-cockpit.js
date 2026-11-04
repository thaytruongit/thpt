/**
 * ThayTruongIT - THPT Hub (OLM.vn Inspired LMS Architecture)
 * 1. Quản lý Lớp học theo Khối 10/11, Nạp Tài khoản (Họ tên, Lớp, Ngày sinh), Đổi quyền theo Lớp/Khối
 * 2. Giao bài tập theo Bài học SGK & Điều khiển Đề thi (Giao đề, Mở đề, Khóa đề, Cấu hình thời gian & Mức trừ điểm)
 * 3. Engine Giám sát Thi trực tuyến: Đếm ngược thời gian, Chống sao chép, Chống chuyển tab, Cảnh báo trừ 0.5 -> 1.0 điểm
 */

let SQL_ENGINE = null;
let CURRENT_STUDENT_ID = 'HS1001';
let FOCUS_LOCK_ACTIVE = false;
let EXAM_SHUFFLE_CODE = '101';

// Trạng thái Phiên làm bài thi có giám sát của Học sinh
window.EXAM_PROCTOR_STATE = {
    inProgress: false,
    submitted: false,
    timerInterval: null,
    durationMinutes: 45,
    remainingSeconds: 45 * 60,
    penaltyMode: 'TIERED', // 'TIERED' (0.5đ -> 1.0đ), 'FIXED_05' (0.5đ), 'FIXED_10' (1.0đ)
    maxViolations: 3,
    violationsCount: 0,
    totalPenaltyPoints: 0,
    violationLogs: [],
    lastViolationTimestamp: 0
};

// Danh sách các Lớp học chuẩn theo Khối 10 & Khối 11
const DEFAULT_CLASSES = [
    {
        id: '10A1',
        name: 'Lớp 10A1',
        grade: 10,
        track: 'k10',
        track_label: 'Khối 10: Lập trình Python cơ bản',
        academic_year: '2026 - 2027',
        exam_enabled: true,
        practice_enabled: true,
        assigned_problems: ['py10_01', 'py10_02', 'py10_03', 'py10_04'],
        assigned_exam: true,
        exam_title: 'Đề Kiểm Tra Định Kỳ Giữa Kỳ - Tin Học 10 (Chuẩn BGD 2025)',
        exam_duration_minutes: 45,
        penalty_mode: 'TIERED',
        max_violations: 3,
        deadline: '2026-11-15'
    },
    {
        id: '10A2',
        name: 'Lớp 10A2',
        grade: 10,
        track: 'k10',
        track_label: 'Khối 10: Lập trình Python cơ bản',
        academic_year: '2026 - 2027',
        exam_enabled: true,
        practice_enabled: true,
        assigned_problems: ['py10_01', 'py10_02'],
        assigned_exam: true,
        exam_title: 'Đề Kiểm Tra Định Kỳ Giữa Kỳ - Tin Học 10 (Chuẩn BGD 2025)',
        exam_duration_minutes: 45,
        penalty_mode: 'TIERED',
        max_violations: 3,
        deadline: '2026-11-15'
    },
    {
        id: '11CS1',
        name: 'Lớp 11CS1 (Định hướng CS)',
        grade: 11,
        track: 'k11-cs',
        track_label: 'Khối 11: Khoa học máy tính (Thuật toán & SQL)',
        academic_year: '2026 - 2027',
        exam_enabled: true,
        practice_enabled: true,
        assigned_problems: ['cs11_algo_01', 'cs11_algo_02', 'cs11_sql_01', 'cs11_sql_02'],
        assigned_exam: true,
        exam_title: 'Đề Kiểm Tra Định Kỳ - Tin Học 11 Định Hướng CS (Chuẩn BGD 2025)',
        exam_duration_minutes: 45,
        penalty_mode: 'TIERED',
        max_violations: 3,
        deadline: '2026-11-20'
    },
    {
        id: '11ICT1',
        name: 'Lớp 11ICT1 (Định hướng ICT)',
        grade: 11,
        track: 'k11-ict',
        track_label: 'Khối 11: Tin học ứng dụng (Thiết kế Web & CSDL)',
        academic_year: '2026 - 2027',
        exam_enabled: true,
        practice_enabled: true,
        assigned_problems: ['ict11_web_01', 'ict11_web_02'],
        assigned_exam: true,
        exam_title: 'Đề Kiểm Tra Định Kỳ - Tin Học 11 Định Hướng ICT (Chuẩn BGD 2025)',
        exam_duration_minutes: 45,
        penalty_mode: 'TIERED',
        max_violations: 3,
        deadline: '2026-11-20'
    }
];

// Ánh xạ Bài học SGK chuẩn GDPT 2018 cho từng mã bài tập
const DEFAULT_LESSON_MAP = {
    'py10_01': 'Bài 16: Ngôn ngữ lập trình bậc cao và Python',
    'py10_02': 'Bài 19: Câu lệnh rẽ nhánh If - Else',
    'py10_03': 'Bài 20: Câu lệnh lặp For và Hàm trong Python',
    'py10_04': 'Bài 25: Kiểu dữ liệu Xâu ký tự (String)',
    'cs11_algo_01': 'Chủ đề F - Bài 11: Thuật toán Tìm kiếm nhị phân',
    'cs11_algo_02': 'Chủ đề F - Bài 12: Thuật toán Sắp xếp (Chia để trị)',
    'cs11_sql_01': 'Chủ đề F - Bài 15: Truy vấn CSDL quan hệ (SELECT - WHERE)',
    'cs11_sql_02': 'Chủ đề F - Bài 16: Truy vấn gom nhóm & Kết nối bảng SQL',
    'ict11_web_01': 'Chủ đề E - Bài 1: Cấu trúc ngữ nghĩa trang Web HTML5',
    'ict11_web_02': 'Chủ đề E - Bài 2: Định dạng CSS3 & Bố cục trang Web'
};

window.CLASSES_LIST = [];

// --- 1. TẢI DỮ LIỆU HỌC LIỆU, LỚP HỌC VÀ HỌC SINH TỪ GITHUB data/*.json ---
async function loadGitHubDataFiles() {
    const files = [
        { key: 'k10', path: 'data/grade10-python.json' },
        { key: 'k11-cs', path: 'data/grade11-cs.json' },
        { key: 'k11-ict', path: 'data/grade11-ict.json' }
    ];

    for (const item of files) {
        try {
            const res = await fetch(`${item.path}?v=${Date.now()}`);
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    APP_DATA[item.key] = data.map(p => ({
                        ...p,
                        lesson_title: p.lesson_title || DEFAULT_LESSON_MAP[p.id] || `Bài học: ${p.category || 'Chuyên đề Tin học'}`,
                        type: p.type || 'ALGORITHM',
                        sample_in: p.sample_in || p.sample_input || '',
                        sample_out: p.sample_out || p.sample_output || '',
                        testcases: p.testcases || []
                    }));
                }
            }
        } catch (err) {
            console.info(`[DataLoader] Sử dụng dữ liệu dự phòng cho ${item.path}`);
        }
    }

    // Gắn tên Bài học mặc định cho dữ liệu dự phòng
    ['k10', 'k11-cs', 'k11-ict'].forEach(k => {
        (APP_DATA[k] || []).forEach(p => {
            if (!p.lesson_title) {
                p.lesson_title = DEFAULT_LESSON_MAP[p.id] || `Bài học: ${p.category || 'Chuyên đề Tin học'}`;
            }
        });
    });

    // Hợp nhất các bài tập do Giáo viên thêm mới
    const customProbs = JSON.parse(localStorage.getItem('thpt_custom_problems_v2') || '{}');
    ['k10', 'k11-cs', 'k11-ict'].forEach(k => {
        if (Array.isArray(customProbs[k]) && customProbs[k].length > 0) {
            const existingIds = new Set((APP_DATA[k] || []).map(p => p.id));
            customProbs[k].forEach(cp => {
                if (!existingIds.has(cp.id)) {
                    APP_DATA[k].push(cp);
                }
            });
        }
    });

    // Tải cấu trúc Lớp học (Khối 10 & Khối 11)
    const savedClasses = localStorage.getItem('thpt_classes_v4');
    if (savedClasses) {
        try { window.CLASSES_LIST = JSON.parse(savedClasses); } catch (e) {}
    }
    if (!window.CLASSES_LIST || window.CLASSES_LIST.length === 0) {
        try {
            const cRes = await fetch(`data/classes-config.json?v=${Date.now()}`);
            if (cRes.ok) window.CLASSES_LIST = await cRes.json();
        } catch (e) {}
    }
    if (!window.CLASSES_LIST || window.CLASSES_LIST.length === 0) {
        window.CLASSES_LIST = JSON.parse(JSON.stringify(DEFAULT_CLASSES));
    }
    // Chuẩn hóa các trường cấu hình thi cho từng Lớp
    window.CLASSES_LIST.forEach(c => {
        if (!c.exam_title) c.exam_title = `Đề Kiểm Tra Định Kỳ - Lớp ${c.id} (Chuẩn BGD 2025)`;
        if (!c.exam_duration_minutes) c.exam_duration_minutes = 45;
        if (!c.penalty_mode) c.penalty_mode = 'TIERED';
        if (!c.max_violations) c.max_violations = 3;
        if (!Array.isArray(c.assigned_problems) || c.assigned_problems.length === 0) {
            c.assigned_problems = (APP_DATA[c.track] || []).map(p => p.id);
        }
    });
    saveClassesToStorage();

    // Tải danh sách tài khoản Học sinh
    const savedRoster = localStorage.getItem('thpt_roster_v3');
    if (savedRoster) {
        try { window.STUDENTS_ROSTER = JSON.parse(savedRoster); } catch (e) {}
    }
    if (!window.STUDENTS_ROSTER || window.STUDENTS_ROSTER.length === 0) {
        try {
            const rRes = await fetch(`data/students-roster.json?v=${Date.now()}`);
            if (rRes.ok) window.STUDENTS_ROSTER = await rRes.json();
        } catch (e) {}
    }
    saveRosterToStorage();

    // Khôi phục Đề thi đã nạp từ DOCX/XLSX nếu có
    const savedExam = localStorage.getItem('thpt_custom_exam_v2');
    if (savedExam) {
        try {
            const parsedExam = JSON.parse(savedExam);
            if (parsedExam.part1) EXAM_DATA.part1 = parsedExam.part1;
            if (parsedExam.part2) EXAM_DATA.part2 = parsedExam.part2;
            if (parsedExam.part3) EXAM_DATA.part3 = parsedExam.part3;
        } catch (e) {}
    }

    initAntiCheatEventListeners();

    if (typeof initAuthSystem === 'function') {
        initAuthSystem();
    }
}

function saveClassesToStorage() {
    localStorage.setItem('thpt_classes_v4', JSON.stringify(window.CLASSES_LIST));
}

function saveRosterToStorage() {
    localStorage.setItem('thpt_roster_v3', JSON.stringify(window.STUDENTS_ROSTER));
}

function getClassById(classId) {
    return (window.CLASSES_LIST || []).find(c => c.id.toUpperCase() === String(classId || '').toUpperCase()) || window.CLASSES_LIST[0];
}

function getActiveStudent() {
    return (window.STUDENTS_ROSTER || []).find(s => s.id === CURRENT_STUDENT_ID) || (window.STUDENTS_ROSTER && window.STUDENTS_ROSTER[0]);
}

function normalizeDobToPin(dobStr) {
    const digits = String(dobStr || '').replace(/\D/g, '');
    return digits.length >= 4 ? digits : '1111';
}

// ============================================================================
// 2. QUẢN LÝ LỚP HỌC THEO KHỐI 10, 11 & GIAO BÀI TẬP THEO BÀI HỌC
// ============================================================================

function createNewClassByGrade() {
    const classCode = (document.getElementById('new-class-code').value || '').trim().toUpperCase();
    const className = (document.getElementById('new-class-name').value || '').trim();
    const gradeVal = parseInt(document.getElementById('new-class-grade').value) || 10;
    const trackVal = document.getElementById('new-class-track').value || (gradeVal === 10 ? 'k10' : 'k11-cs');

    if (!classCode) {
        alert('Vui lòng nhập Mã lớp (VD: 10A3, 11CS2, 11ICT2)!');
        return;
    }

    if (window.CLASSES_LIST.some(c => c.id.toUpperCase() === classCode)) {
        alert(`Lớp "${classCode}" đã tồn tại trong hệ thống!`);
        return;
    }

    const trackLabels = {
        'k10': 'Khối 10: Lập trình Python cơ bản',
        'k11-cs': 'Khối 11: Khoa học máy tính (Thuật toán & SQL)',
        'k11-ict': 'Khối 11: Tin học ứng dụng (Thiết kế Web & CSDL)'
    };

    const defaultProblems = (APP_DATA[trackVal] || []).map(p => p.id);
    const newClassObj = {
        id: classCode,
        name: className || `Lớp ${classCode}`,
        grade: gradeVal,
        track: trackVal,
        track_label: trackLabels[trackVal] || trackLabels['k10'],
        academic_year: '2026 - 2027',
        exam_enabled: true,
        practice_enabled: true,
        assigned_problems: defaultProblems,
        assigned_exam: true,
        exam_title: `Đề Kiểm Tra Định Kỳ - Lớp ${classCode} (Chuẩn BGD 2025)`,
        exam_duration_minutes: 45,
        penalty_mode: 'TIERED',
        max_violations: 3,
        deadline: '2026-11-30'
    };

    window.CLASSES_LIST.push(newClassObj);
    saveClassesToStorage();
    renderAdminAllViews();

    document.getElementById('new-class-code').value = '';
    document.getElementById('new-class-name').value = '';
    alert(`✅ Đã tạo mới thành công "${newClassObj.name}" thuộc Khối ${gradeVal} (${newClassObj.track_label})!`);
}

function onSelectGradeForNewClass(gradeVal) {
    const trackSel = document.getElementById('new-class-track');
    if (!trackSel) return;
    if (String(gradeVal) === '10') {
        trackSel.innerHTML = `<option value="k10">Khối 10: Lập trình Python cơ bản</option>`;
    } else {
        trackSel.innerHTML = `
            <option value="k11-cs">Khối 11 - Định hướng Khoa học máy tính (CS)</option>
            <option value="k11-ict">Khối 11 - Định hướng Tin học ứng dụng (ICT)</option>
        `;
    }
}

function toggleClassExamPermission(classId) {
    const cls = getClassById(classId);
    if (!cls) return;
    cls.exam_enabled = !cls.exam_enabled;
    saveClassesToStorage();
    renderAdminAllViews();
    if (typeof renderStudentPortalHeaderAndTasks === 'function') {
        renderStudentPortalHeaderAndTasks();
    }
}

function setClassExamState(classId, isOpen) {
    if (classId === 'ALL') {
        (window.CLASSES_LIST || []).forEach(c => { c.exam_enabled = isOpen; });
    } else {
        const cls = getClassById(classId);
        if (cls) cls.exam_enabled = isOpen;
    }
    saveClassesToStorage();
    renderAdminAllViews();
    if (typeof renderStudentPortalHeaderAndTasks === 'function') {
        renderStudentPortalHeaderAndTasks();
    }
    alert(isOpen
        ? `🔓 Đã MỞ ĐỀ THI cho ${classId === 'ALL' ? 'toàn bộ các lớp' : 'Lớp ' + classId}! Học sinh đã có thể vào làm bài.`
        : `🔒 Đã KHÓA ĐỀ THI đối với ${classId === 'ALL' ? 'toàn bộ các lớp' : 'Lớp ' + classId}! Học sinh không thể truy cập đề thi.`
    );
}

function deleteClassById(classId) {
    const count = (window.STUDENTS_ROSTER || []).filter(s => s.class_id === classId).length;
    if (count > 0 && !confirm(`Lớp ${classId} đang có ${count} học sinh. Bạn có chắc chắn muốn xóa lớp này không?`)) {
        return;
    }
    window.CLASSES_LIST = window.CLASSES_LIST.filter(c => c.id !== classId);
    saveClassesToStorage();
    renderAdminAllViews();
}

/**
 * GIAO BÀI TẬP THEO BÀI HỌC CHO TỪNG LỚP / KHỐI
 */
function renderLessonAssignmentManager() {
    const classSel = document.getElementById('assign-lesson-class-select');
    const checklistContainer = document.getElementById('assign-lesson-checklist');
    const deadlineInput = document.getElementById('assign-lesson-deadline');
    if (!classSel || !checklistContainer) return;

    const currentClassId = classSel.value || (window.CLASSES_LIST[0] && window.CLASSES_LIST[0].id) || '10A1';
    const cls = getClassById(currentClassId);
    if (!cls) return;

    if (deadlineInput && cls.deadline) {
        deadlineInput.value = cls.deadline;
    }

    const trackProblems = APP_DATA[cls.track] || [];
    const assignedSet = new Set(cls.assigned_problems || []);

    checklistContainer.innerHTML = trackProblems.map(p => {
        const checked = assignedSet.has(p.id) ? 'checked' : '';
        const lessonLabel = p.lesson_title || DEFAULT_LESSON_MAP[p.id] || p.category;
        return `
            <label class="p-3 rounded-xl border ${checked ? 'bg-indigo-50/70 border-indigo-300' : 'bg-white border-slate-200'} flex items-start gap-3 cursor-pointer hover:border-indigo-400 transition">
                <input type="checkbox" name="lesson_prob_chk" value="${p.id}" ${checked} class="mt-1 w-4 h-4 text-indigo-600 rounded">
                <div class="text-xs flex-1">
                    <div class="flex flex-wrap items-center justify-between gap-1">
                        <span class="font-extrabold text-indigo-800">📘 ${lessonLabel}</span>
                        <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">${p.type || 'PYTHON'} • ${p.difficulty}</span>
                    </div>
                    <div class="font-bold text-slate-900 mt-1">${p.title} <span class="text-slate-400 font-mono">(${p.id})</span></div>
                </div>
            </label>
        `;
    }).join('');
}

function saveLessonAssignmentForClass() {
    const classSel = document.getElementById('assign-lesson-class-select');
    const deadlineInput = document.getElementById('assign-lesson-deadline');
    if (!classSel) return;

    const targetClassId = classSel.value;
    const cls = getClassById(targetClassId);
    if (!cls) return;

    const checkedIds = [...document.querySelectorAll('input[name="lesson_prob_chk"]:checked')].map(el => el.value);
    if (checkedIds.length === 0) {
        alert('Vui lòng chọn ít nhất 1 bài học / bài tập để giao cho lớp!');
        return;
    }

    cls.assigned_problems = checkedIds;
    if (deadlineInput && deadlineInput.value) {
        cls.deadline = deadlineInput.value;
    }

    saveClassesToStorage();
    renderLessonAssignmentManager();
    renderClassesManagerCards();
    if (typeof renderStudentPortalHeaderAndTasks === 'function') {
        renderStudentPortalHeaderAndTasks();
    }

    alert(`✅ Đã giao ${checkedIds.length} bài tập theo bài học cho Lớp ${cls.id} (Khối ${cls.grade})!\nHạn hoàn thành: ${cls.deadline}`);
}

/**
 * GIAO ĐỀ THI, MỞ ĐỀ THI, KHÓA ĐỀ THI & CẤU HÌNH THỜI GIAN + MỨC TRỪ ĐIỂM CHỐNG GIAN LẬN
 */
function onChangeExamConfigGradeFilter() {
    const gradeSel = document.getElementById('exam-cfg-grade-select');
    const classSel = document.getElementById('exam-cfg-class-select');
    if (!classSel || !window.CLASSES_LIST) return;
    const gradeVal = gradeSel ? gradeSel.value : 'ALL';
    const filteredClasses = gradeVal === 'ALL'
        ? window.CLASSES_LIST
        : window.CLASSES_LIST.filter(c => String(c.grade) === String(gradeVal));

    classSel.innerHTML =
        `<option value="ALL">Tất cả các lớp (${gradeVal === 'ALL' ? 'Khối 10 & 11' : 'Toàn bộ Khối ' + gradeVal})</option>` +
        filteredClasses.map(c => `<option value="${c.id}">Khối ${c.grade} • Lớp ${c.id} (${c.name})</option>`).join('');

    onChangeExamConfigClassSelect();
}

function onChangeExamConfigClassSelect() {
    const classSel = document.getElementById('exam-cfg-class-select');
    if (!classSel) return;
    const val = classSel.value;
    const cls = val === 'ALL' ? window.CLASSES_LIST[0] : getClassById(val);
    if (!cls) return;

    const titleEl = document.getElementById('exam-cfg-title');
    const durEl = document.getElementById('exam-cfg-duration');
    const penEl = document.getElementById('exam-cfg-penalty');
    const maxVioEl = document.getElementById('exam-cfg-max-violations');

    if (titleEl) titleEl.value = cls.exam_title || `Đề Kiểm Tra Định Kỳ - Lớp ${cls.id} (Chuẩn BGD 2025)`;
    if (durEl) durEl.value = cls.exam_duration_minutes || 45;
    if (penEl) penEl.value = cls.penalty_mode || 'TIERED';
    if (maxVioEl) maxVioEl.value = cls.max_violations || 3;
}

function saveAndDispatchExamToClass(openImmediately = true) {
    const gradeSel = document.getElementById('exam-cfg-grade-select');
    const classSel = document.getElementById('exam-cfg-class-select');
    const titleEl = document.getElementById('exam-cfg-title');
    const durEl = document.getElementById('exam-cfg-duration');
    const penEl = document.getElementById('exam-cfg-penalty');
    const maxVioEl = document.getElementById('exam-cfg-max-violations');

    const gradeVal = gradeSel ? gradeSel.value : 'ALL';
    const targetId = classSel ? classSel.value : 'ALL';
    const examTitle = (titleEl ? titleEl.value.trim() : '') || 'Đề Kiểm Tra Định Kỳ Chuẩn Cấu Trúc BGD 2025';
    const durationMins = Math.max(5, Math.min(180, parseInt(durEl ? durEl.value : 45) || 45));
    const penaltyMode = penEl ? penEl.value : 'TIERED';
    const maxViolations = Math.max(1, parseInt(maxVioEl ? maxVioEl.value : 3) || 3);

    let targets = [];
    if (targetId === 'ALL') {
        targets = gradeVal === 'ALL'
            ? (window.CLASSES_LIST || [])
            : (window.CLASSES_LIST || []).filter(c => String(c.grade) === String(gradeVal));
    } else {
        targets = [getClassById(targetId)].filter(Boolean);
    }

    targets.forEach(c => {
        c.assigned_exam = true;
        c.exam_enabled = openImmediately;
        c.exam_title = examTitle;
        c.exam_duration_minutes = durationMins;
        c.penalty_mode = penaltyMode;
        c.max_violations = maxViolations;
    });

    saveClassesToStorage();
    renderAdminAllViews();
    if (typeof renderStudentPortalHeaderAndTasks === 'function') {
        renderStudentPortalHeaderAndTasks();
    }

    const penaltyDesc = penaltyMode === 'FIXED_10'
        ? 'Trừ cố định 1.0 điểm / lần vi phạm'
        : (penaltyMode === 'FIXED_05' ? 'Trừ cố định 0.5 điểm / lần vi phạm' : 'Lần 1 trừ 0.5 điểm, từ lần 2 trở đi trừ 1.0 điểm / lần');

    alert(
        `${openImmediately ? '📤 ĐÃ GIAO & 🔓 MỞ ĐỀ THI' : '🔒 ĐÃ CẬP NHẬT & KHÓA ĐỀ THI'}!\n` +
        `• Phạm vi áp dụng: ${targetId === 'ALL' ? 'Tất cả các lớp Khối 10 & 11' : 'Lớp ' + targetId}\n` +
        `• Tên đề thi: ${examTitle}\n` +
        `• Thời gian làm bài: ${durationMins} phút\n` +
        `• Chế độ chống sao chép & chuyển tab: ${penaltyDesc} (Tối đa ${maxViolations} lần vi phạm)`
    );
}

// ============================================================================
// 3. ENGINE GIÁM SÁT THI TRỰC TUYẾN & CHỐNG GIAN LẬN CHO HỌC SINH
// ============================================================================

function playWarningBeepSound() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.setValueAtTime(360, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
    } catch (e) {}
}

function syncStudentExamLobbyState() {
    const stu = getActiveStudent();
    if (!stu) return;
    const clsObj = getClassById(stu.class_id);

    const isLocked = stu.permission_status === 'LOCKED' || (clsObj && clsObj.exam_enabled === false);
    const lockNoticeEl = document.getElementById('student-exam-lock-notice');
    const lobbyEl = document.getElementById('student-exam-lobby');
    const activeWorkspaceEl = document.getElementById('student-exam-active-workspace');

    const examTitle = (clsObj && clsObj.exam_title) ? clsObj.exam_title : 'Đề Kiểm Tra Định Kỳ Tin Học THPT (Chuẩn BGD 2025)';
    const examDur = (clsObj && clsObj.exam_duration_minutes) ? clsObj.exam_duration_minutes : 45;
    const penaltyMode = (clsObj && clsObj.penalty_mode) ? clsObj.penalty_mode : 'TIERED';
    const maxVio = (clsObj && clsObj.max_violations) ? clsObj.max_violations : 3;

    const penaltyText = penaltyMode === 'FIXED_10'
        ? 'Trừ 1.0 điểm cho mỗi lần sao chép hoặc chuyển tab'
        : (penaltyMode === 'FIXED_05'
            ? 'Trừ 0.5 điểm cho mỗi lần sao chép hoặc chuyển tab'
            : 'Trừ 0.5 điểm (lần 1 - mức nhẹ) và trừ 1.0 điểm (từ lần 2 - mức nặng)');

    // Cập nhật thông tin trên Phòng chờ thi (Lobby)
    const lobbyTitleEl = document.getElementById('exam-lobby-title');
    const lobbyDurEl = document.getElementById('exam-lobby-duration');
    const lobbyPenEl = document.getElementById('exam-lobby-penalty-rule');
    const lobbyMaxVioEl = document.getElementById('exam-lobby-max-vio');
    const activeTitleEl = document.getElementById('exam-active-title');

    if (lobbyTitleEl) lobbyTitleEl.textContent = examTitle;
    if (activeTitleEl) activeTitleEl.textContent = examTitle;
    if (lobbyDurEl) lobbyDurEl.textContent = `${examDur} Phút`;
    if (lobbyPenEl) lobbyPenEl.textContent = penaltyText;
    if (lobbyMaxVioEl) lobbyMaxVioEl.textContent = `${maxVio} lần vi phạm`;

    if (isLocked) {
        // Nếu Giáo viên khóa đề thi và Học sinh đang làm dở -> Tự động thu bài ngay
        if (window.EXAM_PROCTOR_STATE.inProgress) {
            stopStudentExamTimer();
            window.EXAM_PROCTOR_STATE.inProgress = false;
        }
        if (lockNoticeEl) lockNoticeEl.classList.remove('hidden');
        if (lobbyEl) lobbyEl.classList.add('hidden');
        if (activeWorkspaceEl) activeWorkspaceEl.classList.add('hidden');
        return;
    }

    if (lockNoticeEl) lockNoticeEl.classList.add('hidden');

    if (window.EXAM_PROCTOR_STATE.inProgress || window.EXAM_PROCTOR_STATE.submitted) {
        if (lobbyEl) lobbyEl.classList.add('hidden');
        if (activeWorkspaceEl) activeWorkspaceEl.classList.remove('hidden');
    } else {
        if (lobbyEl) lobbyEl.classList.remove('hidden');
        if (activeWorkspaceEl) activeWorkspaceEl.classList.add('hidden');
    }
}

function startStudentTimedExam() {
    const stu = getActiveStudent();
    if (!stu) return;
    const clsObj = getClassById(stu.class_id);

    if (stu.permission_status === 'LOCKED' || (clsObj && clsObj.exam_enabled === false)) {
        alert('🔒 Giáo viên hiện đang khóa đề thi đối với lớp hoặc tài khoản của em!');
        syncStudentExamLobbyState();
        return;
    }

    const durMins = (clsObj && clsObj.exam_duration_minutes) ? Number(clsObj.exam_duration_minutes) : 45;
    const penMode = (clsObj && clsObj.penalty_mode) ? clsObj.penalty_mode : 'TIERED';
    const maxVio = (clsObj && clsObj.max_violations) ? Number(clsObj.max_violations) : 3;

    stopStudentExamTimer();

    window.EXAM_PROCTOR_STATE = {
        inProgress: true,
        submitted: false,
        timerInterval: null,
        durationMinutes: durMins,
        remainingSeconds: durMins * 60,
        penaltyMode: penMode,
        maxViolations: maxVio,
        violationsCount: 0,
        totalPenaltyPoints: 0,
        violationLogs: [],
        lastViolationTimestamp: 0
    };

    // Reset bài làm cũ nếu có
    const formEl = document.getElementById('exam-form');
    if (formEl) formEl.reset();
    document.querySelectorAll('[id^="p1_exp_"], [id^="p2_exp_"], [id^="p3_exp_"]').forEach(el => el.classList.add('hidden'));
    const resBanner = document.getElementById('exam-final-result-banner');
    if (resBanner) resBanner.classList.add('hidden');

    updateExamProctorHUD();
    syncStudentExamLobbyState();

    window.EXAM_PROCTOR_STATE.timerInterval = setInterval(() => {
        if (!window.EXAM_PROCTOR_STATE.inProgress) return;
        window.EXAM_PROCTOR_STATE.remainingSeconds--;
        updateExamProctorHUD();

        if (window.EXAM_PROCTOR_STATE.remainingSeconds <= 0) {
            stopStudentExamTimer();
            submitExam(true, 'Hết thời gian làm bài theo quy định của Giáo viên');
        }
    }, 1000);
}

function stopStudentExamTimer() {
    if (window.EXAM_PROCTOR_STATE && window.EXAM_PROCTOR_STATE.timerInterval) {
        clearInterval(window.EXAM_PROCTOR_STATE.timerInterval);
        window.EXAM_PROCTOR_STATE.timerInterval = null;
    }
}

function updateExamProctorHUD() {
    const st = window.EXAM_PROCTOR_STATE;
    const timerEl = document.getElementById('exam-countdown-display');
    const vioEl = document.getElementById('exam-proctor-violations');
    const penEl = document.getElementById('exam-proctor-penalty');
    const logListEl = document.getElementById('exam-violation-logs-inline');

    if (timerEl) {
        const secs = Math.max(0, st.remainingSeconds);
        const mm = String(Math.floor(secs / 60)).padStart(2, '0');
        const ss = String(secs % 60).padStart(2, '0');
        timerEl.textContent = `${mm}:${ss}`;
        if (secs <= 300) {
            timerEl.className = 'text-xl font-mono font-black text-rose-600 animate-pulse';
        } else {
            timerEl.className = 'text-xl font-mono font-black text-indigo-700';
        }
    }

    if (vioEl) {
        vioEl.textContent = `${st.violationsCount} / ${st.maxViolations} lần`;
    }
    if (penEl) {
        penEl.textContent = `-${st.totalPenaltyPoints.toFixed(1)} điểm`;
    }

    if (logListEl) {
        if (st.violationLogs.length === 0) {
            logListEl.innerHTML = `<span class="text-emerald-700 font-semibold">✔ Chưa có vi phạm quy chế nào. Hãy tập trung làm bài!</span>`;
        } else {
            logListEl.innerHTML = st.violationLogs.map(l =>
                `<div class="text-[11px] text-rose-700 font-semibold">⚠️ [${l.time}] Lần ${l.count}: ${l.reason} (Trừ <strong>-${l.deducted.toFixed(1)} điểm</strong> — Mức độ: ${l.severity})</div>`
            ).join('');
        }
    }
}

/**
 * Xử lý khi phát hiện Học sinh Sao chép (Copy/Paste/Chuột phải) hoặc Chuyển Tab / Rời cửa sổ khi đang thi
 */
function triggerAntiCheatViolation(violationType, detailReason) {
    const st = window.EXAM_PROCTOR_STATE;
    if (!st || !st.inProgress) return;
    if (window.CURRENT_SESSION && window.CURRENT_SESSION.role !== 'STUDENT') return;

    // Chống lặp sự kiện kép (blur + visibilitychange cùng lúc trong vòng 800ms)
    const now = Date.now();
    if (now - st.lastViolationTimestamp < 800) return;
    st.lastViolationTimestamp = now;

    st.violationsCount++;

    // Tính điểm trừ từ 0.5 đến 1.0 điểm tùy mức độ và cấu hình của Giáo viên
    let deducted = 0.5;
    let severityLabel = 'Mức độ 1 (Cảnh cáo nhẹ - Trừ 0.5đ)';

    if (st.penaltyMode === 'FIXED_10') {
        deducted = 1.0;
        severityLabel = 'Mức nghiêm trọng (Trừ 1.0đ)';
    } else if (st.penaltyMode === 'FIXED_05') {
        deducted = 0.5;
        severityLabel = 'Mức cảnh cáo (Trừ 0.5đ)';
    } else {
        // TIERED: Lần 1 trừ 0.5 điểm; Từ lần 2 trở đi hoặc tái phạm chuyển tab trừ 1.0 điểm
        if (st.violationsCount === 1) {
            deducted = 0.5;
            severityLabel = 'Mức độ 1 (Vi phạm lần đầu - Trừ 0.5đ)';
        } else {
            deducted = 1.0;
            severityLabel = `Mức độ 2 (Tái phạm lần ${st.violationsCount} - Trừ 1.0đ)`;
        }
    }

    st.totalPenaltyPoints = Math.min(10.0, Number((st.totalPenaltyPoints + deducted).toFixed(1)));

    const logItem = {
        count: st.violationsCount,
        type: violationType,
        reason: detailReason,
        deducted,
        severity: severityLabel,
        time: new Date().toLocaleTimeString('vi-VN')
    };
    st.violationLogs.unshift(logItem);

    // Ghi nhận vào hồ sơ học sinh để Giáo viên giám sát trên Sơ đồ 45 máy & Google Sheets
    const stu = getActiveStudent();
    if (stu) {
        stu.tab_warnings = (stu.tab_warnings || 0) + 1;
        stu.penalty_points = st.totalPenaltyPoints;
        saveRosterToStorage();
        renderLabHeatmap45();
        if (window.cloudPipeline) {
            window.cloudPipeline.pushEvent('LAB_HEARTBEAT', {
                ...stu,
                violation: detailReason,
                penaltyPoints: st.totalPenaltyPoints
            });
        }
    }

    playWarningBeepSound();
    updateExamProctorHUD();
    showAntiCheatWarningModal(logItem, st);

    // Nếu vượt ngưỡng vi phạm tối đa -> Tự động thu bài ngay lập tức
    if (st.violationsCount >= st.maxViolations) {
        setTimeout(() => {
            if (window.EXAM_PROCTOR_STATE.inProgress) {
                submitExam(true, `Tự động thu bài do vi phạm quy chế thi ${st.violationsCount}/${st.maxViolations} lần (${detailReason})`);
            }
        }, 600);
    }
}

function showAntiCheatWarningModal(logItem, stateObj) {
    const modal = document.getElementById('anti-cheat-warning-modal');
    const bodyEl = document.getElementById('anti-cheat-modal-body');
    if (!modal || !bodyEl) return;

    bodyEl.innerHTML = `
        <div class="space-y-2 text-xs">
            <div class="p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-900 font-bold">
                🚨 Hệ thống phát hiện hành vi: <span class="underline">${logItem.reason}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 pt-1">
                <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <div class="text-[11px] text-slate-500">Số lần vi phạm:</div>
                    <div class="text-sm font-black text-rose-600">${stateObj.violationsCount} / ${stateObj.maxViolations} lần</div>
                </div>
                <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <div class="text-[11px] text-slate-500">Điểm bị trừ lần này:</div>
                    <div class="text-sm font-black text-rose-600">-${logItem.deducted.toFixed(1)} điểm</div>
                </div>
            </div>
            <div class="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 font-semibold">
                ⚠️ Tổng điểm bị trừ lũy kế: <strong class="text-rose-700">-${stateObj.totalPenaltyPoints.toFixed(1)} điểm</strong> (${logItem.severity}).<br>
                ${stateObj.violationsCount >= stateObj.maxViolations
                    ? '🛑 Bạn đã chạm ngưỡng vi phạm tối đa! Hệ thống sẽ tự động thu bài ngay bây giờ.'
                    : `Lưu ý: Nếu tiếp tục chuyển tab hoặc sao chép đủ ${stateObj.maxViolations} lần, hệ thống sẽ tự động khóa và thu bài thi!`}
            </div>
        </div>
    `;
    modal.classList.remove('hidden');
}

function closeAntiCheatWarningModal() {
    const modal = document.getElementById('anti-cheat-warning-modal');
    if (modal) modal.classList.add('hidden');
}

function initAntiCheatEventListeners() {
    // 1. Phát hiện chuyển Tab (visibilitychange) và rời cửa sổ (window blur)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && window.EXAM_PROCTOR_STATE && window.EXAM_PROCTOR_STATE.inProgress) {
            triggerAntiCheatViolation('TAB_SWITCH', 'Chuyển sang tab khác hoặc thu nhỏ trình duyệt khi đang làm bài thi');
        }
    });

    window.addEventListener('blur', () => {
        if (window.EXAM_PROCTOR_STATE && window.EXAM_PROCTOR_STATE.inProgress) {
            triggerAntiCheatViolation('WINDOW_BLUR', 'Rời khỏi cửa sổ phòng thi (Mất tiêu điểm cửa sổ làm bài)');
        }
    });

    // 2. Chống Sao chép (Copy / Cut / Paste / Chuột phải / Phím tắt) trong vùng làm bài thi
    ['copy', 'cut', 'paste', 'contextmenu'].forEach(evtName => {
        document.addEventListener(evtName, (e) => {
            if (!window.EXAM_PROCTOR_STATE || !window.EXAM_PROCTOR_STATE.inProgress) return;
            const examSection = document.getElementById('tab-exam');
            if (examSection && !examSection.classList.contains('hidden')) {
                e.preventDefault();
                const actionNames = {
                    copy: 'Sao chép nội dung đề thi (Copy)',
                    cut: 'Cắt nội dung đề thi (Cut)',
                    paste: 'Dán nội dung từ bên ngoài vào bài thi (Paste)',
                    contextmenu: 'Mở menu chuột phải trong phòng thi'
                };
                triggerAntiCheatViolation('COPY_PASTE', actionNames[evtName] || 'Thao tác sao chép trái phép');
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (!window.EXAM_PROCTOR_STATE || !window.EXAM_PROCTOR_STATE.inProgress) return;
        const examSection = document.getElementById('tab-exam');
        if (!examSection || examSection.classList.contains('hidden')) return;

        const key = (e.key || '').toLowerCase();
        if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'u', 'p'].includes(key)) {
            e.preventDefault();
            triggerAntiCheatViolation('SHORTCUT_COPY', `Sử dụng phím tắt bị cấm (Ctrl+${key.toUpperCase()}) trong phòng thi`);
        } else if (e.key === 'F12' || e.key === 'PrintScreen') {
            e.preventDefault();
            triggerAntiCheatViolation('DEVTOOLS', `Sử dụng phím chụp màn hình / kiểm tra phần tử (${e.key})`);
        }
    });
}

// ============================================================================
// 4. NẠP TÀI KHOẢN HỌC SINH THEO KHỐI (HỌ TÊN, LỚP, NGÀY SINH - CHUẨN OLM.VN)
// ============================================================================

async function bulkImportStudentsByGradeFromText() {
    const targetGrade = parseInt(document.getElementById('bulk-import-grade').value) || 10;
    const rawText = (document.getElementById('bulk-import-textarea').value || '').trim();

    if (!rawText) {
        alert('Vui lòng nhập hoặc dán danh sách học sinh theo định dạng: Họ và tên | Lớp | Ngày sinh');
        return;
    }

    const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    let importedCount = 0;

    lines.forEach((line, idx) => {
        const parts = line.split(/\||\t|;|,/).map(p => p.trim()).filter(Boolean);
        if (parts.length < 2) return;

        const fullName = parts[0];
        const classCode = parts[1].toUpperCase();
        const dob = parts[2] || (targetGrade === 10 ? '15/05/2011' : '15/05/2010');

        if (fullName.toLowerCase().includes('họ và tên') || fullName.toLowerCase() === 'họ tên') return;

        upsertStudentWithClassAndDob({
            fullName,
            classCode,
            dob,
            fallbackGrade: targetGrade,
            seqIndex: idx + 1
        });
        importedCount++;
    });

    saveClassesToStorage();
    saveRosterToStorage();
    renderAdminAllViews();

    if (window.cloudPipeline && importedCount > 0) {
        await window.cloudPipeline.pushEvent('BULK_SYNC_ALL', { students: window.STUDENTS_ROSTER });
    }

    document.getElementById('bulk-import-textarea').value = '';
    alert(`🎉 Đã nạp thành công ${importedCount} tài khoản học sinh vào Khối ${targetGrade}!\nMật khẩu mặc định của mỗi học sinh là Ngày sinh viết liền (VD: 15/08/2011 -> 15082011).`);
}

function upsertStudentWithClassAndDob({ fullName, classCode, dob, fallbackGrade, seqIndex, customId }) {
    const inferredGrade = classCode.startsWith('11') ? 11 : (classCode.startsWith('10') ? 10 : (fallbackGrade || 10));
    const inferredTrack = inferredGrade === 10 ? 'k10' : (classCode.toUpperCase().includes('ICT') ? 'k11-ict' : 'k11-cs');

    let clsObj = window.CLASSES_LIST.find(c => c.id.toUpperCase() === classCode.toUpperCase());
    if (!clsObj) {
        clsObj = {
            id: classCode.toUpperCase(),
            name: `Lớp ${classCode.toUpperCase()}`,
            grade: inferredGrade,
            track: inferredTrack,
            track_label: inferredGrade === 10 ? 'Khối 10: Lập trình Python cơ bản' : (inferredTrack === 'k11-ict' ? 'Khối 11: Tin học ứng dụng (ICT)' : 'Khối 11: Khoa học máy tính (CS)'),
            academic_year: '2026 - 2027',
            exam_enabled: true,
            practice_enabled: true,
            assigned_problems: (APP_DATA[inferredTrack] || []).map(p => p.id),
            assigned_exam: true,
            exam_title: `Đề Kiểm Tra Định Kỳ - Lớp ${classCode.toUpperCase()} (Chuẩn BGD 2025)`,
            exam_duration_minutes: 45,
            penalty_mode: 'TIERED',
            max_violations: 3,
            deadline: '2026-11-30'
        };
        window.CLASSES_LIST.push(clsObj);
    }

    const stuId = customId || `HS${inferredGrade}${String(window.STUDENTS_ROSTER.length + 1).padStart(2, '0')}`;
    const pinFromDob = normalizeDobToPin(dob);

    const existing = window.STUDENTS_ROSTER.find(s =>
        s.id.toUpperCase() === stuId.toUpperCase() ||
        (s.name.toLowerCase() === fullName.toLowerCase() && s.class_id.toUpperCase() === classCode.toUpperCase())
    );

    const studentRecord = {
        id: existing ? existing.id : stuId,
        name: fullName,
        dob: dob,
        grade: clsObj.grade,
        class_id: clsObj.id,
        track: clsObj.track,
        seat: existing ? existing.seat : `Máy ${String((window.STUDENTS_ROSTER.length % 45) + 1).padStart(2, '0')}`,
        pin: pinFromDob,
        permission_status: existing ? (existing.permission_status || 'ACTIVE') : 'ACTIVE',
        smart_score: existing ? (existing.smart_score || 80) : 80,
        xp: existing ? (existing.xp || 1000) : 1000,
        level: existing ? (existing.level || 2) : 2,
        streak: existing ? (existing.streak || 1) : 1,
        tx1: existing ? existing.tx1 : 8.0,
        tx2: existing ? existing.tx2 : 8.0,
        tx3: existing ? existing.tx3 : 8.0,
        tx4: existing ? existing.tx4 : 8.0,
        gk: existing ? existing.gk : 8.0,
        ck: existing ? existing.ck : 8.0,
        status: existing ? existing.status : 'WORKING',
        current_task: (APP_DATA[clsObj.track] && APP_DATA[clsObj.track][0]) ? APP_DATA[clsObj.track][0].id : 'py10_01',
        completed_tasks: existing ? (existing.completed_tasks || []) : [],
        tab_warnings: 0,
        penalty_points: 0
    };

    if (existing) {
        Object.assign(existing, studentRecord);
    } else {
        window.STUDENTS_ROSTER.push(studentRecord);
    }
    return studentRecord;
}

function downloadStudentImportTemplateXlsx() {
    const sampleRows = [
        { "Họ và tên": "Nguyễn Văn Minh", "Lớp": "10A1", "Ngày sinh": "15/08/2011", "Khối": 10 },
        { "Họ và tên": "Trần Ngọc Lan", "Lớp": "10A2", "Ngày sinh": "22/10/2011", "Khối": 10 },
        { "Họ và tên": "Lê Hoàng Nam", "Lớp": "11CS1", "Ngày sinh": "05/03/2010", "Khối": 11 },
        { "Họ và tên": "Phạm Phương Thảo", "Lớp": "11ICT1", "Ngày sinh": "18/11/2010", "Khối": 11 }
    ];
    const ws = XLSX.utils.json_to_sheet(sampleRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DS_HocSinh_TheoKhoi");
    XLSX.writeFile(wb, "Mau_Nap_TaiKhoan_HocSinh_Khoi_10_11.xlsx");
}

function importRosterFromExcelFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const targetGrade = parseInt(document.getElementById('bulk-import-grade')?.value) || 10;
    const reader = new FileReader();
    reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);

        let added = 0;
        rows.forEach((r, idx) => {
            const fullName = String(r['Họ và tên'] || r['Họ và Tên'] || r['Họ tên'] || r['HoTen'] || r['Name'] || '').trim();
            const classCode = String(r['Lớp'] || r['Lop'] || r['Class'] || (targetGrade === 10 ? '10A1' : '11CS1')).trim().toUpperCase();
            const dob = String(r['Ngày sinh'] || r['NgaySinh'] || r['DOB'] || (targetGrade === 10 ? '15/05/2011' : '15/05/2010')).trim();
            const customId = r['Mã Học Sinh'] || r['MaHS'] ? String(r['Mã Học Sinh'] || r['MaHS']).trim() : null;

            if (fullName) {
                upsertStudentWithClassAndDob({
                    fullName,
                    classCode,
                    dob,
                    fallbackGrade: Number(r['Khối'] || targetGrade),
                    seqIndex: idx + 1,
                    customId
                });
                added++;
            }
        });

        saveClassesToStorage();
        saveRosterToStorage();
        renderAdminAllViews();

        if (window.cloudPipeline && added > 0) {
            await window.cloudPipeline.pushEvent('BULK_SYNC_ALL', { students: window.STUDENTS_ROSTER });
        }
        alert(`🎉 Đã nạp thành công ${added} tài khoản học sinh từ file Excel (Họ tên, Lớp, Ngày sinh) và đồng bộ lên Google Sheets!`);
    };
    reader.readAsArrayBuffer(file);
}

function exportStudentCredentialsExcel() {
    const filterGrade = document.getElementById('roster-filter-grade')?.value || 'ALL';
    const filterClass = document.getElementById('roster-filter-class')?.value || 'ALL';

    const list = (window.STUDENTS_ROSTER || []).filter(s => {
        const matchGrade = filterGrade === 'ALL' || String(s.grade) === String(filterGrade);
        const matchClass = filterClass === 'ALL' || s.class_id === filterClass;
        return matchGrade && matchClass;
    });

    const rows = list.map((s, idx) => ({
        "STT": idx + 1,
        "Mã Đăng Nhập (Tài khoản)": s.id,
        "Họ và Tên Học Sinh": s.name,
        "Ngày Sinh": s.dob || "15/05/2011",
        "Khối": s.grade || 10,
        "Lớp": s.class_id,
        "Chương Trình Được Phân Quyền": s.track === 'k10' ? 'Tin học 10 (Python)' : (s.track === 'k11-cs' ? 'Tin học 11 (Khoa học máy tính - CS)' : 'Tin học 11 (Tin học ứng dụng - ICT)'),
        "Mật Khẩu Mặc Định (Ngày sinh)": s.pin || normalizeDobToPin(s.dob),
        "Trạng Thái Quyền": s.permission_status === 'LOCKED' ? 'Tạm khóa' : 'Đang mở'
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "TaiKhoan_HocSinh");
    XLSX.writeFile(wb, "DanhSach_TaiKhoan_HocSinh_OLM_THPT.xlsx");
}

// --- 5. THAY ĐỔI QUYỀN HỌC SINH THEO LỚP, KHỐI TRỰC TIẾP ---
async function onChangeStudentClassOrGrade(studentId, newClassId) {
    const stu = (window.STUDENTS_ROSTER || []).find(s => s.id === studentId);
    const clsObj = getClassById(newClassId);
    if (!stu || !clsObj) return;

    stu.class_id = clsObj.id;
    stu.grade = clsObj.grade;
    stu.track = clsObj.track;

    saveRosterToStorage();
    renderAdminAllViews();

    if (window.cloudPipeline) {
        await window.cloudPipeline.pushEvent('UPSERT_STUDENT', stu);
    }
}

async function onChangeStudentPermissionStatus(studentId) {
    const stu = (window.STUDENTS_ROSTER || []).find(s => s.id === studentId);
    if (!stu) return;

    stu.permission_status = stu.permission_status === 'LOCKED' ? 'ACTIVE' : 'LOCKED';
    saveRosterToStorage();
    renderAdminAllViews();

    if (window.cloudPipeline) {
        await window.cloudPipeline.pushEvent('UPSERT_STUDENT', stu);
    }
}

// --- 6. BỘ CHẤM CODE ĐA NGÔN NGỮ: PYTHON WASM + SQLITE WASM + WEB HTML/CSS DOM ---
async function initSqlEngine() {
    if (SQL_ENGINE) return SQL_ENGINE;
    if (typeof window.initSqlJs === 'function') {
        try {
            SQL_ENGINE = await window.initSqlJs({
                locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
            });
            return SQL_ENGINE;
        } catch (err) {
            console.error('SQL.js Init Error:', err);
        }
    }
    return null;
}

async function executeSqlProblem(prob, studentQuery) {
    const SQL = await initSqlEngine();
    if (!SQL) {
        return { error: true, message: 'Không thể khởi tạo SQLite WebAssembly Engine.' };
    }

    const db = new SQL.Database();
    try {
        db.run(prob.sql_init || '');
        const stuRes = db.exec(studentQuery);
        const expRes = db.exec(prob.expected_query || '');

        const stuTable = stuRes[0] || { columns: [], values: [] };
        const expTable = expRes[0] || { columns: [], values: [] };

        const isMatch = JSON.stringify(stuTable.values) === JSON.stringify(expTable.values) &&
                        stuTable.columns.length === expTable.columns.length;

        db.close();
        return {
            error: false,
            isMatch,
            columns: stuTable.columns,
            values: stuTable.values,
            expectedValues: expTable.values
        };
    } catch (err) {
        db.close();
        return { error: true, message: err.message };
    }
}

function executeWebProblem(prob, htmlCode) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlCode, 'text/html');
    const reqTags = prob.required_tags || ['header', 'main', 'footer'];
    const checks = reqTags.map(tag => {
        const found = doc.querySelectorAll(tag).length > 0;
        return { tag, found };
    });

    const passedCount = checks.filter(c => c.found).length;
    return {
        isAllPassed: passedCount === reqTags.length,
        passedCount,
        totalCount: reqTags.length,
        checks
    };
}

// --- 7. GHI NHẬN KẾT QUẢ BÀI LÀM CỦA HỌC SINH & TÍNH ĐIỂM SMARTSCORE OLM ---
async function recordAndSyncStudentSubmission({ problemId, problemTitle, submissionType, verdict, score, xpAdded, rawScore, penaltyPoints }) {
    const stu = getActiveStudent();
    if (!stu) return;

    stu.xp = (stu.xp || 1000) + (xpAdded || 0);
    stu.level = Math.floor(stu.xp / 500) + 1;
    stu.status = verdict === 'AC' ? 'AC' : 'ERROR';
    stu.current_task = problemId;

    if (!Array.isArray(stu.completed_tasks)) stu.completed_tasks = [];
    if (verdict === 'AC' && !stu.completed_tasks.includes(problemId)) {
        stu.completed_tasks.push(problemId);
    }

    if (verdict === 'AC') {
        stu.smart_score = Math.min(100, (stu.smart_score || 75) + 5);
    }

    if (submissionType === 'AUTO_JUDGE') {
        stu.tx3 = Math.max(Number(stu.tx3 || 0), Number(score.toFixed(1)));
    } else if (submissionType === 'EXAM_2025') {
        stu.tx2 = Number(score.toFixed(1));
        stu.gk = Math.max(Number(stu.gk || 0), Number(score.toFixed(1)));
    }

    saveRosterToStorage();
    if (typeof renderStudentPortalHeaderAndTasks === 'function') {
        renderStudentPortalHeaderAndTasks();
    }
    renderGradebookTable();
    renderAdminAllViews();

    if (window.cloudPipeline) {
        await window.cloudPipeline.pushEvent('RECORD_SUBMISSION', {
            studentId: stu.id,
            studentName: stu.name,
            classId: stu.class_id,
            submissionType,
            problemId,
            problemTitle,
            verdict,
            rawScore: rawScore !== undefined ? Number(rawScore.toFixed(2)) : Number(score.toFixed(2)),
            penaltyPoints: penaltyPoints || 0,
            score: Number(score.toFixed(2)),
            xpAdded,
            studentSnapshot: stu
        });
    }
}

// --- 8. ĐIỀU KHIỂN BÀN LÀM VIỆC GIÁO VIÊN (OLM TEACHER PORTAL) ---
function switchAdminSubTab(subId) {
    document.querySelectorAll('.admin-subpanel').forEach(el => el.classList.add('hidden'));
    ['roster', 'curriculum', 'lab', 'gradebook', 'cloud'].forEach(id => {
        const btn = document.getElementById(`admin-subtab-${id}`) || document.getElementById(`admin-btn-${id}`);
        if (btn) {
            btn.className = id === subId
                ? 'px-3.5 py-2 rounded-lg text-xs font-bold bg-indigo-600 text-white shadow-sm transition-all'
                : 'px-3.5 py-2 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all';
        }
    });

    const target = document.getElementById(`admin-panel-${subId}`);
    if (target) target.classList.remove('hidden');
    lucide.createIcons();
}

function renderAdminAllViews() {
    renderClassesManagerCards();
    populateClassFilterDropdowns();
    renderLessonAssignmentManager();
    onChangeExamConfigClassSelect();
    renderAdminRosterTable();
    renderLabHeatmap45();
    renderAdminProblemList();
    renderAdminGradebookEditor();
    renderSyncLogsUI();
    loadCloudConfigIntoForm();
}

function renderClassesManagerCards() {
    const container = document.getElementById('classes-manager-grid');
    if (!container) return;

    container.innerHTML = (window.CLASSES_LIST || []).map(cls => {
        const stuCount = (window.STUDENTS_ROSTER || []).filter(s => s.class_id === cls.id).length;
        const badgeColor = cls.grade === 10 ? 'bg-indigo-100 text-indigo-800' : (cls.track === 'k11-cs' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800');
        const assignedCount = Array.isArray(cls.assigned_problems) ? cls.assigned_problems.length : 0;
        const durMins = cls.exam_duration_minutes || 45;

        return `
            <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start gap-2">
                        <span class="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${badgeColor}">Khối ${cls.grade}</span>
                        <span class="text-xs font-bold text-slate-500">👨‍🎓 ${stuCount} HS</span>
                    </div>
                    <h4 class="text-base font-black text-slate-900 mt-2">${cls.name} (${cls.id})</h4>
                    <p class="text-xs text-slate-600 mt-0.5">${cls.track_label}</p>
                    <div class="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                        <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">📘 Đã giao: ${assignedCount} bài học</span>
                        <span class="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">⏱️ Đề thi: ${durMins} phút</span>
                    </div>
                </div>
                <div class="mt-4 pt-3 border-t border-slate-100 flex flex-wrap justify-between items-center gap-2 text-xs">
                    <button onclick="toggleClassExamPermission('${cls.id}')" class="px-2.5 py-1 rounded-lg font-bold ${cls.exam_enabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}">
                        ${cls.exam_enabled ? '🔓 Đề thi: ĐANG MỞ' : '🔒 Đề thi: ĐÃ KHÓA'}
                    </button>
                    <button onclick="deleteClassById('${cls.id}')" class="text-slate-400 hover:text-rose-600 text-[11px]">Xóa lớp</button>
                </div>
            </div>
        `;
    }).join('');
}

function populateClassFilterDropdowns() {
    const classOptionsHtml = `<option value="ALL">Tất cả các lớp</option>` +
        (window.CLASSES_LIST || []).map(c => `<option value="${c.id}">${c.id} - Khối ${c.grade}</option>`).join('');

    ['roster-filter-class', 'gradebook-filter-class', 'lab-filter-class', 'exam-cfg-class-select'].forEach(selId => {
        const el = document.getElementById(selId);
        if (el) {
            const currentVal = el.value || 'ALL';
            el.innerHTML = classOptionsHtml;
            if ([...el.options].some(o => o.value === currentVal)) el.value = currentVal;
        }
    });

    const assignLessonSel = document.getElementById('assign-lesson-class-select');
    if (assignLessonSel) {
        const prev = assignLessonSel.value;
        assignLessonSel.innerHTML = (window.CLASSES_LIST || []).map(c =>
            `<option value="${c.id}">Lớp ${c.id} (Khối ${c.grade} - ${c.track.toUpperCase()})</option>`
        ).join('');
        if ([...assignLessonSel.options].some(o => o.value === prev)) assignLessonSel.value = prev;
    }

    const newStuClassSel = document.getElementById('new-stu-class');
    if (newStuClassSel) {
        newStuClassSel.innerHTML = (window.CLASSES_LIST || []).map(c =>
            `<option value="${c.id}">${c.id} (${c.track_label})</option>`
        ).join('');
    }
}

function renderAdminRosterTable() {
    const tbody = document.getElementById('admin-roster-tbody');
    if (!tbody) return;

    const filterGrade = document.getElementById('roster-filter-grade')?.value || 'ALL';
    const filterClass = document.getElementById('roster-filter-class')?.value || 'ALL';

    const list = (window.STUDENTS_ROSTER || []).filter(s => {
        const matchGrade = filterGrade === 'ALL' || String(s.grade) === String(filterGrade);
        const matchClass = filterClass === 'ALL' || s.class_id === filterClass;
        return matchGrade && matchClass;
    });

    tbody.innerHTML = list.map((s) => {
        const qrUrl = `${window.location.origin}${window.location.pathname}?student=${s.id}&pin=${s.pin || '1111'}`;
        const classSelectHtml = (window.CLASSES_LIST || []).map(c =>
            `<option value="${c.id}" ${c.id === s.class_id ? 'selected' : ''}>Lớp ${c.id} (Khối ${c.grade} - ${c.track.toUpperCase()})</option>`
        ).join('');

        const isLocked = s.permission_status === 'LOCKED';

        return `
            <tr class="hover:bg-slate-50">
                <td class="px-3 py-2 font-mono font-bold text-indigo-700">${s.id}</td>
                <td class="px-3 py-2 font-semibold text-slate-900">${s.name}</td>
                <td class="px-2 py-2 text-center font-mono text-[11px] text-slate-600">
                    <div>${s.dob || '15/05/2011'}</div>
                    <div class="text-slate-400">MK: <strong>${s.pin || '1111'}</strong></div>
                </td>
                <td class="px-3 py-2">
                    <select onchange="onChangeStudentClassOrGrade('${s.id}', this.value)" class="text-xs border border-slate-300 rounded-lg px-2 py-1 font-bold bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500">
                        ${classSelectHtml}
                    </select>
                </td>
                <td class="px-3 py-2 text-center">
                    <button onclick="onChangeStudentPermissionStatus('${s.id}')" class="px-2.5 py-1 rounded-full text-[11px] font-bold ${isLocked ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}">
                        ${isLocked ? '🔒 Đã khóa thi' : '🔓 Đang mở quyền'}
                    </button>
                </td>
                <td class="px-3 py-2 text-right space-x-2">
                    <button onclick="copyStudentQrLink('${qrUrl}', '${s.name}')" class="text-xs text-indigo-600 hover:underline font-semibold">🔗 QR</button>
                    <button onclick="deleteStudentRoster('${s.id}')" class="text-xs text-rose-600 hover:underline">Xóa</button>
                </td>
            </tr>
        `;
    }).join('');
}

function addNewStudentFromAdmin() {
    const name = document.getElementById('new-stu-name').value.trim();
    const classCode = document.getElementById('new-stu-class').value;
    const dob = document.getElementById('new-stu-dob').value.trim() || '15/05/2011';
    const customId = document.getElementById('new-stu-id').value.trim();

    if (!name) {
        alert('Vui lòng nhập Họ và tên học sinh!');
        return;
    }

    const stu = upsertStudentWithClassAndDob({
        fullName: name,
        classCode,
        dob,
        fallbackGrade: classCode.startsWith('11') ? 11 : 10,
        customId: customId || null
    });

    saveClassesToStorage();
    saveRosterToStorage();
    renderAdminAllViews();

    if (window.cloudPipeline) {
        window.cloudPipeline.pushEvent('UPSERT_STUDENT', stu);
    }

    document.getElementById('new-stu-id').value = '';
    document.getElementById('new-stu-name').value = '';
    alert(`✅ Đã thêm học sinh ${stu.name} (${stu.id}) vào lớp ${stu.class_id}!\nMật khẩu đăng nhập: ${stu.pin}`);
}

function deleteStudentRoster(stuId) {
    window.STUDENTS_ROSTER = (window.STUDENTS_ROSTER || []).filter(s => s.id !== stuId);
    saveRosterToStorage();
    renderAdminAllViews();
}

function copyStudentQrLink(url, name) {
    navigator.clipboard.writeText(url).catch(() => {});
    alert(`Đã sao chép đường dẫn đăng nhập nhanh của học sinh ${name}:\n${url}`);
}

// 8.2. Sơ đồ Phòng máy Realtime (Lọc theo Lớp & Hiển thị Cảnh báo Chuyển Tab / Trừ điểm)
function renderLabHeatmap45() {
    const grid = document.getElementById('lab-heatmap-grid');
    if (!grid) return;

    const filterClass = document.getElementById('lab-filter-class')?.value || 'ALL';
    const roster = (window.STUDENTS_ROSTER || []).filter(s => filterClass === 'ALL' || s.class_id === filterClass);
    let html = '';

    const totalSeats = Math.max(18, roster.length);
    for (let i = 1; i <= totalSeats; i++) {
        const seatLabel = `Máy ${i < 10 ? '0' + i : i}`;
        const stu = roster[i - 1];

        if (stu) {
            let colorClass = 'bg-emerald-50 border-emerald-300 text-emerald-900';
            let statusBadge = '🟢 Hoàn thành AC';
            if (stu.tab_warnings > 0) {
                colorClass = 'bg-amber-50 border-amber-400 text-amber-900 ring-2 ring-amber-300';
                statusBadge = `⚠️ Vi phạm: ${stu.tab_warnings} lần (-${(stu.penalty_points || stu.tab_warnings * 0.5).toFixed(1)}đ)`;
            } else if (stu.status === 'ERROR') {
                colorClass = 'bg-rose-50 border-rose-300 text-rose-900';
                statusBadge = '🔴 Gặp lỗi Code';
            } else if (stu.status === 'WORKING') {
                colorClass = 'bg-blue-50 border-blue-300 text-blue-900';
                statusBadge = '🟡 Đang làm bài';
            }

            html += `
                <div class="p-3 rounded-xl border ${colorClass} text-xs flex flex-col justify-between shadow-sm">
                    <div class="flex justify-between items-center font-bold">
                        <span>🖥️ ${seatLabel}</span>
                        <span class="text-[10px] px-1.5 py-0.5 rounded bg-white/80 font-extrabold">${stu.class_id}</span>
                    </div>
                    <div class="font-bold truncate mt-1.5" title="${stu.name}">${stu.name}</div>
                    <div class="text-[11px] opacity-90 mt-1 flex justify-between items-center">
                        <span>${statusBadge}</span>
                        <span class="font-mono font-bold">${stu.tx3 || 0}đ</span>
                    </div>
                </div>
            `;
        } else {
            html += `
                <div class="p-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400 text-xs flex flex-col justify-between">
                    <div class="font-bold">🖥️ ${seatLabel}</div>
                    <div class="text-[11px] italic my-1.5">Máy trống</div>
                    <div class="text-[10px]">⚪ Chưa đăng nhập</div>
                </div>
            `;
        }
    }
    grid.innerHTML = html;
}

function shuffleExamPaperForLab() {
    const codes = ['101', '102', '103', '104', '201', '202'];
    const nextCode = codes[Math.floor(Math.random() * codes.length)];
    EXAM_SHUFFLE_CODE = nextCode;
    const badge = document.getElementById('exam-shuffle-badge');
    if (badge) badge.textContent = `Mã đề: ${nextCode}`;

    EXAM_DATA.part1 = [...EXAM_DATA.part1].sort(() => Math.random() - 0.5);
    EXAM_DATA.part2 = [...EXAM_DATA.part2].sort(() => Math.random() - 0.5);
    renderExamQuestions();
    alert(`🔀 Đã trộn đề thi tự động sang Mã đề ${nextCode}!`);
}

function toggleExamLockMode() {
    const filterClass = document.getElementById('lab-filter-class')?.value || 'ALL';
    const firstCls = filterClass === 'ALL' ? window.CLASSES_LIST[0] : getClassById(filterClass);
    const nextOpenState = firstCls ? !firstCls.exam_enabled : false;
    setClassExamState(filterClass, nextOpenState);
}

// 8.3. Quản trị Ngân hàng Học liệu & Đề thi (data/*.json trên GitHub)
function renderAdminProblemList() {
    const tbody = document.getElementById('admin-problems-tbody');
    if (!tbody) return;

    const allProbs = [];
    ['k10', 'k11-cs', 'k11-ict'].forEach(track => {
        (APP_DATA[track] || []).forEach(p => {
            allProbs.push({ ...p, track });
        });
    });

    tbody.innerHTML = allProbs.map(p => `
        <tr class="hover:bg-slate-50">
            <td class="px-3 py-2 font-mono font-bold text-slate-600">${p.id}</td>
            <td class="px-3 py-2">
                <div class="text-[10px] font-bold text-indigo-700">${p.lesson_title || DEFAULT_LESSON_MAP[p.id] || p.category}</div>
                <div class="font-semibold text-slate-900">${p.title}</div>
            </td>
            <td class="px-3 py-2"><span class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold uppercase text-[10px]">${p.track}</span></td>
            <td class="px-3 py-2"><span class="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold text-[10px]">${p.type || 'PYTHON'}</span></td>
            <td class="px-3 py-2 text-center">${p.difficulty}</td>
            <td class="px-3 py-2 text-center font-bold">${p.competency}</td>
        </tr>
    `).join('');
}

async function addNewProblemAndSyncGitHub() {
    const track = document.getElementById('adm-prob-track').value;
    const type = document.getElementById('adm-prob-type').value;
    const lessonEl = document.getElementById('adm-prob-lesson');
    const lessonTitle = (lessonEl ? lessonEl.value.trim() : '') || 'Bài học SGK Tin học THPT';
    const title = document.getElementById('adm-prob-title').value.trim();
    const diff = document.getElementById('adm-prob-diff').value;
    const comp = document.getElementById('adm-prob-comp').value;
    const desc = document.getElementById('adm-prob-desc').value.trim();
    const sampleIn = document.getElementById('adm-prob-in').value.trim();
    const sampleOut = document.getElementById('adm-prob-out').value.trim();
    const starter = document.getElementById('adm-prob-starter').value;
    const hint = document.getElementById('adm-prob-hint').value.trim();

    if (!title || !desc) {
        alert('Vui lòng nhập Tên bài tập và Mô tả đề bài!');
        return;
    }

    const newProb = {
        id: `${track.replace('-', '')}_${Date.now().toString().slice(-4)}`,
        title,
        lesson_title: lessonTitle,
        type,
        category: lessonTitle,
        difficulty: diff,
        competency: comp,
        description: desc,
        input_format: 'Dữ liệu nhập từ luồng chuẩn (Standard Input).',
        sample_in: sampleIn,
        sample_out: sampleOut,
        starter_code: starter || '# Viết code của bạn tại đây\n',
        testcases: [{ input: sampleIn, output: sampleOut, hidden: false }],
        required_tags: ['header', 'main', 'footer'],
        hint: hint || 'Hãy phân tích kỹ đầu vào và đầu ra mẫu.'
    };

    APP_DATA[track].push(newProb);

    // Tự động giao bài tập mới này cho các lớp thuộc cùng nhánh
    (window.CLASSES_LIST || []).filter(c => c.track === track).forEach(c => {
        if (!Array.isArray(c.assigned_problems)) c.assigned_problems = [];
        c.assigned_problems.push(newProb.id);
    });
    saveClassesToStorage();

    const customProbs = JSON.parse(localStorage.getItem('thpt_custom_problems_v2') || '{}');
    if (!customProbs[track]) customProbs[track] = [];
    customProbs[track].push(newProb);
    localStorage.setItem('thpt_custom_problems_v2', JSON.stringify(customProbs));

    loadProblemList();
    renderAdminProblemList();
    renderLessonAssignmentManager();

    const fileMap = {
        'k10': 'data/grade10-python.json',
        'k11-cs': 'data/grade11-cs.json',
        'k11-ict': 'data/grade11-ict.json'
    };
    const res = await window.cloudPipeline.commitJsonToGitHub(
        fileMap[track],
        APP_DATA[track],
        `Them bai tap theo bai hoc: ${lessonTitle} - ${title}`
    );

    alert(`✅ Đã thêm bài tập "${title}" vào "${lessonTitle}" và giao tự động cho các lớp thuộc nhánh ${track.toUpperCase()}!\n${res.message}`);
}

function downloadCurriculumJsonFile(trackKey) {
    const fileMap = {
        'k10': 'grade10-python.json',
        'k11-cs': 'grade11-cs.json',
        'k11-ict': 'grade11-ict.json',
        'exam': 'exam-2025.json'
    };
    const dataObj = trackKey === 'exam' ? EXAM_DATA : APP_DATA[trackKey];
    const blob = new Blob([JSON.stringify(dataObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileMap[trackKey] || 'data.json';
    a.click();
    URL.revokeObjectURL(url);
}

// 8.4. Sổ điểm Thông tư 22 Cho phép Lọc theo Khối/Lớp & Sửa trực tiếp
function renderAdminGradebookEditor() {
    const tbody = document.getElementById('admin-gradebook-editor-tbody');
    if (!tbody) return;

    const filterGrade = document.getElementById('gradebook-filter-grade')?.value || 'ALL';
    const filterClass = document.getElementById('gradebook-filter-class')?.value || 'ALL';

    const list = (window.STUDENTS_ROSTER || []).filter(s => {
        const matchGrade = filterGrade === 'ALL' || String(s.grade) === String(filterGrade);
        const matchClass = filterClass === 'ALL' || s.class_id === filterClass;
        return matchGrade && matchClass;
    });

    tbody.innerHTML = list.map(s => {
        const dtb = ((Number(s.tx1) + Number(s.tx2) + Number(s.tx3) + Number(s.tx4) + Number(s.gk) * 2 + Number(s.ck) * 3) / 9).toFixed(1);
        const rank = dtb >= 8.0 ? 'Tốt' : (dtb >= 6.5 ? 'Khá' : (dtb >= 5.0 ? 'Đạt' : 'Chưa đạt'));
        const rankColor = dtb >= 8.0 ? 'bg-emerald-100 text-emerald-800' : (dtb >= 6.5 ? 'bg-blue-100 text-blue-800' : (dtb >= 5.0 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'));

        return `
            <tr class="hover:bg-slate-50">
                <td class="px-3 py-2 font-mono font-bold text-slate-600">${s.id}</td>
                <td class="px-3 py-2 font-semibold text-slate-900">${s.name}</td>
                <td class="px-2 py-2 text-center"><span class="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">${s.class_id} (K${s.grade || 10})</span></td>
                ${['tx1', 'tx2', 'tx3', 'tx4', 'gk', 'ck'].map(col => `
                    <td class="px-1.5 py-1.5 text-center">
                        <input type="number" step="0.5" min="0" max="10" value="${s[col]}"
                            onchange="onTeacherEditScore('${s.id}', '${col}', this.value)"
                            class="w-14 text-center border border-slate-300 rounded py-1 text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                    </td>
                `).join('')}
                <td class="px-3 py-2 text-center font-black text-indigo-700 text-sm">${dtb}</td>
                <td class="px-3 py-2 text-center"><span class="px-2 py-0.5 rounded text-[11px] font-bold ${rankColor}">${rank}</span></td>
            </tr>
        `;
    }).join('');
}

async function onTeacherEditScore(studentId, colName, newVal) {
    const val = Math.min(10, Math.max(0, parseFloat(newVal) || 0));
    const stu = (window.STUDENTS_ROSTER || []).find(s => s.id === studentId);
    if (!stu) return;

    stu[colName] = val;
    const dtb = ((Number(stu.tx1) + Number(stu.tx2) + Number(stu.tx3) + Number(stu.tx4) + Number(stu.gk) * 2 + Number(stu.ck) * 3) / 9).toFixed(1);

    saveRosterToStorage();
    renderGradebookTable();
    renderAdminGradebookEditor();

    if (window.cloudPipeline) {
        await window.cloudPipeline.pushEvent('UPDATE_GRADEBOOK', {
            ...stu,
            dtb
        });
    }
}

// 8.5. Trung tâm Đồng bộ Tự động Google Sheets & GitHub
function loadCloudConfigIntoForm() {
    if (!window.cloudPipeline) return;
    const cfg = window.cloudPipeline.config;
    const sheetUrlInput = document.getElementById('cfg-sheet-url');
    const webhookInput = document.getElementById('cfg-webhook-url');
    const ghTokenInput = document.getElementById('cfg-github-token');

    if (sheetUrlInput) sheetUrlInput.value = cfg.spreadsheetUrl || '';
    if (webhookInput) webhookInput.value = cfg.appsScriptWebhookUrl || '';
    if (ghTokenInput) ghTokenInput.value = cfg.githubToken || '';
    window.cloudPipeline.notifyStatusUI();
}

async function saveAndAutoInitGoogleSheets() {
    const spreadsheetUrl = document.getElementById('cfg-sheet-url').value.trim();
    const appsScriptWebhookUrl = document.getElementById('cfg-webhook-url').value.trim();
    const githubToken = document.getElementById('cfg-github-token').value.trim();

    window.cloudPipeline.saveConfig({
        spreadsheetUrl,
        appsScriptWebhookUrl,
        githubToken
    });

    await window.cloudPipeline.pushEvent('AUTO_INIT_SCHEMA', {
        students: window.STUDENTS_ROSTER
    });

    if (window.cloudPipeline.config.spreadsheetId) {
        const rows = await window.cloudPipeline.fetchSheetTabViaGViz('TaiKhoan_HS');
        if (rows && rows.length > 0) {
            window.cloudPipeline.addLog('GVIZ_READ', `Đã đọc tự động ${rows.length} dòng tài khoản từ Google Sheet`, 'CLOUD_SYNCED');
        }
    }

    alert('Đã lưu cấu hình và kích hoạt quy trình đồng bộ tự động 2 chiều Website <-> Google Sheets & GitHub!');
}

async function triggerFullCloudSyncNow() {
    if (!window.cloudPipeline) return;
    await window.cloudPipeline.pushEvent('BULK_SYNC_ALL', {
        students: window.STUDENTS_ROSTER
    });
    alert('Đã đồng bộ toàn bộ Tài khoản Học sinh, Điểm XP và Bảng điểm Thông tư 22 lên Google Sheets!');
}

function renderSyncLogsUI() {
    const container = document.getElementById('sync-activity-logs');
    if (!container || !window.cloudPipeline) return;

    const logs = window.cloudPipeline.syncLogs || [];
    if (logs.length === 0) {
        container.innerHTML = `<div class="text-xs text-slate-400 italic">Chưa có sự kiện đồng bộ nào. Mọi thao tác nộp bài hoặc chấm điểm sẽ tự động ghi tại đây...</div>`;
        return;
    }

    container.innerHTML = logs.slice(0, 15).map(l => `
        <div class="p-2 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
            <div>
                <span class="font-mono font-bold text-indigo-700">[${l.action}]</span>
                <span class="text-slate-700 ml-1">${l.detail}</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-[10px] px-2 py-0.5 rounded font-bold ${l.status === 'CLOUD_SYNCED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}">${l.status}</span>
                <span class="text-[10px] text-slate-400">${l.timestamp}</span>
            </div>
        </div>
    `).join('');
}

window.renderSyncLogsUI = renderSyncLogsUI;
