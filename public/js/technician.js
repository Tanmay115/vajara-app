// Checklist items for Final Assembly
const CHECKLIST_ITEMS = [
  // Top Lead > 1. Visual and Structural Checks
  { id: 1, section: "Top Lead", subsection: "1. Visual and Structural Checks", desc: "Check the top lead area for any visible cracks or damage." },
  { id: 2, section: "Top Lead", subsection: "1. Visual and Structural Checks", desc: "Ensure the bezel is properly adhered to the top lead." },
  // Top Lead > 2. Sticker and Label Placement
  { id: 3, section: "Top Lead", subsection: "2. Sticker and Label Placement", desc: "Verify that the Power and Wi-Fi LED stickers are properly pasted in their designated positions." },
  { id: 4, section: "Top Lead", subsection: "2. Sticker and Label Placement", desc: "Ensure the brand sticker is properly placed at the top-right corner of the top lead." },
  // Top Lead > 3. LED Component Placement
  { id: 5, section: "Top Lead", subsection: "3. LED Component Placement", desc: "Confirm the Wi-Fi LED is present at the bottom-right corner." },
  { id: 6, section: "Top Lead", subsection: "3. LED Component Placement", desc: "Confirm the Power LED is positioned to the left of the Wi-Fi LED." },
  { id: 7, section: "Top Lead", subsection: "3. LED Component Placement", desc: "Ensure both Power and Wi-Fi LEDs are securely fixed using black silicone." },
  // Top Lead > 4. Screen Support & Adhesion
  { id: 8, section: "Top Lead", subsection: "4. Screen Support & Adhesion", desc: "Check that the screen support is properly and securely adhered." },
  { id: 9, section: "Top Lead", subsection: "4. Screen Support & Adhesion", desc: "Verify that black silicone is applied on the left and right sides of the screen support plate." },
  { id: 10, section: "Top Lead", subsection: "4. Screen Support & Adhesion", desc: "Check that white silicone is properly applied in the gap between the screen and the top lead." },
  // Top Lead > 5. Fasteners and Hardware
  { id: 11, section: "Top Lead", subsection: "5. Fasteners and Hardware", desc: "Confirm that four (3M x 10) screws are present on the screen support plate." },
  { id: 12, section: "Top Lead", subsection: "5. Fasteners and Hardware", desc: "Verify the use of four 3M plain washers and four 3M spring washers." },
  { id: 13, section: "Top Lead", subsection: "5. Fasteners and Hardware", desc: "Ensure all 3M nylon 4 nuts are tightly secured." },
  // Top Lead > 6. Cable Management
  { id: 14, section: "Top Lead", subsection: "6. Cable Management", desc: "Ensure all tie mounts are properly pasted at their designated positions. (Top-8)" },
  { id: 15, section: "Top Lead", subsection: "6. Cable Management", desc: "Check the routing of the HDMI cable on the top lead and secure it with a cable tie." },
  { id: 16, section: "Top Lead", subsection: "6. Cable Management", desc: "Check the routing of the touch cable on the top lead and secure it with a cable tie." },
  { id: 17, section: "Top Lead", subsection: "6. Cable Management", desc: "Check the routing of the Wi-Fi and Power LED cables on the top lead and secure them with a cable tie." },
  { id: 18, section: "Top Lead", subsection: "6. Cable Management", desc: "Check the routing of the screen power cable and secure it with a cable tie." },
  { id: 19, section: "Top Lead", subsection: "6. Cable Management", desc: "Check the routing of the backup screen power cable and secure it with a cable tie." },
  { id: 20, section: "Top Lead", subsection: "6. Cable Management", desc: "Ensure all cables from the top lead to the base are neatly bundled and secured with cable ties." },
  // Top Lead > 7. Electrical Connections
  { id: 21, section: "Top Lead", subsection: "7. Electrical Connections", desc: "Verify that the Touch USB is properly connected to the screen." },
  { id: 22, section: "Top Lead", subsection: "7. Electrical Connections", desc: "Verify that the HDMI cable is properly connected to the screen." },
  { id: 23, section: "Top Lead", subsection: "7. Electrical Connections", desc: "Confirm that the screen power supply is properly connected." },
  // Base > 8. Mechanical Assembly
  { id: 24, section: "Base", subsection: "8. Mechanical Assembly", desc: "Check the Base area for any visible cracks or damage." },
  { id: 25, section: "Base", subsection: "8. Mechanical Assembly", desc: "Check for Vajra ID sticker placement (both inside and outside)." },
  { id: 26, section: "Base", subsection: "8. Mechanical Assembly", desc: "Check that the close grommet is fitted properly. (Qty-4)" },
  { id: 27, section: "Base", subsection: "8. Mechanical Assembly", desc: "Check the Fan Direction (air flow is outside of the vajra)" },
  { id: 28, section: "Base", subsection: "8. Mechanical Assembly", desc: "Check the fan inlet is fitted with 4M x 15 screws(Qty-4) and nylon nuts(Qty-4) properly." },
  { id: 29, section: "Base", subsection: "8. Mechanical Assembly", desc: "Check fan and fan casing are fitted properly using 4M x 50 screws(Qty-2), 4M washers(Qty-6), and nylon nuts(Qty-2)." },
  { id: 30, section: "Base", subsection: "8. Mechanical Assembly", desc: "Check fan filters are present at inlet and outlet cases. (small-1, Big-1)" },
  { id: 31, section: "Base", subsection: "8. Mechanical Assembly", desc: "Check the TB DIN rail is properly fitted with 3M x 10 screws, 3M washers, and 3M nylon nuts." },
  { id: 32, section: "Base", subsection: "8. Mechanical Assembly", desc: "Check TB set is properly mounted along with closing plate and 1 extra fuse. (Grey, Black, Green)" },
  { id: 33, section: "Base", subsection: "8. Mechanical Assembly", desc: "Ensure the SMPS is fitted correctly using 3M x 10 screws(Qty-2), 3M washer, and nylon nuts(Qty-2)." },
  { id: 34, section: "Base", subsection: "8. Mechanical Assembly", desc: "Check 4DIO standoffs (3M x 45)(Qty-3) are fitted in the base using 3M x 10 screws (Qty-3)." },
  { id: 35, section: "Base", subsection: "8. Mechanical Assembly", desc: "Check the network switch is securely mounted using 2M x 15 screws(Qty-2) and 2M nuts(Qty-4)." },
  // Base > 9. Power System
  { id: 36, section: "Base", subsection: "9. Power System", desc: "Check that the 12V screen power adapter on the SMPS is secured with 3 cable ties." },
  { id: 37, section: "Base", subsection: "9. Power System", desc: "Confirm 5V Pi adapter is fitted on the DIN rail using DIN rail mounting." },
  { id: 38, section: "Base", subsection: "9. Power System", desc: "Check 5V Pi adapter is correctly connected to the 2-pin socket using hot glue." },
  // Base > 10. Structural & Mounting
  { id: 39, section: "Base", subsection: "10. Structural & Mounting", desc: "Check 2.5M x 18 (Qty-2) standoffs are fitted at the bottom of 4DIO using 2.5M x 10." },
  { id: 40, section: "Base", subsection: "10. Structural & Mounting", desc: "Check mounting of Raspberry Pi to the bottom of 4DIO using 2.5M washers and 2.5M nuts(Qty-2), tightened properly." },
  { id: 41, section: "Base", subsection: "10. Structural & Mounting", desc: "Check 4 heat sinks are present on the Raspberry Pi." },
  { id: 42, section: "Base", subsection: "10. Structural & Mounting", desc: "Check proper mounting of 4DIO board on the standoff using 3M x 10 screws(Qty-3)." },
  // Base > 11. Connectivity
  { id: 43, section: "Base", subsection: "11. Connectivity", desc: "Check hot glue is applied on the network switch fitting nuts." },
  { id: 44, section: "Base", subsection: "11. Connectivity", desc: "Check power cables for 12V adapters are crimped and glued properly." },
  { id: 45, section: "Base", subsection: "11. Connectivity", desc: "Check the other side power cables of 12V adapters are crimped properly." },
  { id: 46, section: "Base", subsection: "11. Connectivity", desc: "Check power cables for 5V adapters are tied in 2-pin connector using screw and glued properly." },
  { id: 47, section: "Base", subsection: "11. Connectivity", desc: "Verify presence of 3-core power cable with a 3-pin plug; check the other side is crimped with lugs." },
  { id: 48, section: "Base", subsection: "11. Connectivity", desc: "Check the other side of the 3-core power cable has knot and connected properly in TB." },
  { id: 49, section: "Base", subsection: "11. Connectivity", desc: "Check TB to SMPS wires are properly crimped." },
  { id: 50, section: "Base", subsection: "11. Connectivity", desc: "Check TB to SMPS wires are securely tied on both SMPS and TB sides." },
  { id: 51, section: "Base", subsection: "11. Connectivity", desc: "Crimp and tighten the 12V and 5V adapter wires with screws on the SMPS." },
  { id: 52, section: "Base", subsection: "11. Connectivity", desc: "Check fan wires are connected to the SMPS output and tied with the SMPS terminal." },
  { id: 53, section: "Base", subsection: "11. Connectivity", desc: "Check screen input and 4DIO input wires are crimped and fitted to the SMPS terminal." },
  { id: 54, section: "Base", subsection: "11. Connectivity", desc: "Check 4DIO input wires to the buck converter are crimped and connected properly." },
  { id: 55, section: "Base", subsection: "11. Connectivity", desc: "Check backup power wires for Pi and network cables are connected to the buck converter output with proper crimping." },
  { id: 56, section: "Base", subsection: "11. Connectivity", desc: "Check tie mount is present between the fan and SMPS and properly ties the fan and power cable of 4DIO and screen using cable tie." },
  { id: 57, section: "Base", subsection: "11. Connectivity", desc: "Check all cable tie mount present at desired location (Qty-7)." },
  { id: 58, section: "Base", subsection: "11. Connectivity", desc: "Check backup power supply of the Pi is properly mounted with cable tie and tie mount." },
  { id: 59, section: "Base", subsection: "11. Connectivity", desc: "Check Ethernet cable is properly routed and connected to the Pi and network switch ends." },
  { id: 60, section: "Base", subsection: "11. Connectivity", desc: "Check network switch power supply is properly connected." },
  { id: 61, section: "Base", subsection: "11. Connectivity", desc: "Check Touch USB is properly connected to the Pi." },
  { id: 62, section: "Base", subsection: "11. Connectivity", desc: "Check Pi power supply is properly connected to the Pi from pi adapter and glue is applied." },
  { id: 63, section: "Base", subsection: "11. Connectivity", desc: "Check HDMI is properly connected to the Pi and glue is applied." },
  { id: 64, section: "Base", subsection: "11. Connectivity", desc: "Check RTC battery is present on 4DIO." },
  { id: 65, section: "Base", subsection: "11. Connectivity", desc: "Check power and Wi-Fi LED wires are properly crimped and set into the housing." },
  { id: 66, section: "Base", subsection: "11. Connectivity", desc: "Check power and Wi-Fi LED wires are properly connected to 4DIO and hot glue is applied." },
  { id: 67, section: "Base", subsection: "11. Connectivity", desc: "Check IO connector is present and labeled." },
  // Base > 12. Final Accessories
  { id: 68, section: "Base", subsection: "12. Final Accessories", desc: "Check Extra Fan Filter and Mounting Nut Bolt (Qty-5) and Washer(Qty-10) and Dampper(Qty-4) is present." }
];

