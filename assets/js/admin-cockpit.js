/**
 * ThayTruongIT - THPT Hub
 * Admin Cockpit & Multi-Engine Auto-Judge Controller (Python WASM + SQLite WASM + Web DOM Judge)
 */

let SQL_ENGINE = null;
let CURRENT_STUDENT_ID = 'HS1001';
let FOCUS_LOCK_ACTIVE = false;
let EXAM_SHUFFLE_CODE = '101';

// --- 1. TỰ ĐỘNG TẢI NGÂN HÀNG ĐỀ THI & HỌC LIỆU TỪ THƯ MỤC data/*.json TRÊN GITHUB ---
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
                    // Chuẩn hóa trường sample_in / sample_out
                    APP_DATA[item.key] = data.map(p => ({
                        ...p,
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

    // Hợp nhất các bài tập do Giáo viên thêm mới trong LocalStorage
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

    // Tải danh sách học sinh từ data/students-roster.json hoặc LocalStorage
    const savedRoster = localStorage.getItem('thpt_roster_v2');
    if (savedRoster) {
        try {
            window.STUDENTS_ROSTER = JSON.parse(savedRoster);
        } catch (e) {}
    }

    if (!window.STUDENTS_ROSTER || window.STUDENTS_ROSTER.length === 0) {
        try {
            const rRes = await fetch(`data/students-roster.json?v=${Date.now()}`);
            if (rRes.ok) {
                window.STUDENTS_ROSTER = await rRes.json();
                saveRosterToStorage();
            }
        } catch (e) {}
    }

    if (!window.STUDENTS_ROSTER || window.STUDENTS_ROSTER.length === 0) {
        window.STUDENTS_ROSTER = STUDENTS_MOCK.map((s, idx) => ({
            ...s,
            class_id: idx < 2 ? '10A1' : (idx < 4 ? '11CS1' : '11ICT1'),
            track: idx < 2 ? 'k10' : (idx < 4 ? 'k11-cs' : 'k11-ict'),
            seat: `Máy 0${idx + 1}`,
            pin: `${idx + 1}${idx + 1}${idx + 1}${idx + 1}`,
            xp: 1250 + idx * 150,
            level: 3,
            streak: 5 + idx,
            status: 'AC',
            current_task: 'py10_01',
            tab_warnings: 0
        }));
        saveRosterToStorage();
    }

    // Kiểm tra URL parameter ?student=HS1001 (Quét mã QR đăng nhập nhanh)
    const params = new URLSearchParams(window.location.search);
    const qrStudent = params.get('student');
    if (qrStudent && window.STUDENTS_ROSTER.some(s => s.id === qrStudent)) {
        CURRENT_STUDENT_ID = qrStudent;
    } else {
        CURRENT_STUDENT_ID = localStorage.getItem('thpt_active_student_id') || window.STUDENTS_ROSTER[0].id;
    }

    renderActiveStudentSelector();
    loadProblemList();
    renderGradebookTable();
    renderAdminAllViews();
}

function saveRosterToStorage() {
    localStorage.setItem('thpt_roster_v2', JSON.stringify(window.STUDENTS_ROSTER));
}

function getActiveStudent() {
    return (window.STUDENTS_ROSTER || []).find(s => s.id === CURRENT_STUDENT_ID) || window.STUDENTS_ROSTER[0];
}

function renderActiveStudentSelector() {
    const sel = document.getElementById('active-student-select');
    if (!sel || !window.STUDENTS_ROSTER) return;

    sel.innerHTML = window.STUDENTS_ROSTER.map(s =>
        `<option value="${s.id}" ${s.id === CURRENT_STUDENT_ID ? 'selected' : ''}>👦 ${s.id} - ${s.name} (${s.class_id})</option>`
    ).join('');

    const stu = getActiveStudent();
    if (stu) {
        document.getElementById('header-xp').textContent = (stu.xp || 1250).toLocaleString();
        document.getElementById('header-level').textContent = stu.level || Math.floor((stu.xp || 1250) / 500) + 1;
        document.getElementById('header-streak').textContent = stu.streak || 5;
    }
}

function onSwitchActiveStudent(studentId) {
    CURRENT_STUDENT_ID = studentId;
    localStorage.setItem('thpt_active_student_id', studentId);
    renderActiveStudentSelector();
}

// --- 2. BỘ CHẤM ĐA NGÔN NGỮ: PYTHON WASM + SQLITE WASM + WEB HTML/CSS DOM ---
async function initSqlEngine() {
    if (SQL_ENGINE) return SQL_ENGINE;
    if (typeof window.initSqlJs === 'function') {
        try {
            SQL_ENGINE = await window.initSqlJs({
                locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
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
        // 1. Khởi tạo bảng & dữ liệu mẫu
        db.run(prob.sql_init || '');

        // 2. Chạy truy vấn của học sinh
        const stuRes = db.exec(studentQuery);

        // 3. Chạy truy vấn đáp án chuẩn của giáo viên
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

// --- 3. TỰ ĐỘNG GHI ĐIỂM & ĐỒNG BỘ LÊN GOOGLE SHEETS KHI HỌC SINH NỘP BÀI ---
async function recordAndSyncStudentSubmission({ problemId, problemTitle, submissionType, verdict, score, xpAdded }) {
    const stu = getActiveStudent();
    if (!stu) return;

    // Cập nhật XP, Level, Trạng thái
    stu.xp = (stu.xp || 1000) + (xpAdded || 0);
    stu.level = Math.floor(stu.xp / 500) + 1;
    stu.status = verdict === 'AC' ? 'AC' : 'ERROR';
    stu.current_task = problemId;

    // Tự động cập nhật cột điểm tương ứng trong Sổ điểm Thông tư 22
    if (submissionType === 'AUTO_JUDGE') {
        stu.tx3 = Math.max(Number(stu.tx3 || 0), Number(score.toFixed(1)));
    } else if (submissionType === 'EXAM_2025') {
        stu.tx2 = Number(score.toFixed(1));
        stu.gk = Math.max(Number(stu.gk || 0), Number(score.toFixed(1)));
    }

    saveRosterToStorage();
    renderActiveStudentSelector();
    renderGradebookTable();
    renderAdminAllViews();

    // Đẩy tự động lên Google Sheets qua CloudPipeline
    if (window.cloudPipeline) {
        await window.cloudPipeline.pushEvent('RECORD_SUBMISSION', {
            studentId: stu.id,
            studentName: stu.name,
            classId: stu.class_id,
            submissionType,
            problemId,
            problemTitle,
            verdict,
            score: Number(score.toFixed(2)),
            xpAdded,
            studentSnapshot: stu
        });
    }
}

// --- 4. GIÁM SÁT CHỐNG GIAN LẬN (CHUYỂN TAB / COPY-PASTE) ---
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        const stu = getActiveStudent();
        if (stu) {
            stu.tab_warnings = (stu.tab_warnings || 0) + 1;
            saveRosterToStorage();
            renderAdminAllViews();
            if (window.cloudPipeline) {
                window.cloudPipeline.pushEvent('LAB_HEARTBEAT', stu);
            }
        }
    }
});

// --- 5. ĐIỀU KHIỂN CÁC SUB-TAB TRONG TRUNG TÂM QUẢN TRỊ (ADMIN COCKPIT) ---
function switchAdminSubTab(subId) {
    document.querySelectorAll('.admin-subpanel').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.admin-subbtn').forEach(btn => {
        btn.className = 'admin-subbtn px-3.5 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5 transition-all';
    });

    const target = document.getElementById(`admin-panel-${subId}`);
    if (target) target.classList.remove('hidden');

    const activeBtn = document.getElementById(`admin-btn-${subId}`);
    if (activeBtn) {
        activeBtn.className = 'admin-subbtn px-3.5 py-2 rounded-lg text-xs font-bold bg-indigo-600 text-white shadow-sm flex items-center gap-1.5 transition-all';
    }
    lucide.createIcons();
}

function renderAdminAllViews() {
    renderLabHeatmap45();
    renderAdminRosterTable();
    renderAdminProblemList();
    renderAdminGradebookEditor();
    renderSyncLogsUI();
    loadCloudConfigIntoForm();
}

// 5.1. Sơ đồ Phòng máy 45 máy Realtime
function renderLabHeatmap45() {
    const grid = document.getElementById('lab-heatmap-grid');
    if (!grid) return;

    const roster = window.STUDENTS_ROSTER || [];
    let html = '';

    for (let i = 1; i <= 24; i++) {
        const seatLabel = `Máy ${i < 10 ? '0' + i : i}`;
        const stu = roster[i - 1];

        if (stu) {
            let colorClass = 'bg-emerald-50 border-emerald-300 text-emerald-900';
            let statusBadge = '🟢 AC (100đ)';
            if (stu.tab_warnings > 0) {
                colorClass = 'bg-amber-50 border-amber-400 text-amber-900 ring-2 ring-amber-300';
                statusBadge = `⚠️ Chuyển Tab (${stu.tab_warnings})`;
            } else if (stu.status === 'ERROR') {
                colorClass = 'bg-rose-50 border-rose-300 text-rose-900';
                statusBadge = '🔴 Lỗi Code / TLE';
            } else if (stu.status === 'WORKING') {
                colorClass = 'bg-blue-50 border-blue-300 text-blue-900';
                statusBadge = '🟡 Đang gõ code';
            }

            html += `
                <div class="p-2.5 rounded-xl border ${colorClass} text-xs flex flex-col justify-between shadow-sm">
                    <div class="flex justify-between items-center font-bold">
                        <span>🖥️ ${seatLabel}</span>
                        <span class="text-[10px] px-1.5 py-0.5 rounded bg-white/80">${stu.class_id}</span>
                    </div>
                    <div class="font-bold truncate mt-1" title="${stu.name}">${stu.name}</div>
                    <div class="text-[11px] opacity-80 mt-0.5 flex justify-between items-center">
                        <span>${statusBadge}</span>
                        <span class="font-mono font-bold">${stu.tx3 || 0}đ</span>
                    </div>
                </div>
            `;
        } else {
            html += `
                <div class="p-2.5 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400 text-xs flex flex-col justify-between">
                    <div class="font-bold">🖥️ ${seatLabel}</div>
                    <div class="text-[11px] italic my-1">Máy trống</div>
                    <div class="text-[10px]">⚪ Offline</div>
                </div>
            `;
        }
    }
    grid.innerHTML = html;
}

function toggleFocusLockMode() {
    FOCUS_LOCK_ACTIVE = !FOCUS_LOCK_ACTIVE;
    const btn = document.getElementById('btn-focus-lock');
    const overlay = document.getElementById('student-focus-lock-overlay');
    if (FOCUS_LOCK_ACTIVE) {
        btn.className = 'px-3.5 py-2 rounded-lg text-xs font-bold bg-rose-600 text-white shadow flex items-center gap-1.5';
        btn.innerHTML = `<i data-lucide="unlock" class="w-4 h-4"></i> Mở Khóa Màn Hình HS (Đang Khóa)`;
    } else {
        btn.className = 'px-3.5 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white shadow flex items-center gap-1.5';
        btn.innerHTML = `<i data-lucide="lock" class="w-4 h-4"></i> Khóa Tập Trung (Focus Mode)`;
        if (overlay) overlay.classList.add('hidden');
    }
    lucide.createIcons();
}

function previewStudentFocusLock() {
    const overlay = document.getElementById('student-focus-lock-overlay');
    if (overlay) overlay.classList.remove('hidden');
}

function broadcastTeacherHint() {
    const msg = prompt('Nhập thông báo hoặc gợi ý chung gửi tới toàn bộ màn hình học sinh trong phòng máy:', 'Các em chú ý kiểm tra điều kiện dừng của vòng lặp while nhé!');
    if (!msg) return;
    const banner = document.getElementById('live-broadcast-banner');
    const textEl = document.getElementById('live-broadcast-text');
    if (banner && textEl) {
        textEl.textContent = msg;
        banner.classList.remove('hidden');
    }
}

// 5.2. Quản lý Danh sách Lớp & Học sinh (Roster + Nhập Excel + QR)
function renderAdminRosterTable() {
    const tbody = document.getElementById('admin-roster-tbody');
    if (!tbody) return;

    const filterClass = (document.getElementById('roster-filter-class')?.value) || 'ALL';
    const list = (window.STUDENTS_ROSTER || []).filter(s => filterClass === 'ALL' || s.class_id === filterClass);

    tbody.innerHTML = list.map((s, idx) => {
        const qrUrl = `${window.location.origin}${window.location.pathname}?student=${s.id}`;
        return `
            <tr class="hover:bg-slate-50">
                <td class="px-3 py-2 font-mono font-bold text-indigo-700">${s.id}</td>
                <td class="px-3 py-2 font-semibold text-slate-900">${s.name}</td>
                <td class="px-3 py-2"><span class="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">${s.class_id}</span></td>
                <td class="px-3 py-2">${s.seat || `Máy ${idx + 1}`}</td>
                <td class="px-3 py-2 font-bold text-amber-700">🏆 ${s.xp || 0} XP</td>
                <td class="px-3 py-2 text-center">
                    <button onclick="copyStudentQrLink('${qrUrl}', '${s.name}')" class="text-xs text-indigo-600 hover:underline font-semibold">🔗 Link QR</button>
                </td>
                <td class="px-3 py-2 text-right">
                    <button onclick="deleteStudentRoster('${s.id}')" class="text-xs text-rose-600 hover:underline">Xóa</button>
                </td>
            </tr>
        `;
    }).join('');
}

function addNewStudentFromAdmin() {
    const id = document.getElementById('new-stu-id').value.trim();
    const name = document.getElementById('new-stu-name').value.trim();
    const classId = document.getElementById('new-stu-class').value;
    const seat = document.getElementById('new-stu-seat').value.trim() || `Máy ${(window.STUDENTS_ROSTER.length + 1)}`;

    if (!id || !name) {
        alert('Vui lòng nhập đầy đủ Mã học sinh và Họ tên!');
        return;
    }

    const track = classId.includes('10') ? 'k10' : (classId.includes('CS') ? 'k11-cs' : 'k11-ict');
    const newStu = {
        id, name, class_id: classId, track, seat, pin: '1111',
        xp: 1000, level: 2, streak: 1,
        tx1: 8.0, tx2: 8.0, tx3: 8.0, tx4: 8.0, gk: 8.0, ck: 8.0,
        status: 'WORKING', current_task: 'py10_01', tab_warnings: 0
    };

    window.STUDENTS_ROSTER.push(newStu);
    saveRosterToStorage();
    renderActiveStudentSelector();
    renderGradebookTable();
    renderAdminAllViews();

    if (window.cloudPipeline) {
        window.cloudPipeline.pushEvent('UPSERT_STUDENT', newStu);
    }

    document.getElementById('new-stu-id').value = '';
    document.getElementById('new-stu-name').value = '';
}

function deleteStudentRoster(stuId) {
    window.STUDENTS_ROSTER = (window.STUDENTS_ROSTER || []).filter(s => s.id !== stuId);
    saveRosterToStorage();
    renderActiveStudentSelector();
    renderGradebookTable();
    renderAdminAllViews();
}

function copyStudentQrLink(url, name) {
    navigator.clipboard.writeText(url).catch(() => {});
    alert(`Đã sao chép đường dẫn đăng nhập nhanh của học sinh ${name}:\n${url}`);
}

function importRosterFromExcelFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);

        let added = 0;
        rows.forEach((r, idx) => {
            const id = String(r['Mã Học Sinh'] || r['MaHS'] || r['ID'] || `HS${1200 + idx}`).trim();
            const name = String(r['Họ và Tên'] || r['HoTen'] || r['Name'] || '').trim();
            const classId = String(r['Lớp'] || r['Lop'] || '10A1').trim();
            if (name) {
                const existing = window.STUDENTS_ROSTER.find(s => s.id === id);
                const stuObj = {
                    id, name, class_id: classId,
                    track: classId.includes('10') ? 'k10' : (classId.includes('CS') ? 'k11-cs' : 'k11-ict'),
                    seat: `Máy ${window.STUDENTS_ROSTER.length + 1}`,
                    pin: '1111',
                    xp: Number(r['XP'] || 1000),
                    level: 3, streak: 5,
                    tx1: Number(r['ĐĐGtx 1'] || r['TX1'] || 8.0),
                    tx2: Number(r['ĐĐGtx 2'] || r['TX2'] || 8.0),
                    tx3: Number(r['ĐĐGtx 3'] || r['TX3'] || 8.0),
                    tx4: Number(r['ĐĐGtx 4'] || r['TX4'] || 8.0),
                    gk: Number(r['ĐĐGgk (x2)'] || r['GK'] || 8.0),
                    ck: Number(r['ĐĐGck (x3)'] || r['CK'] || 8.0),
                    status: 'AC', current_task: 'py10_01', tab_warnings: 0
                };
                if (existing) {
                    Object.assign(existing, stuObj);
                } else {
                    window.STUDENTS_ROSTER.push(stuObj);
                }
                added++;
            }
        });

        saveRosterToStorage();
        renderActiveStudentSelector();
        renderGradebookTable();
        renderAdminAllViews();

        if (window.cloudPipeline) {
            await window.cloudPipeline.pushEvent('BULK_SYNC_ALL', { students: window.STUDENTS_ROSTER });
        }
        alert(`Đã nhập thành công ${added} học sinh từ file Excel và tự động đồng bộ lên Google Sheets!`);
    };
    reader.readAsArrayBuffer(file);
}

