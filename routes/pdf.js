const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const { dbGet } = require('../database');

function requireAuth(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: 'Not authenticated' });
  next();
}

const CHECKLIST_ITEMS = [
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

const L = 40, R = 555, CONTENT_W = 515;

// Draw a checkbox — returns the box, no text
function drawCheckbox(doc, x, y) {
  doc.rect(x, y, 8, 8).strokeColor('#000').lineWidth(0.5).stroke();
}

// Draw checkbox + label on one line, returns new y
function checkItem(doc, x, y, label, checked) {
  drawCheckbox(doc, x, y + 1);
  if (checked) {
    // Draw tick using lines (no unicode)
    doc.moveTo(x + 1, y + 5).lineTo(x + 3, y + 8).lineTo(x + 7, y + 2)
       .strokeColor('#000').lineWidth(1).stroke();
  }
  doc.fontSize(9).font('Helvetica').fillColor('#000')
     .text(label, x + 12, y, { width: CONTENT_W - (x - L) - 12, lineBreak: false });
  return y + 14;
}

// Simple field row: label + value
function fieldRow(doc, x, y, label, value) {
  doc.fontSize(9).font('Helvetica-Bold').fillColor('#000').text(label, x, y, { continued: true, width: 120 });
  doc.font('Helvetica').text('  ' + (value || '_______________'), { lineBreak: false });
  return y + 14;
}

router.get('/:id', requireAuth, (req, res) => {
  const form = dbGet(`SELECT f.*, u.name as technician_name
    FROM forms f LEFT JOIN users u ON f.technician_id = u.id WHERE f.id = ?`, [req.params.id]);
  if (!form) return res.status(404).json({ error: 'Form not found' });

  const user = req.session.user;
  if (user.role === 'technician' && form.technician_id !== user.id)
    return res.status(403).json({ error: 'Forbidden' });

  let d = {};
  try { d = JSON.parse(form.form_data || '{}'); } catch(e) {}

  const doc = new PDFDocument({ margin: 0, size: 'A4', autoFirstPage: true });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="Vajra-JobCard-${form.vajra_id || form.id}.pdf"`);
  doc.pipe(res);

  // ══════════════════════════════════════════════
  // PAGE 1 — VAJRA TESTING JOB CARD
  // ══════════════════════════════════════════════
  let y = 30;

  // Title
  doc.fontSize(16).font('Helvetica-Bold').fillColor('#000')
     .text('Vajra Testing Job Card', L, y, { align: 'center', width: CONTENT_W });
  y += 26;

  // Vajra ID
  drawCheckbox(doc, L, y + 1);
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#000')
     .text('Assign Vajra ID :-', L + 12, y, { continued: true });
  doc.font('Helvetica').text('  ' + (form.vajra_id || '_______________'));
  y += 16;

  // Vajra Base ID
  drawCheckbox(doc, L, y + 1);
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#000')
     .text('Vajra Base ID :-', L + 12, y, { continued: true });
  doc.font('Helvetica').text('  ' + (form.vajra_base_id || '_______________'));
  y += 20;

  // ── Testing and QA ──
  drawCheckbox(doc, L, y + 1);
  doc.fontSize(11).font('Helvetica-Bold').fillColor('#000').text('Testing and QA :-', L + 12, y);
  y += 18;

  const tqaRows = [
    `Supply & Connectivity Testing (Voltage - ${d.tqa_supply_vac||'___'} VAC, ${d.tqa_supply_24v||'24.1'}v, ${d.tqa_supply_5v||'5'} V)`,
    `IO Test, Voltage Test (With Load: ${d.tqa_io_with_load||'___'}  Without Load: ${d.tqa_io_without_load||'___'})`,
    `RTC Address Detection and RTC battery (${d.tqa_rtc_voltage||'3'} V)  Addr: ${d.tqa_rtc_address||'___'}`,
    `Log Verification (Temp: ${d.tqa_log_temp||'___'} C  Swap: ${d.tqa_log_swap||'___'} MB)`,
    'Screen Touch Testing',
    'Power and Network LED Testing',
  ];
  const tqaDone = [d.tqa_supply, d.tqa_io, d.tqa_rtc, d.tqa_log, d.tqa_touch, d.tqa_led];
  const tqaResult = [d.tqa_supply_result, d.tqa_io_result, d.tqa_rtc_result, d.tqa_log_result, d.tqa_touch_result, d.tqa_led_result];

  tqaRows.forEach((label, i) => {
    drawCheckbox(doc, L + 8, y + 1);
    if (tqaDone[i]) {
      doc.moveTo(L + 9, y + 5).lineTo(L + 11, y + 8).lineTo(L + 15, y + 2)
         .strokeColor('#000').lineWidth(1).stroke();
    }
    const resultStr = tqaResult[i] ? `  [${tqaResult[i].toUpperCase()}]` : '';
    doc.fontSize(10).font('Helvetica').fillColor('#000')
       .text(`${i + 1}.  ${label}${resultStr}`, L + 22, y, { width: CONTENT_W - 22 });
    y += 15;
  });
  y += 8;

  // ── Visual Inspection ──
  drawCheckbox(doc, L, y + 1);
  doc.fontSize(11).font('Helvetica-Bold').fillColor('#000').text('Visual Inspection: -', L + 12, y);
  y += 18;

  doc.fontSize(10).font('Helvetica-Bold').fillColor('#000').text('1.  Component:-', L + 8, y);
  y += 15;

  // Two-column component layout
  const col1X = L + 16, col2X = L + 280, colW = 240;

  const comps = [
    { label: `SMPS - IPFGA007- ${d.vi_smps_id||''}`,   val: d.vi_smps,          col: 0 },
    { label: `Fan - IFPGA004- ${d.vi_fan_id||''}`,      val: d.vi_fan,           col: 1 },
    { label: `4DIO - IPFGA019- ${d.vi_4dio_id||''}`,    val: d.vi_4dio,          col: 0 },
    { label: `Network Switch - IFPGA006- ${d.vi_ns_id||''}`, val: d.vi_network_switch, col: 1 },
    { label: `Controller+HeatSink - IFPGA003- ${d.vi_ctrl_id||''}`, val: d.vi_controller, col: 0 },
    { label: `10" Screen - IFPGA013- ${d.vi_screen_id||''}`, val: d.vi_screen,    col: 1 },
    { label: `SD card - IFPGA001- ${d.vi_sdcard_id||''}`, val: d.vi_sdcard,       col: 0 },
    { label: `12v Adapter - IPFGA036- ${d.vi_12v_id||''}`, val: d.vi_12v_adapter, col: 1 },
    { label: `PI Adapter - IPFGA035- ${d.vi_pi_adapter_id||''}`, val: d.vi_pi_adapter, col: 0 },
  ];

  // Render in pairs
  let leftY = y, rightY = y;
  comps.forEach(c => {
    const cx = c.col === 0 ? col1X : col2X;
    const cy = c.col === 0 ? leftY : rightY;
    drawCheckbox(doc, cx, cy + 1);
    if (c.val) {
      doc.moveTo(cx + 1, cy + 5).lineTo(cx + 3, cy + 8).lineTo(cx + 7, cy + 2)
         .strokeColor('#000').lineWidth(1).stroke();
    }
    doc.fontSize(9).font('Helvetica').fillColor('#000').text(c.label, cx + 12, cy, { width: colW - 12 });
    if (c.col === 0) leftY += 14; else rightY += 14;
  });
  y = Math.max(leftY, rightY) + 2;

  // Filter, Grommets, TB in a row
  [['Filter', d.vi_filter], ['Grommets', d.vi_grommets], ['TB Mounting and Fuse', d.vi_tb_fuse]].forEach(([label, val], i) => {
    const cx = col1X + i * 155;
    drawCheckbox(doc, cx, y + 1);
    if (val) {
      doc.moveTo(cx + 1, y + 5).lineTo(cx + 3, y + 8).lineTo(cx + 7, y + 2)
         .strokeColor('#000').lineWidth(1).stroke();
    }
    doc.fontSize(9).font('Helvetica').fillColor('#000').text(label, cx + 12, y);
  });
  y += 18;

  // Wiring
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#000').text('2.  Wiring :-', L + 8, y);
  y += 15;

  const wires = [
    ['Power Cable', d.vi_w_power, 0], ['TB to SMPS', d.vi_w_tb_smps, 1],
    ['SMPS to 4DIO', d.vi_w_smps_4dio, 0], ['4DIO to LED', d.vi_w_4dio_led, 1],
    ['NS Power cable', d.vi_w_ns_power, 0], ['Controller Power', d.vi_w_ctrl_power, 1],
    ['LAN Cable', d.vi_w_lan, 0], ['HDMI Cable', d.vi_w_hdmi, 1],
    ['USB Touch Cable', d.vi_w_usb_touch, 0], ['Screen Power Supply', d.vi_w_screen_pwr, 1],
  ];
  let wLeftY = y, wRightY = y;
  wires.forEach(([label, val, col]) => {
    const cx = col === 0 ? col1X : col2X;
    const cy = col === 0 ? wLeftY : wRightY;
    drawCheckbox(doc, cx, cy + 1);
    if (val) {
      doc.moveTo(cx + 1, cy + 5).lineTo(cx + 3, cy + 8).lineTo(cx + 7, cy + 2)
         .strokeColor('#000').lineWidth(1).stroke();
    }
    doc.fontSize(9).font('Helvetica').fillColor('#000').text(label, cx + 12, cy, { width: colW - 12 });
    if (col === 0) wLeftY += 14; else wRightY += 14;
  });
  y = Math.max(wLeftY, wRightY) + 4;

  // Remaining visual items
  const viOther = [
    ['Add IO connectors with labels', d.vi_io_labels],
    ['Vajra Id Sticker (Inside and Outside)', d.vi_vajra_sticker],
    ['Brand Stickers and Labeling, Bezel', d.vi_brand_sticker],
    ['Crack checking for encloser', d.vi_crack_check],
  ];
  viOther.forEach(([label, val], i) => {
    drawCheckbox(doc, L + 8, y + 1);
    if (val) {
      doc.moveTo(L + 9, y + 5).lineTo(L + 11, y + 8).lineTo(L + 15, y + 2)
         .strokeColor('#000').lineWidth(1).stroke();
    }
    doc.fontSize(10).font('Helvetica').fillColor('#000').text(`${i + 3}.  ${label}`, L + 22, y, { width: CONTENT_W - 22 });
    y += 15;
  });
  y += 8;

  // ── Tests Perform ──
  drawCheckbox(doc, L, y + 1);
  doc.fontSize(11).font('Helvetica-Bold').fillColor('#000').text('Tests perform :-', L + 12, y);
  y += 18;

  const tests = [
    ['Burn Test', d.burn_result, d.burn_start, d.burn_end],
    ['Network Test', d.network_result, d.network_start, d.network_end],
    ['Non-Ethernet test', d.noneth_result, d.noneth_start, d.noneth_end],
  ];
  tests.forEach(([label, result]) => {
    drawCheckbox(doc, L + 8, y + 1);
    if (result) {
      doc.moveTo(L + 9, y + 5).lineTo(L + 11, y + 8).lineTo(L + 15, y + 2)
         .strokeColor('#000').lineWidth(1).stroke();
    }
    const resultStr = result ? ` - ${result.toUpperCase()}` : ' -';
    doc.fontSize(10).font('Helvetica').fillColor('#000').text(label + resultStr, L + 22, y);
    y += 14;
  });
  y += 8;

  // ── Bottom fields ──
  const fields = [
    ['Allotted To :-', d.allotted_to],
    ['Machine Name :-', d.machine_name],
    ['Where To Shipped :-', d.where_shipped],
  ];
  fields.forEach(([label, value]) => {
    drawCheckbox(doc, L, y + 1);
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#000').text(label, L + 12, y, { lineBreak: false });
    doc.fontSize(10).font('Helvetica').fillColor('#000').text('  ' + (value || '_______________'), L + 140, y, { lineBreak: false });
    y += 15;
  });

  drawCheckbox(doc, L, y + 1);
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#000').text('Verified By :-', L + 12, y, { lineBreak: false });
  doc.fontSize(10).font('Helvetica').fillColor('#000').text('  ' + (d.verified_by || form.technician_name || 'Hrushikesh Gadute'), L + 140, y, { lineBreak: false });
  y += 15;

  drawCheckbox(doc, L, y + 1);
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#000').text('Date :-', L + 12, y, { lineBreak: false });
  doc.fontSize(10).font('Helvetica').fillColor('#000').text('  ' + (d.form_date || '____ / ____ / 2026'), L + 140, y, { lineBreak: false });

  // ══════════════════════════════════════════════
  // PAGE 2 — FINAL ASSEMBLY CHECKLIST
  // ══════════════════════════════════════════════
  doc.addPage();
  y = 30;

  doc.fontSize(13).font('Helvetica-Bold').fillColor('#000')
     .text('VAJRA SYSTEM FINAL ASSEMBLY CHECKLIST', L, y, { align: 'center', width: CONTENT_W });
  y += 26;

  // Column positions
  const C_NUM = L, C_NUM_W = 32;
  const C_ITEM = C_NUM + C_NUM_W, C_ITEM_W = 305;
  const C_YES = C_ITEM + C_ITEM_W, C_YES_W = 38;
  const C_NO = C_YES + C_YES_W, C_NO_W = 38;
  const C_CMT = C_NO + C_NO_W, C_CMT_W = R - C_NO - C_NO_W;
  const ROW_H = 22;

  function tableHeader(doc, y) {
    doc.rect(C_NUM, y, C_NUM_W, ROW_H).fillAndStroke('#e0e0e0', '#000');
    doc.rect(C_ITEM, y, C_ITEM_W, ROW_H).fillAndStroke('#e0e0e0', '#000');
    doc.rect(C_YES, y, C_YES_W, ROW_H).fillAndStroke('#e0e0e0', '#000');
    doc.rect(C_NO, y, C_NO_W, ROW_H).fillAndStroke('#e0e0e0', '#000');
    doc.rect(C_CMT, y, C_CMT_W, ROW_H).fillAndStroke('#e0e0e0', '#000');
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#000');
    doc.text('Sr.\nNo.', C_NUM + 4, y + 4, { width: C_NUM_W - 8, align: 'center' });
    doc.text('Check list Item', C_ITEM + 4, y + 8, { width: C_ITEM_W - 8 });
    doc.text('Yes', C_YES + 4, y + 8, { width: C_YES_W - 8, align: 'center' });
    doc.text('No', C_NO + 4, y + 8, { width: C_NO_W - 8, align: 'center' });
    doc.text('Comments', C_CMT + 4, y + 8, { width: C_CMT_W - 8 });
    return y + ROW_H;
  }

  function sectionRow(doc, y, label) {
    doc.rect(C_NUM, y, C_NUM_W + C_ITEM_W + C_YES_W + C_NO_W + C_CMT_W, ROW_H)
       .fillAndStroke('#cccccc', '#000');
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#000')
       .text(label, C_NUM + 6, y + 7, { width: CONTENT_W - 12 });
    return y + ROW_H;
  }

  // Draw tick (right sign) using lines - no unicode
  function drawTick(doc, cx, cy) {
    doc.moveTo(cx, cy + 4).lineTo(cx + 3, cy + 8).lineTo(cx + 9, cy)
       .strokeColor('#000').lineWidth(1.2).stroke();
  }

  // Draw cross (wrong sign) using lines - no unicode
  function drawCross(doc, cx, cy) {
    doc.moveTo(cx, cy).lineTo(cx + 9, cy + 9)
       .moveTo(cx + 9, cy).lineTo(cx, cy + 9)
       .strokeColor('#000').lineWidth(1.2).stroke();
  }

  y = tableHeader(doc, y);

  let lastSection = '';
  CHECKLIST_ITEMS.forEach(([id, section, , desc]) => {
    // Add new page if needed
    if (y > 780) {
      doc.addPage();
      y = 30;
      y = tableHeader(doc, y);
      lastSection = ''; // re-draw section header
    }

    // Section header row
    if (section !== lastSection) {
      if (y > 755) {
        doc.addPage();
        y = 30;
        y = tableHeader(doc, y);
      }
      y = sectionRow(doc, y, section);
      lastSection = section;
    }

    const val = d[`cl_${id}`];
    const comment = d[`cl_${id}_comment`] || '';

    // Row cells
    doc.rect(C_NUM, y, C_NUM_W, ROW_H).stroke('#000');
    doc.rect(C_ITEM, y, C_ITEM_W, ROW_H).stroke('#000');
    doc.rect(C_YES, y, C_YES_W, ROW_H).stroke('#000');
    doc.rect(C_NO, y, C_NO_W, ROW_H).stroke('#000');
    doc.rect(C_CMT, y, C_CMT_W, ROW_H).stroke('#000');

    // Sr No
    doc.fontSize(9).font('Helvetica').fillColor('#000')
       .text(String(id), C_NUM + 4, y + 7, { width: C_NUM_W - 8, align: 'center' });

    // Description
    doc.fontSize(8.5).font('Helvetica').fillColor('#000')
       .text(desc, C_ITEM + 4, y + 5, { width: C_ITEM_W - 8, height: ROW_H - 6, lineBreak: true });

    // Yes column — tick if yes
    if (val === 'yes') {
      drawTick(doc, C_YES + 14, y + 6);
    }

    // No column — cross if no
    if (val === 'no') {
      drawCross(doc, C_NO + 14, y + 6);
    }

    // Comment
    if (comment) {
      doc.fontSize(8).font('Helvetica').fillColor('#000')
         .text(comment, C_CMT + 3, y + 5, { width: C_CMT_W - 6, height: ROW_H - 6 });
    }

    y += ROW_H;
  });

  // Footer
  y += 14;
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#000').text('Vajra Id - ', L, y, { continued: true });
  doc.font('Helvetica').text(form.vajra_id || '______________');
  y += 16;
  doc.fontSize(10).font('Helvetica-Bold').text('Verified By - ', L, y, { continued: true });
  doc.font('Helvetica').text(d.verified_by || form.technician_name || '______________');
  y += 16;
  doc.fontSize(10).font('Helvetica-Bold').text('Date - ', L, y, { continued: true });
  doc.font('Helvetica').text(d.form_date || '____ / ____ / 2026');

  doc.end();
});

module.exports = router;
