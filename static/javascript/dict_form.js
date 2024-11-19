"use strict"

/*
0: FORMA
1: KEY
2: LEMMA
3: ETIMO
4: LANG
5: DATE
6: POS
7: FUNCT
8: gender
9: number
10: case
11: degree
12: deterType
13: MWEs
14: pronType
15: person
16: verbForm
17: mood
18: tense
19: voice
20: property
21: adpType
22: advType
23: advType2
24: numType
25: partType
 
26: g
27: h
28: p
29: v
 
30: LOC.1
31: LOC.2
32: LOC.3
33: LOC.4
 
34: DATE.0
35: DATE.1
36: DATE.2
*/

const z_dict = 11;
const g_dict = "dict";

var DictForm = {
  id: "dict_form.id",
  wind: null,
  openAll: function () {
    this.build(D_M.dict_rows);
    this.show();
  },
  openQuerySelected: function (rows) {
    this.build(rows);
    this.show();
  },
  build: async function (rows) {
    // collegamento con D_M per nomi colonne
    const heads = D_M.dict_heads;
    const sp = "         ";
    const menu = `
<div class="menu_wnd" >
<ul>
<li>
<a class="tipb arrow" href="javascript:DictForm.scroll_top()">&#9650;
<span class="tiptextb">Scroll Top</span>
</a>
</li>
<li>
<a class="tipb arrow" href="javascript:DictForm.scroll_bottom()">&#9660;
<span class="tiptextb">Scroll Bottom</span>
</a>
</li>
<li>
<a class="tipb arrow" href="javascript:DictForm.scroll_left()">&#9664;
<span class="tiptextb">Scroll Left</span>
</a>
</li>
<li>
<a class="tipb arrow" href="javascript:DictForm.scroll_right()">&#9654;
<span class="tiptextb">Scroll Right</span>
</a>
</li>

<li>
<a class="cmd" href="#">?
</a>
</li>
<li>${sp}</li>
<li><a  href="javascript:DictForm.hide()">X</a></li>
<li></li>
</ul>
</div>
<div class="dict_form">
`;
    let jt = UaJth();
    jt.append(menu);
    const forms_len = 8;
    const head_form = heads.slice(0, forms_len);
    const heaD_Msd = heads.slice(forms_len);

    // head
    jt.append(`<table><thead><tr>`);
    let h = (d) => `<th><span>${d}</span></th>`;
    jt.append(h, "N.");
    for (const x of head_form) jt.append(h, x.toUpperCase());
    for (const x of heaD_Msd) jt.append(h, x.toUpperCase())
    jt.append(`</tr></thead><tbody>`);

    // rowa
    const le = rows.length;
    const r0 = (d) => `<td>${d}</td>`;
    const r1 = (d) => `<td class="m">${d}</td>`;
    const ler = rows.length > 0 ? rows[0].length : 0;
    for (let i = 0; i < le; i++) {
      const row = rows[i];
      jt.append("<tr>")
      jt.append(r0, i);
      for (let i = 0; i < forms_len; i++) jt.append(r0, row[i])
      for (let i = forms_len; i < ler; i++) jt.append(r1, row[i])
      jt.append("</tr>")
    }
    jt.append(`</tbody></table></div>`);
    const html = jt.html();
    if (!this.wind) {
      this.wind = UaWindowAdm.create(this.id, "ulaquery_id");
      this.setXY();
      this.wind.drag();
      this.wind.addGroup(g_dict);
      this.wind.setZ(z_dict);
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
  },
  setXY: function () {
    const left = 5;
    const top = 35;
    this.wind.setXY(left, top, -1);
  },
  resetXY: function () {
    this.wind.reset();
    this.setXY();
    this.show();
  },
  scroll_top: function () {
    const x = this.wind.w;
    const e = x.querySelector("div.dict_form");
    e.scrollTop = 0;
  },
  scroll_bottom: function () {
    const e = this.wind.w.querySelector("div.dict_form");
    e.scrollTop = e.scrollHeight;
  },
  scroll_left: function () {
    const e = this.wind.w.querySelector("div.dict_form");
    e.scrollLeft = 0;
  },
  scroll_right: function () {
    const e = this.wind.w.querySelector("div.dict_form");
    e.scrollLeft = e.scrollWidth;
  },
  bind: function () {
    const a = this.wind.w.querySelector("div.dict_form");
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
  }

};


