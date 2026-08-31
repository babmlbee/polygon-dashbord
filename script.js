const GITHUB_USER = 'babmlbee'; 
const GITHUB_REPO = 'polygon-dashboard';  
const FILE_PATH = 'data.json';

let currentLang = localStorage.getItem('language') || 'uk';
let polygons = [];
let customMethods = [];
let orders = [];
let isAdmin = !!localStorage.getItem('gh_token');

const translations = {
    uk: {
        mainTitle: "Дашборд розпоряджень", addPolygonTitle: "База полігонів", polygonPlaceholder: "Назва полігону", addPolygonBtn: "Додати",
        polyImsmaPlaceholder: "IMSMA ID (необов'язково)", addMethodTitle: "База методів", methodPlaceholder: "Власний тип", addMethodBtn: "Додати",
        newOrderTitle: "Нове розпорядження (ТО)", optRegion: "Оберіть область...", regKh: "Харківська область", regMyk: "Миколаївська область",
        optType: "Оберіть тип...", selectDefault: "Оберіть полігон...", lblPolygonsInTO: "Об'єкти в цьому розпорядженні:", btnAddPolygonToTO: "+ Додати об'єкт до ТО",
        lblSelectMethods: "Оберіть методи розмінування...", lblSelected: "Обрано:",
        lblCadsSpace: "Кадастри (через пробіл):", cadastreInputPlaceholder: "Наприклад: 1234567800:01:001:0001",
        typeDemining: "Розмінування", typeNts: "НТО", typeEore: "ІНРМ",
        optSubNts: "Оберіть підтип НТО...", ntsIn: "Первинне НТО", ntsRe: "Повторне НТО", ntsDemarc: "НТО З метою встановлення маркування", ntsTarget: "Цільове НТО",
        demTs: "Технічне обстеження", demMc: "Розмінування в ручну", demBac: "ОРВБД", demMdd: "Застосування кінологічних розрахунків МРС", demMech: "Розмінування з використанням машин і механізмів",
        orderNumberPlaceholder: "Номер розпорядження", imsmaPlaceholder: "IMSMA ID", addOrderBtn: "Зберегти розпорядження", 
        actualOrdersTitle: "Актуальні розпорядження", inactiveOrdersTitle: "Неактивні / Завершені розпорядження",
        thNum: "ТО / Регіон", thPeriod: "Період", thPolDetails: "Об'єкти, Полігони та Деталі", thAction: "Дія", deleteBtn: "Видалити",
        statusLoaded: "✅ Дані завантажено", statusSaving: "⏳ Збереження...", statusSaved: "✅ Збережено",
        lblImsma: "IMSMA ID", lblType: "Методи", lblSubtype: "Підтип", lblStatus: "Статус звіту",
        reportYes: "✅ Надіслано", reportNo: "⏳ Очікується", lblCads: "Кадастри",
        colPolygon: "Полігон", colImsma: "IMSMA ID", colMethods: "Методи розмінування",
        dateWarning: "УВАГА: Наступний місяць має іншу кількість днів. Кінцева дата зміщена. Перевірте її!",
        lblTargetedCadsOnly: "Цільове НТО (тільки кадастри)",
        errNoType: "Оберіть тип для всіх об'єктів!", errNoPoly: "Оберіть полігон!", errCadsOrPoly: "Для Цільового НТО потрібно вказати кадастри або обрати полігон!"
    },
    en: {
        mainTitle: "Task Orders Dashboard", addPolygonTitle: "Polygons Base", polygonPlaceholder: "Polygon Name", addPolygonBtn: "Add",
        polyImsmaPlaceholder: "IMSMA ID (optional)", addMethodTitle: "Methods Base", methodPlaceholder: "Custom method", addMethodBtn: "Add",
        newOrderTitle: "New Task Order", optRegion: "Select Region...", regKh: "Kharkiv Region", regMyk: "Mykolaiv Region",
        optType: "Select Type...", selectDefault: "Select Polygon...", lblPolygonsInTO: "Items in this TO:", btnAddPolygonToTO: "+ Add Item to TO",
        lblSelectMethods: "Select demining methods...", lblSelected: "Selected:",
        lblCadsSpace: "Cadastres (space-separated):", cadastreInputPlaceholder: "Example: 1234567800:01:001:0001",
        typeDemining: "Demining", typeNts: "NTS", typeEore: "EORE",
        optSubNts: "Select NTS Subtype...", ntsIn: "In-NTS", ntsRe: "Re-NTS", ntsDemarc: "Demarcation NTS", ntsTarget: "Targeted NTS",
        demTs: "Technical survey", demMc: "Manual clearance", demBac: "BAC", demMdd: "MDD", demMech: "Mechanical clearance",
        orderNumberPlaceholder: "Task Order Number", imsmaPlaceholder: "IMSMA ID", addOrderBtn: "Save Task Order", 
        actualOrdersTitle: "Current Task Orders", inactiveOrdersTitle: "Inactive / Completed Task Orders",
        thNum: "TO / Region", thPeriod: "Period", thPolDetails: "Items, Polygons & Details", thAction: "Action", deleteBtn: "Delete",
        statusLoaded: "✅ Data loaded", statusSaving: "⏳ Saving...", statusSaved: "✅ Saved",
        lblImsma: "IMSMA ID", lblType: "Methods", lblSubtype: "Subtype", lblStatus: "Completion Report Status",
        reportYes: "✅ Sent", reportNo: "⏳ Pending", lblCads: "Cadastres",
        colPolygon: "Polygon", colImsma: "IMSMA ID", colMethods: "Demining Methods",
        dateWarning: "WARNING: The next month has a different number of days. The end date was adjusted!",
        lblTargetedCadsOnly: "Targeted NTS (cadastres only)",
        errNoType: "Select type for all items!", errNoPoly: "Select a polygon!", errCadsOrPoly: "For Targeted NTS, provide cadastres or select a polygon!"
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
    document.getElementById('t_polyOptRegion').innerText = t.optRegion;
    document.getElementById('t_polyRegKh').innerText = t.regKh;
    document.getElementById('t_polyRegMyk').innerText = t.regMyk;
    document.getElementById('t_addPolygonBtn').innerText = t.addPolygonBtn;
    
    document.getElementById('t_addMethodTitle').innerText = t.addMethodTitle; 
    document.getElementById('newMethodInput').placeholder = t.methodPlaceholder; 
    document.getElementById('t_addMethodBtn').innerText = t.addMethodBtn;
    document.getElementById('t_newOrderTitle').innerText = t.newOrderTitle; 
    document.getElementById('t_optRegion').innerText = t.optRegion; 
    document.getElementById('t_regKh').innerText = t.regKh; 
    document.getElementById('t_regMyk').innerText = t.regMyk;
    document.getElementById('t_lblPolygonsInTO').innerText = t.lblPolygonsInTO; 
    document.getElementById('t_btnAddPolygonToTO').innerText = t.btnAddPolygonToTO; 
    document.getElementById('orderNumber').placeholder = t.orderNumberPlaceholder; 
    document.getElementById('t_addOrderBtn').innerText = t.addOrderBtn;
    document.getElementById('t_actualOrdersTitle').innerText = t.actualOrdersTitle; 
    document.getElementById('t_inactiveOrdersTitle').innerText = t.inactiveOrdersTitle;
    document.getElementById('t_thNum').innerText = t.thNum; 
    document.getElementById('t_thPeriod').innerText = t.thPeriod; 
    document.getElementById('t_thPolDetails').innerText = t.thPolDetails; 
    document.getElementById('t_thAction').innerText = t.thAction;
    
    document.getElementById('polygonItemsContainer').innerHTML = ''; 
    renderOrders();
}

async function loadData() {
    try {
        const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/${FILE_PATH}?t=${Date.now()}`);
        if (response.ok) {
            const data = await response.json();
            
            // Сумісність: перетворення старих рядків на об'єкти
            polygons = (data.polygons || []).map(p => {
                if (typeof p === 'string') return { name: p, imsma: "", region: "" };
                return p;
            });
            
            customMethods = data.customMethods || []; 
            orders = data.orders || [];
            document.getElementById('syncStatus').innerText = translations[currentLang].statusLoaded;
        } else { 
            document.getElementById('syncStatus').innerText = "База порожня"; 
        }
    } catch (e) { console.error(e); }
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
        let sha = null; const getRes = await fetch(apiUrl, { headers: { 'Authorization': `token ${token}` } });
        if (getRes.ok) { const fileData = await getRes.json(); sha = fileData.sha; }
        const body = { message: "Оновлення бази дашборду", content: contentBase64 }; if (sha) body.sha = sha;
        const putRes = await fetch(apiUrl, { method: 'PUT', headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (putRes.ok) { document.getElementById('syncStatus').innerText = translations[currentLang].statusSaved; } 
        else { alert("Помилка збереження. Перевірте токен."); localStorage.removeItem('gh_token'); isAdmin = false; updateAdminUI(); }
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
    const region = document.getElementById('newPolyRegion').value;
    
    if (name && !polygons.some(p => p.name === name)) { 
        polygons.push({ name, imsma, region }); 
        
        document.getElementById('newPolygonInput').value = ''; 
        document.getElementById('newPolyImsma').value = '';
        document.getElementById('newPolyRegion').value = '';
        
        document.querySelectorAll('.item-poly-select').forEach(select => {
            select.insertAdjacentHTML('beforeend', `<option value="${name}">${name}</option>`);
        });
        saveToGitHub(); 
    }
}

function addCustomMethod() {
    const name = document.getElementById('newMethodInput').value.trim();
    if (name && !customMethods.includes(name)) { 
        customMethods.push(name); 
        document.getElementById('newMethodInput').value = ''; 
        
        const blocks = document.querySelectorAll('.polygon-block');
        blocks.forEach(block => {
            const blockId = block.id;
            const dropdown = document.getElementById('dd_' + blockId);
            if (dropdown) {
                const html = `<label class="checkbox-item"><input type="checkbox" value="${name}" onchange="updateMethodLabel('${blockId}')"> <span style="margin:0">${name}</span></label>`;
                dropdown.insertAdjacentHTML('beforeend', html);
            }
        });
        saveToGitHub(); 
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

function toggleNtsSub(blockId) {
    const block = document.getElementById(blockId);
    const sub = block.querySelector('.item-nts-sub').value;
    const cadGroup = block.querySelector('.item-cadastres-group');
    if(sub === 'targeted') cadGroup.style.display = 'block'; else cadGroup.style.display = 'none';
}

function toggleItemFields(blockId) {
    const block = document.getElementById(blockId);
    const type = block.querySelector('.item-type-select').value;
    const demFields = block.querySelector('.item-demining-fields');
    const ntsFields = block.querySelector('.item-nts-fields');
    
    demFields.classList.remove('active'); ntsFields.classList.remove('active');
    
    if(type === 'demining') demFields.classList.add('active');
    if(type === 'nts') { ntsFields.classList.add('active'); toggleNtsSub(blockId); }
}

// Функція, яка спрацьовує при виборі полігону і підтягує всі його дані
function onPolygonSelect(blockId) {
    const block = document.getElementById(blockId);
    const polyName = block.querySelector('.item-poly-select').value;
    if (!polyName) return;

    // 1. Отримуємо базові налаштування полігону
    const polyData = polygons.find(p => p.name === polyName);
    if (polyData) {
        if (polyData.imsma) block.querySelector('.item-imsma').value = polyData.imsma;
        if (polyData.region) {
            const globReg = document.getElementById('orderRegion');
            if (!globReg.value) globReg.value = polyData.region;
        }
    }

    // 2. Шукаємо останнє використання полігону в історії розпоряджень
    let foundHistory = false;
    const sortedOrders = [...orders].sort((a, b) => new Date(b.startDate || b.date) - new Date(a.startDate || a.date));
    
    for (let order of sortedOrders) {
        const item = (order.items || []).find(i => i.polygon === polyName);
        if (item) {
            foundHistory = true;
            
            // Відновлюємо Тип
            block.querySelector('.item-type-select').value = item.type;
            toggleItemFields(blockId);

            // Якщо глобальний регіон ще не встановлено, беремо з історії
            const globReg = document.getElementById('orderRegion');
            if (!globReg.value && order.region) globReg.value = order.region;

            // Відновлюємо специфічні поля
            if (item.type === 'demining') {
                if (item.imsma) block.querySelector('.item-imsma').value = item.imsma;
                
                const checkboxes = block.querySelectorAll('.item-methods-group input[type="checkbox"]');
                checkboxes.forEach(cb => {
                    cb.checked = (item.deminingTypes || []).includes(cb.value);
                });
                updateMethodLabel(blockId);
                
            } else if (item.type === 'nts') {
                block.querySelector('.item-nts-sub').value = item.ntsSubType;
                toggleNtsSub(blockId);
                // Кадастри НЕ переносяться за вимогою
            }
            break; // Знайшли найсвіжіше — зупиняємось
        }
    }

    if (!foundHistory) {
        toggleItemFields(blockId);
    }
}

function addPolygonItemBlock() {
    const t = translations[currentLang]; const blockId = 'poly_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    
    let polOpts = `<option value="" disabled selected>${t.selectDefault}</option>`; 
    polygons.forEach(p => polOpts += `<option value="${p.name}">${p.name}</option>`);
    
    let methodOpts = '';
    const baseMethods = [ {id:'ts', l:t.demTs}, {id:'mc', l:t.demMc}, {id:'bac', l:t.demBac}, {id:'mdd', l:t.demMdd}, {id:'mech', l:t.demMech} ];
    baseMethods.forEach(m => methodOpts += `<label class="checkbox-item"><input type="checkbox" value="${m.id}" onchange="updateMethodLabel('${blockId}')"> <span style="margin:0">${m.l}</span></label>`);
    customMethods.forEach(m => methodOpts += `<label class="checkbox-item"><input type="checkbox" value="${m}" onchange="updateMethodLabel('${blockId}')"> <span style="margin:0">${m}</span></label>`);
    
    const html = `
        <div class="polygon-block" id="${blockId}">
            <button type="button" class="btn-remove" onclick="document.getElementById('${blockId}').remove()">X</button>
            <div class="form-grid">
                <select class="item-poly-select" onchange="onPolygonSelect('${blockId}')">
                    ${polOpts}
                </select>
                <select class="item-type-select" onchange="toggleItemFields('${blockId}')">
                    <option value="" disabled selected>${t.optType}</option>
                    <option value="demining">${t.typeDemining}</option>
                    <option value="nts">${t.typeNts}</option>
                    <option value="eore">${t.typeEore}</option>
                </select>
            </div>
            
            <div class="item-demining-fields dynamic-fields">
                <input type="text" class="item-imsma" placeholder="${t.imsmaPlaceholder}">
                <div class="multi-select">
                    <div class="select-btn" onclick="toggleMultiSelect('dd_${blockId}')"><span id="lbl_${blockId}">${t.lblSelectMethods}</span> <span>▼</span></div>
                    <div class="select-dropdown item-methods-group" id="dd_${blockId}">${methodOpts}</div>
                </div>
            </div>
            
            <div class="item-nts-fields dynamic-fields">
                <select class="item-nts-sub full-width" onchange="toggleNtsSub('${blockId}')">
                    <option value="" disabled selected>${t.optSubNts}</option>
                    <option value="in_nts">${t.ntsIn}</option>
                    <option value="re_nts">${t.ntsRe}</option>
                    <option value="demarcation">${t.ntsDemarc}</option>
                    <option value="targeted">${t.ntsTarget}</option>
                </select>

                <div class="item-cadastres-group full-width" style="display:none; margin-top: 5px;">
                    <label class="lbl-bold">${t.lblCadsSpace}</label>
                    <input type="text" class="item-cadastres-input" placeholder="${t.cadastreInputPlaceholder}">
                </div>
            </div>
        </div>
    `;
    document.getElementById('polygonItemsContainer').insertAdjacentHTML('beforeend', html);
}

function addOrder() {
    const number = document.getElementById('orderNumber').value.trim(); 
    const region = document.getElementById('orderRegion').value;
    const startDate = document.getElementById('startDate').value; 
    const endDate = document.getElementById('endDate').value;
    const blocks = document.querySelectorAll('.polygon-block');
    const t = translations[currentLang];
    
    if (!number || !region || !startDate || !endDate) { alert("Заповніть номер ТО, область та дати!"); return; }
    if (blocks.length === 0) { alert("Додайте хоча б один об'єкт до розпорядження!"); return; }

    let items = []; let validationError = false; let errMsg = "";
    
    blocks.forEach(block => {
        const type = block.querySelector('.item-type-select').value; 
        const poly = block.querySelector('.item-poly-select').value; 
        
        if (!type) { validationError = true; errMsg = t.errNoType; return; }
        
        let item = { polygon: poly, type: type };
        
        if (type === 'demining') {
            if (!poly) { validationError = true; errMsg = t.errNoPoly; return; }
            item.imsma = block.querySelector('.item-imsma').value.trim();
            item.deminingTypes = Array.from(block.querySelectorAll('.item-methods-group input:checked')).map(cb => cb.value);
        } else if (type === 'nts') {
            item.ntsSubType = block.querySelector('.item-nts-sub').value;
            item.ntsReportSent = false;
            
            if(item.ntsSubType === 'targeted') {
                const cadStr = block.querySelector('.item-cadastres-input').value.trim();
                item.cadastres = cadStr ? cadStr.split(/\s+/) : [];
                if (!poly && item.cadastres.length === 0) { validationError = true; errMsg = t.errCadsOrPoly; return; }
            } else {
                if (!poly) { validationError = true; errMsg = t.errNoPoly; return; }
            }
        } else if (type === 'eore') {
            if (!poly) { validationError = true; errMsg = t.errNoPoly; return; }
        }
        items.push(item);
    });

    if (validationError) { alert(errMsg); return; }

    orders.push({ number, region, startDate, endDate, items });
    document.getElementById('orderNumber').value = ''; document.getElementById('orderRegion').value = ''; 
    document.getElementById('startDate').value = ''; document.getElementById('endDate').value = ''; 
    document.getElementById('polygonItemsContainer').innerHTML = '';
    renderOrders(); 
    saveToGitHub();
}

function toggleReportStatus(orderIdx, itemIdx) {
    if (!isAdmin) return;
    orders[orderIdx].items[itemIdx].ntsReportSent = !orders[orderIdx].items[itemIdx].ntsReportSent;
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

function renderOrders() {
    const tbody = document.getElementById('tableBody'); 
    const inactiveTbody = document.getElementById('inactiveTableBody');
    tbody.innerHTML = ''; inactiveTbody.innerHTML = '';
    
    const sorted = [...orders].sort((a, b) => new Date(b.startDate || b.date) - new Date(a.startDate || a.date));
    const t = translations[currentLang];
    
    let activeCount = 0; let inactiveCount = 0;
    
    sorted.forEach((order) => {
        const originalOrderIndex = orders.indexOf(order);
        const dateStatus = getDateStatus(order.endDate);
        const isInactive = dateStatus.isInactive;
        
        if (isInactive) inactiveCount++; else activeCount++;
        
        const tr = document.createElement('tr');
        let regionName = order.region === 'kharkiv' ? t.regKh : (order.region === 'mykolaiv' ? t.regMyk : order.region);
        
        let periodHtml = order.startDate ? 
            `<div class="date-cell"><span class="date-badge ${dateStatus.class}">${formatD(order.startDate)} — ${formatD(order.endDate)}</span></div>` : 
            (order.date || '-');
            
        let itemsHtml = ""; 
        let itemsArr = order.items || [];
        
        itemsArr.forEach((item, itemIdx) => {
            let typeTag = ""; let detailsStr = "";
            let polyName = item.polygon ? item.polygon : t.lblTargetedCadsOnly;

            if (item.type === 'demining') {
                typeTag = `<span class="tag demining">${t.typeDemining}</span>`;
                let demTypesArr = item.deminingTypes || [];
                let translatedTypes = demTypesArr.map(typeId => {
                    if (typeId === 'ts') return t.demTs; if (typeId === 'mc') return t.demMc; if (typeId === 'bac') return t.demBac; if (typeId === 'mdd') return t.demMdd; if (typeId === 'mech') return t.demMech; return typeId; 
                });
                
                let methodsTableHtml = '';
                if (translatedTypes.length > 0) {
                    methodsTableHtml = `<table class="info-table"><thead><tr><th>${t.colImsma}</th><th>${t.colMethods}</th></tr></thead><tbody><tr><td><code>${item.imsma || '-'}</code></td><td>${translatedTypes.join(', ')}</td></tr></tbody></table>`;
                } else {
                    methodsTableHtml = `<table class="info-table"><thead><tr><th>${t.colImsma}</th></tr></thead><tbody><tr><td><code>${item.imsma || '-'}</code></td></tr></tbody></table>`;
                }
                detailsStr = methodsTableHtml;

            } else if (item.type === 'nts') {
                typeTag = `<span class="tag nts">${t.typeNts}</span>`;
                let ntsName = t.ntsIn;
                if(item.ntsSubType === 're_nts') ntsName = t.ntsRe; if(item.ntsSubType === 'demarcation') ntsName = t.ntsDemarc; if(item.ntsSubType === 'targeted') ntsName = t.ntsTarget;
                
                let reportStatusHtml = '';
                if (isAdmin) {
                    reportStatusHtml = `<label style="cursor:pointer; display:inline-flex; align-items:center; background:#f6f8fa; padding:2px 6px; border:1px solid #e1e4e8; border-radius:4px;"><input type="checkbox" onchange="toggleReportStatus(${originalOrderIndex}, ${itemIdx})" ${item.ntsReportSent ? 'checked' : ''} style="margin-right:6px;"> ${item.ntsReportSent ? t.reportYes : t.reportNo}</label>`;
                } else {
                    reportStatusHtml = item.ntsReportSent ? t.reportYes : t.reportNo;
                }

                let cadastreHtml = '';
                if (item.ntsSubType === 'targeted' && item.cadastres && item.cadastres.length > 0) {
                    cadastreHtml = `<div style="margin-top:5px;"><b>${t.lblCads}:</b><table class="info-table"><thead><tr><th>Кадастрові номери</th></tr></thead><tbody>`;
                    item.cadastres.forEach(cad => { cadastreHtml += `<tr><td><code>${cad}</code></td></tr>`; });
                    cadastreHtml += `</tbody></table></div>`;
                }

                detailsStr = `<small style="color:#586069;"><b>${t.lblSubtype}:</b> ${ntsName}<br><div style="margin-top:5px;"><b>${t.lblStatus}:</b> ${reportStatusHtml}</div>${cadastreHtml}</small>`;
            } else if (item.type === 'eore') {
                typeTag = `<span class="tag eore">${t.typeEore}</span>`;
            }
            
            itemsHtml += `<div class="poly-list-item"><strong>${polyName}</strong> ${typeTag}<br>${detailsStr}</div>`;
        });

        let html = `<td><strong>#${order.number}</strong><br><small style="color:#586069;">${regionName}</small></td><td>${periodHtml}</td><td>${itemsHtml}</td>`;
        if (isAdmin) {
            html += `<td class="admin-only"><button class="delete-btn" onclick="deleteOrder(${originalOrderIndex})">${t.deleteBtn}</button></td>`;
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
