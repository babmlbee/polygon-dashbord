const GITHUB_USER = 'babmlbee'; 
const GITHUB_REPO = 'polygon-dashboard';  
const FILE_PATH = 'data.json';

let currentLang = localStorage.getItem('language') || 'uk';
let polygons = [];
let customMethods = [];
let orders = [];
let isAdmin = !!localStorage.getItem('gh_token');

let editingOrderIndex = -1;

const translations = {
    uk: {
        mainTitle: "Дашборд розпоряджень", addPolygonTitle: "База полігонів", polygonPlaceholder: "Назва полігону", addPolygonBtn: "Додати",
        polyImsmaPlaceholder: "IMSMA ID (необов'язково)", addMethodTitle: "База методів", methodPlaceholder: "Власний тип", addMethodBtn: "Додати",
        btnToggleBasesShow: "+ Відкрити налаштування баз (Полігони / Методи)", btnToggleBasesHide: "- Сховати налаштування баз",
        newOrderTitle: "Нове розпорядження (ТО)", editOrderTitle: "Редагування ТО", optRegion: "Оберіть область...", regKh: "Харківська область", regMyk: "Миколаївська область",
        optType: "Оберіть тип робіт...", selectDefault: "Оберіть полігон...", lblPolygonsInTO: "Об'єкти в цьому розпорядженні:", btnAddPolygonToTO: "+ Додати об'єкт",
        lblSelectMethods: "Оберіть методи розмінування...", lblSelected: "Обрано:",
        lblCadsSpace: "Кадастри (через пробіл/кому/новий рядок):", cadastreInputPlaceholder: "Наприклад: 6322882200:04:000:0091",
        typeDemining: "Розмінування", typeNts: "НТО", typeEore: "ІНРМ",
        optSubNts: "Оберіть підтип НТО...", ntsIn: "Первинне НТО", ntsRe: "Повторне НТО", ntsDemarc: "НТО з метою встановлення маркування", ntsTarget: "Цільове НТО",
        demTs: "Технічне обстеження", demMc: "Розмінування в ручну", demBac: "ОРВБД", demMdd: "Застосування кінологічних розрахунків МРС", demMech: "Розмінування з використанням машин і механізмів",
        orderNumberPlaceholder: "Номер розпорядження", imsmaPlaceholder: "IMSMA ID", addOrderBtn: "Зберегти розпорядження", btnUpdateOrder: "Оновити розпорядження", btnCancel: "Скасувати",
        actualOrdersTitle: "Актуальні розпорядження", inactiveOrdersTitle: "Неактивні / Завершені розпорядження",
        thNum: "ТО / Регіон", thPeriod: "Період", thPolDetails: "Об'єкти, Полігони та Деталі", thAction: "Дія", deleteBtn: "Видалити", editBtn: "Редагувати",
        statusLoaded: "✅ Дані завантажено", statusSaving: "⏳ Збереження...", statusSaved: "✅ Збережено",
        lblImsma: "IMSMA ID", lblType: "Методи", lblSubtype: "Підтип", lblStatus: "NMAC Report Status",
        reportYes: "✅ Надіслано", reportNo: "⏳ Очікується", lblCads: "Кадастри",
        colPolygon: "Полігон", colImsma: "IMSMA ID", colMethods: "Методи розмінування",
        dateWarning: "УВАГА: Наступний місяць має іншу кількість днів. Кінцева дата зміщена. Перевірте її!",
        lblTargetedCadsOnly: "Цільове НТО (тільки кадастри)",
        lblEoreArea: "В межах області (без полігонів)", lblEoreRegion: "Регіон виконання:",
        errNoType: "Оберіть тип робіт та область!", errNoPoly: "Оберіть полігон!", 
        errNtsFields: "Вкажіть Назву та IMSMA для даного виду НТО!",
        errNtsIn: "Вкажіть Громаду для Первинного НТО!",
        errNtsTarget: "Вкажіть кадастри для Цільового НТО!",
        errNoRegion: "Оберіть область!",
        filterTitle: "Фільтри та Пошук", fltSearchPlaceholder: "Пошук (ТО, Полігон, Громада, IMSMA, Кадастр)...",
        fltAllReg: "Всі області", fltKh: "Харківська", fltMyk: "Миколаївська",
        fltAllTypes: "Всі типи робіт", fltDem: "Розмінування", fltNts: "НТО", fltEore: "ІНРМ",
        fltAllStatus: "Всі статуси звітів (тільки для НТО)", fltPending: "⏳ Очікується звіт", fltSent: "✅ Звіт надіслано",
        lblFilterDate: "Період (з - по):", btnResetFilters: "Скинути фільтри", btnOpenPdf: "📄 Відкрити PDF",
        lblCustomPoly: "✏️ Одноразовий полігон (ввести вручну)", customPolyPlaceholder: "Назва полігону",
        lblName: "Назва полігону:", lblHromada: "Громада:", hromadaPlaceholder: "Наприклад: Балаклійська", colHromada: "Громада"
    },
    en: {
        mainTitle: "Task Orders Dashboard", addPolygonTitle: "Polygons Base", polygonPlaceholder: "Polygon Name", addPolygonBtn: "Add",
        polyImsmaPlaceholder: "IMSMA ID (optional)", addMethodTitle: "Methods Base", methodPlaceholder: "Custom method", addMethodBtn: "Add",
        btnToggleBasesShow: "+ Open Base Settings (Polygons / Methods)", btnToggleBasesHide: "- Hide Base Settings",
        newOrderTitle: "New Task Order", editOrderTitle: "Edit Task Order", optRegion: "Select Region...", regKh: "Kharkiv Region", regMyk: "Mykolaiv Region",
        optType: "Select Type...", selectDefault: "Select Polygon...", lblPolygonsInTO: "Items in this TO:", btnAddPolygonToTO: "+ Add Item",
        lblSelectMethods: "Select demining methods...", lblSelected: "Selected:",
        lblCadsSpace: "Cadastres (space/comma separated):", cadastreInputPlaceholder: "Example: 1234567800:01:001:0001",
        typeDemining: "Demining", typeNts: "NTS", typeEore: "EORE",
        optSubNts: "Select NTS Subtype...", ntsIn: "In-NTS", ntsRe: "Re-NTS", ntsDemarc: "Demarcation NTS", ntsTarget: "Targeted NTS",
        demTs: "Technical survey", demMc: "Manual clearance", demBac: "BAC", demMdd: "MDD", demMech: "Mechanical clearance",
        orderNumberPlaceholder: "Task Order Number", imsmaPlaceholder: "IMSMA ID", addOrderBtn: "Save Task Order", btnUpdateOrder: "Update Task Order", btnCancel: "Cancel",
        actualOrdersTitle: "Current Task Orders", inactiveOrdersTitle: "Inactive / Completed Task Orders",
        thNum: "TO / Region", thPeriod: "Period", thPolDetails: "Items, Polygons & Details", thAction: "Action", deleteBtn: "Delete", editBtn: "Edit",
        statusLoaded: "✅ Data loaded", statusSaving: "⏳ Saving...", statusSaved: "✅ Saved",
        lblImsma: "IMSMA ID", lblType: "Methods", lblSubtype: "Subtype", lblStatus: "NMAC Report Status",
        reportYes: "✅ Sent", reportNo: "⏳ Pending", lblCads: "Cadastres",
        colPolygon: "Polygon", colImsma: "IMSMA ID", colMethods: "Demining Methods",
        dateWarning: "WARNING: The next month has a different number of days. The end date was adjusted!",
        lblTargetedCadsOnly: "Targeted NTS (cadastres only)",
        lblEoreArea: "Within region (no polygons)", lblEoreRegion: "Operating Region:",
        errNoType: "Select type and region!", errNoPoly: "Select a polygon!", 
        errNtsFields: "Provide Name and IMSMA for this NTS type!",
        errNtsIn: "Provide Hromada for In-NTS!",
        errNtsTarget: "Provide cadastres for Targeted NTS!",
        errNoRegion: "Select a region!",
        filterTitle: "Filters & Search", fltSearchPlaceholder: "Search (TO, Polygon, Hromada, IMSMA, Cadastre)...",
        fltAllReg: "All Regions", fltKh: "Kharkiv", fltMyk: "Mykolaiv",
        fltAllTypes: "All Types", fltDem: "Demining", fltNts: "NTS", fltEore: "EORE",
        fltAllStatus: "All Report Statuses (NTS only)", fltPending: "⏳ Pending", fltSent: "✅ Sent",
        lblFilterDate: "Period (from - to):", btnResetFilters: "Reset Filters", btnOpenPdf: "📄 Open PDF",
        lblCustomPoly: "✏️ One-time polygon (manual entry)", customPolyPlaceholder: "Polygon name",
        lblName: "Polygon Name:", lblHromada: "Hromada:", hromadaPlaceholder: "Example: Balakliiska", colHromada: "Hromada"
    }
};

