"use strict";
var pmtiles = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __pow = Math.pow;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // index.ts
  var js_exports = {};
  __export(js_exports, {
    Compression: () => Compression,
    EtagMismatch: () => EtagMismatch,
    FetchSource: () => FetchSource,
    FileSource: () => FileSource,
    PMTiles: () => PMTiles,
    Protocol: () => Protocol,
    ResolvedValueCache: () => ResolvedValueCache,
    SharedPromiseCache: () => SharedPromiseCache,
    TileType: () => TileType,
    bytesToHeader: () => bytesToHeader,
    findTile: () => findTile,
    getUint64: () => getUint64,
    leafletRasterLayer: () => leafletRasterLayer,
    readVarint: () => readVarint,
    tileIdToZxy: () => tileIdToZxy,
    tileTypeExt: () => tileTypeExt,
    zxyToTileId: () => zxyToTileId
  });

  // node_modules/fflate/esm/browser.js
  var u8 = Uint8Array;
  var u16 = Uint16Array;
  var i32 = Int32Array;
  var fleb = new u8([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    4,
    4,
    4,
    4,
    5,
    5,
    5,
    5,
    0,
    /* unused */
    0,
    0,
    /* impossible */
    0
  ]);
  var fdeb = new u8([
    0,
    0,
    0,
    0,
    1,
    1,
    2,
    2,
    3,
    3,
    4,
    4,
    5,
    5,
    6,
    6,
    7,
    7,
    8,
    8,
    9,
    9,
    10,
    10,
    11,
    11,
    12,
    12,
    13,
    13,
    /* unused */
    0,
    0
  ]);
  var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
  var freb = function(eb, start) {
    var b = new u16(31);
    for (var i = 0; i < 31; ++i) {
      b[i] = start += 1 << eb[i - 1];
    }
    var r = new i32(b[30]);
    for (var i = 1; i < 30; ++i) {
      for (var j = b[i]; j < b[i + 1]; ++j) {
        r[j] = j - b[i] << 5 | i;
      }
    }
    return { b, r };
  };
  var _a = freb(fleb, 2);
  var fl = _a.b;
  var revfl = _a.r;
  fl[28] = 258, revfl[258] = 28;
  var _b = freb(fdeb, 0);
  var fd = _b.b;
  var revfd = _b.r;
  var rev = new u16(32768);
  for (i = 0; i < 32768; ++i) {
    x = (i & 43690) >> 1 | (i & 21845) << 1;
    x = (x & 52428) >> 2 | (x & 13107) << 2;
    x = (x & 61680) >> 4 | (x & 3855) << 4;
    rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
  }
  var x;
  var i;
  var hMap = function(cd, mb, r) {
    var s = cd.length;
    var i = 0;
    var l = new u16(mb);
    for (; i < s; ++i) {
      if (cd[i])
        ++l[cd[i] - 1];
    }
    var le = new u16(mb);
    for (i = 1; i < mb; ++i) {
      le[i] = le[i - 1] + l[i - 1] << 1;
    }
    var co;
    if (r) {
      co = new u16(1 << mb);
      var rvb = 15 - mb;
      for (i = 0; i < s; ++i) {
        if (cd[i]) {
          var sv = i << 4 | cd[i];
          var r_1 = mb - cd[i];
          var v = le[cd[i] - 1]++ << r_1;
          for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
            co[rev[v] >> rvb] = sv;
          }
        }
      }
    } else {
      co = new u16(s);
      for (i = 0; i < s; ++i) {
        if (cd[i]) {
          co[i] = rev[le[cd[i] - 1]++] >> 15 - cd[i];
        }
      }
    }
    return co;
  };
  var flt = new u8(288);
  for (i = 0; i < 144; ++i)
    flt[i] = 8;
  var i;
  for (i = 144; i < 256; ++i)
    flt[i] = 9;
  var i;
  for (i = 256; i < 280; ++i)
    flt[i] = 7;
  var i;
  for (i = 280; i < 288; ++i)
    flt[i] = 8;
  var i;
  var fdt = new u8(32);
  for (i = 0; i < 32; ++i)
    fdt[i] = 5;
  var i;
  var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
  var fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
  var max = function(a) {
    var m = a[0];
    for (var i = 1; i < a.length; ++i) {
      if (a[i] > m)
        m = a[i];
    }
    return m;
  };
  var bits = function(d, p, m) {
    var o = p / 8 | 0;
    return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
  };
  var bits16 = function(d, p) {
    var o = p / 8 | 0;
    return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
  };
  var shft = function(p) {
    return (p + 7) / 8 | 0;
  };
  var slc = function(v, s, e) {
    if (s == null || s < 0)
      s = 0;
    if (e == null || e > v.length)
      e = v.length;
    var n = new u8(e - s);
    n.set(v.subarray(s, e));
    return n;
  };
  var ec = [
    "unexpected EOF",
    "invalid block type",
    "invalid length/literal",
    "invalid distance",
    "stream finished",
    "no stream handler",
    ,
    "no callback",
    "invalid UTF-8 data",
    "extra field too long",
    "date not in range 1980-2099",
    "filename too long",
    "stream finishing",
    "invalid zip data"
    // determined by unknown compression method
  ];
  var err = function(ind, msg, nt) {
    var e = new Error(msg || ec[ind]);
    e.code = ind;
    if (Error.captureStackTrace)
      Error.captureStackTrace(e, err);
    if (!nt)
      throw e;
    return e;
  };
  var inflt = function(dat, st, buf, dict) {
    var sl = dat.length, dl = dict ? dict.length : 0;
    if (!sl || st.f && !st.l)
      return buf || new u8(0);
    var noBuf = !buf || st.i != 2;
    var noSt = st.i;
    if (!buf)
      buf = new u8(sl * 3);
    var cbuf = function(l2) {
      var bl = buf.length;
      if (l2 > bl) {
        var nbuf = new u8(Math.max(bl * 2, l2));
        nbuf.set(buf);
        buf = nbuf;
      }
    };
    var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
    var tbts = sl * 8;
    do {
      if (!lm) {
        final = bits(dat, pos, 1);
        var type = bits(dat, pos + 1, 3);
        pos += 3;
        if (!type) {
          var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
          if (t > sl) {
            if (noSt)
              err(0);
            break;
          }
          if (noBuf)
            cbuf(bt + l);
          buf.set(dat.subarray(s, t), bt);
          st.b = bt += l, st.p = pos = t * 8, st.f = final;
          continue;
        } else if (type == 1)
          lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
        else if (type == 2) {
          var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
          var tl = hLit + bits(dat, pos + 5, 31) + 1;
          pos += 14;
          var ldt = new u8(tl);
          var clt = new u8(19);
          for (var i = 0; i < hcLen; ++i) {
            clt[clim[i]] = bits(dat, pos + i * 3, 7);
          }
          pos += hcLen * 3;
          var clb = max(clt), clbmsk = (1 << clb) - 1;
          var clm = hMap(clt, clb, 1);
          for (var i = 0; i < tl; ) {
            var r = clm[bits(dat, pos, clbmsk)];
            pos += r & 15;
            var s = r >> 4;
            if (s < 16) {
              ldt[i++] = s;
            } else {
              var c = 0, n = 0;
              if (s == 16)
                n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
              else if (s == 17)
                n = 3 + bits(dat, pos, 7), pos += 3;
              else if (s == 18)
                n = 11 + bits(dat, pos, 127), pos += 7;
              while (n--)
                ldt[i++] = c;
            }
          }
          var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
          lbt = max(lt);
          dbt = max(dt);
          lm = hMap(lt, lbt, 1);
          dm = hMap(dt, dbt, 1);
        } else
          err(1);
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
      }
      if (noBuf)
        cbuf(bt + 131072);
      var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
      var lpos = pos;
      for (; ; lpos = pos) {
        var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
        pos += c & 15;
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
        if (!c)
          err(2);
        if (sym < 256)
          buf[bt++] = sym;
        else if (sym == 256) {
          lpos = pos, lm = null;
          break;
        } else {
          var add = sym - 254;
          if (sym > 264) {
            var i = sym - 257, b = fleb[i];
            add = bits(dat, pos, (1 << b) - 1) + fl[i];
            pos += b;
          }
          var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
          if (!d)
            err(3);
          pos += d & 15;
          var dt = fd[dsym];
          if (dsym > 3) {
            var b = fdeb[dsym];
            dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
          }
          if (pos > tbts) {
            if (noSt)
              err(0);
            break;
          }
          if (noBuf)
            cbuf(bt + 131072);
          var end = bt + add;
          if (bt < dt) {
            var shift2 = dl - dt, dend = Math.min(dt, end);
            if (shift2 + bt < 0)
              err(3);
            for (; bt < dend; ++bt)
              buf[bt] = dict[shift2 + bt];
          }
          for (; bt < end; bt += 4) {
            buf[bt] = buf[bt - dt];
            buf[bt + 1] = buf[bt + 1 - dt];
            buf[bt + 2] = buf[bt + 2 - dt];
            buf[bt + 3] = buf[bt + 3 - dt];
          }
          bt = end;
        }
      }
      st.l = lm, st.p = lpos, st.b = bt, st.f = final;
      if (lm)
        final = 1, st.m = lbt, st.d = dm, st.n = dbt;
    } while (!final);
    return bt == buf.length ? buf : slc(buf, 0, bt);
  };
  var et = /* @__PURE__ */ new u8(0);
  var gzs = function(d) {
    if (d[0] != 31 || d[1] != 139 || d[2] != 8)
      err(6, "invalid gzip data");
    var flg = d[3];
    var st = 10;
    if (flg & 4)
      st += (d[10] | d[11] << 8) + 2;
    for (var zs = (flg >> 3 & 1) + (flg >> 4 & 1); zs > 0; zs -= !d[st++])
      ;
    return st + (flg & 2);
  };
  var gzl = function(d) {
    var l = d.length;
    return (d[l - 4] | d[l - 3] << 8 | d[l - 2] << 16 | d[l - 1] << 24) >>> 0;
  };
  var zls = function(d, dict) {
    if ((d[0] & 15) != 8 || d[0] >> 4 > 7 || (d[0] << 8 | d[1]) % 31)
      err(6, "invalid zlib data");
    if ((d[1] >> 5 & 1) == +!dict)
      err(6, "invalid zlib data: " + (d[1] & 32 ? "need" : "unexpected") + " dictionary");
    return (d[1] >> 3 & 4) + 2;
  };
  function inflateSync(data, opts) {
    return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
  }
  function gunzipSync(data, opts) {
    var st = gzs(data);
    if (st + 8 > data.length)
      err(6, "invalid gzip data");
    return inflt(data.subarray(st, -8), { i: 2 }, opts && opts.out || new u8(gzl(data)), opts && opts.dictionary);
  }
  function unzlibSync(data, opts) {
    return inflt(data.subarray(zls(data, opts && opts.dictionary), -4), { i: 2 }, opts && opts.out, opts && opts.dictionary);
  }
  function decompressSync(data, opts) {
    return data[0] == 31 && data[1] == 139 && data[2] == 8 ? gunzipSync(data, opts) : (data[0] & 15) != 8 || data[0] >> 4 > 7 || (data[0] << 8 | data[1]) % 31 ? inflateSync(data, opts) : unzlibSync(data, opts);
  }
  var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
  var tds = 0;
  try {
    td.decode(et, { stream: true });
    tds = 1;
  } catch (e) {
  }

  // v2.ts
  var shift = (n, shift2) => {
    return n * __pow(2, shift2);
  };
  var unshift = (n, shift2) => {
    return Math.floor(n / __pow(2, shift2));
  };
  var getUint24 = (view, pos) => {
    return shift(view.getUint16(pos + 1, true), 8) + view.getUint8(pos);
  };
  var getUint48 = (view, pos) => {
    return shift(view.getUint32(pos + 2, true), 16) + view.getUint16(pos, true);
  };
  var compare = (tz, tx, ty, view, i) => {
    if (tz !== view.getUint8(i))
      return tz - view.getUint8(i);
    const x = getUint24(view, i + 1);
    if (tx !== x)
      return tx - x;
    const y = getUint24(view, i + 4);
    if (ty !== y)
      return ty - y;
    return 0;
  };
  var queryLeafdir = (view, z, x, y) => {
    const offsetLen = queryView(view, z | 128, x, y);
    if (offsetLen) {
      return {
        z,
        x,
        y,
        offset: offsetLen[0],
        length: offsetLen[1],
        isDir: true
      };
    }
    return null;
  };
  var queryTile = (view, z, x, y) => {
    const offsetLen = queryView(view, z, x, y);
    if (offsetLen) {
      return {
        z,
        x,
        y,
        offset: offsetLen[0],
        length: offsetLen[1],
        isDir: false
      };
    }
    return null;
  };
  var queryView = (view, z, x, y) => {
    let m = 0;
    let n = view.byteLength / 17 - 1;
    while (m <= n) {
      const k = n + m >> 1;
      const cmp = compare(z, x, y, view, k * 17);
      if (cmp > 0) {
        m = k + 1;
      } else if (cmp < 0) {
        n = k - 1;
      } else {
        return [getUint48(view, k * 17 + 7), view.getUint32(k * 17 + 13, true)];
      }
    }
    return null;
  };
  var entrySort = (a, b) => {
    if (a.isDir && !b.isDir) {
      return 1;
    }
    if (!a.isDir && b.isDir) {
      return -1;
    }
    if (a.z !== b.z) {
      return a.z - b.z;
    }
    if (a.x !== b.x) {
      return a.x - b.x;
    }
    return a.y - b.y;
  };
  var parseEntry = (dataview, i) => {
    const zRaw = dataview.getUint8(i * 17);
    const z = zRaw & 127;
    return {
      z,
      x: getUint24(dataview, i * 17 + 1),
      y: getUint24(dataview, i * 17 + 4),
      offset: getUint48(dataview, i * 17 + 7),
      length: dataview.getUint32(i * 17 + 13, true),
      isDir: zRaw >> 7 === 1
    };
  };
  var sortDir = (a) => {
    const entries = [];
    const view = new DataView(a);
    for (let i = 0; i < view.byteLength / 17; i++) {
      entries.push(parseEntry(view, i));
    }
    return createDirectory(entries);
  };
  var createDirectory = (entries) => {
    entries.sort(entrySort);
    const buffer = new ArrayBuffer(17 * entries.length);
    const arr = new Uint8Array(buffer);
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      let z = entry.z;
      if (entry.isDir)
        z = z | 128;
      arr[i * 17] = z;
      arr[i * 17 + 1] = entry.x & 255;
      arr[i * 17 + 2] = entry.x >> 8 & 255;
      arr[i * 17 + 3] = entry.x >> 16 & 255;
      arr[i * 17 + 4] = entry.y & 255;
      arr[i * 17 + 5] = entry.y >> 8 & 255;
      arr[i * 17 + 6] = entry.y >> 16 & 255;
      arr[i * 17 + 7] = entry.offset & 255;
      arr[i * 17 + 8] = unshift(entry.offset, 8) & 255;
      arr[i * 17 + 9] = unshift(entry.offset, 16) & 255;
      arr[i * 17 + 10] = unshift(entry.offset, 24) & 255;
      arr[i * 17 + 11] = unshift(entry.offset, 32) & 255;
      arr[i * 17 + 12] = unshift(entry.offset, 48) & 255;
      arr[i * 17 + 13] = entry.length & 255;
      arr[i * 17 + 14] = entry.length >> 8 & 255;
      arr[i * 17 + 15] = entry.length >> 16 & 255;
      arr[i * 17 + 16] = entry.length >> 24 & 255;
    }
    return buffer;
  };
  var deriveLeaf = (view, tile) => {
    if (view.byteLength < 17)
      return null;
    const numEntries = view.byteLength / 17;
    const entry = parseEntry(view, numEntries - 1);
    if (entry.isDir) {
      const leafLevel = entry.z;
      const levelDiff = tile.z - leafLevel;
      const leafX = Math.trunc(tile.x / (1 << levelDiff));
      const leafY = Math.trunc(tile.y / (1 << levelDiff));
      return { z: leafLevel, x: leafX, y: leafY };
    }
    return null;
  };
  function getHeader(source) {
    return __async(this, null, function* () {
      const resp = yield source.getBytes(0, 512e3);
      const dataview = new DataView(resp.data);
      const jsonSize = dataview.getUint32(4, true);
      const rootEntries = dataview.getUint16(8, true);
      const dec = new TextDecoder("utf-8");
      const jsonMetadata = JSON.parse(
        dec.decode(new DataView(resp.data, 10, jsonSize))
      );
      let tileCompression = 0 /* Unknown */;
      if (jsonMetadata.compression === "gzip") {
        tileCompression = 2 /* Gzip */;
      }
      let minzoom = 0;
      if ("minzoom" in jsonMetadata) {
        minzoom = +jsonMetadata.minzoom;
      }
      let maxzoom = 0;
      if ("maxzoom" in jsonMetadata) {
        maxzoom = +jsonMetadata.maxzoom;
      }
      let centerLon = 0;
      let centerLat = 0;
      let centerZoom = 0;
      let minLon = -180;
      let minLat = -85;
      let maxLon = 180;
      let maxLat = 85;
      if (jsonMetadata.bounds) {
        const split = jsonMetadata.bounds.split(",");
        minLon = +split[0];
        minLat = +split[1];
        maxLon = +split[2];
        maxLat = +split[3];
      }
      if (jsonMetadata.center) {
        const split = jsonMetadata.center.split(",");
        centerLon = +split[0];
        centerLat = +split[1];
        centerZoom = +split[2];
      }
      const header = {
        specVersion: dataview.getUint16(2, true),
        rootDirectoryOffset: 10 + jsonSize,
        rootDirectoryLength: rootEntries * 17,
        jsonMetadataOffset: 10,
        jsonMetadataLength: jsonSize,
        leafDirectoryOffset: 0,
        leafDirectoryLength: void 0,
        tileDataOffset: 0,
        tileDataLength: void 0,
        numAddressedTiles: 0,
        numTileEntries: 0,
        numTileContents: 0,
        clustered: false,
        internalCompression: 1 /* None */,
        tileCompression,
        tileType: 1 /* Mvt */,
        minZoom: minzoom,
        maxZoom: maxzoom,
        minLon,
        minLat,
        maxLon,
        maxLat,
        centerZoom,
        centerLon,
        centerLat,
        etag: resp.etag
      };
      return header;
    });
  }
  function getZxy(header, source, cache, z, x, y, signal) {
    return __async(this, null, function* () {
      let rootDir = yield cache.getArrayBuffer(
        source,
        header.rootDirectoryOffset,
        header.rootDirectoryLength,
        header
      );
      if (header.specVersion === 1) {
        rootDir = sortDir(rootDir);
      }
      const entry = queryTile(new DataView(rootDir), z, x, y);
      if (entry) {
        const resp = yield source.getBytes(entry.offset, entry.length, signal);
        let tileData = resp.data;
        const view = new DataView(tileData);
        if (view.getUint8(0) === 31 && view.getUint8(1) === 139) {
          tileData = decompressSync(new Uint8Array(tileData));
        }
        return {
          data: tileData
        };
      }
      const leafcoords = deriveLeaf(new DataView(rootDir), { z, x, y });
      if (leafcoords) {
        const leafdirEntry = queryLeafdir(
          new DataView(rootDir),
          leafcoords.z,
          leafcoords.x,
          leafcoords.y
        );
        if (leafdirEntry) {
          let leafDir = yield cache.getArrayBuffer(
            source,
            leafdirEntry.offset,
            leafdirEntry.length,
            header
          );
          if (header.specVersion === 1) {
            leafDir = sortDir(leafDir);
          }
          const tileEntry = queryTile(new DataView(leafDir), z, x, y);
          if (tileEntry) {
            const resp = yield source.getBytes(
              tileEntry.offset,
              tileEntry.length,
              signal
            );
            let tileData = resp.data;
            const view = new DataView(tileData);
            if (view.getUint8(0) === 31 && view.getUint8(1) === 139) {
              tileData = decompressSync(new Uint8Array(tileData));
            }
            return {
              data: tileData
            };
          }
        }
      }
      return void 0;
    });
  }
  var v2_default = {
    getHeader,
    getZxy
  };

  // adapters.ts
  var leafletRasterLayer = (source, options) => {
    let loaded = false;
    let mimeType = "";
    const cls = L.GridLayer.extend({
      createTile: (coord, done) => {
        const el = document.createElement("img");
        const controller = new AbortController();
        const signal = controller.signal;
        el.cancel = () => {
          controller.abort();
        };
        if (!loaded) {
          source.getHeader().then((header) => {
            if (header.tileType === 1 /* Mvt */) {
              console.error(
                "Error: archive contains MVT vector tiles, but leafletRasterLayer is for displaying raster tiles. See https://github.com/protomaps/PMTiles/tree/main/js for details."
              );
            } else if (header.tileType === 2) {
              mimeType = "image/png";
            } else if (header.tileType === 3) {
              mimeType = "image/jpeg";
            } else if (header.tileType === 4) {
              mimeType = "image/webp";
            } else if (header.tileType === 5) {
              mimeType = "image/avif";
            }
          });
          loaded = true;
        }
        source.getZxy(coord.z, coord.x, coord.y, signal).then((arr) => {
          if (arr) {
            const blob = new Blob([arr.data], { type: mimeType });
            const imageUrl = window.URL.createObjectURL(blob);
            el.src = imageUrl;
            el.cancel = void 0;
            done(void 0, el);
          }
        }).catch((e) => {
          if (e.name !== "AbortError") {
            throw e;
          }
        });
        return el;
      },
      _removeTile: function(key) {
        const tile = this._tiles[key];
        if (!tile) {
          return;
        }
        if (tile.el.cancel)
          tile.el.cancel();
        tile.el.width = 0;
        tile.el.height = 0;
        tile.el.deleted = true;
        L.DomUtil.remove(tile.el);
        delete this._tiles[key];
        this.fire("tileunload", {
          tile: tile.el,
          coords: this._keyToTileCoords(key)
        });
      }
    });
    return new cls(options);
  };
  var v3compat = (v4) => (requestParameters, arg2) => {
    if (arg2 instanceof AbortController) {
      return v4(requestParameters, arg2);
    }
    const abortController = new AbortController();
    v4(requestParameters, abortController).then(
      (result) => {
        return arg2(
          void 0,
          result.data,
          result.cacheControl || "",
          result.expires || ""
        );
      },
      (err2) => {
        return arg2(err2);
      }
    ).catch((e) => {
      return arg2(e);
    });
    return { cancel: () => abortController.abort() };
  };
  var Protocol = class {
    /**
     * Initialize the MapLibre PMTiles protocol.
     *
     * * metadata: also load the metadata section of the PMTiles. required for some "inspect" functionality
     * and to automatically populate the map attribution. Requires an extra HTTP request.
     */
    constructor(options) {
      /** @hidden */
      this.tilev4 = (params, abortController) => __async(this, null, function* () {
        if (params.type === "json") {
          const pmtilesUrl2 = params.url.substr(10);
          let instance2 = this.tiles.get(pmtilesUrl2);
          if (!instance2) {
            instance2 = new PMTiles(pmtilesUrl2);
            this.tiles.set(pmtilesUrl2, instance2);
          }
          if (this.metadata) {
            return {
              data: yield instance2.getTileJson(params.url)
            };
          }
          const h = yield instance2.getHeader();
          return {
            data: {
              tiles: [`${params.url}/{z}/{x}/{y}`],
              minzoom: h.minZoom,
              maxzoom: h.maxZoom,
              bounds: [h.minLon, h.minLat, h.maxLon, h.maxLat]
            }
          };
        }
        const re = new RegExp(/pmtiles:\/\/(.+)\/(\d+)\/(\d+)\/(\d+)/);
        const result = params.url.match(re);
        if (!result) {
          throw new Error("Invalid PMTiles protocol URL");
        }
        const pmtilesUrl = result[1];
        let instance = this.tiles.get(pmtilesUrl);
        if (!instance) {
          instance = new PMTiles(pmtilesUrl);
          this.tiles.set(pmtilesUrl, instance);
        }
        const z = result[2];
        const x = result[3];
        const y = result[4];
        const header = yield instance.getHeader();
        const resp = yield instance == null ? void 0 : instance.getZxy(+z, +x, +y, abortController.signal);
        if (resp) {
          return {
            data: new Uint8Array(resp.data),
            cacheControl: resp.cacheControl,
            expires: resp.expires
          };
        }
        if (header.tileType === 1 /* Mvt */) {
          return { data: new Uint8Array() };
        }
        return { data: null };
      });
      this.tile = v3compat(this.tilev4);
      this.tiles = /* @__PURE__ */ new Map();
      this.metadata = (options == null ? void 0 : options.metadata) || false;
    }
    /**
     * Add a {@link PMTiles} instance to the global protocol instance.
     *
     * For remote fetch sources, references in MapLibre styles like pmtiles://http://...
     * will resolve to the same instance if the URLs match.
     */
    add(p) {
      this.tiles.set(p.source.getKey(), p);
    }
    /**
     * Fetch a {@link PMTiles} instance by URL, for remote PMTiles instances.
     */
    get(url) {
      return this.tiles.get(url);
    }
  };

  // index.ts
  function toNum(low, high) {
    return (high >>> 0) * 4294967296 + (low >>> 0);
  }
  function readVarintRemainder(l, p) {
    const buf = p.buf;
    let b = buf[p.pos++];
    let h = (b & 112) >> 4;
    if (b < 128)
      return toNum(l, h);
    b = buf[p.pos++];
    h |= (b & 127) << 3;
    if (b < 128)
      return toNum(l, h);
    b = buf[p.pos++];
    h |= (b & 127) << 10;
    if (b < 128)
      return toNum(l, h);
    b = buf[p.pos++];
    h |= (b & 127) << 17;
    if (b < 128)
      return toNum(l, h);
    b = buf[p.pos++];
    h |= (b & 127) << 24;
    if (b < 128)
      return toNum(l, h);
    b = buf[p.pos++];
    h |= (b & 1) << 31;
    if (b < 128)
      return toNum(l, h);
    throw new Error("Expected varint not more than 10 bytes");
  }
  function readVarint(p) {
    const buf = p.buf;
    let b = buf[p.pos++];
    let val = b & 127;
    if (b < 128)
      return val;
    b = buf[p.pos++];
    val |= (b & 127) << 7;
    if (b < 128)
      return val;
    b = buf[p.pos++];
    val |= (b & 127) << 14;
    if (b < 128)
      return val;
    b = buf[p.pos++];
    val |= (b & 127) << 21;
    if (b < 128)
      return val;
    b = buf[p.pos];
    val |= (b & 15) << 28;
    return readVarintRemainder(val, p);
  }
  function rotate(n, xy, rx, ry) {
    if (ry === 0) {
      if (rx === 1) {
        xy[0] = n - 1 - xy[0];
        xy[1] = n - 1 - xy[1];
      }
      const t = xy[0];
      xy[0] = xy[1];
      xy[1] = t;
    }
  }
  function idOnLevel(z, pos) {
    const n = __pow(2, z);
    let rx = pos;
    let ry = pos;
    let t = pos;
    const xy = [0, 0];
    let s = 1;
    while (s < n) {
      rx = 1 & t / 2;
      ry = 1 & (t ^ rx);
      rotate(s, xy, rx, ry);
      xy[0] += s * rx;
      xy[1] += s * ry;
      t = t / 4;
      s *= 2;
    }
    return [z, xy[0], xy[1]];
  }
  var tzValues = [
    0,
    1,
    5,
    21,
    85,
    341,
    1365,
    5461,
    21845,
    87381,
    349525,
    1398101,
    5592405,
    22369621,
    89478485,
    357913941,
    1431655765,
    5726623061,
    22906492245,
    91625968981,
    366503875925,
    1466015503701,
    5864062014805,
    23456248059221,
    93824992236885,
    375299968947541,
    1501199875790165
  ];
  function zxyToTileId(z, x, y) {
    if (z > 26) {
      throw Error("Tile zoom level exceeds max safe number limit (26)");
    }
    if (x > __pow(2, z) - 1 || y > __pow(2, z) - 1) {
      throw Error("tile x/y outside zoom level bounds");
    }
    const acc = tzValues[z];
    const n = __pow(2, z);
    let rx = 0;
    let ry = 0;
    let d = 0;
    const xy = [x, y];
    let s = n / 2;
    while (s > 0) {
      rx = (xy[0] & s) > 0 ? 1 : 0;
      ry = (xy[1] & s) > 0 ? 1 : 0;
      d += s * s * (3 * rx ^ ry);
      rotate(s, xy, rx, ry);
      s = s / 2;
    }
    return acc + d;
  }
  function tileIdToZxy(i) {
    let acc = 0;
    const z = 0;
    for (let z2 = 0; z2 < 27; z2++) {
      const numTiles = (1 << z2) * (1 << z2);
      if (acc + numTiles > i) {
        return idOnLevel(z2, i - acc);
      }
      acc += numTiles;
    }
    throw Error("Tile zoom level exceeds max safe number limit (26)");
  }
  var Compression = /* @__PURE__ */ ((Compression2) => {
    Compression2[Compression2["Unknown"] = 0] = "Unknown";
    Compression2[Compression2["None"] = 1] = "None";
    Compression2[Compression2["Gzip"] = 2] = "Gzip";
    Compression2[Compression2["Brotli"] = 3] = "Brotli";
    Compression2[Compression2["Zstd"] = 4] = "Zstd";
    return Compression2;
  })(Compression || {});
  function defaultDecompress(buf, compression) {
    return __async(this, null, function* () {
      if (compression === 1 /* None */ || compression === 0 /* Unknown */) {
        return buf;
      }
      if (compression === 2 /* Gzip */) {
        if (typeof globalThis.DecompressionStream === "undefined") {
          return decompressSync(new Uint8Array(buf));
        }
        const stream = new Response(buf).body;
        if (!stream) {
          throw Error("Failed to read response stream");
        }
        const result = stream.pipeThrough(
          // biome-ignore lint: needed to detect DecompressionStream in browser+node+cloudflare workers
          new globalThis.DecompressionStream("gzip")
        );
        return new Response(result).arrayBuffer();
      }
      throw Error("Compression method not supported");
    });
  }
  var TileType = /* @__PURE__ */ ((TileType2) => {
    TileType2[TileType2["Unknown"] = 0] = "Unknown";
    TileType2[TileType2["Mvt"] = 1] = "Mvt";
    TileType2[TileType2["Png"] = 2] = "Png";
    TileType2[TileType2["Jpeg"] = 3] = "Jpeg";
    TileType2[TileType2["Webp"] = 4] = "Webp";
    TileType2[TileType2["Avif"] = 5] = "Avif";
    return TileType2;
  })(TileType || {});
  function tileTypeExt(t) {
    if (t === 1 /* Mvt */)
      return ".mvt";
    if (t === 2 /* Png */)
      return ".png";
    if (t === 3 /* Jpeg */)
      return ".jpg";
    if (t === 4 /* Webp */)
      return ".webp";
    if (t === 5 /* Avif */)
      return ".avif";
    return "";
  }
  var HEADER_SIZE_BYTES = 127;
  function findTile(entries, tileId) {
    let m = 0;
    let n = entries.length - 1;
    while (m <= n) {
      const k = n + m >> 1;
      const cmp = tileId - entries[k].tileId;
      if (cmp > 0) {
        m = k + 1;
      } else if (cmp < 0) {
        n = k - 1;
      } else {
        return entries[k];
      }
    }
    if (n >= 0) {
      if (entries[n].runLength === 0) {
        return entries[n];
      }
      if (tileId - entries[n].tileId < entries[n].runLength) {
        return entries[n];
      }
    }
    return null;
  }
  var FileSource = class {
    constructor(file) {
      this.file = file;
    }
    getKey() {
      return this.file.name;
    }
    getBytes(offset, length) {
      return __async(this, null, function* () {
        const blob = this.file.slice(offset, offset + length);
        const a = yield blob.arrayBuffer();
        return { data: a };
      });
    }
  };
  var FetchSource = class {
    constructor(url, customHeaders = new Headers()) {
      this.url = url;
      this.customHeaders = customHeaders;
      this.mustReload = false;
      let userAgent = "";
      if ("navigator" in globalThis) {
        userAgent = globalThis.navigator.userAgent || "";
      }
      const isWindows = userAgent.indexOf("Windows") > -1;
      const isChromiumBased = /Chrome|Chromium|Edg|OPR|Brave/.test(userAgent);
      this.chromeWindowsNoCache = false;
      if (isWindows && isChromiumBased) {
        this.chromeWindowsNoCache = true;
      }
    }
    getKey() {
      return this.url;
    }
    /**
     * Mutate the custom [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers) set for all requests to the remote archive.
     */
    setHeaders(customHeaders) {
      this.customHeaders = customHeaders;
    }
    getBytes(offset, length, passedSignal, etag) {
      return __async(this, null, function* () {
        let controller;
        let signal;
        if (passedSignal) {
          signal = passedSignal;
        } else {
          controller = new AbortController();
          signal = controller.signal;
        }
        const requestHeaders = new Headers(this.customHeaders);
        requestHeaders.set("range", `bytes=${offset}-${offset + length - 1}`);
        let cache;
        if (this.mustReload) {
          cache = "reload";
        } else if (this.chromeWindowsNoCache) {
          cache = "no-store";
        }
        let resp = yield fetch(this.url, {
          signal,
          cache,
          headers: requestHeaders
          //biome-ignore lint: "cache" is incompatible between cloudflare workers and browser
        });
        if (offset === 0 && resp.status === 416) {
          const contentRange = resp.headers.get("Content-Range");
          if (!contentRange || !contentRange.startsWith("bytes */")) {
            throw Error("Missing content-length on 416 response");
          }
          const actualLength = +contentRange.substr(8);
          resp = yield fetch(this.url, {
            signal,
            cache: "reload",
            headers: { range: `bytes=0-${actualLength - 1}` }
            //biome-ignore lint: "cache" is incompatible between cloudflare workers and browser
          });
        }
        let newEtag = resp.headers.get("Etag");
        if (newEtag == null ? void 0 : newEtag.startsWith("W/")) {
          newEtag = null;
        }
        if (resp.status === 416 || etag && newEtag && newEtag !== etag) {
          this.mustReload = true;
          throw new EtagMismatch(
            `Server returned non-matching ETag ${etag} after one retry. Check browser extensions and servers for issues that may affect correct ETag headers.`
          );
        }
        if (resp.status >= 300) {
          throw Error(`Bad response code: ${resp.status}`);
        }
        const contentLength = resp.headers.get("Content-Length");
        if (resp.status === 200 && (!contentLength || +contentLength > length)) {
          if (controller)
            controller.abort();
          throw Error(
            "Server returned no content-length header or content-length exceeding request. Check that your storage backend supports HTTP Byte Serving."
          );
        }
        const a = yield resp.arrayBuffer();
        return {
          data: a,
          etag: newEtag || void 0,
          cacheControl: resp.headers.get("Cache-Control") || void 0,
          expires: resp.headers.get("Expires") || void 0
        };
      });
    }
  };
  function getUint64(v, offset) {
    const wh = v.getUint32(offset + 4, true);
    const wl = v.getUint32(offset + 0, true);
    return wh * __pow(2, 32) + wl;
  }
  function bytesToHeader(bytes, etag) {
    const v = new DataView(bytes);
    const specVersion = v.getUint8(7);
    if (specVersion > 3) {
      throw Error(
        `Archive is spec version ${specVersion} but this library supports up to spec version 3`
      );
    }
    return {
      specVersion,
      rootDirectoryOffset: getUint64(v, 8),
      rootDirectoryLength: getUint64(v, 16),
      jsonMetadataOffset: getUint64(v, 24),
      jsonMetadataLength: getUint64(v, 32),
      leafDirectoryOffset: getUint64(v, 40),
      leafDirectoryLength: getUint64(v, 48),
      tileDataOffset: getUint64(v, 56),
      tileDataLength: getUint64(v, 64),
      numAddressedTiles: getUint64(v, 72),
      numTileEntries: getUint64(v, 80),
      numTileContents: getUint64(v, 88),
      clustered: v.getUint8(96) === 1,
      internalCompression: v.getUint8(97),
      tileCompression: v.getUint8(98),
      tileType: v.getUint8(99),
      minZoom: v.getUint8(100),
      maxZoom: v.getUint8(101),
      minLon: v.getInt32(102, true) / 1e7,
      minLat: v.getInt32(106, true) / 1e7,
      maxLon: v.getInt32(110, true) / 1e7,
      maxLat: v.getInt32(114, true) / 1e7,
      centerZoom: v.getUint8(118),
      centerLon: v.getInt32(119, true) / 1e7,
      centerLat: v.getInt32(123, true) / 1e7,
      etag
    };
  }
  function deserializeIndex(buffer) {
    const p = { buf: new Uint8Array(buffer), pos: 0 };
    const numEntries = readVarint(p);
    const entries = [];
    let lastId = 0;
    for (let i = 0; i < numEntries; i++) {
      const v = readVarint(p);
      entries.push({ tileId: lastId + v, offset: 0, length: 0, runLength: 1 });
      lastId += v;
    }
    for (let i = 0; i < numEntries; i++) {
      entries[i].runLength = readVarint(p);
    }
    for (let i = 0; i < numEntries; i++) {
      entries[i].length = readVarint(p);
    }
    for (let i = 0; i < numEntries; i++) {
      const v = readVarint(p);
      if (v === 0 && i > 0) {
        entries[i].offset = entries[i - 1].offset + entries[i - 1].length;
      } else {
        entries[i].offset = v - 1;
      }
    }
    return entries;
  }
  function detectVersion(a) {
    const v = new DataView(a);
    if (v.getUint16(2, true) === 2) {
      console.warn(
        "PMTiles spec version 2 has been deprecated; please see github.com/protomaps/PMTiles for tools to upgrade"
      );
      return 2;
    }
    if (v.getUint16(2, true) === 1) {
      console.warn(
        "PMTiles spec version 1 has been deprecated; please see github.com/protomaps/PMTiles for tools to upgrade"
      );
      return 1;
    }
    return 3;
  }
  var EtagMismatch = class extends Error {
  };
  function getHeaderAndRoot(source, decompress) {
    return __async(this, null, function* () {
      const resp = yield source.getBytes(0, 16384);
      const v = new DataView(resp.data);
      if (v.getUint16(0, true) !== 19792) {
        throw new Error("Wrong magic number for PMTiles archive");
      }
      if (detectVersion(resp.data) < 3) {
        return [yield v2_default.getHeader(source)];
      }
      const headerData = resp.data.slice(0, HEADER_SIZE_BYTES);
      const header = bytesToHeader(headerData, resp.etag);
      const rootDirData = resp.data.slice(
        header.rootDirectoryOffset,
        header.rootDirectoryOffset + header.rootDirectoryLength
      );
      const dirKey = `${source.getKey()}|${header.etag || ""}|${header.rootDirectoryOffset}|${header.rootDirectoryLength}`;
      const rootDir = deserializeIndex(
        yield decompress(rootDirData, header.internalCompression)
      );
      return [header, [dirKey, rootDir.length, rootDir]];
    });
  }
  function getDirectory(source, decompress, offset, length, header) {
    return __async(this, null, function* () {
      const resp = yield source.getBytes(offset, length, void 0, header.etag);
      const data = yield decompress(resp.data, header.internalCompression);
      const directory = deserializeIndex(data);
      if (directory.length === 0) {
        throw new Error("Empty directory is invalid");
      }
      return directory;
    });
  }
  var ResolvedValueCache = class {
    constructor(maxCacheEntries = 100, prefetch = true, decompress = defaultDecompress) {
      this.cache = /* @__PURE__ */ new Map();
      this.maxCacheEntries = maxCacheEntries;
      this.counter = 1;
      this.decompress = decompress;
    }
    getHeader(source) {
      return __async(this, null, function* () {
        const cacheKey = source.getKey();
        const cacheValue = this.cache.get(cacheKey);
        if (cacheValue) {
          cacheValue.lastUsed = this.counter++;
          const data = cacheValue.data;
          return data;
        }
        const res = yield getHeaderAndRoot(source, this.decompress);
        if (res[1]) {
          this.cache.set(res[1][0], {
            lastUsed: this.counter++,
            data: res[1][2]
          });
        }
        this.cache.set(cacheKey, {
          lastUsed: this.counter++,
          data: res[0]
        });
        this.prune();
        return res[0];
      });
    }
    getDirectory(source, offset, length, header) {
      return __async(this, null, function* () {
        const cacheKey = `${source.getKey()}|${header.etag || ""}|${offset}|${length}`;
        const cacheValue = this.cache.get(cacheKey);
        if (cacheValue) {
          cacheValue.lastUsed = this.counter++;
          const data = cacheValue.data;
          return data;
        }
        const directory = yield getDirectory(
          source,
          this.decompress,
          offset,
          length,
          header
        );
        this.cache.set(cacheKey, {
          lastUsed: this.counter++,
          data: directory
        });
        this.prune();
        return directory;
      });
    }
    // for v2 backwards compatibility
    getArrayBuffer(source, offset, length, header) {
      return __async(this, null, function* () {
        const cacheKey = `${source.getKey()}|${header.etag || ""}|${offset}|${length}`;
        const cacheValue = this.cache.get(cacheKey);
        if (cacheValue) {
          cacheValue.lastUsed = this.counter++;
          const data = yield cacheValue.data;
          return data;
        }
        const resp = yield source.getBytes(offset, length, void 0, header.etag);
        this.cache.set(cacheKey, {
          lastUsed: this.counter++,
          data: resp.data
        });
        this.prune();
        return resp.data;
      });
    }
    prune() {
      if (this.cache.size > this.maxCacheEntries) {
        let minUsed = Infinity;
        let minKey = void 0;
        this.cache.forEach((cacheValue, key) => {
          if (cacheValue.lastUsed < minUsed) {
            minUsed = cacheValue.lastUsed;
            minKey = key;
          }
        });
        if (minKey) {
          this.cache.delete(minKey);
        }
      }
    }
    invalidate(source) {
      return __async(this, null, function* () {
        this.cache.delete(source.getKey());
      });
    }
  };
  var SharedPromiseCache = class {
    constructor(maxCacheEntries = 100, prefetch = true, decompress = defaultDecompress) {
      this.cache = /* @__PURE__ */ new Map();
      this.invalidations = /* @__PURE__ */ new Map();
      this.maxCacheEntries = maxCacheEntries;
      this.counter = 1;
      this.decompress = decompress;
    }
    getHeader(source) {
      return __async(this, null, function* () {
        const cacheKey = source.getKey();
        const cacheValue = this.cache.get(cacheKey);
        if (cacheValue) {
          cacheValue.lastUsed = this.counter++;
          const data = yield cacheValue.data;
          return data;
        }
        const p = new Promise((resolve, reject) => {
          getHeaderAndRoot(source, this.decompress).then((res) => {
            if (res[1]) {
              this.cache.set(res[1][0], {
                lastUsed: this.counter++,
                data: Promise.resolve(res[1][2])
              });
            }
            resolve(res[0]);
            this.prune();
          }).catch((e) => {
            reject(e);
          });
        });
        this.cache.set(cacheKey, { lastUsed: this.counter++, data: p });
        return p;
      });
    }
    getDirectory(source, offset, length, header) {
      return __async(this, null, function* () {
        const cacheKey = `${source.getKey()}|${header.etag || ""}|${offset}|${length}`;
        const cacheValue = this.cache.get(cacheKey);
        if (cacheValue) {
          cacheValue.lastUsed = this.counter++;
          const data = yield cacheValue.data;
          return data;
        }
        const p = new Promise((resolve, reject) => {
          getDirectory(source, this.decompress, offset, length, header).then((directory) => {
            resolve(directory);
            this.prune();
          }).catch((e) => {
            reject(e);
          });
        });
        this.cache.set(cacheKey, { lastUsed: this.counter++, data: p });
        return p;
      });
    }
    // for v2 backwards compatibility
    getArrayBuffer(source, offset, length, header) {
      return __async(this, null, function* () {
        const cacheKey = `${source.getKey()}|${header.etag || ""}|${offset}|${length}`;
        const cacheValue = this.cache.get(cacheKey);
        if (cacheValue) {
          cacheValue.lastUsed = this.counter++;
          const data = yield cacheValue.data;
          return data;
        }
        const p = new Promise((resolve, reject) => {
          source.getBytes(offset, length, void 0, header.etag).then((resp) => {
            resolve(resp.data);
            if (this.cache.has(cacheKey)) {
            }
            this.prune();
          }).catch((e) => {
            reject(e);
          });
        });
        this.cache.set(cacheKey, { lastUsed: this.counter++, data: p });
        return p;
      });
    }
    prune() {
      if (this.cache.size >= this.maxCacheEntries) {
        let minUsed = Infinity;
        let minKey = void 0;
        this.cache.forEach((cacheValue, key) => {
          if (cacheValue.lastUsed < minUsed) {
            minUsed = cacheValue.lastUsed;
            minKey = key;
          }
        });
        if (minKey) {
          this.cache.delete(minKey);
        }
      }
    }
    invalidate(source) {
      return __async(this, null, function* () {
        const key = source.getKey();
        if (this.invalidations.get(key)) {
          return yield this.invalidations.get(key);
        }
        this.cache.delete(source.getKey());
        const p = new Promise((resolve, reject) => {
          this.getHeader(source).then((h) => {
            resolve();
            this.invalidations.delete(key);
          }).catch((e) => {
            reject(e);
          });
        });
        this.invalidations.set(key, p);
      });
    }
  };
  var PMTiles = class {
    constructor(source, cache, decompress) {
      if (typeof source === "string") {
        this.source = new FetchSource(source);
      } else {
        this.source = source;
      }
      if (decompress) {
        this.decompress = decompress;
      } else {
        this.decompress = defaultDecompress;
      }
      if (cache) {
        this.cache = cache;
      } else {
        this.cache = new SharedPromiseCache();
      }
    }
    /**
     * Return the header of the archive,
     * including information such as tile type, min/max zoom, bounds, and summary statistics.
     */
    getHeader() {
      return __async(this, null, function* () {
        return yield this.cache.getHeader(this.source);
      });
    }
    /** @hidden */
    getZxyAttempt(z, x, y, signal) {
      return __async(this, null, function* () {
        const tileId = zxyToTileId(z, x, y);
        const header = yield this.cache.getHeader(this.source);
        if (header.specVersion < 3) {
          return v2_default.getZxy(header, this.source, this.cache, z, x, y, signal);
        }
        if (z < header.minZoom || z > header.maxZoom) {
          return void 0;
        }
        let dO = header.rootDirectoryOffset;
        let dL = header.rootDirectoryLength;
        for (let depth = 0; depth <= 3; depth++) {
          const directory = yield this.cache.getDirectory(
            this.source,
            dO,
            dL,
            header
          );
          const entry = findTile(directory, tileId);
          if (entry) {
            if (entry.runLength > 0) {
              const resp = yield this.source.getBytes(
                header.tileDataOffset + entry.offset,
                entry.length,
                signal,
                header.etag
              );
              return {
                data: yield this.decompress(resp.data, header.tileCompression),
                cacheControl: resp.cacheControl,
                expires: resp.expires
              };
            }
            dO = header.leafDirectoryOffset + entry.offset;
            dL = entry.length;
          } else {
            return void 0;
          }
        }
        throw Error("Maximum directory depth exceeded");
      });
    }
    /**
     * Primary method to get a single tile's bytes from an archive.
     *
     * Returns undefined if the tile does not exist in the archive.
     */
    getZxy(z, x, y, signal) {
      return __async(this, null, function* () {
        try {
          return yield this.getZxyAttempt(z, x, y, signal);
        } catch (e) {
          if (e instanceof EtagMismatch) {
            this.cache.invalidate(this.source);
            return yield this.getZxyAttempt(z, x, y, signal);
          }
          throw e;
        }
      });
    }
    /** @hidden */
    getMetadataAttempt() {
      return __async(this, null, function* () {
        const header = yield this.cache.getHeader(this.source);
        const resp = yield this.source.getBytes(
          header.jsonMetadataOffset,
          header.jsonMetadataLength,
          void 0,
          header.etag
        );
        const decompressed = yield this.decompress(
          resp.data,
          header.internalCompression
        );
        const dec = new TextDecoder("utf-8");
        return JSON.parse(dec.decode(decompressed));
      });
    }
    /**
     * Return the arbitrary JSON metadata of the archive.
     */
    getMetadata() {
      return __async(this, null, function* () {
        try {
          return yield this.getMetadataAttempt();
        } catch (e) {
          if (e instanceof EtagMismatch) {
            this.cache.invalidate(this.source);
            return yield this.getMetadataAttempt();
          }
          throw e;
        }
      });
    }
    /**
     * Construct a [TileJSON](https://github.com/mapbox/tilejson-spec) object.
     *
     * baseTilesUrl is the desired tiles URL, excluding the suffix `/{z}/{x}/{y}.{ext}`.
     * For example, if the desired URL is `http://example.com/tileset/{z}/{x}/{y}.mvt`,
     * the baseTilesUrl should be `https://example.com/tileset`.
     */
    getTileJson(baseTilesUrl) {
      return __async(this, null, function* () {
        const header = yield this.getHeader();
        const metadata = yield this.getMetadata();
        const ext = tileTypeExt(header.tileType);
        return {
          tilejson: "3.0.0",
          scheme: "xyz",
          tiles: [`${baseTilesUrl}/{z}/{x}/{y}${ext}`],
          // biome-ignore lint: TileJSON spec
          vector_layers: metadata.vector_layers,
          attribution: metadata.attribution,
          description: metadata.description,
          name: metadata.name,
          version: metadata.version,
          bounds: [header.minLon, header.minLat, header.maxLon, header.maxLat],
          center: [header.centerLon, header.centerLat, header.centerZoom],
          minzoom: header.minZoom,
          maxzoom: header.maxZoom
        };
      });
    }
  };
  return __toCommonJS(js_exports);
})();