let currentUser = null;
let currentFormId = null;
let currentFormType = 'standard'; // Default to standard

// Toast notification
function showToast(message, type = 'success') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast ${type}`;
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// Calculate progress
function updateProgress() {
  const total = document.querySelectorAll('input[type="radio"], input[type="checkbox"]').length;
  const filled = document.querySelectorAll('input[type="radio"]:checked').length;
  const textInputs = document.querySelectorAll('input[type="text"]:not([readonly]):not([disabled])');
  let textFilled = 0;
  textInputs.forEach(inp => { if (inp.value.trim()) textFilled++; });
  const pct = Math.min(100, Math.round(((filled + textFilled) / (total + textInputs.length)) * 100));
  const bar = document.getElementById('progressFill');
  const label = document.getElementById('progressPct');
  if (bar) bar.style.width = pct + '%';
  if (label) label.textContent = pct + '% complete';

  // Update per-section checklist counts
  updateSectionProgress();
}

function updateSectionProgress() {
  const sections = {};
  CHECKLIST_ITEMS.forEach(item => {
    const key = item.section;
    if (!sections[key]) sections[key] = { total: 0, done: 0 };
    sections[key].total++;
    const filled = document.querySelector(`input[name="cl_${item.id}"]:checked`);
    if (filled) sections[key].done++;
  });
  Object.entries(sections).forEach(([section, { total, done }]) => {
    const el = document.getElementById(`section-progress-${section.replace(' ', '-')}`);
    if (el) {
      el.textContent = `${done}/${total}`;
      el.style.background = done === total ? '#27ae60' : done > 0 ? '#ff9800' : '#444';
    }
  });
}

// Vajra ID duplicate warning helpers
function showVajraDupWarning(msg) {
  removeVajraDupWarning();
  const input = document.getElementById('vajra_id');
  if (!input) return;
  const warn = document.createElement('div');
  warn.id = 'vajraDupWarn';
  warn.style.cssText = 'background:#2a1800;border:1px solid #ff9800;color:#ff9800;border-radius:5px;padding:6px 10px;font-size:0.82rem;margin-top:4px;';
  warn.textContent = msg;
  input.parentNode.appendChild(warn);
}
function removeVajraDupWarning() {
  const el = document.getElementById('vajraDupWarn');
  if (el) el.remove();
}

// Collect form data
function collectFormData() {
  const data = {};
  // Basic fields
  ['vajra_id', 'vajra_base_id', 'allotted_to', 'machine_name', 'where_shipped', 'verified_by', 'form_date'].forEach(k => {
    const el = document.getElementById(k);
    if (el) data[k] = el.value;
  });
  // Testing & QA checkboxes
  ['tqa_func', 'tqa_power', 'tqa_led', 'tqa_ports', 'tqa_screen', 'tqa_network'].forEach(k => {
    const el = document.getElementById(k);
    if (el) data[k] = el.checked;
  });
  // Pass/fail radios for testing QA
  document.querySelectorAll('input[type="radio"]').forEach(r => {
    if (r.checked) data[r.name] = r.value;
  });
  // Visual inspection checkboxes
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    data[cb.name] = cb.checked;
  });
  // Text areas and comments
  document.querySelectorAll('textarea').forEach(ta => {
    if (ta.name) data[ta.name] = ta.value;
  });
  // All named inputs
  document.querySelectorAll('input[name]').forEach(inp => {
    if (inp.type !== 'radio') data[inp.name] = inp.type === 'checkbox' ? inp.checked : inp.value;
  });
  return data;
}

// Restore form data
function restoreFormData(data) {
  if (!data) return;
  Object.entries(data).forEach(([key, value]) => {
    // Radio buttons
    const radio = document.querySelector(`input[type="radio"][name="${key}"][value="${value}"]`);
    if (radio) { radio.checked = true; return; }
    // Checkboxes
    const cb = document.querySelector(`input[type="checkbox"][name="${key}"]`);
    if (cb) { cb.checked = value; return; }
    // Regular inputs
    const inp = document.getElementById(key) || document.querySelector(`input[name="${key}"], textarea[name="${key}"]`);
    if (inp && inp.type !== 'radio') inp.value = value;
  });
}

// Save form
async function saveForm(status) {
  const vajra_id = document.getElementById('vajra_id').value.trim();
  const vajra_base_id = document.getElementById('vajra_base_id').value.trim();
  const form_data = collectFormData();
  const payload = { id: currentFormId, vajra_id, vajra_base_id, vajra_type: currentFormType, status, form_data };

  try {
    const res = await fetch('/api/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Save failed');
    currentFormId = result.id;
    // Update URL param without reload
    const url = new URL(window.location.href);
    url.searchParams.set('id', currentFormId);
    window.history.replaceState({}, '', url);
    return true;
  } catch (err) {
    showToast(err.message, 'error');
    return false;
  }
}

// Build the checklist HTML
function buildChecklist() {
  const container = document.getElementById('checklistContainer');
  if (!container) return;

  let currentSection = '';
  let currentSubsection = '';
  let html = '';

  CHECKLIST_ITEMS.forEach(item => {
    if (item.section !== currentSection) {
      if (currentSection) html += '</tbody></table></div>';
      const sectionId = `section-progress-${item.section.replace(' ', '-')}`;
      html += `<div class="card-header ${item.section === 'Base' ? 'section-alt' : ''}" style="display:flex;justify-content:space-between;align-items:center;">
        <span>${item.section} Assembly</span>
        <span id="${sectionId}" style="background:#444;color:white;padding:2px 10px;border-radius:12px;font-size:0.75rem;font-weight:700;">0/${CHECKLIST_ITEMS.filter(i=>i.section===item.section).length}</span>
      </div>`;
      currentSection = item.section;
      currentSubsection = '';
    }
    if (item.subsection !== currentSubsection) {
      if (currentSubsection) html += '</tbody></table>';
      html += `<div class="section-subheader">${item.subsection}</div>
        <table class="checklist-table">
          <thead><tr>
            <th style="width:40px">#</th>
            <th>Item Description</th>
            <th style="width:160px">Status</th>
            <th style="width:180px">Comments</th>
          </tr></thead>
          <tbody>`;
      currentSubsection = item.subsection;
    }
    html += `<tr>
      <td class="item-num">${item.id}</td>
      <td class="item-desc">${item.desc}</td>
      <td>
        <div class="radio-group">
          <label class="radio-label yes-lbl">
            <input type="radio" name="cl_${item.id}" value="yes"> Yes
          </label>
          <label class="radio-label no-lbl">
            <input type="radio" name="cl_${item.id}" value="no"> No
          </label>
        </div>
      </td>
      <td><input type="text" name="cl_${item.id}_comment" class="comment-input" placeholder="Comment..."></td>
    </tr>`;
  });
  if (currentSection) html += '</tbody></table></div>';
  container.innerHTML = html;
}

// Initialize page
async function init() {
  try {
    const res = await fetch('/api/me');
    if (!res.ok) { window.location.href = '/'; return; }
    currentUser = await res.json();
    if (currentUser.role !== 'technician') { window.location.href = '/head-office.html'; return; }

    document.getElementById('userNameDisplay').textContent = currentUser.name;
    document.getElementById('verified_by').value = currentUser.name;
    document.getElementById('form_date').value = new Date().toISOString().split('T')[0];

    buildChecklist();

    // Check if editing existing form
    const params = new URLSearchParams(window.location.search);
    const formId = params.get('id');
    if (formId) {
      currentFormId = parseInt(formId);
      await loadForm(currentFormId);
      await loadAttachments(currentFormId);
    }

    // Vajra ID duplicate check on blur
    document.getElementById('vajra_id')?.addEventListener('blur', async (e) => {
      const val = e.target.value.trim();
      if (!val) { removeVajraDupWarning(); return; }
      try {
        const res = await fetch(`/api/admin/check-vajra-id?vajra_id=${encodeURIComponent(val)}&exclude_id=${currentFormId || ''}`);
        const data = await res.json();
        if (data.exists) {
          showVajraDupWarning(`⚠️ Vajra ID "${val}" already used in Form #${data.form.id} (${data.form.status})`);
        } else {
          removeVajraDupWarning();
        }
      } catch(e) {}
    });

    // Progress tracking
    document.getElementById('techForm').addEventListener('change', updateProgress);
    document.getElementById('techForm').addEventListener('input', updateProgress);
    updateProgress();

    // Auto-save every 2 minutes for drafts
    setInterval(async () => {
      if (!currentFormId) return;
      const submitBtn = document.getElementById('submitBtn');
      if (submitBtn && submitBtn.disabled && submitBtn.textContent !== 'Save Draft') return;
      const saved = await saveForm('draft');
      if (saved) showToast('Auto-saved ✓', 'info');
    }, 120000);

  } catch (err) {
    window.location.href = '/';
  }
}