function setLanguage(lang) {
    currentLang = lang; localStorage.setItem('language', lang);
    const t = translations[lang];
    
    document.getElementById('lang_uk').className = lang === 'uk' ? 'active' : ''; 
    document.getElementById('lang_en').className = lang === 'en' ? 'active' : '';
    
    document.getElementById('t_mainTitle').innerText = t.mainTitle;
    document.getElementById('t_addPolygonTitle').innerText = t.addPolygonTitle; 
    document.getElementById('newPolygonInput').placeholder = t.polygonPlaceholder; 
    document.getElementById('newPolyImsma').placeholder = t.polyImsmaPlaceholder;
    document.getElementById('t_optRegion').innerText = t.optRegion;
    document.getElementById('t_regKh').innerText = t.regKh;
    document.getElementById('t_regMyk').innerText = t.regMyk;
    document.getElementById('t_addPolygonBtn').innerText = t.addPolygonBtn;
    
    document.getElementById('t_addMethodTitle').innerText = t.addMethodTitle; 
    document.getElementById('newMethodInput').placeholder = t.methodPlaceholder; 
    document.getElementById('t_addMethodBtn').innerText = t.addMethodBtn;
    
    const basesContainer = document.getElementById('basesContainer');
    const btnBases = document.getElementById('t_btnToggleBases');
    if (basesContainer.style.display === 'none' || !basesContainer.style.display) {
        btnBases.innerText = t.btnToggleBasesShow;
    } else {
        btnBases.innerText = t.btnToggleBasesHide;
    }

    if(editingOrderIndex >= 0) {
        document.getElementById('t_newOrderTitle').innerText = t.editOrderTitle + " #" + orders[editingOrderIndex].number;
        document.getElementById('t_addOrderBtn').innerText = t.btnUpdateOrder;
    } else {
        document.getElementById('t_newOrderTitle').innerText = t.newOrderTitle; 
        document.getElementById('t_addOrderBtn').innerText = t.addOrderBtn;
    }
    
    document.getElementById('t_optType').innerText = t.optType;
    document.getElementById('t_typeDemining').innerText = t.typeDemining;
    document.getElementById('t_typeNts').innerText = t.typeNts;
    document.getElementById('t_typeEore').innerText = t.typeEore;
    
    document.getElementById('t_optSubNts').innerText = t.optSubNts;
    document.getElementById('t_ntsIn').innerText = t.ntsIn;
    document.getElementById('t_ntsRe').innerText = t.ntsRe;
    document.getElementById('t_ntsDemarc').innerText = t.ntsDemarc;
    document.getElementById('t_ntsTarget').innerText = t.ntsTarget;

    document.getElementById('t_lblPolygonsInTO').innerText = t.lblPolygonsInTO; 
    document.getElementById('t_btnAddPolygonToTO').innerText = t.btnAddPolygonToTO; 
    document.getElementById('orderNumber').placeholder = t.orderNumberPlaceholder; 
    document.getElementById('cancelEditBtn').innerText = t.btnCancel;
    
    document.getElementById('t_actualOrdersTitle').innerText = t.actualOrdersTitle; 
    document.getElementById('t_inactiveOrdersTitle').innerText = t.inactiveOrdersTitle;
    document.getElementById('t_thNum').innerText = t.thNum; 
    document.getElementById('t_thPeriod').innerText = t.thPeriod; 
    document.getElementById('t_thPolDetails').innerText = t.thPolDetails; 
    document.getElementById('t_thAction').innerText = t.thAction;

    document.getElementById('t_filterTitle').innerText = t.filterTitle;
    document.getElementById('filterText').placeholder = t.fltSearchPlaceholder;
    document.getElementById('t_fltAllReg').innerText = t.fltAllReg;
    document.getElementById('t_fltKh').innerText = t.fltKh;
    document.getElementById('t_fltMyk').innerText = t.fltMyk;
    document.getElementById('t_fltAllTypes').innerText = t.fltAllTypes;
    document.getElementById('t_fltDem').innerText = t.fltDem;
    document.getElementById('t_fltNts').innerText = t.fltNts;
    document.getElementById('t_fltEore').innerText = t.fltEore;
    document.getElementById('t_fltAllStatus').innerText = t.fltAllStatus;
    document.getElementById('t_fltPending').innerText = t.fltPending;
    document.getElementById('t_fltSent').innerText = t.fltSent;
    document.getElementById('t_lblFilterDate').innerText = t.lblFilterDate;
    document.getElementById('t_btnResetFilters').innerText = t.btnResetFilters;
    
    renderOrders();
}