!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?module.exports=i():"function"==typeof define&&define.amd?define(i):(t="undefined"!=typeof globalThis?globalThis:t||self).Pbf=i()}(this,(function(){"use strict";const t=4294967296,i=1/t,e="undefined"==typeof TextDecoder?null:new TextDecoder("utf-8");function s(t,i,e){return e?4294967296*i+(t>>>0):4294967296*(i>>>0)+(t>>>0)}function r(t,i,e){const s=i<=16383?1:i<=2097151?2:i<=268435455?3:Math.floor(Math.log(i)/(7*Math.LN2));e.realloc(s);for(let i=e.pos-1;i>=t;i--)e.buf[i+s]=e.buf[i]}function o(t,i){for(let e=0;e<t.length;e++)i.writeVarint(t[e])}function h(t,i){for(let e=0;e<t.length;e++)i.writeSVarint(t[e])}function n(t,i){for(let e=0;e<t.length;e++)i.writeFloat(t[e])}function a(t,i){for(let e=0;e<t.length;e++)i.writeDouble(t[e])}function d(t,i){for(let e=0;e<t.length;e++)i.writeBoolean(t[e])}function l(t,i){for(let e=0;e<t.length;e++)i.writeFixed32(t[e])}function u(t,i){for(let e=0;e<t.length;e++)i.writeSFixed32(t[e])}function f(t,i){for(let e=0;e<t.length;e++)i.writeFixed64(t[e])}function p(t,i){for(let e=0;e<t.length;e++)i.writeSFixed64(t[e])}return class{constructor(t=new Uint8Array(16)){this.buf=ArrayBuffer.isView(t)?t:new Uint8Array(t),this.dataView=new DataView(this.buf.buffer),this.pos=0,this.type=0,this.length=this.buf.length}readFields(t,i,e=this.length){for(;this.pos<e;){const e=this.readVarint(),s=e>>3,r=this.pos;this.type=7&e,t(s,i,this),this.pos===r&&this.skip(e)}return i}readMessage(t,i){return this.readFields(t,i,this.readVarint()+this.pos)}readFixed32(){const t=this.dataView.getUint32(this.pos,!0);return this.pos+=4,t}readSFixed32(){const t=this.dataView.getInt32(this.pos,!0);return this.pos+=4,t}readFixed64(){const i=this.dataView.getUint32(this.pos,!0)+this.dataView.getUint32(this.pos+4,!0)*t;return this.pos+=8,i}readSFixed64(){const i=this.dataView.getUint32(this.pos,!0)+this.dataView.getInt32(this.pos+4,!0)*t;return this.pos+=8,i}readFloat(){const t=this.dataView.getFloat32(this.pos,!0);return this.pos+=4,t}readDouble(){const t=this.dataView.getFloat64(this.pos,!0);return this.pos+=8,t}readVarint(t){const i=this.buf;let e,r;return r=i[this.pos++],e=127&r,r<128?e:(r=i[this.pos++],e|=(127&r)<<7,r<128?e:(r=i[this.pos++],e|=(127&r)<<14,r<128?e:(r=i[this.pos++],e|=(127&r)<<21,r<128?e:(r=i[this.pos],e|=(15&r)<<28,function(t,i,e){const r=e.buf;let o,h;if(h=r[e.pos++],o=(112&h)>>4,h<128)return s(t,o,i);if(h=r[e.pos++],o|=(127&h)<<3,h<128)return s(t,o,i);if(h=r[e.pos++],o|=(127&h)<<10,h<128)return s(t,o,i);if(h=r[e.pos++],o|=(127&h)<<17,h<128)return s(t,o,i);if(h=r[e.pos++],o|=(127&h)<<24,h<128)return s(t,o,i);if(h=r[e.pos++],o|=(1&h)<<31,h<128)return s(t,o,i);throw new Error("Expected varint not more than 10 bytes")}(e,t,this)))))}readVarint64(){return this.readVarint(!0)}readSVarint(){const t=this.readVarint();return t%2==1?(t+1)/-2:t/2}readBoolean(){return Boolean(this.readVarint())}readString(){const t=this.readVarint()+this.pos,i=this.pos;return this.pos=t,t-i>=12&&e?e.decode(this.buf.subarray(i,t)):function(t,i,e){let s="",r=i;for(;r<e;){const i=t[r];let o,h,n,a=null,d=i>239?4:i>223?3:i>191?2:1;if(r+d>e)break;1===d?i<128&&(a=i):2===d?(o=t[r+1],128==(192&o)&&(a=(31&i)<<6|63&o,a<=127&&(a=null))):3===d?(o=t[r+1],h=t[r+2],128==(192&o)&&128==(192&h)&&(a=(15&i)<<12|(63&o)<<6|63&h,(a<=2047||a>=55296&&a<=57343)&&(a=null))):4===d&&(o=t[r+1],h=t[r+2],n=t[r+3],128==(192&o)&&128==(192&h)&&128==(192&n)&&(a=(15&i)<<18|(63&o)<<12|(63&h)<<6|63&n,(a<=65535||a>=1114112)&&(a=null))),null===a?(a=65533,d=1):a>65535&&(a-=65536,s+=String.fromCharCode(a>>>10&1023|55296),a=56320|1023&a),s+=String.fromCharCode(a),r+=d}return s}(this.buf,i,t)}readBytes(){const t=this.readVarint()+this.pos,i=this.buf.subarray(this.pos,t);return this.pos=t,i}readPackedVarint(t=[],i){const e=this.readPackedEnd();for(;this.pos<e;)t.push(this.readVarint(i));return t}readPackedSVarint(t=[]){const i=this.readPackedEnd();for(;this.pos<i;)t.push(this.readSVarint());return t}readPackedBoolean(t=[]){const i=this.readPackedEnd();for(;this.pos<i;)t.push(this.readBoolean());return t}readPackedFloat(t=[]){const i=this.readPackedEnd();for(;this.pos<i;)t.push(this.readFloat());return t}readPackedDouble(t=[]){const i=this.readPackedEnd();for(;this.pos<i;)t.push(this.readDouble());return t}readPackedFixed32(t=[]){const i=this.readPackedEnd();for(;this.pos<i;)t.push(this.readFixed32());return t}readPackedSFixed32(t=[]){const i=this.readPackedEnd();for(;this.pos<i;)t.push(this.readSFixed32());return t}readPackedFixed64(t=[]){const i=this.readPackedEnd();for(;this.pos<i;)t.push(this.readFixed64());return t}readPackedSFixed64(t=[]){const i=this.readPackedEnd();for(;this.pos<i;)t.push(this.readSFixed64());return t}readPackedEnd(){return 2===this.type?this.readVarint()+this.pos:this.pos+1}skip(t){const i=7&t;if(0===i)for(;this.buf[this.pos++]>127;);else if(2===i)this.pos=this.readVarint()+this.pos;else if(5===i)this.pos+=4;else{if(1!==i)throw new Error(`Unimplemented type: ${i}`);this.pos+=8}}writeTag(t,i){this.writeVarint(t<<3|i)}realloc(t){let i=this.length||16;for(;i<this.pos+t;)i*=2;if(i!==this.length){const t=new Uint8Array(i);t.set(this.buf),this.buf=t,this.dataView=new DataView(t.buffer),this.length=i}}finish(){return this.length=this.pos,this.pos=0,this.buf.subarray(0,this.length)}writeFixed32(t){this.realloc(4),this.dataView.setInt32(this.pos,t,!0),this.pos+=4}writeSFixed32(t){this.realloc(4),this.dataView.setInt32(this.pos,t,!0),this.pos+=4}writeFixed64(t){this.realloc(8),this.dataView.setInt32(this.pos,-1&t,!0),this.dataView.setInt32(this.pos+4,Math.floor(t*i),!0),this.pos+=8}writeSFixed64(t){this.realloc(8),this.dataView.setInt32(this.pos,-1&t,!0),this.dataView.setInt32(this.pos+4,Math.floor(t*i),!0),this.pos+=8}writeVarint(t){(t=+t||0)>268435455||t<0?function(t,i){let e,s;t>=0?(e=t%4294967296|0,s=t/4294967296|0):(e=~(-t%4294967296),s=~(-t/4294967296),4294967295^e?e=e+1|0:(e=0,s=s+1|0));if(t>=0x10000000000000000||t<-0x10000000000000000)throw new Error("Given varint doesn't fit into 10 bytes");i.realloc(10),function(t,i,e){e.buf[e.pos++]=127&t|128,t>>>=7,e.buf[e.pos++]=127&t|128,t>>>=7,e.buf[e.pos++]=127&t|128,t>>>=7,e.buf[e.pos++]=127&t|128,t>>>=7,e.buf[e.pos]=127&t}(e,0,i),function(t,i){const e=(7&t)<<4;if(i.buf[i.pos++]|=e|((t>>>=3)?128:0),!t)return;if(i.buf[i.pos++]=127&t|((t>>>=7)?128:0),!t)return;if(i.buf[i.pos++]=127&t|((t>>>=7)?128:0),!t)return;if(i.buf[i.pos++]=127&t|((t>>>=7)?128:0),!t)return;if(i.buf[i.pos++]=127&t|((t>>>=7)?128:0),!t)return;i.buf[i.pos++]=127&t}(s,i)}(t,this):(this.realloc(4),this.buf[this.pos++]=127&t|(t>127?128:0),t<=127||(this.buf[this.pos++]=127&(t>>>=7)|(t>127?128:0),t<=127||(this.buf[this.pos++]=127&(t>>>=7)|(t>127?128:0),t<=127||(this.buf[this.pos++]=t>>>7&127))))}writeSVarint(t){this.writeVarint(t<0?2*-t-1:2*t)}writeBoolean(t){this.writeVarint(+t)}writeString(t){t=String(t),this.realloc(4*t.length),this.pos++;const i=this.pos;this.pos=function(t,i,e){for(let s,r,o=0;o<i.length;o++){if(s=i.charCodeAt(o),s>55295&&s<57344){if(!r){s>56319||o+1===i.length?(t[e++]=239,t[e++]=191,t[e++]=189):r=s;continue}if(s<56320){t[e++]=239,t[e++]=191,t[e++]=189,r=s;continue}s=r-55296<<10|s-56320|65536,r=null}else r&&(t[e++]=239,t[e++]=191,t[e++]=189,r=null);s<128?t[e++]=s:(s<2048?t[e++]=s>>6|192:(s<65536?t[e++]=s>>12|224:(t[e++]=s>>18|240,t[e++]=s>>12&63|128),t[e++]=s>>6&63|128),t[e++]=63&s|128)}return e}(this.buf,t,this.pos);const e=this.pos-i;e>=128&&r(i,e,this),this.pos=i-1,this.writeVarint(e),this.pos+=e}writeFloat(t){this.realloc(4),this.dataView.setFloat32(this.pos,t,!0),this.pos+=4}writeDouble(t){this.realloc(8),this.dataView.setFloat64(this.pos,t,!0),this.pos+=8}writeBytes(t){const i=t.length;this.writeVarint(i),this.realloc(i);for(let e=0;e<i;e++)this.buf[this.pos++]=t[e]}writeRawMessage(t,i){this.pos++;const e=this.pos;t(i,this);const s=this.pos-e;s>=128&&r(e,s,this),this.pos=e-1,this.writeVarint(s),this.pos+=s}writeMessage(t,i,e){this.writeTag(t,2),this.writeRawMessage(i,e)}writePackedVarint(t,i){i.length&&this.writeMessage(t,o,i)}writePackedSVarint(t,i){i.length&&this.writeMessage(t,h,i)}writePackedBoolean(t,i){i.length&&this.writeMessage(t,d,i)}writePackedFloat(t,i){i.length&&this.writeMessage(t,n,i)}writePackedDouble(t,i){i.length&&this.writeMessage(t,a,i)}writePackedFixed32(t,i){i.length&&this.writeMessage(t,l,i)}writePackedSFixed32(t,i){i.length&&this.writeMessage(t,u,i)}writePackedFixed64(t,i){i.length&&this.writeMessage(t,f,i)}writePackedSFixed64(t,i){i.length&&this.writeMessage(t,p,i)}writeBytesField(t,i){this.writeTag(t,2),this.writeBytes(i)}writeFixed32Field(t,i){this.writeTag(t,5),this.writeFixed32(i)}writeSFixed32Field(t,i){this.writeTag(t,5),this.writeSFixed32(i)}writeFixed64Field(t,i){this.writeTag(t,1),this.writeFixed64(i)}writeSFixed64Field(t,i){this.writeTag(t,1),this.writeSFixed64(i)}writeVarintField(t,i){this.writeTag(t,0),this.writeVarint(i)}writeSVarintField(t,i){this.writeTag(t,0),this.writeSVarint(i)}writeStringField(t,i){this.writeTag(t,2),this.writeString(i)}writeFloatField(t,i){this.writeTag(t,5),this.writeFloat(i)}writeDoubleField(t,i){this.writeTag(t,1),this.writeDouble(i)}writeBooleanField(t,i){this.writeVarintField(t,+i)}}}));