async function loadForm(id) {
  try {
    const res = await fetch(`/api/forms/${id}`);
    if (!res.ok) return;
    const form = await res.json();
    
    // Set form type
    currentFormType = form.vajra_type || 'standard';
    updateFormTitle(currentFormType);
    
    if (form.form_data) restoreFormData(form.form_data);
    document.getElementById('vajra_id').value = form.vajra_id || '';
    document.getElementById('vajra_base_id').value = form.vajra_base_id || '';

    const submitBtn = document.getElementById('submitBtn');
    const saveDraftBtn = document.getElementById('saveDraftBtn');
    const editBtn = document.getElementById('editResubmitBtn');

    if (form.status === 'submitted' || form.status === 'resubmitted') {
      // Locked — awaiting head office review
      submitBtn.disabled = true;
      submitBtn.textContent = 'Awaiting Review';
      saveDraftBtn.style.display = 'none';
      if (editBtn) editBtn.style.display = 'none';
    } else if (form.status === 'approved') {
      // Approved — show Edit & Resubmit button, hide normal submit
      submitBtn.style.display = 'none';
      saveDraftBtn.style.display = 'none';
      if (editBtn) editBtn.style.display = 'inline-flex';
      // Show approved banner
      const banner = document.getElementById('statusBanner');
      if (banner) {
        banner.className = 'status-banner banner-approved';
        banner.innerHTML = '&#10003; This form is <strong>Approved</strong>. You can still edit and resubmit if changes were made to the Vajra unit.';
        banner.style.display = 'block';
      }
    } else if (form.status === 'rejected') {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Rejected';
      saveDraftBtn.style.display = 'none';
      if (editBtn) editBtn.style.display = 'none';
      const banner = document.getElementById('statusBanner');
      if (banner) {
        banner.className = 'status-banner banner-rejected';
        banner.innerHTML = '&#10007; This form was <strong>Rejected</strong>. Please contact Head Office.';
        banner.style.display = 'block';
      }
    }

    // Show head office comments if any
    if (form.head_office_comments) {
      const commentsEl = document.getElementById('hoComments');
      if (commentsEl) {
        commentsEl.textContent = form.head_office_comments;
        commentsEl.closest('.ho-comments-box').style.display = 'block';
      }
    }

    // Show PDF download button for any saved form
    showPDFButton();
  } catch(e) {}
}