function toggleBases() {
    const container = document.getElementById('basesContainer');
    const btn = document.getElementById('t_btnToggleBases');
    const t = translations[currentLang];
    
    if (container.style.display === 'none' || !container.style.display) {
        container.style.display = 'block';
        btn.innerText = t.btnToggleBasesHide;
    } else {
        container.style.display = 'none';
        btn.innerText = t.btnToggleBasesShow;
    }
}

async function loadData() {
    try {
        let data = null;
        const token = localStorage.getItem('gh_token');
        
        if (token) {
            const apiUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${FILE_PATH}?t=${Date.now()}`;
            const response = await fetch(apiUrl, { headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' } });
            if (response.ok) {
                const fileData = await response.json();
                data = JSON.parse(decodeURIComponent(escape(window.atob(fileData.content))));
            }
        }
        if (!data) {
            const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/${FILE_PATH}?t=${Date.now()}`);
            if (response.ok) data = await response.json();
        }
        if (data) {
            polygons = (data.polygons || []).map(p => (typeof p === 'string' ? { name: p, imsma: "", region: "" } : p));
            customMethods = data.customMethods || []; 
            orders = data.orders || [];
            document.getElementById('syncStatus').innerText = translations[currentLang].statusLoaded;
        } else { 
            document.getElementById('syncStatus').innerText = "База порожня"; 
        }
    } catch (e) { console.error("Load Error:", e); }
    
    renderOrders(); 
    updateAdminUI();
}

function utf8_to_b64(str) { return window.btoa(unescape(encodeURIComponent(str))); }

