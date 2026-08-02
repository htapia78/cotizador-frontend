:root{
  --bg:#101317; --surface:#171B21; --surface-2:#1E242B; --line:#2A313A; --line-soft:#222831;
  --text:#E9ECEF; --text-dim:#98A1AC; --text-faint:#6B747F;
  --lime:#A4C639; --lime-dim:#7E9A25; --lime-glow:rgba(164,198,57,.14);
  --amber:#E0A458; --danger:#D9584A; --info:#5B9BD5;
  --r:10px; --r-sm:6px;
  --sans:'Inter',system-ui,-apple-system,sans-serif;
  --display:'Space Grotesk',var(--sans);
  --mono:'JetBrains Mono',ui-monospace,'SF Mono',monospace;
}
*{box-sizing:border-box}
html,body,#root{height:100%}
body{margin:0;background:var(--bg);color:var(--text);font-family:var(--sans);font-size:14px;line-height:1.55;-webkit-font-smoothing:antialiased}
h1,h2,h3,h4{font-family:var(--display);margin:0;letter-spacing:-.02em;font-weight:600}
h1{font-size:26px}h2{font-size:19px}h3{font-size:15px}
a{color:var(--lime)}
::selection{background:var(--lime);color:#101317}

/* ---- primitivas ---- */
.num{font-family:var(--mono);font-variant-numeric:tabular-nums;letter-spacing:-.02em}
.eyebrow{font-family:var(--display);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-faint);font-weight:600}
.dim{color:var(--text-dim)}.faint{color:var(--text-faint)}
.card{background:var(--surface);border:1px solid var(--line);border-radius:var(--r)}
.pad{padding:22px 24px}
.row{display:flex;align-items:center;gap:10px}
.between{display:flex;align-items:center;justify-content:space-between;gap:16px}
.stack{display:flex;flex-direction:column;gap:14px}
.grow{flex:1}
.hr{height:1px;background:var(--line-soft);border:0;margin:16px 0}

/* ---- controles ---- */
input,select,textarea{
  font-family:var(--sans);font-size:13.5px;color:var(--text);
  background:var(--surface-2);border:1px solid var(--line);border-radius:var(--r-sm);
  padding:9px 11px;width:100%;transition:border-color .15s,box-shadow .15s;
}
input.num,select.num{font-family:var(--mono)}
input:focus,select:focus,textarea:focus{outline:none;border-color:var(--lime-dim);box-shadow:0 0 0 3px var(--lime-glow)}
input::placeholder{color:var(--text-faint)}
input[type=number]{text-align:right}
label.f{display:block}
label.f>span{display:block;margin-bottom:5px;font-size:11px;color:var(--text-dim);font-weight:500}