document.addEventListener('DOMContentLoaded', init);

// ===== MY FORMS DASHBOARD =====
let _myForms = [];
let _myFormsFilter = { search: '', status: '' };

async function loadMyForms() {
  const container = document.getElementById('myFormsContainer');
  container.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading your forms...</p></div>';
  
  try {
    const res = await fetch('/api/forms');
    if (!res.ok) throw new Error('Failed to load forms');
    _myForms = await res.json();
    _myFormsFilter = { search: '', status: '' };
    renderMyFormsList();
  } catch (err) {
    container.innerHTML = `<div style="color:#e74c3c;padding:20px;">Error: ${err.message}</div>`;
  }
}

function renderMyFormsList() {
  const container = document.getElementById('myFormsContainer');

  // Build search/filter bar
  const statuses = ['All', 'Draft', 'Submitted', 'Approved', 'Rejected', 'Resubmitted'];
  const filterHtml = `
    <div class="search-filter-bar" style="margin-bottom:14px;">
      <input type="text" id="myFormsSearch" class="search-input" placeholder="🔍 Search Vajra ID..." value="${_myFormsFilter.search}" oninput="filterMyForms()" style="flex:1;min-width:160px;">
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        ${statuses.map(s => `<button class="filter-btn${_myFormsFilter.status === (s==='All'?'':s.toLowerCase()) ? ' active' : ''}" onclick="setMyFormsStatusFilter('${s==='All'?'':s.toLowerCase()}')">${s}</button>`).join('')}
      </div>
    </div>`;

  const filtered = _myForms.filter(f => {
    const search = _myFormsFilter.search.toLowerCase();
    const matchSearch = !search || (f.vajra_id||'').toLowerCase().includes(search) || String(f.id).includes(search);
    const matchStatus = !_myFormsFilter.status || f.status === _myFormsFilter.status;
    return matchSearch && matchStatus;
  });

  if (_myForms.length === 0) {
    container.innerHTML = filterHtml + '<div class="empty-state" style="color:#888;padding:40px;text-align:center;"><p>No forms yet. Click "New Form" to get started.</p></div>';
    return;
  }

  let formsHtml = '';
  if (filtered.length === 0) {
    formsHtml = '<div class="empty-state" style="color:#888;padding:30px;text-align:center;"><p>No forms match your filter.</p></div>';
  } else {
    filtered.forEach(f => {
      const badge = { draft: 'badge-draft', submitted: 'badge-submitted', approved: 'badge-approved', rejected: 'badge-rejected', resubmitted: 'badge-resubmitted' }[f.status] || 'badge-draft';
      formsHtml += `
        <div class="form-list-item ${f.status}" onclick="openForm(${f.id})">
          <div class="form-list-info">
            <h3 style="color:#e0e0e0;">Vajra ID: ${f.vajra_id || '(Draft)'}</h3>
            <div class="form-list-meta">Status: <strong>${f.status.toUpperCase()}</strong> &nbsp;•&nbsp; Updated: ${formatDate(f.updated_at)} &nbsp;•&nbsp; Form #${f.id}</div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="badge ${badge}">${f.status.toUpperCase()}</span>
            <button class="btn-pdf" onclick="event.stopPropagation();window.open('/api/pdf/${f.id}','_blank')" title="Download PDF">⬇ PDF</button>
          </div>
        </div>`;
    });
  }
  container.innerHTML = filterHtml + formsHtml;
}

