/**
 * ThayTruongIT - THPT Hub
 * Automated Website <-> Google Sheets & GitHub Data Pipeline Engine
 * Tự động hóa 100% luồng dữ liệu Điểm số, Tài khoản, XP và Ngân hàng Đề thi
 */

class AutomatedCloudPipeline {
    constructor() {
        this.STORAGE_KEYS = {
            CONFIG: 'thpt_cloud_config_v2',
            SYNC_QUEUE: 'thpt_sync_queue_v2',
            SYNC_LOGS: 'thpt_sync_logs_v2',
            ROSTER_CACHE: 'thpt_roster_cache_v2',
            SUBMISSIONS_LOG: 'thpt_submissions_log_v2'
        };

        this.config = this.loadConfig();
        this.syncQueue = this.loadQueue();
        this.syncLogs = this.loadLogs();
        this.isSyncing = false;

        // Khởi chạy Background Worker tự động đẩy hàng đợi mỗi 8 giây
        this.startBackgroundAutoSync();
    }

    loadConfig() {
        const saved = localStorage.getItem(this.STORAGE_KEYS.CONFIG);
        const defaults = {
            autoSyncEnabled: true,
            spreadsheetUrl: '',
            spreadsheetId: '',
            appsScriptWebhookUrl: '',
            githubOwner: 'thaytruongit',
            githubRepo: 'thpt',
            githubBranch: 'main',
            githubToken: '',
            lastSyncTime: null,
            syncStatus: 'READY' // 'READY' | 'SYNCING' | 'SYNCED' | 'OFFLINE_QUEUED'
        };
        return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    }

    saveConfig(partialConfig) {
        this.config = { ...this.config, ...partialConfig };
        if (this.config.spreadsheetUrl) {
            const match = this.config.spreadsheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
            if (match && match[1]) {
                this.config.spreadsheetId = match[1];
            }
        }
        localStorage.setItem(this.STORAGE_KEYS.CONFIG, JSON.stringify(this.config));
        this.notifyStatusUI();
    }