async function saveToGitHub() {
    const token = localStorage.getItem('gh_token'); if (!token) return;
    document.getElementById('syncStatus').innerText = translations[currentLang].statusSaving;
    const contentBase64 = utf8_to_b64(JSON.stringify({ polygons, customMethods, orders }, null, 2));
    const apiUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${FILE_PATH}`;

    try {
        let sha = null; 
        const getRes = await fetch(apiUrl + `?t=${Date.now()}`, { headers: { 'Authorization': `token ${token}` } });
        if (getRes.ok) { const fileData = await getRes.json(); sha = fileData.sha; }
        
        const putBody = { message: "Оновлення бази дашборду", content: contentBase64 }; 
        if (sha) putBody.sha = sha;
        
        const putRes = await fetch(apiUrl, { method: 'PUT', headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(putBody) });
        if (putRes.ok) { 
            document.getElementById('syncStatus').innerText = translations[currentLang].statusSaved; 
        } else { 
            if (putRes.status === 401) {
                alert("Помилка авторизації. Токен недійсний. Введіть його знову.");
                localStorage.removeItem('gh_token'); isAdmin = false; updateAdminUI();
            } else {
                alert("Сталась помилка при збереженні. Код: " + putRes.status);
                document.getElementById('syncStatus').innerText = "❌ Помилка збереження";
            }
        }
    } catch (e) { console.error(e); }
}

function toggleAdmin() {
    if (isAdmin) { 
        if(confirm("Вийти з режиму Адміністратора?")) { localStorage.removeItem('gh_token'); isAdmin = false; updateAdminUI(); } 
    } else { 
        const token = prompt("Введіть ваш GitHub Personal Access Token:"); 
        if (token) { localStorage.setItem('gh_token', token.trim()); isAdmin = true; updateAdminUI(); } 
    }
}

function updateAdminUI() {
    document.getElementById('adminForms').style.display = isAdmin ? 'block' : 'none';
    const actionHeaders = document.querySelectorAll('.admin-only'); 
    actionHeaders.forEach(el => el.style.display = isAdmin ? 'table-cell' : 'none');
    renderOrders();
}

function addPolygon() {
    const name = document.getElementById('newPolygonInput').value.trim();
    const imsma = document.getElementById('newPolyImsma').value.trim();
    if (name && !polygons.some(p => p.name === name)) { 
        polygons.push({ name, imsma, region: "" }); 
        document.getElementById('newPolygonInput').value = ''; 
        document.getElementById('newPolyImsma').value = '';
        saveToGitHub(); 
    }
}

function addCustomMethod() {
    const name = document.getElementById('newMethodInput').value.trim();
    if (name && !customMethods.includes(name)) { 
        customMethods.push(name); 
        document.getElementById('newMethodInput').value = ''; 
        saveToGitHub(); 
        // Need to re-render form dropdowns if any exist, but they are dynamically generated so it's fine for next blocks
    }
}

function calculateEndDate() {
    const startInput = document.getElementById('startDate').value; if (!startInput) return;
    let start = new Date(startInput); let expectedMonth = (start.getMonth() + 1) % 12; let end = new Date(start); end.setMonth(end.getMonth() + 1);
    if (end.getMonth() !== expectedMonth) { end = new Date(start.getFullYear(), start.getMonth() + 2, 0); alert(translations[currentLang].dateWarning); }
    let y = end.getFullYear(); let m = String(end.getMonth() + 1).padStart(2, '0'); let d = String(end.getDate()).padStart(2, '0'); 
    document.getElementById('endDate').value = `${y}-${m}-${d}`;
}

document.addEventListener('click', function(e) { 
    if (!e.target.closest('.multi-select')) { document.querySelectorAll('.select-dropdown').forEach(d => d.classList.remove('open')); } 
});

function toggleMultiSelect(id) { document.getElementById(id).classList.toggle('open'); }

function updateMethodLabel(blockId) {
    const t = translations[currentLang]; const container = document.getElementById('dd_' + blockId);
    const checked = container.querySelectorAll('input:checked'); const label = document.getElementById('lbl_' + blockId);
    if (checked.length === 0) label.innerText = t.lblSelectMethods; 
    else if (checked.length === 1) label.innerText = checked[0].parentElement.textContent.trim(); 
    else label.innerText = `${t.lblSelected} ${checked.length}`;
}

function toggleGlobalType() {
    const type = document.getElementById('globalType').value;
    const subNts = document.getElementById('globalNtsSub');
    const itemsSection = document.getElementById('itemsSection');
    
    // Очищаємо список полігонів при зміні глобального типу, щоб не міксувати
    document.getElementById('polygonItemsContainer').innerHTML = '';

    if (type === 'nts') {
        subNts.style.display = 'block';
        itemsSection.style.display = 'block';
    } else if (type === 'eore') {
        subNts.style.display = 'none';
        itemsSection.style.display = 'none'; // ІНРМ не потребує об'єктів
    } else {
        subNts.style.display = 'none';
        itemsSection.style.display = 'block';
    }
}

function onPolygonSelect(blockId) {
    const block = document.getElementById(blockId);
    const polyName = block.querySelector('.item-poly-select').value;
    const customNameInput = block.querySelector('.item-custom-name');
    
    if (polyName === '_custom_') {
        customNameInput.style.display = 'block';
        block.querySelector('.item-imsma').value = '';
        return;
    } else {
        customNameInput.style.display = 'none';
    }

    if (!polyName) return;

    const polyData = polygons.find(p => p.name === polyName);
    if (polyData) {
        if (polyData.imsma) block.querySelector('.item-imsma').value = polyData.imsma;
    }

    if (editingOrderIndex === -1) {
        const sortedOrders = [...orders].sort((a, b) => new Date(b.startDate || b.date) - new Date(a.startDate || a.date));
        for (let order of sortedOrders) {
            const item = (order.items || []).find(i => i.polygon === polyName);
            if (item && item.type === 'demining') {
                if (item.imsma) block.querySelector('.item-imsma').value = item.imsma;
                const checkboxes = block.querySelectorAll('.item-methods-group input[type="checkbox"]');
                checkboxes.forEach(cb => { cb.checked = (item.deminingTypes || []).includes(cb.value); });
                updateMethodLabel(blockId);
                break;
            }
        }
    }
}

function addPolygonItemBlock(itemData = null) {
    const t = translations[currentLang]; 
    const blockId = 'poly_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const globalType = document.getElementById('globalType').value;
    const globalSub = document.getElementById('globalNtsSub').value;

    if (!globalType) { alert("Спершу оберіть Тип робіт!"); return; }
    if (globalType === 'nts' && !globalSub) { alert("Спершу оберіть Підтип НТО!"); return; }

    let html = `<div class="polygon-block" id="${blockId}"><button type="button" class="btn-remove" onclick="document.getElementById('${blockId}').remove()">X</button>`;

    if (globalType === 'demining') {
        let polOpts = `<option value="" disabled selected>${t.selectDefault}</option>`; 
        polOpts += `<option value="_custom_" style="font-weight:bold; color:var(--primary);">${t.lblCustomPoly}</option>`;
        polygons.forEach(p => polOpts += `<option value="${p.name}">${p.name}</option>`);
        
        let methodOpts = '';
        const baseMethods = [ {id:'ts', l:t.demTs}, {id:'mc', l:t.demMc}, {id:'bac', l:t.demBac}, {id:'mdd', l:t.demMdd}, {id:'mech', l:t.demMech} ];
        baseMethods.forEach(m => methodOpts += `<label class="checkbox-item"><input type="checkbox" value="${m.id}" onchange="updateMethodLabel('${blockId}')"> <span style="margin:0">${m.l}</span></label>`);
        customMethods.forEach(m => methodOpts += `<label class="checkbox-item"><input type="checkbox" value="${m}" onchange="updateMethodLabel('${blockId}')"> <span style="margin:0">${m}</span></label>`);
        
        html += `
            <div class="form-grid">
                <div>
                    <select class="item-poly-select full-width" onchange="onPolygonSelect('${blockId}')">${polOpts}</select>
                    <input type="text" class="item-custom-name full-width" style="display:none; margin-top: 8px;" placeholder="${t.customPolyPlaceholder}">
                </div>
                <input type="text" class="item-imsma" placeholder="${t.imsmaPlaceholder}">
            </div>
            <div class="multi-select" style="margin-top: 10px;">
                <div class="select-btn" onclick="toggleMultiSelect('dd_${blockId}')"><span id="lbl_${blockId}">${t.lblSelectMethods}</span> <span>▼</span></div>
                <div class="select-dropdown item-methods-group" id="dd_${blockId}">${methodOpts}</div>
            </div>
        `;
    } 
    else if (globalType === 'nts') {
        if (globalSub === 'in_nts') {
            html += `
                <div class="full-width">
                    <label class="lbl-bold">${t.lblHromada}</label>
                    <input type="text" class="item-nts-hromada" placeholder="${t.hromadaPlaceholder}">
                </div>
            `;
        } 
        else if (globalSub === 'targeted') {
            html += `
                <div class="full-width">
                    <label class="lbl-bold">${t.lblCadsSpace}</label>
                    <textarea class="item-cadastres-input" placeholder="${t.cadastreInputPlaceholder}" style="width:100%; padding:8px; border:1px solid var(--border); border-radius:4px; box-sizing:border-box; resize:vertical; min-height:60px; font-family:inherit;"></textarea>
                </div>
            `;
        } 
        else { // re_nts, demarcation
            html += `
                <div class="full-width" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div>
                        <label class="lbl-bold">${t.lblName}</label>
                        <input type="text" class="item-nts-name" placeholder="${t.customPolyPlaceholder}">
                    </div>
                    <div>
                        <label class="lbl-bold">IMSMA ID:</label>
                        <input type="text" class="item-nts-imsma" placeholder="${t.imsmaPlaceholder}">
                    </div>
                </div>
            `;
        }
    }

    html += `</div>`;
    document.getElementById('polygonItemsContainer').insertAdjacentHTML('beforeend', html);
    
    // Якщо редагуємо і є дані
    if (itemData) {
        const block = document.getElementById(blockId);
        if (globalType === 'demining') {
            if (itemData.polygon) {
                const select = block.querySelector('.item-poly-select');
                if(!Array.from(select.options).some(opt => opt.value === itemData.polygon)) {
                    select.value = '_custom_';
                    const customInput = block.querySelector('.item-custom-name');
                    customInput.style.display = 'block';
                    customInput.value = itemData.polygon;
                } else {
                    select.value = itemData.polygon;
                }
            }
            if (itemData.imsma) block.querySelector('.item-imsma').value = itemData.imsma;
            if (itemData.deminingTypes) {
                const checkboxes = block.querySelectorAll('.item-methods-group input[type="checkbox"]');
                checkboxes.forEach(cb => { cb.checked = itemData.deminingTypes.includes(cb.value); });
                updateMethodLabel(blockId);
            }
        } 
        else if (globalType === 'nts') {
            if (globalSub === 'in_nts' && itemData.hromada) {
                block.querySelector('.item-nts-hromada').value = itemData.hromada;
            } else if (globalSub === 'targeted' && itemData.cadastres) {
                block.querySelector('.item-cadastres-input').value = itemData.cadastres.join(', ');
            } else {
                if (itemData.polygon) block.querySelector('.item-nts-name').value = itemData.polygon;
                if (itemData.imsma) block.querySelector('.item-nts-imsma').value = itemData.imsma;
            }
        }
    }
}

function editOrder(globalIndex) {
    if (!isAdmin) return;
    editingOrderIndex = globalIndex;
    const order = orders[globalIndex];
    const t = translations[currentLang];
    
    document.getElementById('orderNumber').value = order.number || '';
    document.getElementById('startDate').value = order.startDate || '';
    document.getElementById('endDate').value = order.endDate || '';
    
    // Визначаємо глобальний тип і регіон зі старого формату або з нового
    let oReg = order.region || '';
    let oType = order.type || (order.items && order.items.length > 0 ? order.items[0].type : 'demining');
    let oSub = order.ntsSubType || (order.items && order.items.length > 0 ? order.items[0].ntsSubType : '');
    
    document.getElementById('globalRegion').value = oReg;
    document.getElementById('globalType').value = oType;
    document.getElementById('globalNtsSub').value = oSub;
    toggleGlobalType(); // оновлює UI

    document.getElementById('polygonItemsContainer').innerHTML = ''; 
    if (order.items && order.items.length > 0) {
        order.items.forEach(item => addPolygonItemBlock(item));
    }
    
    document.getElementById('t_newOrderTitle').innerText = t.editOrderTitle + " #" + order.number;
    document.getElementById('t_addOrderBtn').innerText = t.btnUpdateOrder;
    document.getElementById('cancelEditBtn').style.display = 'inline-block';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelEdit() {
    editingOrderIndex = -1;
    const t = translations[currentLang];
    
    document.getElementById('orderNumber').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('globalRegion').value = '';
    document.getElementById('globalType').value = '';
    document.getElementById('globalNtsSub').value = '';
    toggleGlobalType();
    
    document.getElementById('polygonItemsContainer').innerHTML = '';
    
    document.getElementById('t_newOrderTitle').innerText = t.newOrderTitle;
    document.getElementById('t_addOrderBtn').innerText = t.addOrderBtn;
    document.getElementById('cancelEditBtn').style.display = 'none';
}

function addOrder() {
    const number = document.getElementById('orderNumber').value.trim(); 
    const startDate = document.getElementById('startDate').value; 
    const endDate = document.getElementById('endDate').value;
    const globalRegion = document.getElementById('globalRegion').value;
    const globalType = document.getElementById('globalType').value;
    const globalNtsSub = document.getElementById('globalNtsSub').value;
    
    const blocks = document.querySelectorAll('.polygon-block');
    const t = translations[currentLang];
    
    if (!number || !startDate || !endDate) { alert("Заповніть номер ТО та дати!"); return; }
    if (!globalRegion || !globalType) { alert(t.errNoType); return; }
    if (globalType === 'nts' && !globalNtsSub) { alert("Оберіть підтип НТО!"); return; }
    if (globalType !== 'eore' && blocks.length === 0) { alert("Додайте хоча б один об'єкт до розпорядження!"); return; }

    let items = []; 
    let validationError = false; 
    let errMsg = "";
    
    let orderNtsSent = false;
    if (editingOrderIndex >= 0) {
        orderNtsSent = orders[editingOrderIndex].ntsReportSent !== undefined 
            ? orders[editingOrderIndex].ntsReportSent 
            : (orders[editingOrderIndex].items || []).some(i => i.ntsReportSent);
    }
    
    blocks.forEach(block => {
        let item = {};
        
        if (globalType === 'demining') {
            let poly = block.querySelector('.item-poly-select').value; 
            const customName = block.querySelector('.item-custom-name').value.trim();
            if (poly === '_custom_') poly = customName;
            if (!poly) { validationError = true; errMsg = t.errNoPoly; return; }
            
            item.polygon = poly;
            item.imsma = block.querySelector('.item-imsma').value.trim();
            item.deminingTypes = Array.from(block.querySelectorAll('.item-methods-group input:checked')).map(cb => cb.value);
            
        } else if (globalType === 'nts') {
            if (globalNtsSub === 'in_nts') {
                const hVal = block.querySelector('.item-nts-hromada').value.trim();
                if (!hVal) { validationError = true; errMsg = t.errNtsIn; return; }
                item.hromada = hVal;
            } 
            else if (globalNtsSub === 'targeted') {
                const cStr = block.querySelector('.item-cadastres-input').value.trim();
                item.cadastres = cStr ? cStr.split(/[,;\n\s]+/).map(c => c.trim()).filter(c => c.length > 5) : [];
                if (item.cadastres.length === 0) { validationError = true; errMsg = t.errNtsTarget; return; }
            } 
            else { 
                const nName = block.querySelector('.item-nts-name').value.trim();
                const nImsma = block.querySelector('.item-nts-imsma').value.trim();
                if (!nName && !nImsma) { validationError = true; errMsg = t.errNtsFields; return; }
                item.polygon = nName; item.imsma = nImsma;
            }
        }
        items.push(item);
    });

    if (validationError) { alert(errMsg); return; }

    let updatedOrder = { 
        number, 
        region: globalRegion, 
        type: globalType, 
        startDate, 
        endDate, 
        items 
    };
    if (globalType === 'nts') {
        updatedOrder.ntsSubType = globalNtsSub;
        updatedOrder.ntsReportSent = orderNtsSent;
    }

    if (editingOrderIndex >= 0) {
        updatedOrder.pdfLink = orders[editingOrderIndex].pdfLink;
        orders[editingOrderIndex] = updatedOrder;
    } else {
        orders.push(updatedOrder);
    }
    
    cancelEdit(); 
    renderOrders(); 
    saveToGitHub();
}

function toggleOrderReportStatus(orderIdx) {
    if (!isAdmin) return;
    let order = orders[orderIdx];
    let currentStatus = order.ntsReportSent !== undefined ? order.ntsReportSent : (order.items || []).some(i => i.ntsReportSent);
    order.ntsReportSent = !currentStatus;
    
    // Для зворотної сумісності зі старою структурою
    if (order.items) {
        order.items.forEach(i => { if (i.type === 'nts' || order.type === 'nts') i.ntsReportSent = !currentStatus; });
    }
    
    renderOrders();
    saveToGitHub();
}

function formatD(dStr) { if(!dStr) return ''; const p = dStr.split('-'); return `${p[2]}.${p[1]}.${p[0]}`; }

function getDateStatus(endDateStr) {
    if (!endDateStr) return { class: 'date-green', text: endDateStr };
    const today = new Date(); today.setHours(0,0,0,0);
    const endDate = new Date(endDateStr); endDate.setHours(0,0,0,0);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { class: 'date-red', isInactive: true };
    else if (diffDays <= 10) return { class: 'date-yellow', isInactive: false };
    else return { class: 'date-green', isInactive: false };
}

function resetFilters() {
    document.getElementById('filterText').value = '';
    document.getElementById('filterRegion').value = 'all';
    document.getElementById('filterType').value = 'all';
    document.getElementById('filterNtsStatus').value = 'all';
    document.getElementById('filterDateFrom').value = '';
    document.getElementById('filterDateTo').value = '';
    renderOrders();
}

function getFilteredOrders() {
    const fText = document.getElementById('filterText').value.toLowerCase().trim();
    const fReg = document.getElementById('filterRegion').value;
    const fType = document.getElementById('filterType').value;
    const fNtsStat = document.getElementById('filterNtsStatus').value;
    const fDateFrom = document.getElementById('filterDateFrom').value;
    const fDateTo = document.getElementById('filterDateTo').value;

    return orders.filter(order => {
        if (fReg !== 'all' && order.region !== fReg) return false;
        if (fDateFrom && order.startDate < fDateFrom) return false;
        if (fDateTo && order.endDate > fDateTo) return false;
        
        let oType = order.type || (order.items && order.items.length > 0 ? order.items[0].type : '');
        if (fType !== 'all' && oType !== fType) return false;
        
        let orderNtsSent = order.ntsReportSent !== undefined ? order.ntsReportSent : (order.items || []).some(i => i.ntsReportSent);
        
        if (fNtsStat !== 'all') {
            if (oType !== 'nts') return false;
            if (fNtsStat === 'sent' && !orderNtsSent) return false;
            if (fNtsStat === 'pending' && orderNtsSent) return false;
        }

        if (fText) {
            let matchText = false;
            if ((order.number || '').toLowerCase().includes(fText)) matchText = true;
            
            if (order.items && order.items.length > 0) {
                order.items.forEach(item => {
                    if ((item.polygon || '').toLowerCase().includes(fText)) matchText = true;
                    if ((item.imsma || '').toLowerCase().includes(fText)) matchText = true;
                    if ((item.hromada || '').toLowerCase().includes(fText)) matchText = true;
                    if ((item.cadastres || []).join(' ').toLowerCase().includes(fText)) matchText = true;
                });
            }
            if (!matchText) return false;
        }
        return true;
    });
}

function renderOrders() {
    const tbody = document.getElementById('tableBody'); 
    const inactiveTbody = document.getElementById('inactiveTableBody');
    tbody.innerHTML = ''; inactiveTbody.innerHTML = '';
    
    let filteredOrders = getFilteredOrders();
    const sorted = [...filteredOrders].sort((a, b) => new Date(b.startDate || b.date) - new Date(a.startDate || a.date));
    const t = translations[currentLang];
    
    let activeCount = 0; let inactiveCount = 0;
    
    sorted.forEach((order) => {
        const originalOrderIndex = orders.indexOf(order);
        const dateStatus = getDateStatus(order.endDate);
        const isInactive = dateStatus.isInactive;
        
        if (isInactive) inactiveCount++; else activeCount++;
        
        const tr = document.createElement('tr');
        let regionName = order.region === 'kharkiv' ? t.regKh : (order.region === 'mykolaiv' ? t.regMyk : order.region);
        
        let pdfHtml = '';
        if (order.pdfLink) {
            pdfHtml = `<div style="margin-top: 10px;"><a href="${order.pdfLink}" target="_blank" style="display: inline-block; background-color: #f1f8ff; color: #0366d6; border: 1px solid #c8e1ff; padding: 4px 8px; border-radius: 4px; text-decoration: none; font-size: 12px; font-weight: 600;">${t.btnOpenPdf}</a></div>`;
        }

        let periodHtml = order.startDate ? 
            `<div class="date-cell"><span class="date-badge ${dateStatus.class}">${formatD(order.startDate)}<br>${formatD(order.endDate)}</span></div>` : 
            (order.date || '-');
            
        let itemsHtml = ""; 
        let itemsArr = order.items || [];
        
        // Визначаємо глобальні властивості для рендерингу (навіть зі старої структури)
        let oType = order.type || (itemsArr.length > 0 ? itemsArr[0].type : 'demining');
        let oSub = order.ntsSubType || (itemsArr.length > 0 ? itemsArr[0].ntsSubType : '');

        if (oType === 'eore') {
            itemsHtml += `<div class="poly-list-item"><strong>${t.lblEoreArea}</strong> <span class="tag eore">${t.typeEore}</span><br></div>`;
        } 
        else if (oType === 'demining') {
            itemsArr.forEach(item => {
                let polyName = item.polygon || "-";
                let demTypesArr = item.deminingTypes || [];
                let translatedTypes = demTypesArr.map(typeId => {
                    if (typeId === 'ts') return t.demTs; if (typeId === 'mc') return t.demMc; if (typeId === 'bac') return t.demBac; if (typeId === 'mdd') return t.demMdd; if (typeId === 'mech') return t.demMech; return typeId; 
                });
                
                let methodsTableHtml = '';
                if (translatedTypes.length > 0) {
                    methodsTableHtml = `<table class="info-table"><thead><tr><th>${t.colImsma}</th><th>${t.colMethods}</th></tr></thead><tbody><tr><td><code style="font-size: 13px;">${item.imsma || '-'}</code></td><td>${translatedTypes.join(', ')}</td></tr></tbody></table>`;
                } else {
                    methodsTableHtml = `<table class="info-table"><thead><tr><th>${t.colImsma}</th></tr></thead><tbody><tr><td><code style="font-size: 13px;">${item.imsma || '-'}</code></td></tr></tbody></table>`;
                }
                itemsHtml += `<div class="poly-list-item"><strong>${polyName}</strong> <span class="tag demining">${t.typeDemining}</span><br>${methodsTableHtml}</div>`;
            });
        }
        else if (oType === 'nts') {
            let ntsName = t.ntsIn;
            if(oSub === 're_nts') ntsName = t.ntsRe; 
            if(oSub === 'demarcation') ntsName = t.ntsDemarc; 
            if(oSub === 'targeted') ntsName = t.ntsTarget;

            let hromadas = [];
            let polygons = [];
            let cadastres = [];
            
            itemsArr.forEach(item => {
                if (item.hromada) hromadas.push(item.hromada);
                if (item.polygon || item.imsma) polygons.push({ name: item.polygon, imsma: item.imsma });
                if (item.cadastres && item.cadastres.length > 0) cadastres.push(...item.cadastres);
            });

            let detailsStr = '';

            if (oSub === 'in_nts' && hromadas.length > 0) {
                let uniqueHromadas = [...new Set(hromadas)];
                detailsStr += `<div style="margin-top:5px;"><table class="info-table"><thead><tr><th>${t.colHromada}</th></tr></thead><tbody>`;
                uniqueHromadas.forEach(h => { detailsStr += `<tr><td><strong>${h}</strong></td></tr>`; });
                detailsStr += `</tbody></table></div>`;
            }

            if ((oSub === 're_nts' || oSub === 'demarcation') && polygons.length > 0) {
                detailsStr += `<div style="margin-top:5px;"><table class="info-table"><thead><tr><th>${t.colPolygon}</th><th>${t.colImsma}</th></tr></thead><tbody>`;
                polygons.forEach(p => {
                    let pName = p.name || '-';
                    let pImsma = p.imsma || '-';
                    detailsStr += `<tr><td><strong>${pName}</strong></td><td><code style="font-size: 13px;">${pImsma}</code></td></tr>`;
                });
                detailsStr += `</tbody></table></div>`;
            }

            if (oSub === 'targeted' && cadastres.length > 0) {
                let uniqueCads = [...new Set(cadastres)];
                detailsStr += `<div style="margin-top:5px;"><table class="info-table"><thead><tr><th>Кадастрові номери</th></tr></thead><tbody>`;
                uniqueCads.forEach(cad => { detailsStr += `<tr><td><code style="font-size: 13px;">${cad}</code></td></tr>`; });
                detailsStr += `</tbody></table></div>`;
            }

            itemsHtml += `<div class="poly-list-item"><strong>${ntsName}</strong> <span class="tag nts">${t.typeNts}</span><br>${detailsStr}</div>`;
            
            let isSent = order.ntsReportSent !== undefined ? order.ntsReportSent : itemsArr.some(i => i.ntsReportSent);
            let reportHtml = isAdmin 
                ? `<label style="cursor:pointer; display:inline-flex; align-items:center; background:#f6f8fa; padding:4px 8px; border:1px solid #e1e4e8; border-radius:4px;"><input type="checkbox" onchange="toggleOrderReportStatus(${originalOrderIndex})" ${isSent ? 'checked' : ''} style="margin-right:6px;"> ${isSent ? t.reportYes : t.reportNo}</label>`
                : `<span style="background:#f6f8fa; padding:4px 8px; border:1px solid #e1e4e8; border-radius:4px; display:inline-block;">${isSent ? t.reportYes : t.reportNo}</span>`;
            
            itemsHtml += `<div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed var(--border);">
                            <div style="margin-bottom:4px;"><small style="color:#586069;"><b>${t.lblStatus}:</b></small></div>
                            ${reportHtml}
                          </div>`;
        }

        let html = `<td><strong>#${order.number}</strong><br><small style="color:#586069;">${regionName}</small>${pdfHtml}</td><td>${periodHtml}</td><td>${itemsHtml}</td>`;
        if (isAdmin) {
            html += `<td class="admin-only" style="vertical-align: middle;"><div class="action-buttons"><button class="edit-btn" onclick="editOrder(${originalOrderIndex})">${t.editBtn}</button><button class="delete-btn" onclick="deleteOrder(${originalOrderIndex})">${t.deleteBtn}</button></div></td>`;
        }
        tr.innerHTML = html;
        
        if (isInactive) { inactiveTbody.appendChild(tr); } else { tbody.appendChild(tr); }
    });

    document.getElementById('inactiveCard').style.display = inactiveCount > 0 ? 'block' : 'none';
}

function deleteOrder(index) { 
    if(confirm("Видалити це розпорядження повністю?")) { 
        orders.splice(index, 1); renderOrders(); saveToGitHub(); 
    } 
}

setLanguage(currentLang); 
loadData();