function filterMyForms() {
  _myFormsFilter.search = document.getElementById('myFormsSearch')?.value || '';
  renderMyFormsList();
}

function setMyFormsStatusFilter(status) {
  _myFormsFilter.status = status;
  renderMyFormsList();
}

function formatDate(dt) {
  if (!dt) return '-';
  return new Date(dt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function openForm(id) {
  window.location.href = `/technician.html?id=${id}`;
}

function showDashboard() {
  document.getElementById('myFormsDashboard').style.display = 'block';
  document.getElementById('formEditor').style.display = 'none';
  loadMyForms();
}

function showFormEditor() {
  document.getElementById('myFormsDashboard').style.display = 'none';
  document.getElementById('formEditor').style.display = 'block';
}

document.getElementById('myFormsBtn')?.addEventListener('click', showDashboard);
// Removed old newFormBtnDash handler - now using modal version at end of file

// ===== FILE UPLOAD HANDLING =====

const TEST_LABELS = { burn: 'Burn Test', network: 'Network Test', noneth: 'Non-Ethernet Test' };

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function renderAttachmentChip(att, canDelete) {
  return `<div class="attach-chip" id="chip-${att.id}">
    <span class="attach-icon">&#128206;</span>
    <a href="/api/uploads/download/${att.id}" target="_blank" class="attach-name">${att.original_name}</a>
    <span class="attach-size">${formatBytes(att.size)}</span>
    ${canDelete ? `<button type="button" class="attach-delete" onclick="deleteAttachment(${att.id}, '${att.test_key}')" title="Remove">&#10005;</button>` : ''}
  </div>`;
}

async function loadAttachments(formId) {
  try {
    const res = await fetch(`/api/uploads/form/${formId}`);
    if (!res.ok) return;
    const attachments = await res.json();
    // Group by test_key
    ['burn', 'network', 'noneth'].forEach(key => {
      const container = document.getElementById(`attach-${key}`);
      if (!container) return;
      const files = attachments.filter(a => a.test_key === key);
      container.innerHTML = files.map(a => renderAttachmentChip(a, true)).join('');
    });
  } catch(e) {}
}

async function deleteAttachment(attachmentId, testKey) {
  if (!confirm('Remove this file?')) return;
  try {
    const res = await fetch(`/api/uploads/${attachmentId}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    const chip = document.getElementById(`chip-${attachmentId}`);
    if (chip) chip.remove();
    showToast('File removed.', 'success');
  } catch(err) {
    showToast(err.message, 'error');
  }
}

async function uploadFile(file, testKey) {
  if (!currentFormId) {
    // Must save as draft first to get a form ID
    showToast('Saving draft first to attach file...', 'success');
    const saved = await saveForm('draft');
    if (!saved || !currentFormId) {
      showToast('Could not save form. Please try again.', 'error');
      return;
    }
  }

  const formData = new FormData();
  formData.append('file', file);

  const uploadBtn = document.querySelector(`[data-testkey="${testKey}"]`);
  if (uploadBtn) { uploadBtn.disabled = true; }

  try {
    const res = await fetch(`/api/uploads/${currentFormId}/${testKey}`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    const container = document.getElementById(`attach-${testKey}`);
    if (container) {
      container.insertAdjacentHTML('beforeend', renderAttachmentChip(data.attachment, true));
    }
    showToast(`File attached to ${TEST_LABELS[testKey]}!`, 'success');
  } catch(err) {
    showToast('Upload failed: ' + err.message, 'error');
  } finally {
    if (uploadBtn) { uploadBtn.disabled = false; uploadBtn.value = ''; }
  }
}

// Wire up file inputs
document.querySelectorAll('.test-file-input').forEach(input => {
  input.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const testKey = e.target.dataset.testkey;
    await uploadFile(file, testKey);
    e.target.value = ''; // reset so same file can be re-selected
  });
});

