"use strict"

// const top_filter = 35;

const result_set_top = 35;
const result_set_left = 5;
const z_result_set = 11;
const g_result_set = "resultset";


var ResultSet = {
  id: "resultset_id",
  wind: null,
  openAll: function () {
    const rows = D_M.dict_rsl_rows;
    this.build( D_M.dict_rsl_rows);
    this.show();
  },
  openQuerySelected: function (rows) {
    this.build(rows);
    this.show();
  },
  build: async function (rows) {
    const sp = "         ";
    const menu = `
<div class="menu_wnd result_set" >
<ul>
<li>
<a class="tipb arrow" href="javascript:ResultSet.scroll_top()">&#9650;
<span class="tiptextb">Scroll Top</span>
</a>
</li>
<li>
<a class="tipb arrow" href="javascript:ResultSet.scroll_bottom()">&#9660;
<span class="tiptextb">Scroll Bottom</span>
</a>
</li>
<li>
<a class="tipb arrow" href="javascript:ResultSet.scroll_left()">&#9664;
<span class="tiptextb">Scroll Left</span>
</a>
</li>
<li>
<a class="tipb arrow" href="javascript:ResultSet.scroll_right()">&#9654;
<span class="tiptextb">Scroll Right</span>
</a>
</li>

<li>
<a class="cmd" href="#">?
</a>
</li>
<li>${sp}</li>
<li><a href="javascript:ResultSet.hide()">X</a></li>
<li></li>
</ul>
</div>
<div class="resultset">
`;
    let jt = UaJth();
    jt.append(menu);

    // head
    const heads = D_M.dict_rsl_heads;
    jt.append(`<table><thead><tr>`);
    let h = (d) => `<th><span>${d}</span></th>`;
    jt.append(h, "N.");
    for (const x of heads) jt.append(h, x.toUpperCase());
    jt.append(`</tr></thead><tbody>`);

    const rh = (d) => `<td>${d}</td>`;
    const lers = rows.length;
    for (let i = 0; i < lers; i++) {
      const row = rows[i];
      jt.append("<tr>")
      jt.append(rh, i);
      for (const f of row)
        jt.append(rh, f);
      jt.append("</tr>")
    }
    jt.append(`</tbody></table></div>`);

    const html = jt.html();
    if (!this.wind) {
      this.wind = UaWindowAdm.create(this.id, "ulaquery_id");
      this.setXY();
      this.wind.drag();
      this.wind.addGroup(g_result_set);
      this.wind.setZ(z_result_set);
    }
    this.wind.hide();
    this.wind.setHtml(html);
    this.bind();
  },
  show: async function (url) {
    if (!this.wind) return;
    wait_start();
    await sleep(10);
    this.wind.show();
    wait_stop();
  },
  hide: function () {
    if (!this.wind) return;
    this.wind.hide();
    if (FLT.visible) {
      FLT.show();
    }
  },
  setXY: function () {
    this.wind.setXY(result_set_left, result_set_top, -1);
  },
  resetXY: function () {
    this.wind.reset();
    this.setXY();
    this.show();
  },
  scroll_top: function () {
    const x = this.wind.w;
    const e = x.querySelector("div.resultset");
    e.scrollTop = 0;
  },
  scroll_bottom: function () {
    const e = this.wind.w.querySelector("div.resultset");
    e.scrollTop = e.scrollHeight;
  },
  scroll_left: function () {
    const e = this.wind.w.querySelector("div.resultset");
    e.scrollLeft = 0;
  },
  scroll_right: function () {
    const e = this.wind.w.querySelector("div.resultset");
    e.scrollLeft = e.scrollWidth;
  },
  bind: function () {
    const a = this.wind.w.querySelector("div.resultset");
    a.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopImmediatePropagation();
      let t = ev.target;
      while (t && t.tagName !== 'TR')
        t = t.parentNode;
      const td = t.querySelectorAll("td")[2];
      const formakey = td.innerHTML;
      ContextMgr.openSelected(formakey);
    });
  },

};
