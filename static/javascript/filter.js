"use strict"

const filter_group="filter";

const top_filter = 35;

const where_top = top_filter + 380;
const where_left = 5;
const z_where = 10;

const form_lemma_top = top_filter;
const form_lemma_left = 3;
const z_form_lemma = 9;

const sigl_top = top_filter + 130;
const sigl_left = 5;
const z_sigl = 8;

const funct_top = top_filter;
const funct_left = 490;
const z_funct = 7;

const lang_date_top = top_filter;
const lang_date_left = 300;
const z_lang_date = 6;

const pos_msd_top = top_filter;
const pos_msd_left = 670;
const z_pos_msd = 5;

const VS = {
  forma: '',
  lemma: '',
  etimo: '',
  sigl: {
    sigls: [],
    locts: [],
    datets: []
  },
  funct: {
    functs: [],
  },
  lang_date: {
    langs: [],
    dates: []
  },
  msd_attrs: [],
  select: function () {
    VS.forma = FormLemma.forma;
    VS.lemma = FormLemma.lemma;
    VS.etimo = FormLemma.etimo;

    VS.sigl.sigls = Sigl.sigls;
    VS.sigl.locts = Sigl.locts;
    VS.sigl.datets = Sigl.datets;

    VS.funct.functs = Funct.functs;

    VS.lang_date.langs = LangDate.langs;
    VS.lang_date.dates = LangDate.dates;

    VS.msd_attrs = PosMsd.msd_attrs;
  },
  unselect: function () {
    this.forma = '';
    this.lemma = '';
    this.etimo = '';

    this.sigl.sigls = [];
    this.sigl.locts = [];
    this.sigl.datets = [];

    this.funct.functs = [];

    this.lang_date.langs = [];
    this.lang_date.dates = [];

    this.msd_attrs = [];
  }
}

var FLT = {
  visible: false,
  open: function () {
    this.visible = true;
    FormLemma.open();
    Funct.open();
    LangDate.open();
    Sigl.open();
    PosMsd.open();
    Where.open();
  },
  show: function () {
    this.visible = true;
    FormLemma.show();
    Funct.show();
    LangDate.show();
    Sigl.show();
    PosMsd.show();
    Where.show();
  },
  hide: function () {
    this.visible = false;
    FormLemma.hide();
    Funct.hide();
    LangDate.hide();
    Sigl.hide();
    PosMsd.hide();
    Where.hide();
  },
  resetXY: function () {
    this.visible = true;
    FormLemma.resetXY();
    Sigl.resetXY();
    Funct.resetXY();
    LangDate.resetXY();
    PosMsd.resetXY();
    Where.resetXY();
  },
  getAllSelected: function () {
    FormLemma.select();
    Sigl.select();
    Funct.select();
    LangDate.select();
    PosMsd.select();
    VS.select();
  },
  select: function () {
    this.getAllSelected();
    Where.build();
    Where.show();
  },
  unselect: function () {
    FormLemma.unselect();
    Sigl.unselect();
    Funct.unselect();
    LangDate.unselect();
    PosMsd.unselect();
    VS.unselect();
    Where.build();
    Where.show();
  },
  queryRslt: function () {
    this.getAllSelected();
    const js = D_M.setQueryConditions();
    const rows = D_M.findRsltRows(js);
    ResultSet.openQuerySelected(rows);
  },
  queryDict: function () {
    this.getAllSelected();
    const js = D_M.setQueryConditions();
    const rows = D_M.findDictRows(js);
    DictForm.openQuerySelected(rows);
  }
};