document.getElementById('logoutBtn')?.addEventListener('click', async () => {
  await fetch('/api/logout', { method: 'POST' });
  window.location.href = '/';
});

document.getElementById('saveDraftBtn')?.addEventListener('click', async () => {
  const btn = document.getElementById('saveDraftBtn');
  btn.disabled = true;
  btn.textContent = 'Saving...';
  const ok = await saveForm('draft');
  if (ok) {
    showToast('Draft saved successfully!', 'success');
    showPDFButton();
  }
  btn.disabled = false;
  btn.textContent = 'Save Draft';
});

// ===== VALIDATION MODAL (Task 5) =====
function validateBeforeSubmit() {
  const errors = [];

  // Check all 6 TQA rows: checkbox checked AND pass/fail selected
  const tqaRows = [
    { id: 'tqa_supply', name: 'Supply & Connectivity Testing', resultName: 'tqa_supply_result' },
    { id: 'tqa_io', name: 'IO Test, Voltage Test', resultName: 'tqa_io_result' },
    { id: 'tqa_rtc', name: 'RTC Address Detection', resultName: 'tqa_rtc_result' },
    { id: 'tqa_log', name: 'Log Verification', resultName: 'tqa_log_result' },
    { id: 'tqa_touch', name: 'Screen Touch Testing', resultName: 'tqa_touch_result' },
    { id: 'tqa_led', name: 'Power and Network LED Testing', resultName: 'tqa_led_result' },
  ];
  tqaRows.forEach(row => {
    const checked = document.getElementById(row.id)?.checked;
    const result = document.querySelector(`input[name="${row.resultName}"]:checked`);
    if (!checked && !result) {
      errors.push({ type: 'tqa', msg: `TQA #${tqaRows.indexOf(row)+1} "${row.name}" — not done, no Pass/Fail selected` });
    } else if (!checked) {
      errors.push({ type: 'tqa', msg: `TQA #${tqaRows.indexOf(row)+1} "${row.name}" — checkbox not checked` });
    } else if (!result) {
      errors.push({ type: 'tqa', msg: `TQA #${tqaRows.indexOf(row)+1} "${row.name}" — Pass/Fail not selected` });
    }
  });

  // Check all 68 checklist items
  const unfilledItems = [];
  CHECKLIST_ITEMS.forEach(item => {
    if (!document.querySelector(`input[name="cl_${item.id}"]:checked`)) {
      unfilledItems.push(item);
    }
  });
  if (unfilledItems.length > 0) {
    // Group by section for readability
    const topLead = unfilledItems.filter(i => i.section === 'Top Lead');
    const base = unfilledItems.filter(i => i.section === 'Base');
    if (topLead.length > 0) errors.push({ type: 'checklist', msg: `Top Lead: Items ${topLead.map(i=>i.id).join(', ')} — Yes/No not selected (${topLead.length} items)` });
    if (base.length > 0) errors.push({ type: 'checklist', msg: `Base: Items ${base.map(i=>i.id).join(', ')} — Yes/No not selected (${base.length} items)` });
  }

  return errors;
}

