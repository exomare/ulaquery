

"use strict"

  // var D_M = (function () {
  ; (function () {

    const FORMA = 0, LEMMA = 1, ETIMO = 2, SIGL = 26,
      POS = 6, FUNCT = 7, LANG = 4, DATE = 5;

    const DM = {
      dict_rows: [],
      dict_heads: [],
      dict_map_columns: {},

      dict_rsl_rows: [],
      dict_rsl_heads: [],

      token_list: {},
      token_selected: [],

      load_dict: async function () {
        const url = `ula_data/data_export/dictionary.ula.csv`;
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

          this.dict_rows = rows.map((x) => x.trim().split("|"));
          this.dict_heads = this.dict_rows[0];
          const columns = this.dict_heads.map(x => x.toLowerCase());
          this.dict_map_columns = columns.reduce((acc, element, index) => {
            acc[element] = index;
            return acc;
          }, {});
          this.dict_rows.shift();
          // setta l'arry di righe del result set
          this.dictToResultSet();
        } catch (error) {
          alert(`Errror:${url}\n ${error}`);
          throw error;
        }
      },
      dictToResultSet: function () {
        const row = this.dict_heads;
        const i0_attrs = 8;
        const i0_sigls = row.findIndex((e, i) => i > 20 && e.length == 1);
        const i0_locts = row.findIndex((e, i) => i > i0_sigls && e.startsWith("LOC"));
        const i0_datets = row.findIndex((e, i) => i > i0_locts && e.startsWith("DAT"));

        // intestazione resultset
        this.dict_rsl_heads = this.dict_heads.slice(0, i0_attrs);
        this.dict_rsl_heads.push("MSD");
        this.dict_rsl_heads.push("SIGL.");
        this.dict_rsl_heads.push("LOC.");
        this.dict_rsl_heads.push("DATE");

        const dict2rslt = (r) => {
          const r0 = r.slice(0, i0_attrs);
          let row = Array.from(r0);
          // attrs
          let arr = r.slice(i0_attrs, i0_sigls);
          let s = arr.filter(x => x !== '').join(',');
          row.push(s);
          // sigls
          arr = r.slice(i0_sigls, i0_locts);
          s = arr.filter(x => x !== '').join(',');
          row.push(s);
          // locts
          arr = r.slice(i0_locts, i0_datets);
          s = arr.filter(x => x !== '').join(',');
          row.push(s);
          // datets
          arr = r.slice(i0_datets);
          s = arr.filter(x => x !== '').join(',');
          row.push(s);
          return row;
        }
        this.dict_rsl_rows = [];
        for (const row of this.dict_rows) {
          const r = dict2rslt(row);
          this.dict_rsl_rows.push(r);
        }
      },
      findIndnxFormakey: function (formakey) {
        let index = -1;
        for (let i = 0; i < this.dict_rows.length; i++) {
          if (this.dict_rows[i][1] === formakey) {
            index = i;
            break;
          }
        }
        return index;
      },
      findIndices: function (js) {

        const match = (ptrn, str) => {
          if (ptrn == "") return true;
          const esc = ptrn.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
          const rgx = esc.replace(/\\\*/g, ".*");
          const p = rgx.replace(/\\\?/g, ".");
          const regex = new RegExp(`^${p}$`);
          return regex.test(str);
        }

        const indices = [];
        const dle = this.dict_rows.length;
        for (let i = 0; i < dle; i++) {
          const row = this.dict_rows[i].map(x => x.toLowerCase());
          let ok = true;

          let s = js.forma[1];
          if (s != '') {
            const c = js.forma[0];
            const v = row[c];
            ok = match(s, v);
          }
          if (!ok) continue;

          s = js.lemma[1];
          if (s != '') {
            const c = js.lemma[0];
            const v = row[c];
            const ok = match(s, v);
          }
          if (!ok) continue;

          s = js.etimo[1];
          if (s != '') {
            const c = js.etimo[0];
            const v = row[c];
            ok = match(s, v);
          }
          if (!ok) continue;

          //SIGL
          for (const cs of js.sigls) {
            const c = cs[0];
            const s = cs[1];
            const v = row[c];
            if (s != '' && s != v) {
              ok = false;
              break;
            }
          }
          if (!ok) continue;

          for (const cs of js.locts) {
            const c = cs[0];
            const s = cs[1];
            const v = row[c];
            if (s != '' && s != v) {
              ok = false;
              break;
            }
          }
          if (!ok) continue;

          for (const cs of js.datets) {
            const c = cs[0];
            const s = cs[1];
            const v = row[c];
            if (s != '' && s != v) {
              ok = false;
              break;
            }
          }
          if (!ok) continue;

          let arr = js.functs[1];
          if (arr.length > 0) {
            const c = js.functs[0];
            const v = row[c];
            if (!arr.includes(v)) {
              ok = false;
            }
          }
          if (!ok) continue;

          arr = js.langs[1];
          if (arr.length > 0) {
            const c = js.langs[0];
            const v = row[c];
            if (!arr.includes(v)) {
              ok = false;
            }
          }
          if (!ok) continue;

          arr = js.dates[1];
          if (arr.length > 0) {
            const c = js.dates[0];
            const v = row[c];
            if (!arr.includes(v)) {
              ok = false;
            }
          }
          if (!ok) continue;

          arr = js.pos[1];
          if (arr.length > 0) {
            const c = js.pos[0];
            const v = row[c];
            if (!arr.includes(v)) {
              ok = false;
            }
          }
          if (!ok) continue;

          arr = js.msd_attrs;
          if (arr.length > 0)
            for (const css of arr) {
              const c = css[0];
              const ss = css[1];
              const v = row[c];
              if (!ss.includes(v)) {
                ok = false;
                break;
              }
            }
          if (!ok) continue;

          if (ok)
            indices.push(i);
        }

        return indices;
      },
      findRsltRows: function (js) {
        const idxs = this.findIndices(js);
        const rows = [];
        for (const i of idxs)
          rows.push(this.dict_rsl_rows[i]);
        // rows.push([i, ...this.dict_rsl_rows[i]]);
        return rows;
      },
      findDictRows: function (js) {
        const idxs = this.findIndices(js);
        const rows = [];
        for (const i of idxs)
          rows.push(this.dict_rows[i]);
        // rows.push([i, ...this.dict_rsl_rows[i]]);
        return rows;
      },
      setQueryConditions: function () {
        const js = {
          "forma": [],//[col,str]
          "lemma": [],
          "etimo": [],

          "sigls": [],//[[col0,str0],[col1,str1], ..]
          "locts": [],
          "datets": [],

          "functs": [],//[col,[str0,str1,..] ]
          "langs": [],
          "dates": [],

          "pos": [], //[col,[str0,str1,..]]

          "msd_attrs": []  //[col0,[str0,str1,..],[col1,[s0,s1,..],..]]
        }
        // gestione opzioni inpput forma,lemma,etimo
        js.forma = [FORMA, VS.forma];
        js.lemma = [LEMMA, VS.lemma];
        js.etimo = [ETIMO, VS.etimo];

        // sigls
        let les = VS.sigl.sigls.length;
        let i0 = SIGL;
        let rs = [];
        for (let i = 0; i < les; i++) {
          const r = [i + i0, VS.sigl.sigls[i]];
          rs.push(r);
        }
        js.sigls = rs;

        // locts
        let lel = VS.sigl.locts.length;
        let i1 = i0 + les;
        rs = [];
        for (let i = 0; i < lel; i++) {
          const r = [i + i1, VS.sigl.locts[i]];
          rs.push(r);
        }
        js.locts = rs;

        // datets 
        let led = VS.sigl.datets.length;
        let i2 = i1 + lel;
        rs = [];
        for (let i = 0; i < led; i++) {
          const r = [i + i2, VS.sigl.datets[i]];
          rs.push(r);
        }
        js.datets = rs;

        // functs
        js.functs = [FUNCT, VS.funct.functs];

        // angs,dates
        js.langs = [LANG, VS.lang_date.langs];
        js.dates = [DATE, VS.lang_date.dates];

        // gestone filtro POS MSD attrs
        let pos_arr = [];
        rs = []
        for (let row of VS.msd_attrs) {
          row = row.map(x => x.toLowerCase());
          const xy = row[0].split("_");
          const pos = xy[0];
          const msd = xy[1].toLowerCase();
          const attrs = row.slice(1);
          const col = this.dict_map_columns[msd];
          const r = [col, attrs]
          rs.push(r);
          if (pos_arr.indexOf(pos) < 0)
            pos_arr.push(pos);
        }
        js.pos = [POS, pos_arr]
        js.msd_attrs = rs;

        let s = JSON.stringify(js).toLowerCase();
        return JSON.parse(s);
      },
      load_token_csv: async function (token_name) {
        const url = `ula_data/data_export/${token_name}`;
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
          const tokens = data.trim().split("\n");
          tokens.push('##|##');
          let text_row = [];
          const text_rows = [];
          for (const item of tokens) {
            const formakey = item.split('|')[1];
            if (formakey !== "##") {
              text_row.push(formakey);
            } else {
              text_rows.push(text_row);
              text_row = [];
            }
          }
          return text_rows;
        } catch (error) {
          alert(`Errror:${url}\n ${error}`);
          throw error;
        }
      },
      load_text_list: async function () {
        const url = `ula_data/data_export/token_list.txt`;
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
          const names = data.trim().split("\n");
          return names
        } catch (error) {
          alert(`Errror:${url}\n ${error}`);
          throw error;
        }
      },
      findContextIndices: function (formakey, token_name) {
        const rows = this.token_list[token_name];
        const indices = rows.reduce((indexes, row, index) => {
          if (row.indexOf(formakey) > -1) {
            indexes.push(index);
          }
          return indexes;
        }, []);
        return indices;
      },
      findContextRows: function (formakey, token_name) {
        const indexs = this.findContextIndices(formakey, token_name);
        const arr_token = this.token_list[token_name];
        const text_rows = [];
        for (const i of indexs) {
          const row = arr_token[i];
          // setta il numero di riga originale
          row.unshift(`${i}`);
          text_rows.push(row);
        }
        return text_rows;
      },
      load_tokens: async function () {
        const token_paths = await D_M.load_text_list();
        for (const file_path of token_paths) {
          const arr = await D_M.load_token_csv(file_path);
          // eps19.g.ula.csv => eps0_g elimina il punto nel nome file
          const token_name = file_path.split('.').slice(0, 2).join('_');
          this.token_list[token_name] = arr;
        }
        // TODO AAAs
        const names = Object.keys(this.token_list);
        this.token_selected.push(names[0]);
        this.token_selected.push(names[2]);
      }
    };
    window.D_M = DM;
  }).call(this);

/*
my=(function(){
 ...
 return{
  name1:nameInt1,
  name2:nameInt2,
  ...
 }
}).call(this);
   oppure
})();
uso:
my.name1(...);
my.name2(,,)
*/