button{font-family:var(--sans);font-size:13px;font-weight:600;cursor:pointer;border:1px solid transparent;border-radius:var(--r-sm);padding:9px 15px;transition:all .15s;background:none;color:var(--text)}
button:focus-visible{outline:2px solid var(--lime);outline-offset:2px}
.btn{background:var(--surface-2);border-color:var(--line);color:var(--text)}
.btn:hover{border-color:var(--text-faint)}
.btn-primary{background:var(--lime);color:#12160B;border-color:var(--lime)}
.btn-primary:hover{background:#B4D64A}
.btn-ghost{color:var(--text-dim);padding:7px 10px}
.btn-ghost:hover{color:var(--text);background:var(--surface-2)}
.btn-danger{color:var(--danger);padding:5px 9px;font-size:12px}
.btn-danger:hover{background:rgba(217,88,74,.12)}
.btn-sm{padding:6px 11px;font-size:12px}
button:disabled{opacity:.45;cursor:not-allowed}
.file-btn{position:relative;overflow:hidden;display:inline-flex;align-items:center}
.file-btn input{position:absolute;inset:0;opacity:0;cursor:pointer;padding:0}

/* ---- tablas ---- */
table{width:100%;border-collapse:collapse;font-size:13px}
thead th{
  font-family:var(--display);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;
  color:var(--text-faint);font-weight:600;text-align:left;padding:0 12px 9px;
  border-bottom:1px solid var(--line);white-space:nowrap;
}
thead th.r{text-align:right}
tbody td{padding:9px 12px;border-bottom:1px solid var(--line-soft);vertical-align:middle}
tbody tr:last-child td{border-bottom:0}
tbody tr:hover{background:rgba(255,255,255,.017)}
td.r{text-align:right}
td input{padding:6px 9px;font-size:12.5px}

/* ---- layout app ---- */
.shell{display:flex;min-height:100vh}
.rail{
  width:250px;flex-shrink:0;background:var(--surface);border-right:1px solid var(--line);
  padding:20px 0;display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto;
}
.rail-head{padding:0 20px 18px;border-bottom:1px solid var(--line-soft);margin-bottom:12px}
.step{
  display:grid;grid-template-columns:24px 1fr;gap:11px;align-items:center;
  width:100%;text-align:left;padding:9px 20px;border-radius:0;border:0;
  color:var(--text-dim);position:relative;
}
.step:hover{background:var(--surface-2);color:var(--text)}
.step[data-on="1"]{background:var(--surface-2);color:var(--text)}
.step[data-on="1"]::before{content:'';position:absolute;left:0;top:6px;bottom:6px;width:2.5px;background:var(--lime);border-radius:0 2px 2px 0}
.step-n{font-family:var(--mono);font-size:10.5px;color:var(--text-faint);text-align:right}
.step[data-on="1"] .step-n{color:var(--lime)}
.step-l{font-size:13px;font-weight:500;line-height:1.25}
.step-v{font-family:var(--mono);font-size:10.5px;color:var(--text-faint);display:block;margin-top:1px}
.step[data-on="1"] .step-v{color:var(--lime-dim)}
.main{flex:1;min-width:0;padding:30px 34px 70px;max-width:1180px}
.page-head{margin-bottom:24px}

/* ---- KPI ---- */
.kpis{display:grid;gap:10px}
.kpi{background:var(--surface-2);border:1px solid var(--line);border-radius:var(--r-sm);padding:13px 15px}
.kpi b{display:block;font-family:var(--mono);font-size:19px;font-weight:500;margin-top:3px;letter-spacing:-.03em}
.kpi.hi{background:linear-gradient(150deg,rgba(164,198,57,.12),rgba(164,198,57,.03));border-color:var(--lime-dim)}
.kpi.hi b{color:var(--lime)}

/* ---- cascada ---- */
.casc{display:flex;flex-direction:column}
.casc-row{display:grid;grid-template-columns:1fr 130px 92px;gap:12px;align-items:center;padding:9px 0;border-bottom:1px solid var(--line-soft)}
.casc-row.sub{padding-left:18px}
.casc-row.total{border-top:1px solid var(--line);border-bottom:0;margin-top:5px;padding-top:13px}
.casc-lbl{font-size:13px;color:var(--text-dim)}
.casc-row.total .casc-lbl{font-family:var(--display);font-size:14px;color:var(--text);font-weight:600}
.casc-val{font-family:var(--mono);text-align:right;font-size:13.5px}
.casc-row.total .casc-val{font-size:17px;color:var(--lime)}
.casc-bar{height:5px;border-radius:3px;background:var(--line);overflow:hidden}
.casc-bar i{display:block;height:100%;background:var(--lime-dim);border-radius:3px}

/* ---- varios ---- */
.tag{display:inline-block;font-family:var(--mono);font-size:10.5px;padding:2px 7px;border-radius:4px;background:var(--surface-2);border:1px solid var(--line);color:var(--text-dim)}
.tag.ok{color:var(--lime);border-color:var(--lime-dim)}
.tag.warn{color:var(--amber);border-color:rgba(224,164,88,.4)}
.empty{text-align:center;padding:44px 20px;color:var(--text-faint)}
.empty h3{color:var(--text-dim);margin-bottom:6px}
.sug{position:absolute;top:calc(100% + 4px);left:0;right:0;z-index:40;background:var(--surface-2);border:1px solid var(--line);border-radius:var(--r-sm);max-height:260px;overflow-y:auto;box-shadow:0 12px 32px rgba(0,0,0,.5)}
.sug button{display:block;width:100%;text-align:left;padding:9px 12px;border-radius:0;font-weight:400;font-size:12.5px;border-bottom:1px solid var(--line-soft)}
.sug button:hover{background:var(--lime-glow)}
.toast{position:fixed;right:22px;bottom:22px;z-index:99;background:var(--surface-2);border:1px solid var(--lime-dim);border-left:3px solid var(--lime);border-radius:var(--r-sm);padding:12px 16px;max-width:380px;box-shadow:0 14px 40px rgba(0,0,0,.55);font-size:13px;white-space:pre-line}
.toast.err{border-color:var(--danger);border-left-color:var(--danger)}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
::-webkit-scrollbar{width:9px;height:9px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--line);border-radius:5px}
::-webkit-scrollbar-thumb:hover{background:var(--text-faint)}

/* ---- login ---- */
.login-wrap{min-height:100vh;display:grid;place-items:center;padding:20px;
  background:radial-gradient(1000px 520px at 50% -8%,rgba(164,198,57,.09),transparent 62%),var(--bg)}
.login-card{width:100%;max-width:390px}

@media (max-width:860px){
  .shell{flex-direction:column}
  .rail{width:100%;height:auto;position:static;flex-direction:row;overflow-x:auto;padding:12px 0;gap:2px}
  .rail-head{display:none}
  .step{width:auto;flex-shrink:0;padding:8px 14px;grid-template-columns:auto}
  .step-n,.step-v{display:none}
  .step[data-on="1"]::before{top:auto;bottom:0;left:8px;right:8px;width:auto;height:2.5px;border-radius:2px 2px 0 0}
  .main{padding:20px 16px 60px}
  .grid2,.grid3,.grid4{grid-template-columns:1fr}
}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
