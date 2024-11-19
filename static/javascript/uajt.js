
// var UaJt = function () {
//   return {
//     lines: [],
//     sepL: "{",
//     sepR: "}",
//     reset: function () {
//       this.lines = [];
//       return this;
//     },
//     delimiters: function (sL, sR) {
//       this.sepL = sL;
//       this.sepR = sR;
//       return this;
//     },
//     insert: function (templ, data) {
//       let t = !data ? templ : this.render(templ, data);
//       this.lines.unshift(t);
//       return this;
//     },
//     append: function (templ, data) {
//       let t = !data ? templ : this.render(templ, data);
//       this.lines.push(t);
//       return this;
//     },
//     render: function (templ, data) {
//       let spl = templ.split(this.sepL);
//       let arr = [spl[0]];
//       let i, j, x, ks, k, v, le;
//       for (i = 1; i < spl.length; i++) {
//         x = spl[i].split(this.sepR);
//         ks = x[0].trim().split(".");
//         le = ks.length;
//         for (j = 0; j < le; j++) {
//           k = ks[j];
//           v = data[k];
//         }
//         if (v === undefined) v = this.sepL + ks.join(".") + ":undefined" + this.sepR;
//         else if (!v && v !== 0) v = v || "";
//         else if (typeof v === "object") v = this.sepL + ks.join(".") + ":json Error" + this.sepR;
//         arr.push(v);
//         arr.push(x[1]);
//       }
//       return arr.join("");
//     },
//     text: function (linesep) {
//       const sep = linesep || "";
//       return this.lines.join(sep);
//     },
//     html: function (linesep) {
//       let s = this.text(linesep);
//       return s.replace(/\s+|\[rn]/g, " ");
//     },
//   };
// };

var UaJth = function () {
  return {
    rows: [],
    reset() {
      this.rows = [];
      return this;
    },
    insert(templ, ...args) {
      let t = args.length == 0 ? templ : templ(...args);
      this.rows.unshift(t);
      return this;
    },
    append(templ, ...args) {
      let t = args.length == 0 ? templ : templ(...args);
      this.rows.push(t);
      return this;
    },
    text(linesep) {
      const sep = linesep || "";
      return this.rows.join(sep);
    },
    html(linesep) {
      const s = this.text(linesep);
      return s.replace(/\s+|\[rn]/g, " ");
    }
  };
};