function showValidationModal(errors, onForceSubmit) {
  // Remove existing modal if any
  const existing = document.getElementById('validationModalOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'validationModalOverlay';
  overlay.className = 'validation-modal-overlay';
  overlay.innerHTML = `
    <div class="validation-modal" role="dialog" aria-modal="true" aria-labelledby="valModalTitle">
      <div class="validation-modal-header">
        <span style="font-size:1.3rem;">⚠️</span>
        <h3 id="valModalTitle">Incomplete Form — ${errors.length} Issue(s) Found</h3>
      </div>
      <div class="validation-modal-body">
        <p>The following items are incomplete. Please review before submitting:</p>
        <ul class="validation-error-list">
          ${errors.map(e => `<li>${e.msg}</li>`).join('')}
        </ul>
        <p style="color:#888;font-size:0.8rem;">You can fix these issues or override and submit anyway.</p>
      </div>
      <div class="validation-modal-footer">
        <button class="btn btn-back" id="valModalClose">Go Back & Fix</button>
        <button class="btn btn-reject" id="valModalForce">Submit Anyway</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  document.getElementById('valModalClose').onclick = () => overlay.remove();
  document.getElementById('valModalForce').onclick = () => { overlay.remove(); onForceSubmit(); };
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

document.getElementById('submitBtn')?.addEventListener('click', async () => {
  const vajraId = document.getElementById('vajra_id').value.trim();
  if (!vajraId) {
    showToast('Please enter the Vajra ID before submitting.', 'error');
    return;
  }

  // Duplicate Vajra ID check
  const dupRes = await fetch(`/api/admin/check-vajra-id?vajra_id=${encodeURIComponent(vajraId)}&exclude_id=${currentFormId || ''}`);
  const dupData = await dupRes.json();
  if (dupData.exists) {
    if (!confirm(`⚠️ Vajra ID "${vajraId}" already exists (Form #${dupData.form.id}, status: ${dupData.form.status}). Submit anyway?`)) return;
  }

  // Validate form
  const errors = validateBeforeSubmit();
  if (errors.length > 0) {
    showValidationModal(errors, doSubmit);
    return;
  }

  if (!confirm('Submit this form for Head Office approval?')) return;
  await doSubmit();
});