var Where = {
  id: 'Where_id',
  wind: null,
  isActive: false,
  build: function () {
    const jt = UaJth();
    jt.append(`
<div class="menu_wnd">
<ul>
<li><a onclick="Where.testQuery()" href="#">Test</a></li>  
<li><a onclick="Where.close()" href="#">X</a></li>  
</ul>
 </div>
`);
    jt.append('<div class="where"><ul>');

    const fhslc = (l, v) => `
    <li>
    <div class="sl" >${l}</div>
    <div class="sv num">${v}</div>
    </li>`;
    jt.append(fhslc("Select", ""));

    const fh0 = (l, v) => `
    <li>
    <div class="l" >${l}</div>
    <div class="v"><div>${v}</div></div>
    </li>`;
    jt.append(fh0("Forma", VS.forma));
    jt.append(fh0("Lemma", VS.lemma));
    jt.append(fh0("Etimo", VS.etimo));

    const jr = UaJth();

    const rh = (arr) => {
      jr.reset();
      for (const x of arr)
        jr.append(`<div>${x}</div>`)
      return jr.html();
    };

    const fh = (l, v) => `
    <li>
    <div class="l" >${l}</div>
    <div class="v">${v}</div>
    </li>`;

    let h = rh(VS.sigl.sigls);
    jt.append(fh("Sigl", h));

    h = rh(VS.sigl.locts);
    jt.append(fh("Loc.", h));

    h = rh(VS.sigl.datets);
    jt.append(fh("Date", h));

    h = rh(VS.funct.functs);
    jt.append(fh("Funct", h));

    h = rh(VS.lang_date.langs);
    jt.append(fh("Lang.", h));
    h = rh(VS.lang_date.dates);
    jt.append(fh("Date", h));

    for (let k in VS.msd_attrs) {
      const row = VS.msd_attrs[k];
      const pm = row[0];;
      const rs = row.slice(1);
      const h = rh(rs);
      jt.append(fh(pm, h));
    }

    jt.append("</ul></div>")
    const html = jt.html();
    if (!this.wind) {
      this.wind = UaWindowAdm.create(this.id, "ulaquery_id");
      this.setXY();
      this.wind.drag();
      this.wind.setZ(z_where)
      this.wind.addGroup(filter_group);
    }
   this.wind.hide();
    this.wind.setHtml(html);
  },
  close: function () {
    if (!this.wind) return;
    this.wind.hide();
    this.isActive = false;
  },
  open: function () {
    if (!this.wind) return;
    this.wind.show();
    this.isActive = true;
  },
  show: function (url) {
    if (!this.wind) return;
    if (this.isActive)
      this.wind.show();
  },
  hide: function () {
    if (!this.wind) return;
    if (this.isActive)
      this.wind.hide();
  },
  setXY: function () {
    this.wind.setXY(where_left, where_top, -1);
  },
  resetXY: function () {
    this.wind.reset();
    this.setXY();
    this.open();
  },
  testQuery: function () {
    FLT.getAllSelected();
    const js = D_M.setQueryConditions();
    const idxs = D_M.findIndices(js);
    const n = idxs.length;
    const e = this.wind.w.querySelector(`div.where li div.num`);
    e.innerHTML = `${n}`;
  },

};


var FormLemma = {
  id: 'form_lemma_id',
  wind: null,
  forma: '',
  lemma: '',
  etimo: '',
  isActive: false,
  build: async function () {
    const jt = UaJth();
    jt.append(`
    <div class="menu_wnd">
    <ul>
    <li>
    <a class="tipb" onclick="FormLemma.unselect()" href="#">Unselect
       <span class="tiptextb">Reset Fields Selected</span>
     </a>
    </li>
    <li><a  onclick="FormLemma.close()" href="#">X</a></li>  
    </ul>
    </div>
    
<div class="form_lemma">
<ul>
<li>
  <div class="l">Forma</div>:
  <div  class="i"> <input type="text" value="" name="forma" size="6" > </div>
</li>
<li>
  <div class="l">Lemma</div>:
  <div class="i"> <input type="text" value="" name="lemma" size="6" > </div>
</li>
<li>
  <div class="l">Etimo</div>:
  <div class="i"> <input type="text" value="" name="etimo" size="6" > </div> 
</li>
</ul>
</div>
       `);
    const html = jt.html();
    if (!this.wind) {
      this.wind = UaWindowAdm.create(this.id, "ulaquery_id");
      this.setXY();
      this.wind.drag();
      this.wind.setZ(z_form_lemma);
      this.wind.addGroup(filter_group);
    }
    this.wind.setHtml(html);
    this.bind();
  },
  close: function () {
    if (!this.wind) return;
    this.wind.hide();
    this.isActive = false;
  },
  open: function () {
    if (!this.wind) return;
    this.wind.show();
    this.isActive = true;
  },
  show: function (url) {
    if (!this.wind) return;
    if (this.isActive)
      this.wind.show();
  },
  hide: function () {
    if (!this.wind) return;
    if (this.isActive)
      this.wind.hide();
  },
  setXY: function () {
    this.wind.setXY(form_lemma_left, form_lemma_top, -1);
  },
  resetXY: function () {
    this.wind.reset();
    this.setXY();
    this.open();
  },
  unselect: function () {
    const attrs = this.wind.w.querySelectorAll(`div.form_lemma input`);
    for (let a of attrs) {
      a.value = '';
    }
    FLT.select();
  },
  select: function () {
    let fle = this.wind.w.querySelector("div.form_lemma");
    this.forma = fle.querySelector('input[name="forma"]').value;
    this.lemma = fle.querySelector('input[name="lemma"]').value;
    this.etimo = fle.querySelector('input[name="etimo"]').value;
  },
  bind: function () {
    const attrs = this.wind.w.querySelectorAll("div.form_lemma input");

    const call = () => {
      FLT.select();
    };

    for (let a of attrs) {
      a.addEventListener("change", (ev) => {
        call();
      });
      // a.addEventListener("blur", (ev) => {
      a.addEventListener("mouseleave", (ev) => {
        call();
      });
    }

  }
};