// 5.3. Quản trị Ngân hàng Đề thi & Học liệu (data/*.json trên GitHub)
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
            <td class="px-3 py-2 font-semibold text-slate-900">${p.title}</td>
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
    const title = document.getElementById('adm-prob-title').value.trim();
    const diff = document.getElementById('adm-prob-diff').value;
    const comp = document.getElementById('adm-prob-comp').value;
    const desc = document.getElementById('adm-prob-desc').value.trim();
    const sampleIn = document.getElementById('adm-prob-in').value.trim();
    const sampleOut = document.getElementById('adm-prob-out').value.trim();
    const starter = document.getElementById('adm-prob-starter').value;
    const hint = document.getElementById('adm-prob-hint').value.trim();

    if (!title || !desc) {
        alert('Vui lòng nhập Tiêu đề bài tập và Nội dung đề bài!');
        return;
    }

    const newProb = {
        id: `${track.replace('-', '')}_${Date.now().toString().slice(-4)}`,
        title,
        type,
        category: type === 'SQL' ? 'Cơ sở dữ liệu SQL' : (type === 'WEB' ? 'Thiết kế Web' : 'Thuật toán & Lập trình'),
        difficulty: diff,
        competency: comp,
        description: desc,
        input_format: 'Dữ liệu nhập từ luồng chuẩn (Standard Input).',
        sample_in: sampleIn,
        sample_out: sampleOut,
        starter_code: starter || '# Viết code của bạn tại đây\n',
        testcases: [
            { input: sampleIn, output: sampleOut, hidden: false }
        ],
        required_tags: ['header', 'main', 'footer'],
        hint: hint || 'Hãy phân tích kỹ đầu vào và đầu ra mẫu.'
    };

    APP_DATA[track].push(newProb);

    // Lưu vào LocalStorage
    const customProbs = JSON.parse(localStorage.getItem('thpt_custom_problems_v2') || '{}');
    if (!customProbs[track]) customProbs[track] = [];
    customProbs[track].push(newProb);
    localStorage.setItem('thpt_custom_problems_v2', JSON.stringify(customProbs));

    loadProblemList();
    renderAdminProblemList();

    // Đẩy tự động lên GitHub data/*.json
    const fileMap = {
        'k10': 'data/grade10-python.json',
        'k11-cs': 'data/grade11-cs.json',
        'k11-ict': 'data/grade11-ict.json'
    };
    const targetPath = fileMap[track];
    const res = await window.cloudPipeline.commitJsonToGitHub(
        targetPath,
        APP_DATA[track],
        `Them bai tap moi: ${title} (${newProb.id})`
    );

    alert(`Đã thêm bài tập "${title}" vào kho học liệu!\nTrạng thái GitHub: ${res.message}`);
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

