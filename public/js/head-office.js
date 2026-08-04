// ===== HEAD OFFICE JS =====
let currentUser = null;
let allForms = [];

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

function getBadgeClass(status) {
  const map = { submitted: 'badge-submitted', approved: 'badge-approved', rejected: 'badge-rejected', draft: 'badge-draft', resubmitted: 'badge-resubmitted' };
  return map[status] || 'badge-draft';
}

function formatDate(dt) {
  if (!dt) return '-';
  return new Date(dt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatTestDates(start, end) {
  if (!start && !end) return '';
  const fmt = (dt) => dt ? new Date(dt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';
  let duration = '';
  if (start && end) {
    const ms = new Date(end) - new Date(start);
    if (ms > 0) {
      const totalMins = Math.floor(ms / 60000);
      const hrs = Math.floor(totalMins / 60);
      const mins = totalMins % 60;
      duration = hrs > 0 ? ` &nbsp;&#8680;&nbsp; <strong>${hrs}h ${mins}m</strong>` : ` &nbsp;&#8680;&nbsp; <strong>${mins}m</strong>`;
    }
  }
  return `<div class="test-dates-readonly">
    <span class="date-tag">&#9654; Start: <strong>${fmt(start)}</strong></span>
    <span class="date-tag">&#9632; End: <strong>${fmt(end)}</strong></span>
    ${duration ? `<span class="date-tag duration-tag">&#128337; Duration:${duration}</span>` : ''}
  </div>`;
}

async function loadFormsList() {
  const container = document.getElementById('mainContent');
  container.innerHTML = `<div class="loading"><div class="spinner"></div><p>Loading forms...</p></div>`;

  try {
    // Load stats and forms in parallel
    const [statsRes, formsRes] = await Promise.all([
      fetch('/api/admin/stats'),
      fetch('/api/forms')
    ]);
    const stats = statsRes.ok ? await statsRes.json() : {};
    const forms = formsRes.ok ? await formsRes.json() : [];
    allForms = forms;
    renderDashboard(stats, forms);
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p>Error loading: ${err.message}</p></div>`;
  }
}

function renderDashboard(stats, forms) {
  const container = document.getElementById('mainContent');

  // Stats cards
  let html = `
    <div class="stats-grid">
      <div class="stat-card stat-pending">
        <div class="stat-num">${stats.pending || 0}</div>
        <div class="stat-label">⏳ Pending Review</div>
      </div>
      <div class="stat-card stat-approved">
        <div class="stat-num">${stats.approved || 0}</div>
        <div class="stat-label">✓ Total Approved</div>
      </div>
      <div class="stat-card stat-month">
        <div class="stat-num">${stats.thisMonth || 0}</div>
        <div class="stat-label">📅 Approved This Month</div>
      </div>
      <div class="stat-card stat-rejected">
        <div class="stat-num">${stats.rejected || 0}</div>
        <div class="stat-label">✗ Rejected</div>
      </div>
      <div class="stat-card stat-total">
        <div class="stat-num">${stats.total || 0}</div>
        <div class="stat-label">📋 Total Submitted</div>
      </div>
      <div class="stat-card stat-draft">
        <div class="stat-num">${stats.drafts || 0}</div>
        <div class="stat-label">📝 Drafts</div>
      </div>
    </div>

    <div class="filter-bar">
      <input type="text" id="searchInput" placeholder="🔍 Search Vajra ID, technician..." class="search-input" oninput="filterForms()">
      <select id="statusFilter" class="filter-select" onchange="filterForms()">
        <option value="">All Statuses</option>
        <option value="submitted">Submitted</option>
        <option value="resubmitted">Resubmitted</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
      <input type="date" id="dateFrom" class="filter-date" onchange="filterForms()" title="From date">
      <input type="date" id="dateTo" class="filter-date" onchange="filterForms()" title="To date">
      <button class="btn btn-back" onclick="clearFilters()" style="padding:6px 14px;font-size:0.82rem;">✕ Clear</button>
    </div>
    <div class="forms-list-header">
      <h2 style="color:#e0e0e0;">All Forms</h2>
      <span class="forms-count" id="formsCount">${forms.length} form(s)</span>
    </div>
    <div id="formsList"></div>`;

  container.innerHTML = html;
  renderFormsList(forms);
}

function filterForms() {
  const search = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const status = document.getElementById('statusFilter')?.value || '';
  const dateFrom = document.getElementById('dateFrom')?.value;
  const dateTo = document.getElementById('dateTo')?.value;

  const filtered = allForms.filter(f => {
    const matchSearch = !search || (f.vajra_id||'').toLowerCase().includes(search) || (f.technician_name||'').toLowerCase().includes(search) || String(f.id).includes(search);
    const matchStatus = !status || f.status === status;
    const formDate = new Date(f.updated_at);
    const matchFrom = !dateFrom || formDate >= new Date(dateFrom);
    const matchTo = !dateTo || formDate <= new Date(dateTo + 'T23:59:59');
    return matchSearch && matchStatus && matchFrom && matchTo;
  });

  document.getElementById('formsCount').textContent = `${filtered.length} form(s)`;
  renderFormsList(filtered);
}

function clearFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('statusFilter').value = '';
  document.getElementById('dateFrom').value = '';
  document.getElementById('dateTo').value = '';
  filterForms();
}

function renderFormsList(forms) {
  const container = document.getElementById('formsList');
  if (!container) return;
  if (forms.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>No forms match your filters.</p></div>`;
    return;
  }
  let html = '';
  forms.forEach(f => {
    const typeBadge = f.vajra_type === 'higher' 
      ? '<span class="badge" style="background:#9b59b6;color:white;">⚡ HIGHER</span>' 
      : '<span class="badge" style="background:#3498db;color:white;">📦 STANDARD</span>';
    html += `
      <div class="form-list-item ${f.status}" onclick="viewForm(${f.id})">
        <div class="form-list-info">
          <h3>Vajra ID: ${f.vajra_id || '(No ID)'} &nbsp;•&nbsp; ${f.vajra_base_id || ''} &nbsp; ${typeBadge}</h3>
          <div class="form-list-meta">
            Technician: <strong>${f.technician_name || '-'}</strong> &nbsp;•&nbsp;
            Updated: ${formatDate(f.updated_at)} &nbsp;•&nbsp; Form #${f.id}
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          <span class="badge ${getBadgeClass(f.status)}">${f.status}</span>
          <button onclick="event.stopPropagation();downloadPDF(${f.id},'${f.vajra_id||'form'}')" class="btn-pdf" title="Download PDF">⬇ PDF</button>
        </div>
      </div>`;
  });
  container.innerHTML = html;
}

function renderValue(val) {
  if (val === true || val === 'true') return '<span class="readonly-badge readonly-yes">YES</span>';
  if (val === false || val === 'false') return '<span class="readonly-badge readonly-no">NO</span>';
  if (val === 'pass') return '<span class="readonly-badge readonly-pass">PASS</span>';
  if (val === 'fail') return '<span class="readonly-badge readonly-fail">FAIL</span>';
  if (val === 'yes') return '<span class="readonly-badge readonly-yes">YES</span>';
  if (val === 'no') return '<span class="readonly-badge readonly-no">NO</span>';
  return val || '-';
}

function buildChecklistReadonly(data) {
  const ITEMS = [
    [1,"Top Lead","1. Visual and Structural Checks","Check the top lead area for any visible cracks or damage."],
    [2,"Top Lead","1. Visual and Structural Checks","Ensure the bezel is properly adhered to the top lead."],
    [3,"Top Lead","2. Sticker and Label Placement","Verify that the Power and Wi-Fi LED stickers are properly pasted in their designated positions."],
    [4,"Top Lead","2. Sticker and Label Placement","Ensure the brand sticker is properly placed at the top-right corner of the top lead."],
    [5,"Top Lead","3. LED Component Placement","Confirm the Wi-Fi LED is present at the bottom-right corner."],
    [6,"Top Lead","3. LED Component Placement","Confirm the Power LED is positioned to the left of the Wi-Fi LED."],
    [7,"Top Lead","3. LED Component Placement","Ensure both Power and Wi-Fi LEDs are securely fixed using black silicone."],
    [8,"Top Lead","4. Screen Support & Adhesion","Check that the screen support is properly and securely adhered."],
    [9,"Top Lead","4. Screen Support & Adhesion","Verify that black silicone is applied on the left and right sides of the screen support plate."],
    [10,"Top Lead","4. Screen Support & Adhesion","Check that white silicone is properly applied in the gap between the screen and the top lead."],
    [11,"Top Lead","5. Fasteners and Hardware","Confirm that four (3M x 10) screws are present on the screen support plate."],
    [12,"Top Lead","5. Fasteners and Hardware","Verify the use of four 3M plain washers and four 3M spring washers."],
    [13,"Top Lead","5. Fasteners and Hardware","Ensure all 3M nylon 4 nuts are tightly secured."],
    [14,"Top Lead","6. Cable Management","Ensure all tie mounts are properly pasted at their designated positions. (Top-8)"],
    [15,"Top Lead","6. Cable Management","Check the routing of the HDMI cable on the top lead and secure it with a cable tie."],
    [16,"Top Lead","6. Cable Management","Check the routing of the touch cable on the top lead and secure it with a cable tie."],
    [17,"Top Lead","6. Cable Management","Check the routing of the Wi-Fi and Power LED cables on the top lead and secure them with a cable tie."],
    [18,"Top Lead","6. Cable Management","Check the routing of the screen power cable and secure it with a cable tie."],
    [19,"Top Lead","6. Cable Management","Check the routing of the backup screen power cable and secure it with a cable tie."],
    [20,"Top Lead","6. Cable Management","Ensure all cables from the top lead to the base are neatly bundled and secured with cable ties."],
    [21,"Top Lead","7. Electrical Connections","Verify that the Touch USB is properly connected to the screen."],
    [22,"Top Lead","7. Electrical Connections","Verify that the HDMI cable is properly connected to the screen."],
    [23,"Top Lead","7. Electrical Connections","Confirm that the screen power supply is properly connected."],
    [24,"Base","8. Mechanical Assembly","Check the Base area for any visible cracks or damage."],
    [25,"Base","8. Mechanical Assembly","Check for Vajra ID sticker placement (both inside and outside)."],
    [26,"Base","8. Mechanical Assembly","Check that the close grommet is fitted properly. (Qty-4)"],
    [27,"Base","8. Mechanical Assembly","Check the Fan Direction (air flow is outside of the vajra)"],
    [28,"Base","8. Mechanical Assembly","Check the fan inlet is fitted with 4M x 15 screws(Qty-4) and nylon nuts(Qty-4) properly."],
    [29,"Base","8. Mechanical Assembly","Check fan and fan casing are fitted properly using 4M x 50 screws(Qty-2), 4M washers(Qty-6), and nylon nuts(Qty-2)."],
    [30,"Base","8. Mechanical Assembly","Check fan filters are present at inlet and outlet cases. (small-1, Big-1)"],
    [31,"Base","8. Mechanical Assembly","Check the TB DIN rail is properly fitted with 3M x 10 screws, 3M washers, and 3M nylon nuts."],
    [32,"Base","8. Mechanical Assembly","Check TB set is properly mounted along with closing plate and 1 extra fuse. (Grey, Black, Green)"],
    [33,"Base","8. Mechanical Assembly","Ensure the SMPS is fitted correctly using 3M x 10 screws(Qty-2), 3M washer, and nylon nuts(Qty-2)."],
    [34,"Base","8. Mechanical Assembly","Check 4DIO standoffs (3M x 45)(Qty-3) are fitted in the base using 3M x 10 screws (Qty-3)."],
    [35,"Base","8. Mechanical Assembly","Check the network switch is securely mounted using 2M x 15 screws(Qty-2) and 2M nuts(Qty-4)."],
    [36,"Base","9. Power System","Check that the 12V screen power adapter on the SMPS is secured with 3 cable ties."],
    [37,"Base","9. Power System","Confirm 5V Pi adapter is fitted on the DIN rail using DIN rail mounting."],
    [38,"Base","9. Power System","Check 5V Pi adapter is correctly connected to the 2-pin socket using hot glue."],
    [39,"Base","10. Structural & Mounting","Check 2.5M x 18 (Qty-2) standoffs are fitted at the bottom of 4DIO using 2.5M x 10."],
    [40,"Base","10. Structural & Mounting","Check mounting of Raspberry Pi to the bottom of 4DIO using 2.5M washers and 2.5M nuts(Qty-2), tightened properly."],
    [41,"Base","10. Structural & Mounting","Check 4 heat sinks are present on the Raspberry Pi."],
    [42,"Base","10. Structural & Mounting","Check proper mounting of 4DIO board on the standoff using 3M x 10 screws(Qty-3)."],
    [43,"Base","11. Connectivity","Check hot glue is applied on the network switch fitting nuts."],
    [44,"Base","11. Connectivity","Check power cables for 12V adapters are crimped and glued properly."],
    [45,"Base","11. Connectivity","Check the other side power cables of 12V adapters are crimped properly."],
    [46,"Base","11. Connectivity","Check power cables for 5V adapters are tied in 2-pin connector using screw and glued properly."],
    [47,"Base","11. Connectivity","Verify presence of 3-core power cable with a 3-pin plug; check the other side is crimped with lugs."],
    [48,"Base","11. Connectivity","Check the other side of the 3-core power cable has knot and connected properly in TB."],
    [49,"Base","11. Connectivity","Check TB to SMPS wires are properly crimped."],
    [50,"Base","11. Connectivity","Check TB to SMPS wires are securely tied on both SMPS and TB sides."],
    [51,"Base","11. Connectivity","Crimp and tighten the 12V and 5V adapter wires with screws on the SMPS."],
    [52,"Base","11. Connectivity","Check fan wires are connected to the SMPS output and tied with the SMPS terminal."],
    [53,"Base","11. Connectivity","Check screen input and 4DIO input wires are crimped and fitted to the SMPS terminal."],
    [54,"Base","11. Connectivity","Check 4DIO input wires to the buck converter are crimped and connected properly."],
    [55,"Base","11. Connectivity","Check backup power wires for Pi and network cables are connected to the buck converter output with proper crimping."],
    [56,"Base","11. Connectivity","Check tie mount is present between the fan and SMPS and properly ties the fan and power cable of 4DIO and screen using cable tie."],
    [57,"Base","11. Connectivity","Check all cable tie mount present at desired location (Qty-7)."],
    [58,"Base","11. Connectivity","Check backup power supply of the Pi is properly mounted with cable tie and tie mount."],
    [59,"Base","11. Connectivity","Check Ethernet cable is properly routed and connected to the Pi and network switch ends."],
    [60,"Base","11. Connectivity","Check network switch power supply is properly connected."],
    [61,"Base","11. Connectivity","Check Touch USB is properly connected to the Pi."],
    [62,"Base","11. Connectivity","Check Pi power supply is properly connected to the Pi from pi adapter and glue is applied."],
    [63,"Base","11. Connectivity","Check HDMI is properly connected to the Pi and glue is applied."],
    [64,"Base","11. Connectivity","Check RTC battery is present on 4DIO."],
    [65,"Base","11. Connectivity","Check power and Wi-Fi LED wires are properly crimped and set into the housing."],
    [66,"Base","11. Connectivity","Check power and Wi-Fi LED wires are properly connected to 4DIO and hot glue is applied."],
    [67,"Base","11. Connectivity","Check IO connector is present and labeled."],
    [68,"Base","12. Final Accessories","Check Extra Fan Filter and Mounting Nut Bolt (Qty-5) and Washer(Qty-10) and Dampper(Qty-4) is present."]
  ];

  let currentSection = '', currentSubsection = '', html = '';
  ITEMS.forEach(([id, section, subsection, desc]) => {
    if (section !== currentSection) {
      if (currentSection) html += '</tbody></table></div>';
      html += `<div class="card-header ${section === 'Base' ? 'section-alt' : ''}">${section} Assembly</div>`;
      currentSection = section; currentSubsection = '';
    }
    if (subsection !== currentSubsection) {
      if (currentSubsection) html += '</tbody></table>';
      html += `<div class="section-subheader">${subsection}</div>
        <table class="checklist-table"><thead><tr>
          <th style="width:40px">#</th><th>Item</th><th style="width:100px">Status</th><th>Comments</th>
        </tr></thead><tbody>`;
      currentSubsection = subsection;
    }
    const val = data[`cl_${id}`];
    const comment = data[`cl_${id}_comment`] || '';
    html += `<tr>
      <td class="item-num">${id}</td>
      <td class="item-desc">${desc}</td>
      <td>${renderValue(val)}</td>
      <td style="font-size:0.82rem;color:#555">${comment}</td>
    </tr>`;
  });
  if (currentSection) html += '</tbody></table></div>';
  return html;
}

async function viewForm(id) {
  const container = document.getElementById('mainContent');
  container.innerHTML = `<div class="loading"><div class="spinner"></div><p>Loading form...</p></div>`;

  try {
    const res = await fetch(`/api/forms/${id}`);
    if (!res.ok) throw new Error('Form not found');
    const form = await res.json();
    const d = form.form_data || {};

    const isReviewable = form.status === 'submitted' || form.status === 'resubmitted';

    // Load attachments for this form
    let attachments = [];
    try {
      const attRes = await fetch(`/api/uploads/form/${id}`);
      if (attRes.ok) attachments = await attRes.json();
    } catch(e) {}

    function getAttachmentsForKey(key) {
      const files = attachments.filter(a => a.test_key === key);
      if (files.length === 0) return '<span style="color:#aaa;font-size:0.82rem">No file attached</span>';
      return files.map(a => `
        <a href="/api/uploads/download/${a.id}" target="_blank"
           style="display:inline-flex;align-items:center;gap:6px;padding:4px 12px;background:#f0f4f8;border:1px solid #c0d0e0;border-radius:6px;text-decoration:none;color:#1a3a5c;font-size:0.82rem;font-weight:600;">
          &#128206; ${a.original_name} <span style="color:#888;font-weight:400">(${(a.size/1024).toFixed(1)} KB)</span>
        </a>`).join(' ');
    }
    const statusBadge = `<span class="badge ${getBadgeClass(form.status)}">${form.status.toUpperCase()}</span>`;

    let html = `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;flex-wrap:wrap;">
        <button class="btn btn-back" onclick="loadFormsList()">&#8592; Back to List</button>
        <h2 style="color:#1a3a5c;margin:0;">Form #${form.id} &mdash; Vajra ID: ${form.vajra_id || 'N/A'}</h2>
        ${statusBadge}
      </div>

      <div class="form-card">
        <div class="card-header">Page 1 &mdash; Vajra Testing Job Card</div>
        <div class="card-body">
          <div class="field-row">
            <div class="field-group"><label>Vajra ID</label><div class="readonly-field">${form.vajra_id || '-'}</div></div>
            <div class="field-group"><label>Vajra Base ID</label><div class="readonly-field">${form.vajra_base_id || '-'}</div></div>
          </div>
          <div class="field-row triple">
            <div class="field-group"><label>Allotted To</label><div class="readonly-field">${d.allotted_to || '-'}</div></div>
            <div class="field-group"><label>Machine Name</label><div class="readonly-field">${d.machine_name || '-'}</div></div>
            <div class="field-group"><label>Where To Shipped</label><div class="readonly-field">${d.where_shipped || '-'}</div></div>
          </div>
          <div class="field-row">
            <div class="field-group"><label>Verified By</label><div class="readonly-field">${d.verified_by || form.technician_name || '-'}</div></div>
            <div class="field-group"><label>Date</label><div class="readonly-field">${d.form_date || '-'}</div></div>
          </div>
        </div>
      </div>

      <div class="form-card">
        <div class="card-header section-alt">Testing and QA</div>
        <div class="card-body">
          <table class="checklist-table">
            <thead><tr><th style="width:30px">#</th><th>Test Item</th><th style="width:70px">Done</th><th style="width:90px">Result</th><th>Values / Comments</th></tr></thead>
            <tbody>
              <tr>
                <td class="item-num">1</td>
                <td>Supply &amp; Connectivity Testing</td>
                <td>${renderValue(d.tqa_supply)}</td>
                <td>${renderValue(d.tqa_supply_result)}</td>
                <td style="font-size:0.82rem">
                  VAC: <strong>${d.tqa_supply_vac||'-'}</strong> &nbsp;
                  24.1V: <strong>${d.tqa_supply_24v||'-'}</strong> &nbsp;
                  5V: <strong>${d.tqa_supply_5v||'-'}</strong>
                </td>
              </tr>
              <tr>
                <td class="item-num">2</td>
                <td>IO Test, Voltage Test (With and Without Load)</td>
                <td>${renderValue(d.tqa_io)}</td>
                <td>${renderValue(d.tqa_io_result)}</td>
                <td style="font-size:0.82rem">
                  With Load: <strong>${d.tqa_io_with_load||'-'}</strong> &nbsp;
                  Without Load: <strong>${d.tqa_io_without_load||'-'}</strong>
                  ${d.tqa_io_comment ? `<br>${d.tqa_io_comment}` : ''}
                </td>
              </tr>
              <tr>
                <td class="item-num">3</td>
                <td>RTC Address Detection and RTC Battery (3V)</td>
                <td>${renderValue(d.tqa_rtc)}</td>
                <td>${renderValue(d.tqa_rtc_result)}</td>
                <td style="font-size:0.82rem">
                  Battery: <strong>${d.tqa_rtc_voltage||'-'}</strong> &nbsp;
                  Address: <strong>${d.tqa_rtc_address||'-'}</strong>
                </td>
              </tr>
              <tr>
                <td class="item-num">4</td>
                <td>Log Verification (Temp &amp; Swap etc.)</td>
                <td>${renderValue(d.tqa_log)}</td>
                <td>${renderValue(d.tqa_log_result)}</td>
                <td style="font-size:0.82rem">
                  CPU Temp: <strong>${d.tqa_log_temp ? d.tqa_log_temp+'°C' : '-'}</strong> &nbsp;
                  Swap: <strong>${d.tqa_log_swap ? d.tqa_log_swap+' MB' : '-'}</strong>
                  ${d.tqa_log_comment ? `<br>${d.tqa_log_comment}` : ''}
                </td>
              </tr>
              <tr>
                <td class="item-num">5</td>
                <td>Screen Touch Testing</td>
                <td>${renderValue(d.tqa_touch)}</td>
                <td>${renderValue(d.tqa_touch_result)}</td>
                <td style="font-size:0.82rem">${d.tqa_touch_comment||'-'}</td>
              </tr>
              <tr>
                <td class="item-num">6</td>
                <td>Power and Network LED Testing</td>
                <td>${renderValue(d.tqa_led)}</td>
                <td>${renderValue(d.tqa_led_result)}</td>
                <td style="font-size:0.82rem">${d.tqa_led_comment||'-'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="form-card">
        <div class="card-header section-green">Visual Inspection &mdash; Components</div>
        <div class="card-body">
          <table class="checklist-table">
            <thead><tr><th style="width:50px">Done</th><th>Component</th><th style="width:120px">Part Code</th><th>Serial / ID</th></tr></thead>
            <tbody>
              <tr><td>${renderValue(d.vi_smps)}</td><td>SMPS</td><td><span class="part-code">IPFGA007</span></td><td>${d.vi_smps_id||'-'}</td></tr>
              <tr><td>${renderValue(d.vi_fan)}</td><td>Fan</td><td><span class="part-code">IFPGA004</span></td><td>${d.vi_fan_id||'-'}</td></tr>
              <tr><td>${renderValue(d.vi_4dio)}</td><td>4DIO Board</td><td><span class="part-code">IPFGA019</span></td><td>${d.vi_4dio_id||'-'}</td></tr>
              <tr><td>${renderValue(d.vi_network_switch)}</td><td>Network Switch</td><td><span class="part-code">IFPGA006</span></td><td>${d.vi_ns_id||'-'}</td></tr>
              <tr><td>${renderValue(d.vi_controller)}</td><td>Controller + Heat Sink</td><td><span class="part-code">IFPGA003</span></td><td>${d.vi_ctrl_id||'-'}</td></tr>
              <tr><td>${renderValue(d.vi_screen)}</td><td>10" Screen</td><td><span class="part-code">IFPGA013/SFTFT001</span></td><td>${d.vi_screen_id||'-'}</td></tr>
              <tr><td>${renderValue(d.vi_sdcard)}</td><td>SD Card</td><td><span class="part-code">IFPGA001</span></td><td>${d.vi_sdcard_id||'-'}</td></tr>
              <tr><td>${renderValue(d.vi_12v_adapter)}</td><td>12V Adapter</td><td><span class="part-code">IPFGA036/SFPS005</span></td><td>${d.vi_12v_id||'-'}</td></tr>
              <tr><td>${renderValue(d.vi_pi_adapter)}</td><td>Pi Adapter (5V)</td><td><span class="part-code">IPFGA035</span></td><td>${d.vi_pi_adapter_id||'-'}</td></tr>
            </tbody>
          </table>
          <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:12px;">
            ${[['vi_filter','Filter'],['vi_grommets','Grommets'],['vi_tb_fuse','TB Mounting and Fuse']].map(([k,label])=>
              `<span style="padding:4px 12px;background:${d[k]?'#dce8f5':'#f0f0f0'};border:1.5px solid ${d[k]?'#1a3a5c':'#ddd'};border-radius:6px;font-size:0.82rem;font-weight:${d[k]?'700':'400'}">${label}</span>`
            ).join('')}
          </div>
        </div>
      </div>

      <div class="form-card">
        <div class="card-header section-green">Visual Inspection &mdash; Wiring</div>
        <div class="card-body">
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            ${[['vi_w_power','Power Cable'],['vi_w_tb_smps','TB to SMPS'],['vi_w_smps_4dio','SMPS to 4DIO'],['vi_w_4dio_led','4DIO to LED'],
               ['vi_w_ns_power','NS Power Cable'],['vi_w_ctrl_power','Controller Power'],['vi_w_lan','LAN Cable'],['vi_w_hdmi','HDMI Cable'],
               ['vi_w_usb_touch','USB Touch Cable'],['vi_w_screen_pwr','Screen Power Supply']].map(([k,label])=>
              `<span style="padding:4px 12px;background:${d[k]?'#dce8f5':'#f0f0f0'};border:1.5px solid ${d[k]?'#1a3a5c':'#ddd'};border-radius:6px;font-size:0.82rem;font-weight:${d[k]?'700':'400'}">${label}</span>`
            ).join('')}
          </div>
        </div>
      </div>

      <div class="form-card">
        <div class="card-header section-green">Visual Inspection &mdash; Other</div>
        <div class="card-body">
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
            ${[['vi_io_labels','IO Connectors with Labels'],['vi_vajra_sticker','Vajra ID Sticker (Inside & Outside)'],
               ['vi_brand_sticker','Brand Stickers, Labeling & Bezel'],['vi_crack_check','Crack Check for Enclosure']].map(([k,label])=>
              `<span style="padding:4px 12px;background:${d[k]?'#dce8f5':'#f0f0f0'};border:1.5px solid ${d[k]?'#1a3a5c':'#ddd'};border-radius:6px;font-size:0.82rem;font-weight:${d[k]?'700':'400'}">${label}</span>`
            ).join('')}
          </div>
          ${d.vi_notes ? `<p style="font-size:0.85rem;color:#555">Notes: ${d.vi_notes}</p>` : ''}
        </div>
      </div>

      <div class="form-card">
        <div class="card-header section-orange">Tests Performed</div>
        <div class="card-body">
          <div class="test-row">
            <div class="test-header"><span class="test-name">Burn Test</span>${renderValue(d.burn_result)}</div>
            <div class="test-dates-readonly">${formatTestDates(d.burn_start, d.burn_end)}</div>
            <div class="test-result"><span style="font-size:0.82rem;color:#555">Result: ${d.burn_text || '-'}</span></div>
            <div style="margin-top:8px;">${getAttachmentsForKey('burn')}</div>
          </div>
          <div class="test-row">
            <div class="test-header"><span class="test-name">Network Test</span>${renderValue(d.network_result)}</div>
            <div class="test-dates-readonly">${formatTestDates(d.network_start, d.network_end)}</div>
            <div class="test-result"><span style="font-size:0.82rem;color:#555">Result: ${d.network_text || '-'}</span></div>
            <div style="margin-top:8px;">${getAttachmentsForKey('network')}</div>
          </div>
          <div class="test-row">
            <div class="test-header"><span class="test-name">Non-Ethernet Test</span>${renderValue(d.noneth_result)}</div>
            <div class="test-dates-readonly">${formatTestDates(d.noneth_start, d.noneth_end)}</div>
            <div class="test-result"><span style="font-size:0.82rem;color:#555">Result: ${d.noneth_text || '-'}</span></div>
            <div style="margin-top:8px;">${getAttachmentsForKey('noneth')}</div>
          </div>
        </div>
      </div>

      <div class="form-card">
        <div class="card-header">Page 2 &mdash; Final Assembly Checklist (68 Items)</div>
        <div id="checklistReadonly"></div>
      </div>`;

    if (form.head_office_comments) {
      html += `<div class="form-card">
        <div class="card-header">Head Office Comments</div>
        <div class="card-body"><p style="line-height:1.6">${form.head_office_comments}</p>
        ${form.reviewed_at ? `<p style="font-size:0.82rem;color:#888;margin-top:8px;">Reviewed on: ${formatDate(form.reviewed_at)}</p>` : ''}
        </div>
      </div>`;
    }

    if (isReviewable) {
      html += `<div class="review-panel">
        <h3>Review Decision</h3>
        <label style="font-size:0.85rem;font-weight:600;color:#aaa;display:block;margin-bottom:6px;">Comments (optional)</label>
        <textarea id="reviewComments" placeholder="Add any comments or notes about this form..."></textarea>
        <div class="review-actions">
          <button class="btn btn-approve" onclick="submitReview(${id}, 'approved')">&#10003; Approve</button>
          <button class="btn btn-reject" onclick="submitReview(${id}, 'rejected')">&#10007; Reject</button>
        </div>
      </div>`;
    }

    // Audit log
    const auditHtml = await loadAuditLog(id);
    html += `<div class="form-card">
      <div class="card-header">Audit Log</div>
      <div class="card-body">${auditHtml}</div>
    </div>`;

    // PDF download and Edit buttons
    html += `<div style="display:flex;justify-content:space-between;align-items:center;margin:16px 0;">
      <button class="btn btn-back" onclick="toggleEditMode(${id})" id="editModeBtn" style="background:#ff9800;border-color:#ff9800;color:white;">✎ Edit Form</button>
      <button class="btn btn-save" onclick="downloadPDF(${id},'${form.vajra_id||'form'}')" style="background:#d32f2f;border-color:#d32f2f;">⬇ Download PDF</button>
    </div>`;

    container.innerHTML = html;
    document.getElementById('checklistReadonly').innerHTML = buildChecklistReadonly(d);

  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p>Error loading form: ${err.message}</p><br><button class="btn btn-back" onclick="loadFormsList()">Back</button></div>`;
  }
}

async function submitReview(formId, action) {
  const comments = document.getElementById('reviewComments')?.value || '';
  if (!confirm(`${action === 'approved' ? 'Approve' : 'Reject'} this form?`)) return;

  try {
    const res = await fetch(`/api/forms/${formId}/review`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, comments })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Review failed');
    showToast(`Form ${action} successfully! Technician has been notified.`, 'success');
    setTimeout(() => loadFormsList(), 1800);
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function downloadPDF(formId, vajraId) {
  window.open(`/api/pdf/${formId}`, '_blank');
}

async function loadAuditLog(formId) {
  try {
    const res = await fetch(`/api/admin/audit/${formId}`);
    if (!res.ok) return '<p style="color:#888">Could not load audit log.</p>';
    const logs = await res.json();
    if (!logs.length) return '<p style="color:#888;font-size:0.82rem">No audit history yet.</p>';
    return `<div class="audit-timeline">` + logs.map(l => `
      <div class="audit-entry action-${l.action}">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
          <span class="audit-action action-${l.action}">${l.action.replace('_',' ').toUpperCase()}</span>
          <span class="audit-meta">${formatDate(l.created_at)}</span>
          <span class="audit-meta">by <strong style="color:#ccc">${l.user_name || '-'}</strong></span>
        </div>
        ${l.detail ? `<div class="audit-detail">${l.detail}</div>` : ''}
      </div>`).join('') + `</div>`;
  } catch(e) { return ''; }
}

// ===== USER MANAGEMENT =====
async function showUserManagement() {
  const container = document.getElementById('mainContent');
  container.innerHTML = `<div class="loading"><div class="spinner"></div><p>Loading users...</p></div>`;
  try {
    const res = await fetch('/api/admin/users');
    const users = await res.json();
    let html = `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;flex-wrap:wrap;">
        <button class="btn btn-back" onclick="loadFormsList()">&#8592; Back</button>
        <h2 style="color:#e0e0e0;margin:0;">User Management</h2>
      </div>
      <div class="form-card">
        <div class="card-header">Add New User</div>
        <div class="card-body">
          <div class="field-row triple">
            <div class="field-group"><label>Username</label><input type="text" id="nu_username" class="comment-input" style="width:100%;padding:8px;" placeholder="username"></div>
            <div class="field-group"><label>Full Name</label><input type="text" id="nu_name" class="comment-input" style="width:100%;padding:8px;" placeholder="Full Name"></div>
            <div class="field-group"><label>Email</label><input type="email" id="nu_email" class="comment-input" style="width:100%;padding:8px;" placeholder="email@example.com"></div>
          </div>
          <div class="field-row">
            <div class="field-group"><label>Password</label><input type="password" id="nu_password" class="comment-input" style="width:100%;padding:8px;" placeholder="Password"></div>
            <div class="field-group"><label>Role</label>
              <select id="nu_role" style="width:100%;padding:8px;background:#111;color:#e0e0e0;border:1px solid #333;border-radius:5px;">
                <option value="technician">Technician</option>
                <option value="head_office">Head Office</option>
              </select>
            </div>
          </div>
          <button class="btn btn-submit" onclick="createUser()" style="margin-top:8px;">+ Add User</button>
        </div>
      </div>
      <div class="form-card">
        <div class="card-header">Current Users (${users.length})</div>
        <div class="card-body" style="padding:0;">
          <table class="checklist-table" style="width:100%">
            <thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Role</th><th style="width:80px">Action</th></tr></thead>
            <tbody>
              ${users.map(u => `<tr>
                <td style="color:#e0e0e0">${u.name}</td>
                <td style="color:#aaa">${u.username}</td>
                <td style="color:#aaa">${u.email}</td>
                <td><span class="badge ${u.role==='head_office'?'badge-approved':'badge-submitted'}">${u.role}</span></td>
                <td>${u.id !== (window._currentUserId) ? `<button class="btn btn-reject" style="padding:4px 10px;font-size:0.78rem;" onclick="deleteUser(${u.id},'${u.name}')">Delete</button>` : '<span style="color:#666">You</span>'}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
    container.innerHTML = html;
    window._currentUserId = currentUser.id;
  } catch(err) {
    container.innerHTML = `<div class="empty-state"><p>Error: ${err.message}</p></div>`;
  }
}

async function createUser() {
  const body = {
    username: document.getElementById('nu_username').value.trim(),
    name: document.getElementById('nu_name').value.trim(),
    email: document.getElementById('nu_email').value.trim(),
    password: document.getElementById('nu_password').value,
    role: document.getElementById('nu_role').value
  };
  if (!body.username || !body.name || !body.email || !body.password) { showToast('All fields required', 'error'); return; }
  try {
    const res = await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    showToast(`User "${body.name}" created!`, 'success');
    showUserManagement();
  } catch(err) { showToast(err.message, 'error'); }
}

async function deleteUser(id, name) {
  if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
  try {
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    showToast(`User deleted.`, 'success');
    showUserManagement();
  } catch(err) { showToast(err.message, 'error'); }
}

async function init() {
  try {
    const res = await fetch('/api/me');
    if (!res.ok) { window.location.href = '/'; return; }
    currentUser = await res.json();
    if (currentUser.role !== 'head_office') { window.location.href = '/technician.html'; return; }
    document.getElementById('userNameDisplay').textContent = currentUser.name;
    await loadFormsList();
  } catch (err) {
    window.location.href = '/';
  }
}

document.addEventListener('DOMContentLoaded', init);

document.getElementById('logoutBtn')?.addEventListener('click', async () => {
  await fetch('/api/logout', { method: 'POST' });
  window.location.href = '/';
});

document.getElementById('refreshBtn')?.addEventListener('click', loadFormsList);


// ===== EDIT MODE FOR HEAD OFFICE =====
let isEditMode = false;
let currentFormId = null;
let originalFormData = null;

function toggleEditMode(formId) {
  isEditMode = !isEditMode;
  currentFormId = formId;
  const btn = document.getElementById('editModeBtn');
  
  if (isEditMode) {
    // Enable edit mode
    btn.textContent = '💾 Save Changes';
    btn.style.background = '#27ae60';
    btn.style.borderColor = '#27ae60';
    btn.onclick = () => saveFormChanges(formId);
    makeFieldsEditable();
    showToast('Edit mode enabled! You can now modify form fields.', 'info');
  } else {
    // Cancel edit mode
    btn.textContent = '✎ Edit Form';
    btn.style.background = '#ff9800';
    btn.style.borderColor = '#ff9800';
    btn.onclick = () => toggleEditMode(formId);
    viewForm(formId); // Reload form to reset
  }
}

function makeFieldsEditable() {
  // Convert readonly divs to input fields
  document.querySelectorAll('.readonly-field').forEach(el => {
    const value = el.textContent.trim();
    if (value === '-') return; // Skip empty fields
    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    input.className = 'editable-input';
    input.style.cssText = 'width:100%;padding:8px;border:2px solid #ff9800;border-radius:4px;font-size:0.88rem;background:#fff3cd;';
    el.replaceWith(input);
  });
  
  // Make checklist editable
  document.querySelectorAll('.checklist-table tbody tr').forEach((row, idx) => {
    const statusCell = row.cells[2]; // Status column
    const commentCell = row.cells[3]; // Comment column
    
    // Convert status badges to select
    const currentStatus = statusCell.textContent.trim().toLowerCase();
    const select = document.createElement('select');
    select.style.cssText = 'width:100%;padding:4px;border:2px solid #ff9800;background:#fff3cd;';
    select.innerHTML = `
      <option value="">-</option>
      <option value="yes" ${currentStatus === 'yes' ? 'selected' : ''}>YES</option>
      <option value="no" ${currentStatus === 'no' ? 'selected' : ''}>NO</option>
    `;
    statusCell.innerHTML = '';
    statusCell.appendChild(select);
    
    // Convert comment to textarea
    const currentComment = commentCell.textContent.trim();
    const textarea = document.createElement('input');
    textarea.type = 'text';
    textarea.value = currentComment;
    textarea.style.cssText = 'width:100%;padding:4px;border:1px solid #ddd;font-size:0.82rem;';
    commentCell.innerHTML = '';
    commentCell.appendChild(textarea);
  });
  
  showToast('✏️ All fields are now editable!', 'info');
}

async function saveFormChanges(formId) {
  if (!confirm('Save all changes to this form?')) return;
  
  try {
    // Collect all changed data
    const formData = {};
    
    // Collect editable inputs
    document.querySelectorAll('.editable-input').forEach((input, idx) => {
      const label = input.parentElement.previousElementSibling?.textContent || '';
      const key = label.toLowerCase().replace(/[^a-z0-9]/g, '_');
      formData[key] = input.value;
    });
    
    // Collect checklist changes
    const checklistRows = document.querySelectorAll('.checklist-table tbody tr');
    checklistRows.forEach((row, idx) => {
      const itemNum = row.cells[0].textContent.trim();
      const statusSelect = row.cells[2].querySelector('select');
      const commentInput = row.cells[3].querySelector('input');
      
      if (statusSelect) {
        formData[`cl_${itemNum}`] = statusSelect.value;
      }
      if (commentInput) {
        formData[`cl_${itemNum}_comment`] = commentInput.value;
      }
    });
    
    // Send update to server
    const res = await fetch(`/api/forms/${formId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ form_data: formData })
    });
    
    if (!res.ok) throw new Error('Failed to save changes');
    
    showToast('✅ Form updated successfully!', 'success');
    
    // Log the edit in audit trail
    await fetch(`/api/forms/${formId}/audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'edited_by_head_office',
        detail: 'Form data modified by Head Office'
      })
    });
    
    // Reload form to show changes
    setTimeout(() => {
      isEditMode = false;
      viewForm(formId);
    }, 1500);
    
  } catch (err) {
    showToast('❌ Error saving changes: ' + err.message, 'error');
  }
}