var Sigl = {
  id: 'sigl_id',
  wind: null,
  sigls: [],
  locts: [],
  datets: [],
  isActive: false,
  load: async function (url) {
    try {
      const resp = await fetch(url, {
        method: 'GET',
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        cache: "default"
      });
      if (!resp.ok) {
        throw new Error(`Erroe:${resp.status} ${resp.statusText}`);
      }
      const data = await resp.text();
      const rows = data.trim().split("\n");
      return rows.map((x) => x.trim().split("|"));
    } catch (error) {
      alert(`Errror:${url}\n ${error}`);
      throw error;
    }
  },
  build: async function () {
    const jt = UaJth();
    const rows = await this.load(`static/cfg/exp_loc_dat.csv`);
    const sgs = [];
    const lcs = [];
    const dts = [];
    for (const row of rows) {
      sgs.push(row[0]);
      lcs.push(row[2]);
      if (dts.indexOf(row[3]) < 0)
        dts.push(row[3]);
    }
    // const dts = arr.filter((e, i, arr) => arr.indexOf(e) === i);

    jt.append(`
    <div class="menu_wnd">
    <ul>
    <li>
    <a class="tipb" onclick="Sigl.unselect()" href="#">Unselect
       <span class="tiptextb">Unselect Field Selected</span>
     </a>
    </li>
    <li><a onclick="Sigl.close()" href="#">X</a></li>  
    </ul>
    </div>
    <div class="sigl">`);
    jt.append("<div><ul>")

    jt.append(`<li class="s"><span>Sigl.</span></li> `);
    for (let row of sgs)
      jt.append(`<li class="s"><a>${row}</a></li> `);
    jt.append(`</ul></div>`);

    jt.append("<div><ul>")
    jt.append(`<li class="l"><span>Loc.T.</span></li> `);
    for (let row of lcs)
      jt.append(`<li class="l"><a>${row}</a></li> `);
    jt.append(`</ul></div>`);

    jt.append("<div><ul>")
    jt.append(`<li class="d"><span>Date T.</span></li> `);
    for (let row of dts)
      jt.append(`<li class="d"><a>${row}</a></li> `);
    jt.append(`</ul></div>`);

    jt.append("</div>")
    const html = jt.html();
    if (!this.wind) {
      this.wind = UaWindowAdm.create(this.id, "ulaquery_id");
      this.setXY();
      this.wind.drag();
      this.wind.setZ(z_sigl);
      this.wind.addGroup(filter_group);
    }
    this.wind.setHtml(html);
    this.bind();
  },
  close: function () {
    if (!this.wind) return;
    this.wind.hide();
    this.isActive = false;
  },
  open: function () {
    if (!this.wind) return;
    this.wind.show();
    this.isActive = true;
  },
  show: function (url) {
    if (!this.wind) return;
    if (this.isActive)
      this.wind.show();
  },
  hide: function () {
    if (!this.wind) return;
    if (this.isActive)
      this.wind.hide();
  },
  setXY: function () {
    this.wind.setXY(sigl_left, sigl_top, -1);
  },
  resetXY: function () {
    this.wind.reset();
    this.setXY();
    this.open();
  },
  bind: function () {
    const attrs = this.wind.w.querySelectorAll("div.sigl li a");
    for (let a of attrs) {
      a.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        const t = ev.target;
        if (t.classList.contains("select"))
          t.classList.remove("select");
        else
          t.classList.add("select");
        FLT.select();
      });
    }
  },
  unselect: function () {
    const attrs = this.wind.w.querySelectorAll("div.sigl li a");
    for (let a of attrs) {
      a.classList.remove("select");
    }
    FLT.select();
  },
  select: function () {

    const smear = (lst, arh1) => {
      const arr0 = Array.from(lst);
      const arh0 = arr0.map((x) => x.innerHTML);
      let arr2 = new Array(arr0.length).fill('');
      for (let i = 0; i < arh0.length; i++)
        if (arh1.includes(arh0[i]))
          arr2[i] = arh0[i];
      return arr2;
    }

    const selecteds = (ats) => {
      const arr = Array.from(ats);
      return arr.filter(a => a.classList.contains("select")).map(a => a.innerHTML);
    };

    // sigle settate
    let arr0 = this.wind.w.querySelectorAll("div.sigl li.s a");
    let arr1 = selecteds(arr0);
    this.sigls = smear(arr0, arr1);

    // localit+ testo settate 
    arr0 = this.wind.w.querySelectorAll("div.sigl li.l a");
    arr1 = selecteds(arr0);
    this.locts = smear(arr0, arr1);

    // date testo settate
    arr0 = this.wind.w.querySelectorAll("div.sigl li.d a");
    arr1 = selecteds(arr0);
    this.datets = smear(arr0, arr1);
  }
};