async function doSubmit() {
  const btn = document.getElementById('submitBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Submitting...'; }
  const ok = await saveForm('submitted');
  if (ok) {
    showToast('Form submitted for approval! Head Office has been notified.', 'success');
    if (btn) btn.textContent = 'Submitted';
    // Show download PDF button
    showPDFButton();
  } else {
    if (btn) { btn.disabled = false; btn.textContent = 'Submit for Approval'; }
  }
}

function showPDFButton() {
  if (!currentFormId) return;
  const actions = document.querySelector('.form-actions');
  if (actions && !document.getElementById('pdfDownloadBtn')) {
    const pdfBtn = document.createElement('button');
    pdfBtn.type = 'button';
    pdfBtn.id = 'pdfDownloadBtn';
    pdfBtn.className = 'btn-download-pdf';
    pdfBtn.innerHTML = '⬇ Download PDF';
    pdfBtn.onclick = () => window.open(`/api/pdf/${currentFormId}`, '_blank');
    actions.insertBefore(pdfBtn, actions.firstChild);
  }
}

// Removed old newFormBtn handler - now using modal version at end of file

document.getElementById('editResubmitBtn')?.addEventListener('click', async () => {
  if (!document.getElementById('vajra_id').value.trim()) {
    showToast('Please ensure Vajra ID is filled in.', 'error');
    return;
  }
  if (!confirm('Resubmit this form with your changes for Head Office review?')) return;
  const btn = document.getElementById('editResubmitBtn');
  btn.disabled = true;
  btn.textContent = 'Resubmitting...';
  const ok = await saveForm('resubmitted');
  if (ok) {
    showToast('Form resubmitted! Head Office has been notified of the changes.', 'success');
    btn.textContent = 'Resubmitted';
    // Hide the edit button, show status
    const banner = document.getElementById('statusBanner');
    if (banner) {
      banner.className = 'status-banner banner-submitted';
      banner.innerHTML = '&#8635; Form <strong>Resubmitted</strong> — awaiting Head Office review.';
      banner.style.display = 'block';
    }
  } else {
    btn.disabled = false;
    btn.textContent = 'Edit & Resubmit';
  }
});


// ===== FORM TYPE SELECTION =====
function showFormTypeModal() {
  document.getElementById('formTypeModal').style.display = 'flex';
}

function closeFormTypeModal() {
  document.getElementById('formTypeModal').style.display = 'none';
}

function selectVajraType(type) {
  currentFormType = type;
  closeFormTypeModal();
  
  // Clear form and start fresh
  currentFormId = null;
  document.getElementById('techForm').reset();
  document.getElementById('formEditor').style.display = 'block';
  document.getElementById('myFormsDashboard').style.display = 'none';
  document.getElementById('statusBanner').style.display = 'none';
  
  // Show message based on type
  const typeName = type === 'standard' ? 'Standard Vajra' : 'Higher Version Vajra';
  showToast(`📋 Creating new ${typeName} form`, 'success');
  
  // Update form title to show type
  updateFormTitle(type);
}

function updateFormTitle(type) {
  const typeBadge = type === 'higher' 
    ? '<span style="background:#9b59b6;color:white;padding:4px 12px;border-radius:20px;font-size:0.75rem;font-weight:700;margin-left:10px;">⚡ HIGHER VERSION</span>'
    : '<span style="background:#3498db;color:white;padding:4px 12px;border-radius:20px;font-size:0.75rem;font-weight:700;margin-left:10px;">📦 STANDARD</span>';
  
  const titleElement = document.querySelector('.logo');
  if (titleElement) {
    titleElement.innerHTML = `<span>VAJRA</span> Testing Job Card ${typeBadge}`;
  }
}

// Update New Form button handlers to show modal
document.getElementById('newFormBtn')?.addEventListener('click', (e) => {
  e.preventDefault();
  if (currentFormId || confirm('Start a new form? Unsaved changes will be lost.')) {
    showFormTypeModal();
  }
});

document.getElementById('newFormBtnDash')?.addEventListener('click', (e) => {
  e.preventDefault();
  showFormTypeModal();
});