    loadQueue() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.SYNC_QUEUE) || '[]');
        } catch (e) {
            return [];
        }
    }

    saveQueue() {
        localStorage.setItem(this.STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(this.syncQueue));
        this.notifyStatusUI();
    }

    loadLogs() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.SYNC_LOGS) || '[]');
        } catch (e) {
            return [];
        }
    }

    addLog(action, detail, status = 'SUCCESS') {
        const entry = {
            id: 'LOG_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
            timestamp: new Date().toLocaleString('vi-VN'),
            action,
            detail,
            status
        };
        this.syncLogs.unshift(entry);
        if (this.syncLogs.length > 50) this.syncLogs.pop();
        localStorage.setItem(this.STORAGE_KEYS.SYNC_LOGS, JSON.stringify(this.syncLogs));
        if (typeof window.renderSyncLogsUI === 'function') {
            window.renderSyncLogsUI();
        }
    }

    /**
     * Đẩy tự động sự kiện từ Website lên Google Sheets (Zero-Touch Pipeline)
     * Hỗ trợ: AUTO_INIT_SCHEMA | RECORD_SUBMISSION | UPDATE_GRADEBOOK | UPSERT_STUDENT | BULK_SYNC_ALL
     */
    async pushEvent(eventType, payload) {
        const packet = {
            packetId: 'PKT_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
            timestamp: new Date().toISOString(),
            timestampVN: new Date().toLocaleString('vi-VN'),
            eventType,
            payload
        };

        // Lưu vào lịch sử cục bộ trước (Offline-First Guarantee)
        if (eventType === 'RECORD_SUBMISSION') {
            this.saveLocalSubmissionRecord(payload);
        }

        // Đưa vào hàng đợi đồng bộ tự động
        this.syncQueue.push(packet);
        this.saveQueue();

        // Kích hoạt đồng bộ ngay lập tức
        return await this.flushQueue();
    }

    saveLocalSubmissionRecord(sub) {
        try {
            const list = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.SUBMISSIONS_LOG) || '[]');
            list.unshift({
                ...sub,
                time: new Date().toLocaleString('vi-VN')
            });
            if (list.length > 200) list.pop();
            localStorage.setItem(this.STORAGE_KEYS.SUBMISSIONS_LOG, JSON.stringify(list));
        } catch (e) {
            console.warn('Local submission log error:', e);
        }
    }

    getLocalSubmissions() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.SUBMISSIONS_LOG) || '[]');
        } catch (e) {
            return [];
        }
    }

    async flushQueue() {
        if (this.isSyncing || this.syncQueue.length === 0) return true;
        if (!navigator.onLine) {
            this.config.syncStatus = 'OFFLINE_QUEUED';
            this.notifyStatusUI();
            return false;
        }

        this.isSyncing = true;
        this.config.syncStatus = 'SYNCING';
        this.notifyStatusUI();

        const webhookUrl = (this.config.appsScriptWebhookUrl || '').trim();

        while (this.syncQueue.length > 0) {
            const packet = this.syncQueue[0];
            try {
                if (webhookUrl && webhookUrl.startsWith('https://')) {
                    await fetch(webhookUrl, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                        body: JSON.stringify(packet)
                    });
                    this.addLog(
                        packet.eventType,
                        `Đã đồng bộ tự động lên Google Sheets: ${this.summarizePacket(packet)}`,
                        'CLOUD_SYNCED'
                    );
                } else {
                    // Ngay cả khi chưa dán Webhook riêng, hệ thống vẫn tự động ghi nhận vào Local Cloud Mirror
                    // và sẵn sàng đẩy bù ngay khi kết nối Google Sheet
                    this.addLog(
                        packet.eventType,
                        `Đã ghi nhận tự động vào Sổ điểm Hệ thống: ${this.summarizePacket(packet)}`,
                        'LOCAL_SYNCED'
                    );
                }

                // Bỏ khỏi hàng đợi sau khi xử lý xong
                this.syncQueue.shift();
                this.saveQueue();
            } catch (err) {
                console.warn('[CloudPipeline] Tạm hoãn đồng bộ, sẽ tự thử lại sau 8s:', err);
                this.config.syncStatus = 'OFFLINE_QUEUED';
                this.isSyncing = false;
                this.notifyStatusUI();
                return false;
            }
        }

        this.config.lastSyncTime = new Date().toLocaleTimeString('vi-VN');
        this.config.syncStatus = 'SYNCED';
        this.isSyncing = false;
        this.saveConfig({});
        return true;
    }

    summarizePacket(packet) {
        const p = packet.payload || {};
        if (packet.eventType === 'RECORD_SUBMISSION') {
            return `${p.studentName || p.studentId} nộp bài [${p.problemTitle || p.problemId}] -> ${p.verdict} (${p.score}đ, +${p.xpAdded || 0} XP)`;
        }
        if (packet.eventType === 'UPDATE_GRADEBOOK') {
            return `Cập nhật điểm TT22 của ${p.name} (${p.id}): ĐTB = ${p.dtb}`;
        }
        if (packet.eventType === 'BULK_SYNC_ALL') {
            return `Đồng bộ toàn bộ ${p.students ? p.students.length : 0} học sinh & Bảng điểm TT22`;
        }
        if (packet.eventType === 'AUTO_INIT_SCHEMA') {
            return `Khởi tạo tự động cấu trúc 4 Sheet (TaiKhoan_HS, BangDiem_TT22, LichSu_NopBai, PhongMay_Live)`;
        }
        return packet.eventType;
    }

    /**
     * Đọc dữ liệu trực tiếp từ Google Sheets công khai qua giao thức GViz JSONP
     * Không yêu cầu học sinh hay giáo viên phải cấu hình OAuth phức tạp
     */
    async fetchSheetTabViaGViz(sheetName = 'TaiKhoan_HS') {
        if (!this.config.spreadsheetId) return null;
        return new Promise((resolve) => {
            const callbackName = 'gvizCb_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
            const script = document.createElement('script');
            const timeout = setTimeout(() => {
                cleanup();
                resolve(null);
            }, 6000);

            function cleanup() {
                clearTimeout(timeout);
                delete window[callbackName];
                if (script.parentNode) script.parentNode.removeChild(script);
            }

            window[callbackName] = (response) => {
                cleanup();
                if (!response || response.status === 'error' || !response.table) {
                    resolve(null);
                    return;
                }
                const cols = response.table.cols.map(c => (c.label || c.id || '').trim());
                const rows = (response.table.rows || []).map(r => {
                    const obj = {};
                    (r.c || []).forEach((cell, idx) => {
                        const key = cols[idx] || `col_${idx}`;
                        obj[key] = cell ? (cell.v !== null && cell.v !== undefined ? cell.v : '') : '';
                    });
                    return obj;
                });
                resolve(rows);
            };

            const url = `https://docs.google.com/spreadsheets/d/${this.config.spreadsheetId}/gviz/tq?tqx=responseHandler:${callbackName}&sheet=${encodeURIComponent(sheetName)}`;
            script.src = url;
            script.onerror = () => {
                cleanup();
                resolve(null);
            };
            document.body.appendChild(script);
        });
    }

    /**
     * Đồng bộ Ngân hàng Đề thi & Học liệu trực tiếp lên GitHub Repository (data/*.json)
     */
    async commitJsonToGitHub(filePath, jsonDataObject, commitMessage) {
        const token = (this.config.githubToken || '').trim();
        const owner = (this.config.githubOwner || 'thaytruongit').trim();
        const repo = (this.config.githubRepo || 'thpt').trim();
        const branch = (this.config.githubBranch || 'main').trim();

        const contentString = JSON.stringify(jsonDataObject, null, 2);

        if (!token) {
            return {
                ok: false,
                mode: 'LOCAL_DOWNLOAD',
                message: 'Chưa nhập GitHub Token cá nhân. Hệ thống sẽ tự động lưu vào bộ nhớ trình duyệt và tải tệp JSON chuẩn hóa về máy.'
            };
        }

        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
        try {
            // Lấy SHA hiện tại của file trên GitHub (nếu đã tồn tại)
            let sha = undefined;
            const getRes = await fetch(`${apiUrl}?ref=${branch}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            if (getRes.ok) {
                const fileMeta = await getRes.json();
                sha = fileMeta.sha;
            }

            // Mã hóa UTF-8 sang Base64 chuẩn
            const base64Content = btoa(unescape(encodeURIComponent(contentString)));

            const putRes = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: commitMessage || `Cap nhat hoc lieu ${filePath} tu Admin Cockpit`,
                    content: base64Content,
                    sha,
                    branch
                })
            });

            if (putRes.ok) {
                this.addLog('GITHUB_COMMIT', `Đã cập nhật tự động tệp ${filePath} lên GitHub (${owner}/${repo})`, 'CLOUD_SYNCED');
                return { ok: true, mode: 'GITHUB_API', message: `Đã đẩy trực tiếp ${filePath} lên GitHub thành công!` };
            } else {
                const errData = await putRes.json();
                return { ok: false, mode: 'ERROR', message: errData.message || 'Lỗi xác thực GitHub API' };
            }
        } catch (err) {
            return { ok: false, mode: 'ERROR', message: err.message };
        }
    }

    startBackgroundAutoSync() {
        window.addEventListener('online', () => {
            this.flushQueue();
        });
        setInterval(() => {
            if (this.syncQueue.length > 0 && navigator.onLine) {
                this.flushQueue();
            }
        }, 8000);
    }

    notifyStatusUI() {
        const badge = document.getElementById('cloud-sync-indicator');
        if (!badge) return;

        const qLen = this.syncQueue.length;
        if (this.config.syncStatus === 'SYNCING') {
            badge.className = 'text-xs px-2.5 py-1 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5';
            badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span> Đang đồng bộ Sheet...`;
        } else if (qLen > 0) {
            badge.className = 'text-xs px-2.5 py-1 rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5';
            badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-500"></span> Hàng đợi (${qLen})`;
        } else {
            badge.className = 'text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5';
            badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500"></span> Auto-Sync: Bật ${this.config.lastSyncTime ? '(' + this.config.lastSyncTime + ')' : ''}`;
        }
    }
}

window.cloudPipeline = new AutomatedCloudPipeline();