var Funct = {
  id: 'funct_id',
  wind: null,
  functs: [],
  isActive: false,
  load: async function (url) {
    try {
      const resp = await fetch(url, {
        method: 'GET',
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        cache: "default"
      });
      if (!resp.ok) {
        throw new Error(`Erroe:${resp.status} ${resp.statusText}`);
      }
      const data = await resp.text();
      const rows = data.trim().split("\n");
      return rows.filter((x) => x != '-');
    } catch (error) {
      alert(`Errror:${url}\n ${error}`);
      throw error;
    }
  },
  build: async function () {
    const jt = UaJth();
    const fs = await this.load(`static/cfg/funct.csv`);
    jt.append(`
    <div class="menu_wnd">
    <ul>
    <li>
    <a class="tipb" onclick="Funct.unselect()" href="#">Unselect
       <span class="tiptextb">Unselect Fields Selected</span>  </a>
    </li>
    <li><a onclick="Funct.close()"  href="#">X</a></li>  
    </ul>
    </div>
    <div class="funct">`);

    jt.append("<div><ul>")
    jt.append(`<li class="f"><span>Func</span></li> `);
    for (let row of fs)
      jt.append(`<li class="f"><a>${row}</a></li> `);
    jt.append(`</ul></div>`);

    jt.append("</div>")
    const html = jt.html();
    if (!this.wind) {
      this.wind = UaWindowAdm.create(this.id, "ulaquery_id");
      this.setXY();
      this.wind.drag();
      this.wind.setZ(z_funct);
      this.wind.addGroup(filter_group);
    }
    this.wind.setHtml(html);
    this.bind();
  },
  close: function () {
    if (!this.wind) return;
    this.wind.hide();
    this.isActive = false;
  },
  open: function () {
    if (!this.wind) return;
    this.wind.show();
    this.isActive = true;
  },
  show: function (url) {
    if (!this.wind) return;
    if (this.isActive)
      this.wind.show();
  },
  hide: function () {
    if (!this.wind) return;
    if (this.isActive)
      this.wind.hide();
  },
  setXY: function () {
    this.wind.setXY(funct_left, funct_top, -1);
  },
  resetXY: function () {
    this.wind.reset();
    this.setXY();
    this.open();
  },
  bind: function () {
    const attrs = this.wind.w.querySelectorAll("div.funct li a");
    for (let a of attrs) {
      a.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        const t = ev.target;
        if (t.classList.contains("select"))
          t.classList.remove("select");
        else
          t.classList.add("select");
        FLT.select();
      });
    }
  },
  unselect: function () {
    const attrs = this.wind.w.querySelectorAll("div.funct li a");
    for (let a of attrs) {
      a.classList.remove("select");
    }
    FLT.select();
  },
  select: function () {
    const fn = (ats) => {
      const arr = Array.from(ats);
      const lst = arr.filter(a => a.classList.contains("select")).map(a => a.innerHTML);
      return lst;
    };
    let attrs = this.wind.w.querySelectorAll("div.funct li.f a");
    this.functs = fn(attrs);
  }
};