(function(){
/**
 * A standalone point geometry with useful accessor, comparison, and
 * modification methods.
 *
 * @class
 * @param {number} x the x-coordinate. This could be longitude or screen pixels, or any other sort of unit.
 * @param {number} y the y-coordinate. This could be latitude or screen pixels, or any other sort of unit.
 *
 * @example
 * const point = new Point(-77, 38);
 */
function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype = {
    /**
     * Clone this point, returning a new point that can be modified
     * without affecting the old one.
     * @return {Point} the clone
     */
    clone() { return new Point(this.x, this.y); },

    /**
     * Add this point's x & y coordinates to another point,
     * yielding a new point.
     * @param {Point} p the other point
     * @return {Point} output point
     */
    add(p) { return this.clone()._add(p); },

    /**
     * Subtract this point's x & y coordinates to from point,
     * yielding a new point.
     * @param {Point} p the other point
     * @return {Point} output point
     */
    sub(p) { return this.clone()._sub(p); },

    /**
     * Multiply this point's x & y coordinates by point,
     * yielding a new point.
     * @param {Point} p the other point
     * @return {Point} output point
     */
    multByPoint(p) { return this.clone()._multByPoint(p); },

    /**
     * Divide this point's x & y coordinates by point,
     * yielding a new point.
     * @param {Point} p the other point
     * @return {Point} output point
     */
    divByPoint(p) { return this.clone()._divByPoint(p); },

    /**
     * Multiply this point's x & y coordinates by a factor,
     * yielding a new point.
     * @param {number} k factor
     * @return {Point} output point
     */
    mult(k) { return this.clone()._mult(k); },

    /**
     * Divide this point's x & y coordinates by a factor,
     * yielding a new point.
     * @param {number} k factor
     * @return {Point} output point
     */
    div(k) { return this.clone()._div(k); },

    /**
     * Rotate this point around the 0, 0 origin by an angle a,
     * given in radians
     * @param {number} a angle to rotate around, in radians
     * @return {Point} output point
     */
    rotate(a) { return this.clone()._rotate(a); },

    /**
     * Rotate this point around p point by an angle a,
     * given in radians
     * @param {number} a angle to rotate around, in radians
     * @param {Point} p Point to rotate around
     * @return {Point} output point
     */
    rotateAround(a, p) { return this.clone()._rotateAround(a, p); },

    /**
     * Multiply this point by a 4x1 transformation matrix
     * @param {[number, number, number, number]} m transformation matrix
     * @return {Point} output point
     */
    matMult(m) { return this.clone()._matMult(m); },

    /**
     * Calculate this point but as a unit vector from 0, 0, meaning
     * that the distance from the resulting point to the 0, 0
     * coordinate will be equal to 1 and the angle from the resulting
     * point to the 0, 0 coordinate will be the same as before.
     * @return {Point} unit vector point
     */
    unit() { return this.clone()._unit(); },

    /**
     * Compute a perpendicular point, where the new y coordinate
     * is the old x coordinate and the new x coordinate is the old y
     * coordinate multiplied by -1
     * @return {Point} perpendicular point
     */
    perp() { return this.clone()._perp(); },

    /**
     * Return a version of this point with the x & y coordinates
     * rounded to integers.
     * @return {Point} rounded point
     */
    round() { return this.clone()._round(); },

    /**
     * Return the magnitude of this point: this is the Euclidean
     * distance from the 0, 0 coordinate to this point's x and y
     * coordinates.
     * @return {number} magnitude
     */
    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },

    /**
     * Judge whether this point is equal to another point, returning
     * true or false.
     * @param {Point} other the other point
     * @return {boolean} whether the points are equal
     */
    equals(other) {
        return this.x === other.x &&
               this.y === other.y;
    },

    /**
     * Calculate the distance from this point to another point
     * @param {Point} p the other point
     * @return {number} distance
     */
    dist(p) {
        return Math.sqrt(this.distSqr(p));
    },

    /**
     * Calculate the distance from this point to another point,
     * without the square root step. Useful if you're comparing
     * relative distances.
     * @param {Point} p the other point
     * @return {number} distance
     */
    distSqr(p) {
        const dx = p.x - this.x,
            dy = p.y - this.y;
        return dx * dx + dy * dy;
    },

    /**
     * Get the angle from the 0, 0 coordinate to this point, in radians
     * coordinates.
     * @return {number} angle
     */
    angle() {
        return Math.atan2(this.y, this.x);
    },

    /**
     * Get the angle from this point to another point, in radians
     * @param {Point} b the other point
     * @return {number} angle
     */
    angleTo(b) {
        return Math.atan2(this.y - b.y, this.x - b.x);
    },

    /**
     * Get the angle between this point and another point, in radians
     * @param {Point} b the other point
     * @return {number} angle
     */
    angleWith(b) {
        return this.angleWithSep(b.x, b.y);
    },

    /**
     * Find the angle of the two vectors, solving the formula for
     * the cross product a x b = |a||b|sin(θ) for θ.
     * @param {number} x the x-coordinate
     * @param {number} y the y-coordinate
     * @return {number} the angle in radians
     */
    angleWithSep(x, y) {
        return Math.atan2(
            this.x * y - this.y * x,
            this.x * x + this.y * y);
    },

    /** @param {[number, number, number, number]} m */
    _matMult(m) {
        const x = m[0] * this.x + m[1] * this.y,
            y = m[2] * this.x + m[3] * this.y;
        this.x = x;
        this.y = y;
        return this;
    },

    /** @param {Point} p */
    _add(p) {
        this.x += p.x;
        this.y += p.y;
        return this;
    },

    /** @param {Point} p */
    _sub(p) {
        this.x -= p.x;
        this.y -= p.y;
        return this;
    },

    /** @param {number} k */
    _mult(k) {
        this.x *= k;
        this.y *= k;
        return this;
    },

    /** @param {number} k */
    _div(k) {
        this.x /= k;
        this.y /= k;
        return this;
    },

    /** @param {Point} p */
    _multByPoint(p) {
        this.x *= p.x;
        this.y *= p.y;
        return this;
    },

    /** @param {Point} p */
    _divByPoint(p) {
        this.x /= p.x;
        this.y /= p.y;
        return this;
    },

    _unit() {
        this._div(this.mag());
        return this;
    },

    _perp() {
        const y = this.y;
        this.y = this.x;
        this.x = -y;
        return this;
    },

    /** @param {number} angle */
    _rotate(angle) {
        const cos = Math.cos(angle),
            sin = Math.sin(angle),
            x = cos * this.x - sin * this.y,
            y = sin * this.x + cos * this.y;
        this.x = x;
        this.y = y;
        return this;
    },

    /**
     * @param {number} angle
     * @param {Point} p
     */
    _rotateAround(angle, p) {
        const cos = Math.cos(angle),
            sin = Math.sin(angle),
            x = p.x + cos * (this.x - p.x) - sin * (this.y - p.y),
            y = p.y + sin * (this.x - p.x) + cos * (this.y - p.y);
        this.x = x;
        this.y = y;
        return this;
    },

    _round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    },

    constructor: Point
};