function shuffleExamPaperCode(code) {
    EXAM_SHUFFLE_CODE = code;
    const badge = document.getElementById('exam-code-badge');
    if (badge) badge.textContent = `Mã đề: ${code}`;

    // Xáo trộn thứ tự câu hỏi Phần I và Phần II
    EXAM_DATA.part1 = [...EXAM_DATA.part1].sort(() => Math.random() - 0.5);
    EXAM_DATA.part2 = [...EXAM_DATA.part2].sort(() => Math.random() - 0.5);
    renderExamQuestions();
}

// 5.4. Sổ điểm Thông tư 22 Cho phép Chỉnh sửa Trực tiếp (Inline Edit + Auto Sync Google Sheets)
function renderAdminGradebookEditor() {
    const tbody = document.getElementById('admin-gradebook-editor-tbody');
    if (!tbody) return;

    const list = window.STUDENTS_ROSTER || [];
    tbody.innerHTML = list.map(s => {
        const dtb = ((Number(s.tx1) + Number(s.tx2) + Number(s.tx3) + Number(s.tx4) + Number(s.gk) * 2 + Number(s.ck) * 3) / 9).toFixed(1);
        const rank = dtb >= 8.0 ? 'Tốt' : (dtb >= 6.5 ? 'Khá' : (dtb >= 5.0 ? 'Đạt' : 'Chưa đạt'));
        const rankColor = dtb >= 8.0 ? 'bg-emerald-100 text-emerald-800' : (dtb >= 6.5 ? 'bg-blue-100 text-blue-800' : (dtb >= 5.0 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'));

        return `
            <tr class="hover:bg-slate-50">
                <td class="px-3 py-2 font-mono font-bold text-slate-600">${s.id}</td>
                <td class="px-3 py-2 font-semibold text-slate-900">${s.name}</td>
                <td class="px-2 py-2 text-center"><span class="px-2 py-0.5 rounded bg-slate-100 font-bold">${s.class_id}</span></td>
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

    // Tự động đẩy điểm vừa sửa lên Google Sheets ngay lập tức
    if (window.cloudPipeline) {
        await window.cloudPipeline.pushEvent('UPDATE_GRADEBOOK', {
            ...stu,
            dtb
        });
    }
}

// 5.5. Trung tâm Đồng bộ Tự động Google Sheets & GitHub
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

    // Tự động đẩy cấu trúc 4 Sheet + Toàn bộ danh sách học sinh & Sổ điểm TT22 lên Google Sheets
    await window.cloudPipeline.pushEvent('AUTO_INIT_SCHEMA', {
        students: window.STUDENTS_ROSTER
    });

    // Nếu người dùng dán link Google Sheets công khai, tự động đọc thử dữ liệu từ Sheet về
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