var LangDate = {
  id: 'langdate_id',
  wind: null,
  langs: [],
  dates: [],
  isActive: false,
  load: async function (url) {
    try {
      const resp = await fetch(url, {
        method: 'GET',
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        cache: "default"
      });
      if (!resp.ok) {
        throw new Error(`Erroe:${resp.status} ${resp.statusText}`);
      }
      const data = await resp.text();
      const rows = data.trim().split("\n");
      return rows.filter((x) => x != '-');
    } catch (error) {
      alert(`Errror:${url}\n ${error}`);
      throw error;
    }
  },
  build: async function () {
    const jt = UaJth();
    const ls = await this.load(`static/cfg/lang.csv`);
    const ds = await this.load(`static/cfg/ldata.csv`);
    jt.append(`
    <div class="menu_wnd">
    <ul>
    <li>
    <a class="tipb" onclick="LangDate.unselect()" href="#">Unselect
       <span class="tiptextb">Unselect Fields Selected</span>  </a>
    </li>
    <li><a onclick="LangDate.close()"  href="#">X</a></li>  
    </ul>
    </div>
    <div class="lang_date">`);

    jt.append("<div><ul>")
    jt.append(`<li class="l"><span>Lang</span></li> `);
    for (let row of ls)
      jt.append(`<li class="l"><a>${row}</a></li> `);
    jt.append(`</ul></div>`);

    jt.append("<div><ul>")
    jt.append(`<li class="d"><span>Date</span></li> `);
    for (let row of ds)
      jt.append(`<li class="d"><a>${row}</a></li> `);
    jt.append(`</ul></div>`);

    jt.append("</div>")
    const html = jt.html();
    if (!this.wind) {
      this.wind = UaWindowAdm.create(this.id, "ulaquery_id");
      this.setXY();
      this.wind.drag();
      this.wind.setZ(z_lang_date);
      this.wind.addGroup(filter_group);
    }
    this.wind.setHtml(html);
    this.bind();
  },
  close: function () {
    if (!this.wind) return;
    this.wind.hide();
    this.isActive = false;
  },
  open: function () {
    if (!this.wind) return;
    this.wind.show();
    this.isActive = true;
  },
  show: function (url) {
    if (!this.wind) return;
    if (this.isActive)
      this.wind.show();
  },
  hide: function () {
    if (!this.wind) return;
    if (this.isActive)
      this.wind.hide();
  },
  setXY: function () {
    this.wind.setXY(lang_date_left, lang_date_top, -1);
  },
  resetXY: function () {
    this.wind.reset();
    this.setXY();
    this.open();
  },
  bind: function () {
    const attrs = this.wind.w.querySelectorAll("div.lang_date li a");
    for (let a of attrs) {
      a.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        const t = ev.target;
        if (t.classList.contains("select"))
          t.classList.remove("select");
        else
          t.classList.add("select");
        FLT.select();
      });
    }
  },
  unselect: function () {
    const attrs = this.wind.w.querySelectorAll("div.lang_date li a");
    for (let a of attrs) {
      a.classList.remove("select");
    }
    FLT.select();
  },
  select: function () {
    const fn = (ats) => {
      const arr = Array.from(ats);
      const lst = arr.filter(a => a.classList.contains("select")).map(a => a.innerHTML);
      return lst;
    };
    let attrs = this.wind.w.querySelectorAll("div.lang_date li.l a");
    this.langs = fn(attrs);
    attrs = this.wind.w.querySelectorAll("div.lang_date li.d a");
    this.dates = fn(attrs);
  }
};