/**
 * Construct a point from an array if necessary, otherwise if the input
 * is already a Point, return it unchanged.
 * @param {Point | [number, number] | {x: number, y: number}} p input value
 * @return {Point} constructed point.
 * @example
 * // this
 * var point = Point.convert([0, 1]);
 * // is equivalent to
 * var point = new Point(0, 1);
 */
Point.convert = function (p) {
    if (p instanceof Point) {
        return /** @type {Point} */ (p);
    }
    if (Array.isArray(p)) {
        return new Point(+p[0], +p[1]);
    }
    if (p.x !== undefined && p.y !== undefined) {
        return new Point(+p.x, +p.y);
    }
    throw new Error('Expected [x, y] or {x, y} point format');
};


/** @import Pbf from 'pbf' */
/** @import {Feature} from 'geojson' */

class VectorTileFeature {
    /**
     * @param {Pbf} pbf
     * @param {number} end
     * @param {number} extent
     * @param {string[]} keys
     * @param {unknown[]} values
     */
    constructor(pbf, end, extent, keys, values) {
        // Public

        /** @type {Record<string, unknown>} */
        this.properties = {};

        this.extent = extent;
        /** @type {0 | 1 | 2 | 3} */
        this.type = 0;

        /** @type {number | undefined} */
        this.id = undefined;

        this._pbf = pbf;
        this._geometry = -1;
        this._keys = keys;
        this._values = values;

        pbf.readFields(readFeature, this, end);
    }

    loadGeometry() {
        const pbf = this._pbf;
        pbf.pos = this._geometry;

        const end = pbf.readVarint() + pbf.pos;

        /** @type Point[][] */
        const lines = [];

        /** @type Point[] | undefined */
        let line;

        let cmd = 1;
        let length = 0;
        let x = 0;
        let y = 0;

        while (pbf.pos < end) {
            if (length <= 0) {
                const cmdLen = pbf.readVarint();
                cmd = cmdLen & 0x7;
                length = cmdLen >> 3;
            }

            length--;

            if (cmd === 1 || cmd === 2) {
                x += pbf.readSVarint();
                y += pbf.readSVarint();

                if (cmd === 1) { // moveTo
                    if (line) lines.push(line);
                    line = [];
                }

                if (line) line.push(new Point(x, y));

            } else if (cmd === 7) {

                // Workaround for https://github.com/mapbox/mapnik-vector-tile/issues/90
                if (line) {
                    line.push(line[0].clone()); // closePolygon
                }

            } else {
                throw new Error(`unknown command ${cmd}`);
            }
        }

        if (line) lines.push(line);

        return lines;
    }

    bbox() {
        const pbf = this._pbf;
        pbf.pos = this._geometry;

        const end = pbf.readVarint() + pbf.pos;
        let cmd = 1,
            length = 0,
            x = 0,
            y = 0,
            x1 = Infinity,
            x2 = -Infinity,
            y1 = Infinity,
            y2 = -Infinity;

        while (pbf.pos < end) {
            if (length <= 0) {
                const cmdLen = pbf.readVarint();
                cmd = cmdLen & 0x7;
                length = cmdLen >> 3;
            }

            length--;

            if (cmd === 1 || cmd === 2) {
                x += pbf.readSVarint();
                y += pbf.readSVarint();
                if (x < x1) x1 = x;
                if (x > x2) x2 = x;
                if (y < y1) y1 = y;
                if (y > y2) y2 = y;

            } else if (cmd !== 7) {
                throw new Error(`unknown command ${cmd}`);
            }
        }

        return [x1, y1, x2, y2];
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @return {Feature}
     */
    toGeoJSON(x, y, z) {
        const size = this.extent * Math.pow(2, z),
            x0 = this.extent * x,
            y0 = this.extent * y,
            vtCoords = this.loadGeometry();

        /** @param {Point} p */
        function projectPoint(p) {
            return [
                (p.x + x0) * 360 / size - 180,
                360 / Math.PI * Math.atan(Math.exp((1 - (p.y + y0) * 2 / size) * Math.PI)) - 90
            ];
        }

        /** @param {Point[]} line */
        function projectLine(line) {
            return line.map(projectPoint);
        }

        /** @type {Feature["geometry"]} */
        let geometry;

        if (this.type === 1) {
            const points = [];
            for (const line of vtCoords) {
                points.push(line[0]);
            }
            const coordinates = projectLine(points);
            geometry = points.length === 1 ?
                {type: 'Point', coordinates: coordinates[0]} :
                {type: 'MultiPoint', coordinates};

        } else if (this.type === 2) {

            const coordinates = vtCoords.map(projectLine);
            geometry = coordinates.length === 1 ?
                {type: 'LineString', coordinates: coordinates[0]} :
                {type: 'MultiLineString', coordinates};

        } else if (this.type === 3) {
            const polygons = classifyRings(vtCoords);
            const coordinates = [];
            for (const polygon of polygons) {
                coordinates.push(polygon.map(projectLine));
            }
            geometry = coordinates.length === 1 ?
                {type: 'Polygon', coordinates: coordinates[0]} :
                {type: 'MultiPolygon', coordinates};
        } else {

            throw new Error('unknown feature type');
        }

        /** @type {Feature} */
        const result = {
            type: 'Feature',
            geometry,
            properties: this.properties
        };

        if (this.id != null) {
            result.id = this.id;
        }

        return result;
    }
}

/** @type {['Unknown', 'Point', 'LineString', 'Polygon']} */
VectorTileFeature.types = ['Unknown', 'Point', 'LineString', 'Polygon'];

/**
 * @param {number} tag
 * @param {VectorTileFeature} feature
 * @param {Pbf} pbf
 */
function readFeature(tag, feature, pbf) {
    if (tag === 1) feature.id = pbf.readVarint();
    else if (tag === 2) readTag(pbf, feature);
    else if (tag === 3) feature.type = /** @type {0 | 1 | 2 | 3} */ (pbf.readVarint());
    else if (tag === 4) feature._geometry = pbf.pos;
}

/**
 * @param {Pbf} pbf
 * @param {VectorTileFeature} feature
 */
function readTag(pbf, feature) {
    const end = pbf.readVarint() + pbf.pos;

    while (pbf.pos < end) {
        const key = feature._keys[pbf.readVarint()],
            value = feature._values[pbf.readVarint()];
        feature.properties[key] = value;
    }
}

/** classifies an array of rings into polygons with outer rings and holes
 * @param {Point[][]} rings
 */
function classifyRings(rings) {
    const len = rings.length;

    if (len <= 1) return [rings];

    const polygons = [];
    let polygon, ccw;

    for (let i = 0; i < len; i++) {
        const area = signedArea(rings[i]);
        if (area === 0) continue;

        if (ccw === undefined) ccw = area < 0;

        if (ccw === area < 0) {
            if (polygon) polygons.push(polygon);
            polygon = [rings[i]];

        } else if (polygon) {
            polygon.push(rings[i]);
        }
    }
    if (polygon) polygons.push(polygon);

    return polygons;
}

/** @param {Point[]} ring */
function signedArea(ring) {
    let sum = 0;
    for (let i = 0, len = ring.length, j = len - 1, p1, p2; i < len; j = i++) {
        p1 = ring[i];
        p2 = ring[j];
        sum += (p2.x - p1.x) * (p1.y + p2.y);
    }
    return sum;
}

class VectorTileLayer {
    /**
     * @param {Pbf} pbf
     * @param {number} [end]
     */
    constructor(pbf, end) {
        // Public
        this.version = 1;
        this.name = '';
        this.extent = 4096;
        this.length = 0;

        // Private
        this._pbf = pbf;

        /** @type {string[]} */
        this._keys = [];

        /** @type {unknown[]} */
        this._values = [];

        /** @type {number[]} */
        this._features = [];

        pbf.readFields(readLayer, this, end);

        this.length = this._features.length;
    }