var PosMsd = {
  id: 'pos_msd_id',
  isActive: false,
  wind: null,
  msd_attrs: {},
  load: async function () {
    const url = `static/cfg/pos_msd.csv`;
    try {
      const resp = await fetch(url, {
        method: 'GET',
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        cache: "default"
      });
      if (!resp.ok) {
        throw new Error(`Erroe:${resp.status} ${resp.statusText}`);
      }
      const data = await resp.text();
      const rows = data.trim().split("\n");
      return rows.map((x) => x.split("|"));
    } catch (error) {
      alert(`Errror:${url}\n ${error}`);
      throw error;
    }
  },
  build: async function () {
    const rows = await this.load();
    // elimina la riga di intestazione
    rows.shift()
    const jt1 = UaJth();
    const jt0 = UaJth();
    jt0.append(`
    <div class="menu_wnd">
    <ul>
    <li>
    <a class="tipb" onclick="PosMsd.unselect()" href="#">nselect
       <span class="tiptextb">Unselect Fields Selected</span>
     </a>
    </li>
    <li><a onclick="PosMsd.close()"  href="#">X</a></li>  
    </ul>
    </div>
    <div class="pos_msd">
    <ul class="pos">`);
    let pos = 'XX';
    for (let row of rows) {
      if (row[3].trim() == '') continue;
      const attrs = row[3].split(',');
      const msd = row[2]
      jt1.reset();
      jt1.append(`<li><div><ul>`)

      if (row[0] != pos) {
        pos = row[0];
        jt1.append(`<li class="p"><span>${pos}</span></li>`);
      }
      else
        jt1.append(`<li class="e"></li>`);

      jt1.append(`<li class="m"><span>${msd}</span></li>`);
      for (let x of attrs)
        jt1.append(`<li class="a"><a>${x}</a></li>`);

      jt1.append(`</ul></div></li>`)
      const h = jt1.html()
      jt0.append(`${h}`);
    }
    jt0.append("</ul></div>")
    const html = jt0.html();
    if (!this.wind) {
      this.wind = UaWindowAdm.create(this.id, "ulaquery_id");
      this.setXY();
      this.wind.drag();
      this.wind.setZ(z_pos_msd);
      this.wind.addGroup(filter_group);
    }
    this.wind.setHtml(html);
    this.bind();
  },
  close: function () {
    if (!this.wind) return;
    this.wind.hide();
    this.isActive = false;
  },
  open: function () {
    if (!this.wind) return;
    this.wind.show();
    this.isActive = true;
  },
  show: function (url) {
    if (!this.wind) return;
    if (this.isActive)
      this.wind.show();
  },
  hide: function () {
    if (!this.wind) return;
    if (this.isActive)
      this.wind.hide();
  },
  setXY: function () {
    // const left = 600;
    // const top = top_filter;
    this.wind.setXY(pos_msd_left, pos_msd_top, -1);
  },
  resetXY: function () {
    this.wind.reset();
    this.setXY();
    this.open();
  },
  bind: function () {
    const attrs = this.wind.w.querySelectorAll("div.pos_msd li.a a");
    for (let a of attrs) {
      a.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        const t = ev.currentTarget;
        if (t.classList.contains("select"))
          t.classList.remove("select");
        else
          t.classList.add("select");
        FLT.select();
      });
    }
  },
  select: function () {
    const rows = [];
    const lims = Array.from(this.wind.w.querySelectorAll("div.pos_msd li.m"));
    let pos = '';
    for (const m of lims) {
      const pr = m.parentElement;
      const p = pr.querySelector("li.p span");
      if (!!p) pos = p.innerHTML;
      const msd = m.querySelector("span").innerHTML;
      const lias = Array.from(pr.querySelectorAll("li.a a.select"));
      const row = [];
      for (const la of lias) {
        const h = la.innerHTML;
        row.push(h)
      }
      if (row.length > 0) {
        const pm = `${pos.toLowerCase()}_${msd}`;
        row.unshift(pm)
        rows.push(row);
      }
    }
    this.msd_attrs = rows;
    // this.msd_attrs = {};
    // for (let row of rows)
    //   this.msd_attrs[row[0]] = row.slice(1);
  },
  unselect: function () {
    const attrs = this.wind.w.querySelectorAll("div.pos_msd li.a a");
    for (let a of attrs) {
      a.classList.remove("select");
    }
    FLT.select();
  }
};