    /** return feature `i` from this layer as a `VectorTileFeature`
     * @param {number} i
     */
    feature(i) {
        if (i < 0 || i >= this._features.length) throw new Error('feature index out of bounds');

        this._pbf.pos = this._features[i];

        const end = this._pbf.readVarint() + this._pbf.pos;
        return new VectorTileFeature(this._pbf, end, this.extent, this._keys, this._values);
    }
}

/**
 * @param {number} tag
 * @param {VectorTileLayer} layer
 * @param {Pbf} pbf
 */
function readLayer(tag, layer, pbf) {
    if (tag === 15) layer.version = pbf.readVarint();
    else if (tag === 1) layer.name = pbf.readString();
    else if (tag === 5) layer.extent = pbf.readVarint();
    else if (tag === 2) layer._features.push(pbf.pos);
    else if (tag === 3) layer._keys.push(pbf.readString());
    else if (tag === 4) layer._values.push(readValueMessage(pbf));
}

/**
 * @param {Pbf} pbf
 */
function readValueMessage(pbf) {
    let value = null;
    const end = pbf.readVarint() + pbf.pos;

    while (pbf.pos < end) {
        const tag = pbf.readVarint() >> 3;

        value = tag === 1 ? pbf.readString() :
            tag === 2 ? pbf.readFloat() :
            tag === 3 ? pbf.readDouble() :
            tag === 4 ? pbf.readVarint64() :
            tag === 5 ? pbf.readVarint() :
            tag === 6 ? pbf.readSVarint() :
            tag === 7 ? pbf.readBoolean() : null;
    }

    return value;
}

class VectorTile {
    /**
     * @param {Pbf} pbf
     * @param {number} [end]
     */
    constructor(pbf, end) {
        /** @type {Record<string, VectorTileLayer>} */
        this.layers = pbf.readFields(readTile, {}, end);
    }
}

/**
 * @param {number} tag
 * @param {Record<string, VectorTileLayer>} layers
 * @param {Pbf} pbf
 */
function readTile(tag, layers, pbf) {
    if (tag === 3) {
        const layer = new VectorTileLayer(pbf, pbf.readVarint() + pbf.pos);
        if (layer.length) layers[layer.name] = layer;
    }
}
window.VectorTile=VectorTile;})();
window.pmtiles=window.pmtiles||pmtiles;
