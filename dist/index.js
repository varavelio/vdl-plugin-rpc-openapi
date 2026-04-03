"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
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

// src/index.ts
var index_exports = {};
__export(index_exports, {
  generate: () => generate
});
module.exports = __toCommonJS(index_exports);

// node_modules/@varavel/vdl-plugin-sdk/dist/core/errors.js
var _a;
var PluginError = (_a = class extends Error {
  constructor(message, position) {
    super(message);
    this.name = "PluginError";
    this.position = position;
  }
}, __name(_a, "PluginError"), _a);
function fail(message, position) {
  throw new PluginError(message, position);
}
__name(fail, "fail");
function assert(condition, message, position) {
  if (!condition) throw new PluginError(message, position);
}
__name(assert, "assert");

// node_modules/@varavel/vdl-plugin-sdk/dist/core/define-plugin.js
function definePlugin(handler) {
  return (input) => {
    try {
      return handler(input);
    } catch (error) {
      return {
        files: [],
        errors: [toPluginError(error)]
      };
    }
  };
}
__name(definePlugin, "definePlugin");
function toPluginError(error) {
  if (error instanceof PluginError) return {
    message: error.message,
    position: error.position
  };
  if (error instanceof Error) return { message: error.message };
  return { message: "An unknown generation error occurred." };
}
__name(toPluginError, "toPluginError");

// node_modules/@varavel/vdl-plugin-sdk/dist/_virtual/_@oxc-project_runtime@0.115.0/helpers/typeof.js
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}
__name(_typeof, "_typeof");

// node_modules/@varavel/vdl-plugin-sdk/dist/_virtual/_@oxc-project_runtime@0.115.0/helpers/toPrimitive.js
function toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
__name(toPrimitive, "toPrimitive");

// node_modules/@varavel/vdl-plugin-sdk/dist/_virtual/_@oxc-project_runtime@0.115.0/helpers/toPropertyKey.js
function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
__name(toPropertyKey, "toPropertyKey");

// node_modules/@varavel/vdl-plugin-sdk/dist/_virtual/_@oxc-project_runtime@0.115.0/helpers/defineProperty.js
function _defineProperty(e, r, t) {
  return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
__name(_defineProperty, "_defineProperty");

// node_modules/@varavel/vdl-plugin-sdk/dist/_virtual/_@oxc-project_runtime@0.115.0/helpers/objectSpread2.js
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
__name(ownKeys, "ownKeys");
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
__name(_objectSpread2, "_objectSpread2");

// node_modules/@varavel/vdl-plugin-sdk/dist/utils/rpc/assert-valid-ir-for-rpc.js
var RPC_ANNOTATION_NAME = "rpc";
var PROC_ANNOTATION_NAME = "proc";
var STREAM_ANNOTATION_NAME = "stream";
function assertValidIrForRpc(ir) {
  const rpcTypes = ir.types.filter((typeDef) => {
    return hasAnnotation(typeDef.annotations, RPC_ANNOTATION_NAME);
  });
  for (const rpcType of rpcTypes) assertValidRpcType(rpcType);
}
__name(assertValidIrForRpc, "assertValidIrForRpc");
function assertValidRpcType(typeDef) {
  var _typeDef$typeRef$obje;
  assert(typeDef.typeRef.kind === "object", `Type ${JSON.stringify(typeDef.name)} is annotated with @rpc and must be an object type.`, typeDef.position);
  const fields = (_typeDef$typeRef$obje = typeDef.typeRef.objectFields) !== null && _typeDef$typeRef$obje !== void 0 ? _typeDef$typeRef$obje : [];
  for (const field of fields) assertValidRpcOperationField(typeDef, field);
}
__name(assertValidRpcType, "assertValidRpcType");
function assertValidRpcOperationField(rpcType, field) {
  const hasProc = hasAnnotation(field.annotations, PROC_ANNOTATION_NAME);
  const hasStream = hasAnnotation(field.annotations, STREAM_ANNOTATION_NAME);
  if (!hasProc && !hasStream) return;
  if (hasProc && hasStream) fail(`Field ${JSON.stringify(`${rpcType.name}.${field.name}`)} cannot be annotated with both @proc and @stream.`, field.position);
  const operationAnnotation = hasProc ? PROC_ANNOTATION_NAME : STREAM_ANNOTATION_NAME;
  assert(field.typeRef.kind === "object", `Field ${JSON.stringify(`${rpcType.name}.${field.name}`)} is annotated with @${operationAnnotation} and must be an object type.`, field.position);
  const inputField = findFieldByName(field.typeRef.objectFields, "input");
  const outputField = findFieldByName(field.typeRef.objectFields, "output");
  if (inputField && inputField.typeRef.kind !== "object") fail(`Field "input" in operation ${JSON.stringify(`${rpcType.name}.${field.name}`)} must be an object type when present.`, withFallbackFile(inputField.position, field.position));
  if (outputField && outputField.typeRef.kind !== "object") fail(`Field "output" in operation ${JSON.stringify(`${rpcType.name}.${field.name}`)} must be an object type when present.`, withFallbackFile(outputField.position, field.position));
}
__name(assertValidRpcOperationField, "assertValidRpcOperationField");
function hasAnnotation(annotations, name) {
  return annotations.some((annotation) => annotation.name === name);
}
__name(hasAnnotation, "hasAnnotation");
function findFieldByName(fields, name) {
  return fields === null || fields === void 0 ? void 0 : fields.find((field) => field.name === name);
}
__name(findFieldByName, "findFieldByName");
function withFallbackFile(primary, fallback) {
  if (primary.file.length > 0 || fallback.file.length === 0) return primary;
  return _objectSpread2(_objectSpread2({}, primary), {}, { file: fallback.file });
}
__name(withFallbackFile, "withFallbackFile");

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/nodes/identity.js
var ALIAS = /* @__PURE__ */ Symbol.for("yaml.alias");
var DOC = /* @__PURE__ */ Symbol.for("yaml.document");
var MAP = /* @__PURE__ */ Symbol.for("yaml.map");
var PAIR = /* @__PURE__ */ Symbol.for("yaml.pair");
var SCALAR = /* @__PURE__ */ Symbol.for("yaml.scalar");
var SEQ = /* @__PURE__ */ Symbol.for("yaml.seq");
var NODE_TYPE = /* @__PURE__ */ Symbol.for("yaml.node.type");
var isAlias = /* @__PURE__ */ __name((node) => !!node && typeof node === "object" && node[NODE_TYPE] === ALIAS, "isAlias");
var isDocument = /* @__PURE__ */ __name((node) => !!node && typeof node === "object" && node[NODE_TYPE] === DOC, "isDocument");
var isMap = /* @__PURE__ */ __name((node) => !!node && typeof node === "object" && node[NODE_TYPE] === MAP, "isMap");
var isPair = /* @__PURE__ */ __name((node) => !!node && typeof node === "object" && node[NODE_TYPE] === PAIR, "isPair");
var isScalar = /* @__PURE__ */ __name((node) => !!node && typeof node === "object" && node[NODE_TYPE] === SCALAR, "isScalar");
var isSeq = /* @__PURE__ */ __name((node) => !!node && typeof node === "object" && node[NODE_TYPE] === SEQ, "isSeq");
function isCollection(node) {
  if (node && typeof node === "object") switch (node[NODE_TYPE]) {
    case MAP:
    case SEQ:
      return true;
  }
  return false;
}
__name(isCollection, "isCollection");
function isNode(node) {
  if (node && typeof node === "object") switch (node[NODE_TYPE]) {
    case ALIAS:
    case MAP:
    case SCALAR:
    case SEQ:
      return true;
  }
  return false;
}
__name(isNode, "isNode");
var hasAnchor = /* @__PURE__ */ __name((node) => (isScalar(node) || isCollection(node)) && !!node.anchor, "hasAnchor");

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/log.js
function warn(logLevel, warning) {
  if (logLevel === "debug" || logLevel === "warn") console.warn(warning);
}
__name(warn, "warn");

// node_modules/@varavel/vdl-plugin-sdk/dist/_virtual/_@oxc-project_runtime@0.115.0/helpers/asyncToGenerator.js
function asyncGeneratorStep(n, t, e, r, o, a, c) {
  try {
    var i = n[a](c), u = i.value;
  } catch (n2) {
    e(n2);
    return;
  }
  i.done ? t(u) : Promise.resolve(u).then(r, o);
}
__name(asyncGeneratorStep, "asyncGeneratorStep");
function _asyncToGenerator(n) {
  return function() {
    var t = this, e = arguments;
    return new Promise(function(r, o) {
      var a = n.apply(t, e);
      function _next(n2) {
        asyncGeneratorStep(a, r, o, _next, _throw, "next", n2);
      }
      __name(_next, "_next");
      function _throw(n2) {
        asyncGeneratorStep(a, r, o, _next, _throw, "throw", n2);
      }
      __name(_throw, "_throw");
      _next(void 0);
    });
  };
}
__name(_asyncToGenerator, "_asyncToGenerator");

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/visit.js
var BREAK = /* @__PURE__ */ Symbol("break visit");
var SKIP = /* @__PURE__ */ Symbol("skip children");
var REMOVE = /* @__PURE__ */ Symbol("remove node");
function visit(node, visitor) {
  const visitor_ = initVisitor(visitor);
  if (isDocument(node)) {
    if (visit_(null, node.contents, visitor_, Object.freeze([node])) === REMOVE) node.contents = null;
  } else visit_(null, node, visitor_, Object.freeze([]));
}
__name(visit, "visit");
visit.BREAK = BREAK;
visit.SKIP = SKIP;
visit.REMOVE = REMOVE;
function visit_(key, node, visitor, path) {
  const ctrl = callVisitor(key, node, visitor, path);
  if (isNode(ctrl) || isPair(ctrl)) {
    replaceNode(key, path, ctrl);
    return visit_(key, ctrl, visitor, path);
  }
  if (typeof ctrl !== "symbol") {
    if (isCollection(node)) {
      path = Object.freeze(path.concat(node));
      for (let i = 0; i < node.items.length; ++i) {
        const ci = visit_(i, node.items[i], visitor, path);
        if (typeof ci === "number") i = ci - 1;
        else if (ci === BREAK) return BREAK;
        else if (ci === REMOVE) {
          node.items.splice(i, 1);
          i -= 1;
        }
      }
    } else if (isPair(node)) {
      path = Object.freeze(path.concat(node));
      const ck = visit_("key", node.key, visitor, path);
      if (ck === BREAK) return BREAK;
      else if (ck === REMOVE) node.key = null;
      const cv = visit_("value", node.value, visitor, path);
      if (cv === BREAK) return BREAK;
      else if (cv === REMOVE) node.value = null;
    }
  }
  return ctrl;
}
__name(visit_, "visit_");
function visitAsync(_x, _x2) {
  return _visitAsync.apply(this, arguments);
}
__name(visitAsync, "visitAsync");
function _visitAsync() {
  _visitAsync = _asyncToGenerator(function* (node, visitor) {
    const visitor_ = initVisitor(visitor);
    if (isDocument(node)) {
      if ((yield visitAsync_(null, node.contents, visitor_, Object.freeze([node]))) === REMOVE) node.contents = null;
    } else yield visitAsync_(null, node, visitor_, Object.freeze([]));
  });
  return _visitAsync.apply(this, arguments);
}
__name(_visitAsync, "_visitAsync");
visitAsync.BREAK = BREAK;
visitAsync.SKIP = SKIP;
visitAsync.REMOVE = REMOVE;
function visitAsync_(_x3, _x4, _x5, _x6) {
  return _visitAsync_.apply(this, arguments);
}
__name(visitAsync_, "visitAsync_");
function _visitAsync_() {
  _visitAsync_ = _asyncToGenerator(function* (key, node, visitor, path) {
    const ctrl = yield callVisitor(key, node, visitor, path);
    if (isNode(ctrl) || isPair(ctrl)) {
      replaceNode(key, path, ctrl);
      return visitAsync_(key, ctrl, visitor, path);
    }
    if (typeof ctrl !== "symbol") {
      if (isCollection(node)) {
        path = Object.freeze(path.concat(node));
        for (let i = 0; i < node.items.length; ++i) {
          const ci = yield visitAsync_(i, node.items[i], visitor, path);
          if (typeof ci === "number") i = ci - 1;
          else if (ci === BREAK) return BREAK;
          else if (ci === REMOVE) {
            node.items.splice(i, 1);
            i -= 1;
          }
        }
      } else if (isPair(node)) {
        path = Object.freeze(path.concat(node));
        const ck = yield visitAsync_("key", node.key, visitor, path);
        if (ck === BREAK) return BREAK;
        else if (ck === REMOVE) node.key = null;
        const cv = yield visitAsync_("value", node.value, visitor, path);
        if (cv === BREAK) return BREAK;
        else if (cv === REMOVE) node.value = null;
      }
    }
    return ctrl;
  });
  return _visitAsync_.apply(this, arguments);
}
__name(_visitAsync_, "_visitAsync_");
function initVisitor(visitor) {
  if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value)) return Object.assign({
    Alias: visitor.Node,
    Map: visitor.Node,
    Scalar: visitor.Node,
    Seq: visitor.Node
  }, visitor.Value && {
    Map: visitor.Value,
    Scalar: visitor.Value,
    Seq: visitor.Value
  }, visitor.Collection && {
    Map: visitor.Collection,
    Seq: visitor.Collection
  }, visitor);
  return visitor;
}
__name(initVisitor, "initVisitor");
function callVisitor(key, node, visitor, path) {
  var _visitor$Map, _visitor$Seq, _visitor$Pair, _visitor$Scalar, _visitor$Alias;
  if (typeof visitor === "function") return visitor(key, node, path);
  if (isMap(node)) return (_visitor$Map = visitor.Map) === null || _visitor$Map === void 0 ? void 0 : _visitor$Map.call(visitor, key, node, path);
  if (isSeq(node)) return (_visitor$Seq = visitor.Seq) === null || _visitor$Seq === void 0 ? void 0 : _visitor$Seq.call(visitor, key, node, path);
  if (isPair(node)) return (_visitor$Pair = visitor.Pair) === null || _visitor$Pair === void 0 ? void 0 : _visitor$Pair.call(visitor, key, node, path);
  if (isScalar(node)) return (_visitor$Scalar = visitor.Scalar) === null || _visitor$Scalar === void 0 ? void 0 : _visitor$Scalar.call(visitor, key, node, path);
  if (isAlias(node)) return (_visitor$Alias = visitor.Alias) === null || _visitor$Alias === void 0 ? void 0 : _visitor$Alias.call(visitor, key, node, path);
}
__name(callVisitor, "callVisitor");
function replaceNode(key, path, node) {
  const parent = path[path.length - 1];
  if (isCollection(parent)) parent.items[key] = node;
  else if (isPair(parent)) if (key === "key") parent.key = node;
  else parent.value = node;
  else if (isDocument(parent)) parent.contents = node;
  else {
    const pt = isAlias(parent) ? "alias" : "scalar";
    throw new Error(`Cannot replace node with ${pt} parent`);
  }
}
__name(replaceNode, "replaceNode");

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/doc/directives.js
var escapeChars = {
  "!": "%21",
  ",": "%2C",
  "[": "%5B",
  "]": "%5D",
  "{": "%7B",
  "}": "%7D"
};
var escapeTagName = /* @__PURE__ */ __name((tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]), "escapeTagName");
var _a2;
var Directives = (_a2 = class {
  constructor(yaml, tags) {
    this.docStart = null;
    this.docEnd = false;
    this.yaml = Object.assign({}, _a2.defaultYaml, yaml);
    this.tags = Object.assign({}, _a2.defaultTags, tags);
  }
  clone() {
    const copy = new _a2(this.yaml, this.tags);
    copy.docStart = this.docStart;
    return copy;
  }
  /**
  * During parsing, get a Directives instance for the current document and
  * update the stream state according to the current version's spec.
  */
  atDocument() {
    const res = new _a2(this.yaml, this.tags);
    switch (this.yaml.version) {
      case "1.1":
        this.atNextDocument = true;
        break;
      case "1.2":
        this.atNextDocument = false;
        this.yaml = {
          explicit: _a2.defaultYaml.explicit,
          version: "1.2"
        };
        this.tags = Object.assign({}, _a2.defaultTags);
        break;
    }
    return res;
  }
  /**
  * @param onError - May be called even if the action was successful
  * @returns `true` on success
  */
  add(line, onError) {
    if (this.atNextDocument) {
      this.yaml = {
        explicit: _a2.defaultYaml.explicit,
        version: "1.1"
      };
      this.tags = Object.assign({}, _a2.defaultTags);
      this.atNextDocument = false;
    }
    const parts = line.trim().split(/[ \t]+/);
    const name = parts.shift();
    switch (name) {
      case "%TAG": {
        if (parts.length !== 2) {
          onError(0, "%TAG directive should contain exactly two parts");
          if (parts.length < 2) return false;
        }
        const [handle, prefix] = parts;
        this.tags[handle] = prefix;
        return true;
      }
      case "%YAML": {
        this.yaml.explicit = true;
        if (parts.length !== 1) {
          onError(0, "%YAML directive should contain exactly one part");
          return false;
        }
        const [version] = parts;
        if (version === "1.1" || version === "1.2") {
          this.yaml.version = version;
          return true;
        } else {
          const isValid = /^\d+\.\d+$/.test(version);
          onError(6, `Unsupported YAML version ${version}`, isValid);
          return false;
        }
      }
      default:
        onError(0, `Unknown directive ${name}`, true);
        return false;
    }
  }
  /**
  * Resolves a tag, matching handles to those defined in %TAG directives.
  *
  * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
  *   `'!local'` tag, or `null` if unresolvable.
  */
  tagName(source, onError) {
    if (source === "!") return "!";
    if (source[0] !== "!") {
      onError(`Not a valid tag: ${source}`);
      return null;
    }
    if (source[1] === "<") {
      const verbatim = source.slice(2, -1);
      if (verbatim === "!" || verbatim === "!!") {
        onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
        return null;
      }
      if (source[source.length - 1] !== ">") onError("Verbatim tags must end with a >");
      return verbatim;
    }
    const [, handle, suffix] = source.match(/* @__PURE__ */ new RegExp("^(.*!)([^!]*)$", "s"));
    if (!suffix) onError(`The ${source} tag has no suffix`);
    const prefix = this.tags[handle];
    if (prefix) try {
      return prefix + decodeURIComponent(suffix);
    } catch (error) {
      onError(String(error));
      return null;
    }
    if (handle === "!") return source;
    onError(`Could not resolve tag: ${source}`);
    return null;
  }
  /**
  * Given a fully resolved tag, returns its printable string form,
  * taking into account current tag prefixes and defaults.
  */
  tagString(tag) {
    for (const [handle, prefix] of Object.entries(this.tags)) if (tag.startsWith(prefix)) return handle + escapeTagName(tag.substring(prefix.length));
    return tag[0] === "!" ? tag : `!<${tag}>`;
  }
  toString(doc) {
    const lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [];
    const tagEntries = Object.entries(this.tags);
    let tagNames;
    if (doc && tagEntries.length > 0 && isNode(doc.contents)) {
      const tags = {};
      visit(doc.contents, (_key, node) => {
        if (isNode(node) && node.tag) tags[node.tag] = true;
      });
      tagNames = Object.keys(tags);
    } else tagNames = [];
    for (const [handle, prefix] of tagEntries) {
      if (handle === "!!" && prefix === "tag:yaml.org,2002:") continue;
      if (!doc || tagNames.some((tn) => tn.startsWith(prefix))) lines.push(`%TAG ${handle} ${prefix}`);
    }
    return lines.join("\n");
  }
}, __name(_a2, "Directives"), _a2);
Directives.defaultYaml = {
  explicit: false,
  version: "1.2"
};
Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/doc/anchors.js
function anchorIsValid(anchor) {
  if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
    const msg = `Anchor must not contain whitespace or control characters: ${JSON.stringify(anchor)}`;
    throw new Error(msg);
  }
  return true;
}
__name(anchorIsValid, "anchorIsValid");
function anchorNames(root) {
  const anchors = /* @__PURE__ */ new Set();
  visit(root, { Value(_key, node) {
    if (node.anchor) anchors.add(node.anchor);
  } });
  return anchors;
}
__name(anchorNames, "anchorNames");
function findNewAnchor(prefix, exclude) {
  for (let i = 1; ; ++i) {
    const name = `${prefix}${i}`;
    if (!exclude.has(name)) return name;
  }
}
__name(findNewAnchor, "findNewAnchor");
function createNodeAnchors(doc, prefix) {
  const aliasObjects = [];
  const sourceObjects = /* @__PURE__ */ new Map();
  let prevAnchors = null;
  return {
    onAnchor: /* @__PURE__ */ __name((source) => {
      var _prevAnchors;
      aliasObjects.push(source);
      (_prevAnchors = prevAnchors) !== null && _prevAnchors !== void 0 || (prevAnchors = anchorNames(doc));
      const anchor = findNewAnchor(prefix, prevAnchors);
      prevAnchors.add(anchor);
      return anchor;
    }, "onAnchor"),
    setAnchors: /* @__PURE__ */ __name(() => {
      for (const source of aliasObjects) {
        const ref = sourceObjects.get(source);
        if (typeof ref === "object" && ref.anchor && (isScalar(ref.node) || isCollection(ref.node))) ref.node.anchor = ref.anchor;
        else {
          const error = /* @__PURE__ */ new Error("Failed to resolve repeated object (this should not happen)");
          error.source = source;
          throw error;
        }
      }
    }, "setAnchors"),
    sourceObjects
  };
}
__name(createNodeAnchors, "createNodeAnchors");

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/doc/applyReviver.js
function applyReviver(reviver, obj, key, val) {
  if (val && typeof val === "object") if (Array.isArray(val)) for (let i = 0, len = val.length; i < len; ++i) {
    const v0 = val[i];
    const v1 = applyReviver(reviver, val, String(i), v0);
    if (v1 === void 0) delete val[i];
    else if (v1 !== v0) val[i] = v1;
  }
  else if (val instanceof Map) for (const k of Array.from(val.keys())) {
    const v0 = val.get(k);
    const v1 = applyReviver(reviver, val, k, v0);
    if (v1 === void 0) val.delete(k);
    else if (v1 !== v0) val.set(k, v1);
  }
  else if (val instanceof Set) for (const v0 of Array.from(val)) {
    const v1 = applyReviver(reviver, val, v0, v0);
    if (v1 === void 0) val.delete(v0);
    else if (v1 !== v0) {
      val.delete(v0);
      val.add(v1);
    }
  }
  else for (const [k, v0] of Object.entries(val)) {
    const v1 = applyReviver(reviver, val, k, v0);
    if (v1 === void 0) delete val[k];
    else if (v1 !== v0) val[k] = v1;
  }
  return reviver.call(obj, key, val);
}
__name(applyReviver, "applyReviver");

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/nodes/toJS.js
function toJS(value, arg, ctx) {
  if (Array.isArray(value)) return value.map((v, i) => toJS(v, String(i), ctx));
  if (value && typeof value.toJSON === "function") {
    if (!ctx || !hasAnchor(value)) return value.toJSON(arg, ctx);
    const data = {
      aliasCount: 0,
      count: 1,
      res: void 0
    };
    ctx.anchors.set(value, data);
    ctx.onCreate = (res2) => {
      data.res = res2;
      delete ctx.onCreate;
    };
    const res = value.toJSON(arg, ctx);
    if (ctx.onCreate) ctx.onCreate(res);
    return res;
  }
  if (typeof value === "bigint" && !(ctx === null || ctx === void 0 ? void 0 : ctx.keep)) return Number(value);
  return value;
}
__name(toJS, "toJS");

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/nodes/Node.js
var _a3;
var NodeBase = (_a3 = class {
  constructor(type) {
    Object.defineProperty(this, NODE_TYPE, { value: type });
  }
  /** Create a copy of this node.  */
  clone() {
    const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
    if (this.range) copy.range = this.range.slice();
    return copy;
  }
  /** A plain JavaScript representation of this node. */
  toJS(doc, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
    if (!isDocument(doc)) throw new TypeError("A document argument is required");
    const ctx = {
      anchors: /* @__PURE__ */ new Map(),
      doc,
      keep: true,
      mapAsMap: mapAsMap === true,
      mapKeyWarned: false,
      maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
    };
    const res = toJS(this, "", ctx);
    if (typeof onAnchor === "function") for (const { count, res: res2 } of ctx.anchors.values()) onAnchor(res2, count);
    return typeof reviver === "function" ? applyReviver(reviver, { "": res }, "", res) : res;
  }
}, __name(_a3, "NodeBase"), _a3);

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/nodes/Alias.js
var _a4;
var Alias = (_a4 = class extends NodeBase {
  constructor(source) {
    super(ALIAS);
    this.source = source;
    Object.defineProperty(this, "tag", { set() {
      throw new Error("Alias nodes cannot have tags");
    } });
  }
  /**
  * Resolve the value of this alias within `doc`, finding the last
  * instance of the `source` anchor before this node.
  */
  resolve(doc, ctx) {
    let nodes;
    if (ctx === null || ctx === void 0 ? void 0 : ctx.aliasResolveCache) nodes = ctx.aliasResolveCache;
    else {
      nodes = [];
      visit(doc, { Node: /* @__PURE__ */ __name((_key, node) => {
        if (isAlias(node) || hasAnchor(node)) nodes.push(node);
      }, "Node") });
      if (ctx) ctx.aliasResolveCache = nodes;
    }
    let found = void 0;
    for (const node of nodes) {
      if (node === this) break;
      if (node.anchor === this.source) found = node;
    }
    return found;
  }
  toJSON(_arg, ctx) {
    if (!ctx) return { source: this.source };
    const { anchors, doc, maxAliasCount } = ctx;
    const source = this.resolve(doc, ctx);
    if (!source) {
      const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
      throw new ReferenceError(msg);
    }
    let data = anchors.get(source);
    if (!data) {
      toJS(source, null, ctx);
      data = anchors.get(source);
    }
    if ((data === null || data === void 0 ? void 0 : data.res) === void 0) throw new ReferenceError("This should not happen: Alias anchor was not resolved?");
    if (maxAliasCount >= 0) {
      data.count += 1;
      if (data.aliasCount === 0) data.aliasCount = getAliasCount(doc, source, anchors);
      if (data.count * data.aliasCount > maxAliasCount) throw new ReferenceError("Excessive alias count indicates a resource exhaustion attack");
    }
    return data.res;
  }
  toString(ctx, _onComment, _onChompKeep) {
    const src = `*${this.source}`;
    if (ctx) {
      anchorIsValid(this.source);
      if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
        const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
        throw new Error(msg);
      }
      if (ctx.implicitKey) return `${src} `;
    }
    return src;
  }
}, __name(_a4, "Alias"), _a4);
function getAliasCount(doc, node, anchors) {
  if (isAlias(node)) {
    const source = node.resolve(doc);
    const anchor = anchors && source && anchors.get(source);
    return anchor ? anchor.count * anchor.aliasCount : 0;
  } else if (isCollection(node)) {
    let count = 0;
    for (const item of node.items) {
      const c = getAliasCount(doc, item, anchors);
      if (c > count) count = c;
    }
    return count;
  } else if (isPair(node)) {
    const kc = getAliasCount(doc, node.key, anchors);
    const vc = getAliasCount(doc, node.value, anchors);
    return Math.max(kc, vc);
  }
  return 1;
}
__name(getAliasCount, "getAliasCount");

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/nodes/Scalar.js
var isScalarValue = /* @__PURE__ */ __name((value) => !value || typeof value !== "function" && typeof value !== "object", "isScalarValue");
var _a5;
var Scalar = (_a5 = class extends NodeBase {
  constructor(value) {
    super(SCALAR);
    this.value = value;
  }
  toJSON(arg, ctx) {
    return (ctx === null || ctx === void 0 ? void 0 : ctx.keep) ? this.value : toJS(this.value, arg, ctx);
  }
  toString() {
    return String(this.value);
  }
}, __name(_a5, "Scalar"), _a5);
Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
Scalar.PLAIN = "PLAIN";
Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/doc/createNode.js
var defaultTagPrefix = "tag:yaml.org,2002:";
function findTagObject(value, tagName, tags) {
  if (tagName) {
    var _match$find;
    const match = tags.filter((t) => t.tag === tagName);
    const tagObj = (_match$find = match.find((t) => !t.format)) !== null && _match$find !== void 0 ? _match$find : match[0];
    if (!tagObj) throw new Error(`Tag ${tagName} not found`);
    return tagObj;
  }
  return tags.find((t) => {
    var _t$identify;
    return ((_t$identify = t.identify) === null || _t$identify === void 0 ? void 0 : _t$identify.call(t, value)) && !t.format;
  });
}
__name(findTagObject, "findTagObject");
function createNode(value, tagName, ctx) {
  var _tagObj$nodeClass;
  if (isDocument(value)) value = value.contents;
  if (isNode(value)) return value;
  if (isPair(value)) {
    var _ctx$schema$MAP$creat, _ctx$schema$MAP;
    const map2 = (_ctx$schema$MAP$creat = (_ctx$schema$MAP = ctx.schema[MAP]).createNode) === null || _ctx$schema$MAP$creat === void 0 ? void 0 : _ctx$schema$MAP$creat.call(_ctx$schema$MAP, ctx.schema, null, ctx);
    map2.items.push(value);
    return map2;
  }
  if (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt !== "undefined" && value instanceof BigInt) value = value.valueOf();
  const { aliasDuplicateObjects, onAnchor, onTagObj, schema: schema4, sourceObjects } = ctx;
  let ref = void 0;
  if (aliasDuplicateObjects && value && typeof value === "object") {
    ref = sourceObjects.get(value);
    if (ref) {
      var _ref$anchor;
      (_ref$anchor = ref.anchor) !== null && _ref$anchor !== void 0 || (ref.anchor = onAnchor(value));
      return new Alias(ref.anchor);
    } else {
      ref = {
        anchor: null,
        node: null
      };
      sourceObjects.set(value, ref);
    }
  }
  if (tagName === null || tagName === void 0 ? void 0 : tagName.startsWith("!!")) tagName = defaultTagPrefix + tagName.slice(2);
  let tagObj = findTagObject(value, tagName, schema4.tags);
  if (!tagObj) {
    if (value && typeof value.toJSON === "function") value = value.toJSON();
    if (!value || typeof value !== "object") {
      const node2 = new Scalar(value);
      if (ref) ref.node = node2;
      return node2;
    }
    tagObj = value instanceof Map ? schema4[MAP] : Symbol.iterator in Object(value) ? schema4[SEQ] : schema4[MAP];
  }
  if (onTagObj) {
    onTagObj(tagObj);
    delete ctx.onTagObj;
  }
  const node = (tagObj === null || tagObj === void 0 ? void 0 : tagObj.createNode) ? tagObj.createNode(ctx.schema, value, ctx) : typeof (tagObj === null || tagObj === void 0 || (_tagObj$nodeClass = tagObj.nodeClass) === null || _tagObj$nodeClass === void 0 ? void 0 : _tagObj$nodeClass.from) === "function" ? tagObj.nodeClass.from(ctx.schema, value, ctx) : new Scalar(value);
  if (tagName) node.tag = tagName;
  else if (!tagObj.default) node.tag = tagObj.tag;
  if (ref) ref.node = node;
  return node;
}
__name(createNode, "createNode");

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/nodes/Collection.js
function collectionFromPath(schema4, path, value) {
  let v = value;
  for (let i = path.length - 1; i >= 0; --i) {
    const k = path[i];
    if (typeof k === "number" && Number.isInteger(k) && k >= 0) {
      const a = [];
      a[k] = v;
      v = a;
    } else v = /* @__PURE__ */ new Map([[k, v]]);
  }
  return createNode(v, void 0, {
    aliasDuplicateObjects: false,
    keepUndefined: false,
    onAnchor: /* @__PURE__ */ __name(() => {
      throw new Error("This should not happen, please report a bug.");
    }, "onAnchor"),
    schema: schema4,
    sourceObjects: /* @__PURE__ */ new Map()
  });
}
__name(collectionFromPath, "collectionFromPath");
var isEmptyPath = /* @__PURE__ */ __name((path) => path == null || typeof path === "object" && !!path[Symbol.iterator]().next().done, "isEmptyPath");
var _a6;
var Collection = (_a6 = class extends NodeBase {
  constructor(type, schema4) {
    super(type);
    Object.defineProperty(this, "schema", {
      value: schema4,
      configurable: true,
      enumerable: false,
      writable: true
    });
  }
  /**
  * Create a copy of this collection.
  *
  * @param schema - If defined, overwrites the original's schema
  */
  clone(schema4) {
    const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
    if (schema4) copy.schema = schema4;
    copy.items = copy.items.map((it) => isNode(it) || isPair(it) ? it.clone(schema4) : it);
    if (this.range) copy.range = this.range.slice();
    return copy;
  }
  /**
  * Adds a value to the collection. For `!!map` and `!!omap` the value must
  * be a Pair instance or a `{ key, value }` object, which may not have a key
  * that already exists in the map.
  */
  addIn(path, value) {
    if (isEmptyPath(path)) this.add(value);
    else {
      const [key, ...rest] = path;
      const node = this.get(key, true);
      if (isCollection(node)) node.addIn(rest, value);
      else if (node === void 0 && this.schema) this.set(key, collectionFromPath(this.schema, rest, value));
      else throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
    }
  }
  /**
  * Removes a value from the collection.
  * @returns `true` if the item was found and removed.
  */
  deleteIn(path) {
    const [key, ...rest] = path;
    if (rest.length === 0) return this.delete(key);
    const node = this.get(key, true);
    if (isCollection(node)) return node.deleteIn(rest);
    else throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
  }
  /**
  * Returns item at `key`, or `undefined` if not found. By default unwraps
  * scalar values from their surrounding node; to disable set `keepScalar` to
  * `true` (collections are always returned intact).
  */
  getIn(path, keepScalar) {
    const [key, ...rest] = path;
    const node = this.get(key, true);
    if (rest.length === 0) return !keepScalar && isScalar(node) ? node.value : node;
    else return isCollection(node) ? node.getIn(rest, keepScalar) : void 0;
  }
  hasAllNullValues(allowScalar) {
    return this.items.every((node) => {
      if (!isPair(node)) return false;
      const n = node.value;
      return n == null || allowScalar && isScalar(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
    });
  }
  /**
  * Checks if the collection includes a value with the key `key`.
  */
  hasIn(path) {
    const [key, ...rest] = path;
    if (rest.length === 0) return this.has(key);
    const node = this.get(key, true);
    return isCollection(node) ? node.hasIn(rest) : false;
  }
  /**
  * Sets a value in this collection. For `!!set`, `value` needs to be a
  * boolean to add/remove the item from the set.
  */
  setIn(path, value) {
    const [key, ...rest] = path;
    if (rest.length === 0) this.set(key, value);
    else {
      const node = this.get(key, true);
      if (isCollection(node)) node.setIn(rest, value);
      else if (node === void 0 && this.schema) this.set(key, collectionFromPath(this.schema, rest, value));
      else throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
    }
  }
}, __name(_a6, "Collection"), _a6);

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/stringify/stringifyComment.js
var stringifyComment = /* @__PURE__ */ __name((str) => str.replace(/^(?!$)(?: $)?/gm, "#"), "stringifyComment");
function indentComment(comment, indent) {
  if (/^\n+$/.test(comment)) return comment.substring(1);
  return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
}
__name(indentComment, "indentComment");
var lineComment = /* @__PURE__ */ __name((str, indent, comment) => str.endsWith("\n") ? indentComment(comment, indent) : comment.includes("\n") ? "\n" + indentComment(comment, indent) : (str.endsWith(" ") ? "" : " ") + comment, "lineComment");

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/stringify/foldFlowLines.js
var FOLD_FLOW = "flow";
var FOLD_BLOCK = "block";
var FOLD_QUOTED = "quoted";
function foldFlowLines(text, indent, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
  if (!lineWidth || lineWidth < 0) return text;
  if (lineWidth < minContentWidth) minContentWidth = 0;
  const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
  if (text.length <= endStep) return text;
  const folds = [];
  const escapedFolds = {};
  let end = lineWidth - indent.length;
  if (typeof indentAtStart === "number") if (indentAtStart > lineWidth - Math.max(2, minContentWidth)) folds.push(0);
  else end = lineWidth - indentAtStart;
  let split = void 0;
  let prev = void 0;
  let overflow = false;
  let i = -1;
  let escStart = -1;
  let escEnd = -1;
  if (mode === "block") {
    i = consumeMoreIndentedLines(text, i, indent.length);
    if (i !== -1) end = i + endStep;
  }
  for (let ch; ch = text[i += 1]; ) {
    if (mode === "quoted" && ch === "\\") {
      escStart = i;
      switch (text[i + 1]) {
        case "x":
          i += 3;
          break;
        case "u":
          i += 5;
          break;
        case "U":
          i += 9;
          break;
        default:
          i += 1;
      }
      escEnd = i;
    }
    if (ch === "\n") {
      if (mode === "block") i = consumeMoreIndentedLines(text, i, indent.length);
      end = i + indent.length + endStep;
      split = void 0;
    } else {
      if (ch === " " && prev && prev !== " " && prev !== "\n" && prev !== "	") {
        const next = text[i + 1];
        if (next && next !== " " && next !== "\n" && next !== "	") split = i;
      }
      if (i >= end) if (split) {
        folds.push(split);
        end = split + endStep;
        split = void 0;
      } else if (mode === "quoted") {
        while (prev === " " || prev === "	") {
          prev = ch;
          ch = text[i += 1];
          overflow = true;
        }
        const j = i > escEnd + 1 ? i - 2 : escStart - 1;
        if (escapedFolds[j]) return text;
        folds.push(j);
        escapedFolds[j] = true;
        end = j + endStep;
        split = void 0;
      } else overflow = true;
    }
    prev = ch;
  }
  if (overflow && onOverflow) onOverflow();
  if (folds.length === 0) return text;
  if (onFold) onFold();
  let res = text.slice(0, folds[0]);
  for (let i2 = 0; i2 < folds.length; ++i2) {
    const fold = folds[i2];
    const end2 = folds[i2 + 1] || text.length;
    if (fold === 0) res = `
${indent}${text.slice(0, end2)}`;
    else {
      if (mode === "quoted" && escapedFolds[fold]) res += `${text[fold]}\\`;
      res += `
${indent}${text.slice(fold + 1, end2)}`;
    }
  }
  return res;
}
__name(foldFlowLines, "foldFlowLines");
function consumeMoreIndentedLines(text, i, indent) {
  let end = i;
  let start = i + 1;
  let ch = text[start];
  while (ch === " " || ch === "	") if (i < start + indent) ch = text[++i];
  else {
    do
      ch = text[++i];
    while (ch && ch !== "\n");
    end = i;
    start = i + 1;
    ch = text[start];
  }
  return end;
}
__name(consumeMoreIndentedLines, "consumeMoreIndentedLines");

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/stringify/stringifyString.js
var getFoldOptions = /* @__PURE__ */ __name((ctx, isBlock) => ({
  indentAtStart: isBlock ? ctx.indent.length : ctx.indentAtStart,
  lineWidth: ctx.options.lineWidth,
  minContentWidth: ctx.options.minContentWidth
}), "getFoldOptions");
var containsDocumentMarker = /* @__PURE__ */ __name((str) => /^(%|---|\.\.\.)/m.test(str), "containsDocumentMarker");
function lineLengthOverLimit(str, lineWidth, indentLength) {
  if (!lineWidth || lineWidth < 0) return false;
  const limit = lineWidth - indentLength;
  const strLen = str.length;
  if (strLen <= limit) return false;
  for (let i = 0, start = 0; i < strLen; ++i) if (str[i] === "\n") {
    if (i - start > limit) return true;
    start = i + 1;
    if (strLen - start <= limit) return false;
  }
  return true;
}
__name(lineLengthOverLimit, "lineLengthOverLimit");
function doubleQuotedString(value, ctx) {
  const json = JSON.stringify(value);
  if (ctx.options.doubleQuotedAsJSON) return json;
  const { implicitKey } = ctx;
  const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
  const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
  let str = "";
  let start = 0;
  for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
    if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n") {
      str += json.slice(start, i) + "\\ ";
      i += 1;
      start = i;
      ch = "\\";
    }
    if (ch === "\\") switch (json[i + 1]) {
      case "u":
        {
          str += json.slice(start, i);
          const code = json.substr(i + 2, 4);
          switch (code) {
            case "0000":
              str += "\\0";
              break;
            case "0007":
              str += "\\a";
              break;
            case "000b":
              str += "\\v";
              break;
            case "001b":
              str += "\\e";
              break;
            case "0085":
              str += "\\N";
              break;
            case "00a0":
              str += "\\_";
              break;
            case "2028":
              str += "\\L";
              break;
            case "2029":
              str += "\\P";
              break;
            default:
              if (code.substr(0, 2) === "00") str += "\\x" + code.substr(2);
              else str += json.substr(i, 6);
          }
          i += 5;
          start = i + 1;
        }
        break;
      case "n":
        if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) i += 1;
        else {
          str += json.slice(start, i) + "\n\n";
          while (json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== '"') {
            str += "\n";
            i += 2;
          }
          str += indent;
          if (json[i + 2] === " ") str += "\\";
          i += 1;
          start = i + 1;
        }
        break;
      default:
        i += 1;
    }
  }
  str = start ? str + json.slice(start) : json;
  return implicitKey ? str : foldFlowLines(str, indent, FOLD_QUOTED, getFoldOptions(ctx, false));
}
__name(doubleQuotedString, "doubleQuotedString");
function singleQuotedString(value, ctx) {
  if (ctx.options.singleQuote === false || ctx.implicitKey && value.includes("\n") || /[ \t]\n|\n[ \t]/.test(value)) return doubleQuotedString(value, ctx);
  const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
  const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
  return ctx.implicitKey ? res : foldFlowLines(res, indent, FOLD_FLOW, getFoldOptions(ctx, false));
}
__name(singleQuotedString, "singleQuotedString");
function quotedString(value, ctx) {
  const { singleQuote } = ctx.options;
  let qs;
  if (singleQuote === false) qs = doubleQuotedString;
  else {
    const hasDouble = value.includes('"');
    const hasSingle = value.includes("'");
    if (hasDouble && !hasSingle) qs = singleQuotedString;
    else if (hasSingle && !hasDouble) qs = doubleQuotedString;
    else qs = singleQuote ? singleQuotedString : doubleQuotedString;
  }
  return qs(value, ctx);
}
__name(quotedString, "quotedString");
var blockEndNewlines;
try {
  blockEndNewlines = /* @__PURE__ */ new RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
} catch (_unused) {
  blockEndNewlines = /\n+(?!\n|$)/g;
}
function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
  const { blockQuote, commentString, lineWidth } = ctx.options;
  if (!blockQuote || /\n[\t ]+$/.test(value)) return quotedString(value, ctx);
  const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : "");
  const literal = blockQuote === "literal" ? true : blockQuote === "folded" || type === Scalar.BLOCK_FOLDED ? false : type === Scalar.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, lineWidth, indent.length);
  if (!value) return literal ? "|\n" : ">\n";
  let chomp;
  let endStart;
  for (endStart = value.length; endStart > 0; --endStart) {
    const ch = value[endStart - 1];
    if (ch !== "\n" && ch !== "	" && ch !== " ") break;
  }
  let end = value.substring(endStart);
  const endNlPos = end.indexOf("\n");
  if (endNlPos === -1) chomp = "-";
  else if (value === end || endNlPos !== end.length - 1) {
    chomp = "+";
    if (onChompKeep) onChompKeep();
  } else chomp = "";
  if (end) {
    value = value.slice(0, -end.length);
    if (end[end.length - 1] === "\n") end = end.slice(0, -1);
    end = end.replace(blockEndNewlines, `$&${indent}`);
  }
  let startWithSpace = false;
  let startEnd;
  let startNlPos = -1;
  for (startEnd = 0; startEnd < value.length; ++startEnd) {
    const ch = value[startEnd];
    if (ch === " ") startWithSpace = true;
    else if (ch === "\n") startNlPos = startEnd;
    else break;
  }
  let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
  if (start) {
    value = value.substring(start.length);
    start = start.replace(/\n+/g, `$&${indent}`);
  }
  let header = (startWithSpace ? indent ? "2" : "1" : "") + chomp;
  if (comment) {
    header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " "));
    if (onComment) onComment();
  }
  if (!literal) {
    const foldedValue = value.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
    let literalFallback = false;
    const foldOptions = getFoldOptions(ctx, true);
    if (blockQuote !== "folded" && type !== Scalar.BLOCK_FOLDED) foldOptions.onOverflow = () => {
      literalFallback = true;
    };
    const body = foldFlowLines(`${start}${foldedValue}${end}`, indent, FOLD_BLOCK, foldOptions);
    if (!literalFallback) return `>${header}
${indent}${body}`;
  }
  value = value.replace(/\n+/g, `$&${indent}`);
  return `|${header}
${indent}${start}${value}${end}`;
}
__name(blockString, "blockString");
function plainString(item, ctx, onComment, onChompKeep) {
  const { type, value } = item;
  const { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
  if (implicitKey && value.includes("\n") || inFlow && /[[\]{},]/.test(value)) return quotedString(value, ctx);
  if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) return implicitKey || inFlow || !value.includes("\n") ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
  if (!implicitKey && !inFlow && type !== Scalar.PLAIN && value.includes("\n")) return blockString(item, ctx, onComment, onChompKeep);
  if (containsDocumentMarker(value)) {
    if (indent === "") {
      ctx.forceBlockIndent = true;
      return blockString(item, ctx, onComment, onChompKeep);
    } else if (implicitKey && indent === indentStep) return quotedString(value, ctx);
  }
  const str = value.replace(/\n+/g, `$&
${indent}`);
  if (actualString) {
    const test = /* @__PURE__ */ __name((tag) => {
      var _tag$test;
      return tag.default && tag.tag !== "tag:yaml.org,2002:str" && ((_tag$test = tag.test) === null || _tag$test === void 0 ? void 0 : _tag$test.test(str));
    }, "test");
    const { compat, tags } = ctx.doc.schema;
    if (tags.some(test) || (compat === null || compat === void 0 ? void 0 : compat.some(test))) return quotedString(value, ctx);
  }
  return implicitKey ? str : foldFlowLines(str, indent, FOLD_FLOW, getFoldOptions(ctx, false));
}
__name(plainString, "plainString");
function stringifyString(item, ctx, onComment, onChompKeep) {
  const { implicitKey, inFlow } = ctx;
  const ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) });
  let { type } = item;
  if (type !== Scalar.QUOTE_DOUBLE) {
    if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value)) type = Scalar.QUOTE_DOUBLE;
  }
  const _stringify = /* @__PURE__ */ __name((_type) => {
    switch (_type) {
      case Scalar.BLOCK_FOLDED:
      case Scalar.BLOCK_LITERAL:
        return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
      case Scalar.QUOTE_DOUBLE:
        return doubleQuotedString(ss.value, ctx);
      case Scalar.QUOTE_SINGLE:
        return singleQuotedString(ss.value, ctx);
      case Scalar.PLAIN:
        return plainString(ss, ctx, onComment, onChompKeep);
      default:
        return null;
    }
  }, "_stringify");
  let res = _stringify(type);
  if (res === null) {
    const { defaultKeyType, defaultStringType } = ctx.options;
    const t = implicitKey && defaultKeyType || defaultStringType;
    res = _stringify(t);
    if (res === null) throw new Error(`Unsupported default string type ${t}`);
  }
  return res;
}
__name(stringifyString, "stringifyString");

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/stringify/stringify.js
function createStringifyContext(doc, options) {
  const opt = Object.assign({
    blockQuote: true,
    commentString: stringifyComment,
    defaultKeyType: null,
    defaultStringType: "PLAIN",
    directives: null,
    doubleQuotedAsJSON: false,
    doubleQuotedMinMultiLineLength: 40,
    falseStr: "false",
    flowCollectionPadding: true,
    indentSeq: true,
    lineWidth: 80,
    minContentWidth: 20,
    nullStr: "null",
    simpleKeys: false,
    singleQuote: null,
    trailingComma: false,
    trueStr: "true",
    verifyAliasOrder: true
  }, doc.schema.toStringOptions, options);
  let inFlow;
  switch (opt.collectionStyle) {
    case "block":
      inFlow = false;
      break;
    case "flow":
      inFlow = true;
      break;
    default:
      inFlow = null;
  }
  return {
    anchors: /* @__PURE__ */ new Set(),
    doc,
    flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
    indent: "",
    indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
    inFlow,
    options: opt
  };
}
__name(createStringifyContext, "createStringifyContext");
function getTagObject(tags, item) {
  if (item.tag) {
    var _match$find;
    const match = tags.filter((t) => t.tag === item.tag);
    if (match.length > 0) return (_match$find = match.find((t) => t.format === item.format)) !== null && _match$find !== void 0 ? _match$find : match[0];
  }
  let tagObj = void 0;
  let obj;
  if (isScalar(item)) {
    var _match$find2;
    obj = item.value;
    let match = tags.filter((t) => {
      var _t$identify;
      return (_t$identify = t.identify) === null || _t$identify === void 0 ? void 0 : _t$identify.call(t, obj);
    });
    if (match.length > 1) {
      const testMatch = match.filter((t) => t.test);
      if (testMatch.length > 0) match = testMatch;
    }
    tagObj = (_match$find2 = match.find((t) => t.format === item.format)) !== null && _match$find2 !== void 0 ? _match$find2 : match.find((t) => !t.format);
  } else {
    obj = item;
    tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
  }
  if (!tagObj) {
    var _obj$constructor$name, _obj$constructor;
    const name = (_obj$constructor$name = obj === null || obj === void 0 || (_obj$constructor = obj.constructor) === null || _obj$constructor === void 0 ? void 0 : _obj$constructor.name) !== null && _obj$constructor$name !== void 0 ? _obj$constructor$name : obj === null ? "null" : typeof obj;
    throw new Error(`Tag not resolved for ${name} value`);
  }
  return tagObj;
}
__name(getTagObject, "getTagObject");
function stringifyProps(node, tagObj, { anchors, doc }) {
  var _node$tag;
  if (!doc.directives) return "";
  const props = [];
  const anchor = (isScalar(node) || isCollection(node)) && node.anchor;
  if (anchor && anchorIsValid(anchor)) {
    anchors.add(anchor);
    props.push(`&${anchor}`);
  }
  const tag = (_node$tag = node.tag) !== null && _node$tag !== void 0 ? _node$tag : tagObj.default ? null : tagObj.tag;
  if (tag) props.push(doc.directives.tagString(tag));
  return props.join(" ");
}
__name(stringifyProps, "stringifyProps");
function stringify(item, ctx, onComment, onChompKeep) {
  var _tagObj, _ctx$indentAtStart;
  if (isPair(item)) return item.toString(ctx, onComment, onChompKeep);
  if (isAlias(item)) {
    var _ctx$resolvedAliases;
    if (ctx.doc.directives) return item.toString(ctx);
    if ((_ctx$resolvedAliases = ctx.resolvedAliases) === null || _ctx$resolvedAliases === void 0 ? void 0 : _ctx$resolvedAliases.has(item)) throw new TypeError(`Cannot stringify circular structure without alias nodes`);
    else {
      if (ctx.resolvedAliases) ctx.resolvedAliases.add(item);
      else ctx.resolvedAliases = /* @__PURE__ */ new Set([item]);
      item = item.resolve(ctx.doc);
    }
  }
  let tagObj = void 0;
  const node = isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: /* @__PURE__ */ __name((o) => tagObj = o, "onTagObj") });
  (_tagObj = tagObj) !== null && _tagObj !== void 0 || (tagObj = getTagObject(ctx.doc.schema.tags, node));
  const props = stringifyProps(node, tagObj, ctx);
  if (props.length > 0) ctx.indentAtStart = ((_ctx$indentAtStart = ctx.indentAtStart) !== null && _ctx$indentAtStart !== void 0 ? _ctx$indentAtStart : 0) + props.length + 1;
  const str = typeof tagObj.stringify === "function" ? tagObj.stringify(node, ctx, onComment, onChompKeep) : isScalar(node) ? stringifyString(node, ctx, onComment, onChompKeep) : node.toString(ctx, onComment, onChompKeep);
  if (!props) return str;
  return isScalar(node) || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}
${ctx.indent}${str}`;
}
__name(stringify, "stringify");

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/stringify/stringifyPair.js
function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
  const { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
  let keyComment = isNode(key) && key.comment || null;
  if (simpleKeys) {
    if (keyComment) throw new Error("With simple keys, key nodes cannot have comments");
    if (isCollection(key) || !isNode(key) && typeof key === "object") throw new Error("With simple keys, collection cannot be used as a key value");
  }
  let explicitKey = !simpleKeys && (!key || keyComment && value == null && !ctx.inFlow || isCollection(key) || (isScalar(key) ? key.type === Scalar.BLOCK_FOLDED || key.type === Scalar.BLOCK_LITERAL : typeof key === "object"));
  ctx = Object.assign({}, ctx, {
    allNullValues: false,
    implicitKey: !explicitKey && (simpleKeys || !allNullValues),
    indent: indent + indentStep
  });
  let keyCommentDone = false;
  let chompKeep = false;
  let str = stringify(key, ctx, () => keyCommentDone = true, () => chompKeep = true);
  if (!explicitKey && !ctx.inFlow && str.length > 1024) {
    if (simpleKeys) throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
    explicitKey = true;
  }
  if (ctx.inFlow) {
    if (allNullValues || value == null) {
      if (keyCommentDone && onComment) onComment();
      return str === "" ? "?" : explicitKey ? `? ${str}` : str;
    }
  } else if (allNullValues && !simpleKeys || value == null && explicitKey) {
    str = `? ${str}`;
    if (keyComment && !keyCommentDone) str += lineComment(str, ctx.indent, commentString(keyComment));
    else if (chompKeep && onChompKeep) onChompKeep();
    return str;
  }
  if (keyCommentDone) keyComment = null;
  if (explicitKey) {
    if (keyComment) str += lineComment(str, ctx.indent, commentString(keyComment));
    str = `? ${str}
${indent}:`;
  } else {
    str = `${str}:`;
    if (keyComment) str += lineComment(str, ctx.indent, commentString(keyComment));
  }
  let vsb, vcb, valueComment;
  if (isNode(value)) {
    vsb = !!value.spaceBefore;
    vcb = value.commentBefore;
    valueComment = value.comment;
  } else {
    vsb = false;
    vcb = null;
    valueComment = null;
    if (value && typeof value === "object") value = doc.createNode(value);
  }
  ctx.implicitKey = false;
  if (!explicitKey && !keyComment && isScalar(value)) ctx.indentAtStart = str.length + 1;
  chompKeep = false;
  if (!indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && isSeq(value) && !value.flow && !value.tag && !value.anchor) ctx.indent = ctx.indent.substring(2);
  let valueCommentDone = false;
  const valueStr = stringify(value, ctx, () => valueCommentDone = true, () => chompKeep = true);
  let ws = " ";
  if (keyComment || vsb || vcb) {
    ws = vsb ? "\n" : "";
    if (vcb) {
      const cs = commentString(vcb);
      ws += `
${indentComment(cs, ctx.indent)}`;
    }
    if (valueStr === "" && !ctx.inFlow) {
      if (ws === "\n" && valueComment) ws = "\n\n";
    } else ws += `
${ctx.indent}`;
  } else if (!explicitKey && isCollection(value)) {
    var _ref, _ctx$inFlow;
    const vs0 = valueStr[0];
    const nl0 = valueStr.indexOf("\n");
    const hasNewline = nl0 !== -1;
    const flow = (_ref = (_ctx$inFlow = ctx.inFlow) !== null && _ctx$inFlow !== void 0 ? _ctx$inFlow : value.flow) !== null && _ref !== void 0 ? _ref : value.items.length === 0;
    if (hasNewline || !flow) {
      let hasPropsLine = false;
      if (hasNewline && (vs0 === "&" || vs0 === "!")) {
        let sp0 = valueStr.indexOf(" ");
        if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!") sp0 = valueStr.indexOf(" ", sp0 + 1);
        if (sp0 === -1 || nl0 < sp0) hasPropsLine = true;
      }
      if (!hasPropsLine) ws = `
${ctx.indent}`;
    }
  } else if (valueStr === "" || valueStr[0] === "\n") ws = "";
  str += ws + valueStr;
  if (ctx.inFlow) {
    if (valueCommentDone && onComment) onComment();
  } else if (valueComment && !valueCommentDone) str += lineComment(str, ctx.indent, commentString(valueComment));
  else if (chompKeep && onChompKeep) onChompKeep();
  return str;
}
__name(stringifyPair, "stringifyPair");

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/schema/yaml-1.1/merge.js
var MERGE_KEY = "<<";
var merge = {
  identify: /* @__PURE__ */ __name((value) => value === MERGE_KEY || typeof value === "symbol" && value.description === MERGE_KEY, "identify"),
  default: "key",
  tag: "tag:yaml.org,2002:merge",
  test: /^<<$/,
  resolve: /* @__PURE__ */ __name(() => Object.assign(new Scalar(Symbol(MERGE_KEY)), { addToJSMap: addMergeToJSMap }), "resolve"),
  stringify: /* @__PURE__ */ __name(() => MERGE_KEY, "stringify")
};
var isMergeKey = /* @__PURE__ */ __name((ctx, key) => (merge.identify(key) || isScalar(key) && (!key.type || key.type === Scalar.PLAIN) && merge.identify(key.value)) && (ctx === null || ctx === void 0 ? void 0 : ctx.doc.schema.tags.some((tag) => tag.tag === merge.tag && tag.default)), "isMergeKey");
function addMergeToJSMap(ctx, map2, value) {
  value = ctx && isAlias(value) ? value.resolve(ctx.doc) : value;
  if (isSeq(value)) for (const it of value.items) mergeValue(ctx, map2, it);
  else if (Array.isArray(value)) for (const it of value) mergeValue(ctx, map2, it);
  else mergeValue(ctx, map2, value);
}
__name(addMergeToJSMap, "addMergeToJSMap");
function mergeValue(ctx, map2, value) {
  const source = ctx && isAlias(value) ? value.resolve(ctx.doc) : value;
  if (!isMap(source)) throw new Error("Merge sources must be maps or map aliases");
  const srcMap = source.toJSON(null, ctx, Map);
  for (const [key, value2] of srcMap) if (map2 instanceof Map) {
    if (!map2.has(key)) map2.set(key, value2);
  } else if (map2 instanceof Set) map2.add(key);
  else if (!Object.prototype.hasOwnProperty.call(map2, key)) Object.defineProperty(map2, key, {
    value: value2,
    writable: true,
    enumerable: true,
    configurable: true
  });
  return map2;
}
__name(mergeValue, "mergeValue");

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/nodes/addPairToJSMap.js
function addPairToJSMap(ctx, map2, { key, value }) {
  if (isNode(key) && key.addToJSMap) key.addToJSMap(ctx, map2, value);
  else if (isMergeKey(ctx, key)) addMergeToJSMap(ctx, map2, value);
  else {
    const jsKey = toJS(key, "", ctx);
    if (map2 instanceof Map) map2.set(jsKey, toJS(value, jsKey, ctx));
    else if (map2 instanceof Set) map2.add(jsKey);
    else {
      const stringKey = stringifyKey(key, jsKey, ctx);
      const jsValue = toJS(value, stringKey, ctx);
      if (stringKey in map2) Object.defineProperty(map2, stringKey, {
        value: jsValue,
        writable: true,
        enumerable: true,
        configurable: true
      });
      else map2[stringKey] = jsValue;
    }
  }
  return map2;
}
__name(addPairToJSMap, "addPairToJSMap");
function stringifyKey(key, jsKey, ctx) {
  if (jsKey === null) return "";
  if (typeof jsKey !== "object") return String(jsKey);
  if (isNode(key) && (ctx === null || ctx === void 0 ? void 0 : ctx.doc)) {
    const strCtx = createStringifyContext(ctx.doc, {});
    strCtx.anchors = /* @__PURE__ */ new Set();
    for (const node of ctx.anchors.keys()) strCtx.anchors.add(node.anchor);
    strCtx.inFlow = true;
    strCtx.inStringifyKey = true;
    const strKey = key.toString(strCtx);
    if (!ctx.mapKeyWarned) {
      let jsonStr = JSON.stringify(strKey);
      if (jsonStr.length > 40) jsonStr = jsonStr.substring(0, 36) + '..."';
      warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
      ctx.mapKeyWarned = true;
    }
    return strKey;
  }
  return JSON.stringify(jsKey);
}
__name(stringifyKey, "stringifyKey");

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/nodes/Pair.js
function createPair(key, value, ctx) {
  return new Pair(createNode(key, void 0, ctx), createNode(value, void 0, ctx));
}
__name(createPair, "createPair");
var _a7;
var Pair = (_a7 = class {
  constructor(key, value = null) {
    Object.defineProperty(this, NODE_TYPE, { value: PAIR });
    this.key = key;
    this.value = value;
  }
  clone(schema4) {
    let { key, value } = this;
    if (isNode(key)) key = key.clone(schema4);
    if (isNode(value)) value = value.clone(schema4);
    return new _a7(key, value);
  }
  toJSON(_, ctx) {
    return addPairToJSMap(ctx, (ctx === null || ctx === void 0 ? void 0 : ctx.mapAsMap) ? /* @__PURE__ */ new Map() : {}, this);
  }
  toString(ctx, onComment, onChompKeep) {
    return (ctx === null || ctx === void 0 ? void 0 : ctx.doc) ? stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
  }
}, __name(_a7, "Pair"), _a7);

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/stringify/stringifyCollection.js
function stringifyCollection(collection, ctx, options) {
  var _ctx$inFlow;
  return (((_ctx$inFlow = ctx.inFlow) !== null && _ctx$inFlow !== void 0 ? _ctx$inFlow : collection.flow) ? stringifyFlowCollection : stringifyBlockCollection)(collection, ctx, options);
}
__name(stringifyCollection, "stringifyCollection");
function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
  const { indent, options: { commentString } } = ctx;
  const itemCtx = Object.assign({}, ctx, {
    indent: itemIndent,
    type: null
  });
  let chompKeep = false;
  const lines = [];
  for (let i = 0; i < items.length; ++i) {
    const item = items[i];
    let comment2 = null;
    if (isNode(item)) {
      if (!chompKeep && item.spaceBefore) lines.push("");
      addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
      if (item.comment) comment2 = item.comment;
    } else if (isPair(item)) {
      const ik = isNode(item.key) ? item.key : null;
      if (ik) {
        if (!chompKeep && ik.spaceBefore) lines.push("");
        addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
      }
    }
    chompKeep = false;
    let str2 = stringify(item, itemCtx, () => comment2 = null, () => chompKeep = true);
    if (comment2) str2 += lineComment(str2, itemIndent, commentString(comment2));
    if (chompKeep && comment2) chompKeep = false;
    lines.push(blockItemPrefix + str2);
  }
  let str;
  if (lines.length === 0) str = flowChars.start + flowChars.end;
  else {
    str = lines[0];
    for (let i = 1; i < lines.length; ++i) {
      const line = lines[i];
      str += line ? `
${indent}${line}` : "\n";
    }
  }
  if (comment) {
    str += "\n" + indentComment(commentString(comment), indent);
    if (onComment) onComment();
  } else if (chompKeep && onChompKeep) onChompKeep();
  return str;
}
__name(stringifyBlockCollection, "stringifyBlockCollection");
function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
  const { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
  itemIndent += indentStep;
  const itemCtx = Object.assign({}, ctx, {
    indent: itemIndent,
    inFlow: true,
    type: null
  });
  let reqNewline = false;
  let linesAtValue = 0;
  const lines = [];
  for (let i = 0; i < items.length; ++i) {
    const item = items[i];
    let comment = null;
    if (isNode(item)) {
      if (item.spaceBefore) lines.push("");
      addCommentBefore(ctx, lines, item.commentBefore, false);
      if (item.comment) comment = item.comment;
    } else if (isPair(item)) {
      const ik = isNode(item.key) ? item.key : null;
      if (ik) {
        if (ik.spaceBefore) lines.push("");
        addCommentBefore(ctx, lines, ik.commentBefore, false);
        if (ik.comment) reqNewline = true;
      }
      const iv = isNode(item.value) ? item.value : null;
      if (iv) {
        if (iv.comment) comment = iv.comment;
        if (iv.commentBefore) reqNewline = true;
      } else if (item.value == null && (ik === null || ik === void 0 ? void 0 : ik.comment)) comment = ik.comment;
    }
    if (comment) reqNewline = true;
    let str = stringify(item, itemCtx, () => comment = null);
    reqNewline || (reqNewline = lines.length > linesAtValue || str.includes("\n"));
    if (i < items.length - 1) str += ",";
    else if (ctx.options.trailingComma) {
      if (ctx.options.lineWidth > 0) reqNewline || (reqNewline = lines.reduce((sum, line) => sum + line.length + 2, 2) + (str.length + 2) > ctx.options.lineWidth);
      if (reqNewline) str += ",";
    }
    if (comment) str += lineComment(str, itemIndent, commentString(comment));
    lines.push(str);
    linesAtValue = lines.length;
  }
  const { start, end } = flowChars;
  if (lines.length === 0) return start + end;
  else {
    if (!reqNewline) {
      const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
      reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
    }
    if (reqNewline) {
      let str = start;
      for (const line of lines) str += line ? `
${indentStep}${indent}${line}` : "\n";
      return `${str}
${indent}${end}`;
    } else return `${start}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
  }
}
__name(stringifyFlowCollection, "stringifyFlowCollection");
function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
  if (comment && chompKeep) comment = comment.replace(/^\n+/, "");
  if (comment) {
    const ic = indentComment(commentString(comment), indent);
    lines.push(ic.trimStart());
  }
}
__name(addCommentBefore, "addCommentBefore");

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/nodes/YAMLMap.js
function findPair(items, key) {
  const k = isScalar(key) ? key.value : key;
  for (const it of items) if (isPair(it)) {
    if (it.key === key || it.key === k) return it;
    if (isScalar(it.key) && it.key.value === k) return it;
  }
}
__name(findPair, "findPair");
var _a8;
var YAMLMap = (_a8 = class extends Collection {
  static get tagName() {
    return "tag:yaml.org,2002:map";
  }
  constructor(schema4) {
    super(MAP, schema4);
    this.items = [];
  }
  /**
  * A generic collection parsing method that can be extended
  * to other node classes that inherit from YAMLMap
  */
  static from(schema4, obj, ctx) {
    const { keepUndefined, replacer } = ctx;
    const map2 = new this(schema4);
    const add = /* @__PURE__ */ __name((key, value) => {
      if (typeof replacer === "function") value = replacer.call(obj, key, value);
      else if (Array.isArray(replacer) && !replacer.includes(key)) return;
      if (value !== void 0 || keepUndefined) map2.items.push(createPair(key, value, ctx));
    }, "add");
    if (obj instanceof Map) for (const [key, value] of obj) add(key, value);
    else if (obj && typeof obj === "object") for (const key of Object.keys(obj)) add(key, obj[key]);
    if (typeof schema4.sortMapEntries === "function") map2.items.sort(schema4.sortMapEntries);
    return map2;
  }
  /**
  * Adds a value to the collection.
  *
  * @param overwrite - If not set `true`, using a key that is already in the
  *   collection will throw. Otherwise, overwrites the previous value.
  */
  add(pair, overwrite) {
    var _this$schema;
    let _pair;
    if (isPair(pair)) _pair = pair;
    else if (!pair || typeof pair !== "object" || !("key" in pair)) _pair = new Pair(pair, pair === null || pair === void 0 ? void 0 : pair.value);
    else _pair = new Pair(pair.key, pair.value);
    const prev = findPair(this.items, _pair.key);
    const sortEntries = (_this$schema = this.schema) === null || _this$schema === void 0 ? void 0 : _this$schema.sortMapEntries;
    if (prev) {
      if (!overwrite) throw new Error(`Key ${_pair.key} already set`);
      if (isScalar(prev.value) && isScalarValue(_pair.value)) prev.value.value = _pair.value;
      else prev.value = _pair.value;
    } else if (sortEntries) {
      const i = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
      if (i === -1) this.items.push(_pair);
      else this.items.splice(i, 0, _pair);
    } else this.items.push(_pair);
  }
  delete(key) {
    const it = findPair(this.items, key);
    if (!it) return false;
    return this.items.splice(this.items.indexOf(it), 1).length > 0;
  }
  get(key, keepScalar) {
    var _ref;
    const it = findPair(this.items, key);
    const node = it === null || it === void 0 ? void 0 : it.value;
    return (_ref = !keepScalar && isScalar(node) ? node.value : node) !== null && _ref !== void 0 ? _ref : void 0;
  }
  has(key) {
    return !!findPair(this.items, key);
  }
  set(key, value) {
    this.add(new Pair(key, value), true);
  }
  /**
  * @param ctx - Conversion context, originally set in Document#toJS()
  * @param {Class} Type - If set, forces the returned collection type
  * @returns Instance of Type, Map, or Object
  */
  toJSON(_, ctx, Type) {
    const map2 = Type ? new Type() : (ctx === null || ctx === void 0 ? void 0 : ctx.mapAsMap) ? /* @__PURE__ */ new Map() : {};
    if (ctx === null || ctx === void 0 ? void 0 : ctx.onCreate) ctx.onCreate(map2);
    for (const item of this.items) addPairToJSMap(ctx, map2, item);
    return map2;
  }
  toString(ctx, onComment, onChompKeep) {
    if (!ctx) return JSON.stringify(this);
    for (const item of this.items) if (!isPair(item)) throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
    if (!ctx.allNullValues && this.hasAllNullValues(false)) ctx = Object.assign({}, ctx, { allNullValues: true });
    return stringifyCollection(this, ctx, {
      blockItemPrefix: "",
      flowChars: {
        start: "{",
        end: "}"
      },
      itemIndent: ctx.indent || "",
      onChompKeep,
      onComment
    });
  }
}, __name(_a8, "YAMLMap"), _a8);

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/schema/common/map.js
var map = {
  collection: "map",
  default: true,
  nodeClass: YAMLMap,
  tag: "tag:yaml.org,2002:map",
  resolve(map2, onError) {
    if (!isMap(map2)) onError("Expected a mapping for this tag");
    return map2;
  },
  createNode: /* @__PURE__ */ __name((schema4, obj, ctx) => YAMLMap.from(schema4, obj, ctx), "createNode")
};

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/nodes/YAMLSeq.js
var _a9;
var YAMLSeq = (_a9 = class extends Collection {
  static get tagName() {
    return "tag:yaml.org,2002:seq";
  }
  constructor(schema4) {
    super(SEQ, schema4);
    this.items = [];
  }
  add(value) {
    this.items.push(value);
  }
  /**
  * Removes a value from the collection.
  *
  * `key` must contain a representation of an integer for this to succeed.
  * It may be wrapped in a `Scalar`.
  *
  * @returns `true` if the item was found and removed.
  */
  delete(key) {
    const idx = asItemIndex(key);
    if (typeof idx !== "number") return false;
    return this.items.splice(idx, 1).length > 0;
  }
  get(key, keepScalar) {
    const idx = asItemIndex(key);
    if (typeof idx !== "number") return void 0;
    const it = this.items[idx];
    return !keepScalar && isScalar(it) ? it.value : it;
  }
  /**
  * Checks if the collection includes a value with the key `key`.
  *
  * `key` must contain a representation of an integer for this to succeed.
  * It may be wrapped in a `Scalar`.
  */
  has(key) {
    const idx = asItemIndex(key);
    return typeof idx === "number" && idx < this.items.length;
  }
  /**
  * Sets a value in this collection. For `!!set`, `value` needs to be a
  * boolean to add/remove the item from the set.
  *
  * If `key` does not contain a representation of an integer, this will throw.
  * It may be wrapped in a `Scalar`.
  */
  set(key, value) {
    const idx = asItemIndex(key);
    if (typeof idx !== "number") throw new Error(`Expected a valid index, not ${key}.`);
    const prev = this.items[idx];
    if (isScalar(prev) && isScalarValue(value)) prev.value = value;
    else this.items[idx] = value;
  }
  toJSON(_, ctx) {
    const seq2 = [];
    if (ctx === null || ctx === void 0 ? void 0 : ctx.onCreate) ctx.onCreate(seq2);
    let i = 0;
    for (const item of this.items) seq2.push(toJS(item, String(i++), ctx));
    return seq2;
  }
  toString(ctx, onComment, onChompKeep) {
    if (!ctx) return JSON.stringify(this);
    return stringifyCollection(this, ctx, {
      blockItemPrefix: "- ",
      flowChars: {
        start: "[",
        end: "]"
      },
      itemIndent: (ctx.indent || "") + "  ",
      onChompKeep,
      onComment
    });
  }
  static from(schema4, obj, ctx) {
    const { replacer } = ctx;
    const seq2 = new this(schema4);
    if (obj && Symbol.iterator in Object(obj)) {
      let i = 0;
      for (let it of obj) {
        if (typeof replacer === "function") {
          const key = obj instanceof Set ? it : String(i++);
          it = replacer.call(obj, key, it);
        }
        seq2.items.push(createNode(it, void 0, ctx));
      }
    }
    return seq2;
  }
}, __name(_a9, "YAMLSeq"), _a9);
function asItemIndex(key) {
  let idx = isScalar(key) ? key.value : key;
  if (idx && typeof idx === "string") idx = Number(idx);
  return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
}
__name(asItemIndex, "asItemIndex");

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/schema/common/seq.js
var seq = {
  collection: "seq",
  default: true,
  nodeClass: YAMLSeq,
  tag: "tag:yaml.org,2002:seq",
  resolve(seq2, onError) {
    if (!isSeq(seq2)) onError("Expected a sequence for this tag");
    return seq2;
  },
  createNode: /* @__PURE__ */ __name((schema4, obj, ctx) => YAMLSeq.from(schema4, obj, ctx), "createNode")
};

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/schema/common/string.js
var string = {
  identify: /* @__PURE__ */ __name((value) => typeof value === "string", "identify"),
  default: true,
  tag: "tag:yaml.org,2002:str",
  resolve: /* @__PURE__ */ __name((str) => str, "resolve"),
  stringify(item, ctx, onComment, onChompKeep) {
    ctx = Object.assign({ actualString: true }, ctx);
    return stringifyString(item, ctx, onComment, onChompKeep);
  }
};

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/schema/common/null.js
var nullTag = {
  identify: /* @__PURE__ */ __name((value) => value == null, "identify"),
  createNode: /* @__PURE__ */ __name(() => new Scalar(null), "createNode"),
  default: true,
  tag: "tag:yaml.org,2002:null",
  test: /^(?:~|[Nn]ull|NULL)?$/,
  resolve: /* @__PURE__ */ __name(() => new Scalar(null), "resolve"),
  stringify: /* @__PURE__ */ __name(({ source }, ctx) => typeof source === "string" && nullTag.test.test(source) ? source : ctx.options.nullStr, "stringify")
};

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/schema/core/bool.js
var boolTag = {
  identify: /* @__PURE__ */ __name((value) => typeof value === "boolean", "identify"),
  default: true,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
  resolve: /* @__PURE__ */ __name((str) => new Scalar(str[0] === "t" || str[0] === "T"), "resolve"),
  stringify({ source, value }, ctx) {
    if (source && boolTag.test.test(source)) {
      if (value === (source[0] === "t" || source[0] === "T")) return source;
    }
    return value ? ctx.options.trueStr : ctx.options.falseStr;
  }
};

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/stringify/stringifyNumber.js
function stringifyNumber({ format, minFractionDigits, tag, value }) {
  if (typeof value === "bigint") return String(value);
  const num = typeof value === "number" ? value : Number(value);
  if (!isFinite(num)) return isNaN(num) ? ".nan" : num < 0 ? "-.inf" : ".inf";
  let n = Object.is(value, -0) ? "-0" : JSON.stringify(value);
  if (!format && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^\d/.test(n)) {
    let i = n.indexOf(".");
    if (i < 0) {
      i = n.length;
      n += ".";
    }
    let d = minFractionDigits - (n.length - i - 1);
    while (d-- > 0) n += "0";
  }
  return n;
}
__name(stringifyNumber, "stringifyNumber");

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/schema/core/float.js
var floatNaN = {
  identify: /* @__PURE__ */ __name((value) => typeof value === "number", "identify"),
  default: true,
  tag: "tag:yaml.org,2002:float",
  test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
  resolve: /* @__PURE__ */ __name((str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY, "resolve"),
  stringify: stringifyNumber
};
var floatExp = {
  identify: /* @__PURE__ */ __name((value) => typeof value === "number", "identify"),
  default: true,
  tag: "tag:yaml.org,2002:float",
  format: "EXP",
  test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
  resolve: /* @__PURE__ */ __name((str) => parseFloat(str), "resolve"),
  stringify(node) {
    const num = Number(node.value);
    return isFinite(num) ? num.toExponential() : stringifyNumber(node);
  }
};
var float = {
  identify: /* @__PURE__ */ __name((value) => typeof value === "number", "identify"),
  default: true,
  tag: "tag:yaml.org,2002:float",
  test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
  resolve(str) {
    const node = new Scalar(parseFloat(str));
    const dot = str.indexOf(".");
    if (dot !== -1 && str[str.length - 1] === "0") node.minFractionDigits = str.length - dot - 1;
    return node;
  },
  stringify: stringifyNumber
};

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/schema/core/int.js
var intIdentify = /* @__PURE__ */ __name((value) => typeof value === "bigint" || Number.isInteger(value), "intIdentify");
var intResolve = /* @__PURE__ */ __name((str, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix), "intResolve");
function intStringify(node, radix, prefix) {
  const { value } = node;
  if (intIdentify(value) && value >= 0) return prefix + value.toString(radix);
  return stringifyNumber(node);
}
__name(intStringify, "intStringify");
var intOct = {
  identify: /* @__PURE__ */ __name((value) => intIdentify(value) && value >= 0, "identify"),
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "OCT",
  test: /^0o[0-7]+$/,
  resolve: /* @__PURE__ */ __name((str, _onError, opt) => intResolve(str, 2, 8, opt), "resolve"),
  stringify: /* @__PURE__ */ __name((node) => intStringify(node, 8, "0o"), "stringify")
};
var int = {
  identify: intIdentify,
  default: true,
  tag: "tag:yaml.org,2002:int",
  test: /^[-+]?[0-9]+$/,
  resolve: /* @__PURE__ */ __name((str, _onError, opt) => intResolve(str, 0, 10, opt), "resolve"),
  stringify: stringifyNumber
};
var intHex = {
  identify: /* @__PURE__ */ __name((value) => intIdentify(value) && value >= 0, "identify"),
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "HEX",
  test: /^0x[0-9a-fA-F]+$/,
  resolve: /* @__PURE__ */ __name((str, _onError, opt) => intResolve(str, 2, 16, opt), "resolve"),
  stringify: /* @__PURE__ */ __name((node) => intStringify(node, 16, "0x"), "stringify")
};

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/schema/core/schema.js
var schema = [
  map,
  seq,
  string,
  nullTag,
  boolTag,
  intOct,
  int,
  intHex,
  floatNaN,
  floatExp,
  float
];

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/schema/json/schema.js
function intIdentify2(value) {
  return typeof value === "bigint" || Number.isInteger(value);
}
__name(intIdentify2, "intIdentify");
var stringifyJSON = /* @__PURE__ */ __name(({ value }) => JSON.stringify(value), "stringifyJSON");
var jsonScalars = [
  {
    identify: /* @__PURE__ */ __name((value) => typeof value === "string", "identify"),
    default: true,
    tag: "tag:yaml.org,2002:str",
    resolve: /* @__PURE__ */ __name((str) => str, "resolve"),
    stringify: stringifyJSON
  },
  {
    identify: /* @__PURE__ */ __name((value) => value == null, "identify"),
    createNode: /* @__PURE__ */ __name(() => new Scalar(null), "createNode"),
    default: true,
    tag: "tag:yaml.org,2002:null",
    test: /^null$/,
    resolve: /* @__PURE__ */ __name(() => null, "resolve"),
    stringify: stringifyJSON
  },
  {
    identify: /* @__PURE__ */ __name((value) => typeof value === "boolean", "identify"),
    default: true,
    tag: "tag:yaml.org,2002:bool",
    test: /^true$|^false$/,
    resolve: /* @__PURE__ */ __name((str) => str === "true", "resolve"),
    stringify: stringifyJSON
  },
  {
    identify: intIdentify2,
    default: true,
    tag: "tag:yaml.org,2002:int",
    test: /^-?(?:0|[1-9][0-9]*)$/,
    resolve: /* @__PURE__ */ __name((str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10), "resolve"),
    stringify: /* @__PURE__ */ __name(({ value }) => intIdentify2(value) ? value.toString() : JSON.stringify(value), "stringify")
  },
  {
    identify: /* @__PURE__ */ __name((value) => typeof value === "number", "identify"),
    default: true,
    tag: "tag:yaml.org,2002:float",
    test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
    resolve: /* @__PURE__ */ __name((str) => parseFloat(str), "resolve"),
    stringify: stringifyJSON
  }
];
var schema2 = [map, seq].concat(jsonScalars, {
  default: true,
  tag: "",
  test: /^/,
  resolve(str, onError) {
    onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
    return str;
  }
});

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/schema/yaml-1.1/binary.js
var binary = {
  identify: /* @__PURE__ */ __name((value) => value instanceof Uint8Array, "identify"),
  default: false,
  tag: "tag:yaml.org,2002:binary",
  resolve(src, onError) {
    if (typeof atob === "function") {
      const str = atob(src.replace(/[\n\r]/g, ""));
      const buffer = new Uint8Array(str.length);
      for (let i = 0; i < str.length; ++i) buffer[i] = str.charCodeAt(i);
      return buffer;
    } else {
      onError("This environment does not support reading binary tags; either Buffer or atob is required");
      return src;
    }
  },
  stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
    var _type;
    if (!value) return "";
    const buf = value;
    let str;
    if (typeof btoa === "function") {
      let s = "";
      for (let i = 0; i < buf.length; ++i) s += String.fromCharCode(buf[i]);
      str = btoa(s);
    } else throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
    (_type = type) !== null && _type !== void 0 || (type = Scalar.BLOCK_LITERAL);
    if (type !== Scalar.QUOTE_DOUBLE) {
      const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
      const n = Math.ceil(str.length / lineWidth);
      const lines = new Array(n);
      for (let i = 0, o = 0; i < n; ++i, o += lineWidth) lines[i] = str.substr(o, lineWidth);
      str = lines.join(type === Scalar.BLOCK_LITERAL ? "\n" : " ");
    }
    return stringifyString({
      comment,
      type,
      value: str
    }, ctx, onComment, onChompKeep);
  }
};

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/schema/yaml-1.1/pairs.js
function resolvePairs(seq2, onError) {
  if (isSeq(seq2)) for (let i = 0; i < seq2.items.length; ++i) {
    let item = seq2.items[i];
    if (isPair(item)) continue;
    else if (isMap(item)) {
      if (item.items.length > 1) onError("Each pair must have its own sequence indicator");
      const pair = item.items[0] || new Pair(new Scalar(null));
      if (item.commentBefore) pair.key.commentBefore = pair.key.commentBefore ? `${item.commentBefore}
${pair.key.commentBefore}` : item.commentBefore;
      if (item.comment) {
        var _pair$value;
        const cn = (_pair$value = pair.value) !== null && _pair$value !== void 0 ? _pair$value : pair.key;
        cn.comment = cn.comment ? `${item.comment}
${cn.comment}` : item.comment;
      }
      item = pair;
    }
    seq2.items[i] = isPair(item) ? item : new Pair(item);
  }
  else onError("Expected a sequence for this tag");
  return seq2;
}
__name(resolvePairs, "resolvePairs");
function createPairs(schema4, iterable, ctx) {
  const { replacer } = ctx;
  const pairs2 = new YAMLSeq(schema4);
  pairs2.tag = "tag:yaml.org,2002:pairs";
  let i = 0;
  if (iterable && Symbol.iterator in Object(iterable)) for (let it of iterable) {
    if (typeof replacer === "function") it = replacer.call(iterable, String(i++), it);
    let key, value;
    if (Array.isArray(it)) if (it.length === 2) {
      key = it[0];
      value = it[1];
    } else throw new TypeError(`Expected [key, value] tuple: ${it}`);
    else if (it && it instanceof Object) {
      const keys = Object.keys(it);
      if (keys.length === 1) {
        key = keys[0];
        value = it[key];
      } else throw new TypeError(`Expected tuple with one key, not ${keys.length} keys`);
    } else key = it;
    pairs2.items.push(createPair(key, value, ctx));
  }
  return pairs2;
}
__name(createPairs, "createPairs");
var pairs = {
  collection: "seq",
  default: false,
  tag: "tag:yaml.org,2002:pairs",
  resolve: resolvePairs,
  createNode: createPairs
};

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/schema/yaml-1.1/omap.js
var _a10;
var YAMLOMap = (_a10 = class extends YAMLSeq {
  constructor() {
    super();
    this.add = YAMLMap.prototype.add.bind(this);
    this.delete = YAMLMap.prototype.delete.bind(this);
    this.get = YAMLMap.prototype.get.bind(this);
    this.has = YAMLMap.prototype.has.bind(this);
    this.set = YAMLMap.prototype.set.bind(this);
    this.tag = _a10.tag;
  }
  /**
  * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
  * but TypeScript won't allow widening the signature of a child method.
  */
  toJSON(_, ctx) {
    if (!ctx) return super.toJSON(_);
    const map2 = /* @__PURE__ */ new Map();
    if (ctx === null || ctx === void 0 ? void 0 : ctx.onCreate) ctx.onCreate(map2);
    for (const pair of this.items) {
      let key, value;
      if (isPair(pair)) {
        key = toJS(pair.key, "", ctx);
        value = toJS(pair.value, key, ctx);
      } else key = toJS(pair, "", ctx);
      if (map2.has(key)) throw new Error("Ordered maps must not include duplicate keys");
      map2.set(key, value);
    }
    return map2;
  }
  static from(schema4, iterable, ctx) {
    const pairs2 = createPairs(schema4, iterable, ctx);
    const omap2 = new this();
    omap2.items = pairs2.items;
    return omap2;
  }
}, __name(_a10, "YAMLOMap"), _a10);
YAMLOMap.tag = "tag:yaml.org,2002:omap";
var omap = {
  collection: "seq",
  identify: /* @__PURE__ */ __name((value) => value instanceof Map, "identify"),
  nodeClass: YAMLOMap,
  default: false,
  tag: "tag:yaml.org,2002:omap",
  resolve(seq2, onError) {
    const pairs2 = resolvePairs(seq2, onError);
    const seenKeys = [];
    for (const { key } of pairs2.items) if (isScalar(key)) if (seenKeys.includes(key.value)) onError(`Ordered maps must not include duplicate keys: ${key.value}`);
    else seenKeys.push(key.value);
    return Object.assign(new YAMLOMap(), pairs2);
  },
  createNode: /* @__PURE__ */ __name((schema4, iterable, ctx) => YAMLOMap.from(schema4, iterable, ctx), "createNode")
};

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/schema/yaml-1.1/set.js
var _a11;
var YAMLSet = (_a11 = class extends YAMLMap {
  constructor(schema4) {
    super(schema4);
    this.tag = _a11.tag;
  }
  add(key) {
    let pair;
    if (isPair(key)) pair = key;
    else if (key && typeof key === "object" && "key" in key && "value" in key && key.value === null) pair = new Pair(key.key, null);
    else pair = new Pair(key, null);
    if (!findPair(this.items, pair.key)) this.items.push(pair);
  }
  /**
  * If `keepPair` is `true`, returns the Pair matching `key`.
  * Otherwise, returns the value of that Pair's key.
  */
  get(key, keepPair) {
    const pair = findPair(this.items, key);
    return !keepPair && isPair(pair) ? isScalar(pair.key) ? pair.key.value : pair.key : pair;
  }
  set(key, value) {
    if (typeof value !== "boolean") throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
    const prev = findPair(this.items, key);
    if (prev && !value) this.items.splice(this.items.indexOf(prev), 1);
    else if (!prev && value) this.items.push(new Pair(key));
  }
  toJSON(_, ctx) {
    return super.toJSON(_, ctx, Set);
  }
  toString(ctx, onComment, onChompKeep) {
    if (!ctx) return JSON.stringify(this);
    if (this.hasAllNullValues(true)) return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
    else throw new Error("Set items must all have null values");
  }
  static from(schema4, iterable, ctx) {
    const { replacer } = ctx;
    const set2 = new this(schema4);
    if (iterable && Symbol.iterator in Object(iterable)) for (let value of iterable) {
      if (typeof replacer === "function") value = replacer.call(iterable, value, value);
      set2.items.push(createPair(value, null, ctx));
    }
    return set2;
  }
}, __name(_a11, "YAMLSet"), _a11);
YAMLSet.tag = "tag:yaml.org,2002:set";
var set = {
  collection: "map",
  identify: /* @__PURE__ */ __name((value) => value instanceof Set, "identify"),
  nodeClass: YAMLSet,
  default: false,
  tag: "tag:yaml.org,2002:set",
  createNode: /* @__PURE__ */ __name((schema4, iterable, ctx) => YAMLSet.from(schema4, iterable, ctx), "createNode"),
  resolve(map2, onError) {
    if (isMap(map2)) if (map2.hasAllNullValues(true)) return Object.assign(new YAMLSet(), map2);
    else onError("Set items must all have null values");
    else onError("Expected a mapping for this tag");
    return map2;
  }
};

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/schema/yaml-1.1/timestamp.js
function parseSexagesimal(str, asBigInt) {
  const sign = str[0];
  const parts = sign === "-" || sign === "+" ? str.substring(1) : str;
  const num = /* @__PURE__ */ __name((n) => asBigInt ? BigInt(n) : Number(n), "num");
  const res = parts.replace(/_/g, "").split(":").reduce((res2, p) => res2 * num(60) + num(p), num(0));
  return sign === "-" ? num(-1) * res : res;
}
__name(parseSexagesimal, "parseSexagesimal");
function stringifySexagesimal(node) {
  let { value } = node;
  let num = /* @__PURE__ */ __name((n) => n, "num");
  if (typeof value === "bigint") num = /* @__PURE__ */ __name((n) => BigInt(n), "num");
  else if (isNaN(value) || !isFinite(value)) return stringifyNumber(node);
  let sign = "";
  if (value < 0) {
    sign = "-";
    value *= num(-1);
  }
  const _60 = num(60);
  const parts = [value % _60];
  if (value < 60) parts.unshift(0);
  else {
    value = (value - parts[0]) / _60;
    parts.unshift(value % _60);
    if (value >= 60) {
      value = (value - parts[0]) / _60;
      parts.unshift(value);
    }
  }
  return sign + parts.map((n) => String(n).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
}
__name(stringifySexagesimal, "stringifySexagesimal");
var intTime = {
  identify: /* @__PURE__ */ __name((value) => typeof value === "bigint" || Number.isInteger(value), "identify"),
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "TIME",
  test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
  resolve: /* @__PURE__ */ __name((str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt), "resolve"),
  stringify: stringifySexagesimal
};
var floatTime = {
  identify: /* @__PURE__ */ __name((value) => typeof value === "number", "identify"),
  default: true,
  tag: "tag:yaml.org,2002:float",
  format: "TIME",
  test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
  resolve: /* @__PURE__ */ __name((str) => parseSexagesimal(str, false), "resolve"),
  stringify: stringifySexagesimal
};
var timestamp = {
  identify: /* @__PURE__ */ __name((value) => value instanceof Date, "identify"),
  default: true,
  tag: "tag:yaml.org,2002:timestamp",
  test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
  resolve(str) {
    const match = str.match(timestamp.test);
    if (!match) throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
    const [, year, month, day, hour, minute, second] = match.map(Number);
    const millisec = match[7] ? Number((match[7] + "00").substr(1, 3)) : 0;
    let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
    const tz = match[8];
    if (tz && tz !== "Z") {
      let d = parseSexagesimal(tz, false);
      if (Math.abs(d) < 30) d *= 60;
      date -= 6e4 * d;
    }
    return new Date(date);
  },
  stringify: /* @__PURE__ */ __name(({ value }) => {
    var _value$toISOString$re;
    return (_value$toISOString$re = value === null || value === void 0 ? void 0 : value.toISOString().replace(/(T00:00:00)?\.000Z$/, "")) !== null && _value$toISOString$re !== void 0 ? _value$toISOString$re : "";
  }, "stringify")
};

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/schema/yaml-1.1/bool.js
function boolStringify({ value, source }, ctx) {
  if (source && (value ? trueTag : falseTag).test.test(source)) return source;
  return value ? ctx.options.trueStr : ctx.options.falseStr;
}
__name(boolStringify, "boolStringify");
var trueTag = {
  identify: /* @__PURE__ */ __name((value) => value === true, "identify"),
  default: true,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
  resolve: /* @__PURE__ */ __name(() => new Scalar(true), "resolve"),
  stringify: boolStringify
};
var falseTag = {
  identify: /* @__PURE__ */ __name((value) => value === false, "identify"),
  default: true,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
  resolve: /* @__PURE__ */ __name(() => new Scalar(false), "resolve"),
  stringify: boolStringify
};

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/schema/yaml-1.1/float.js
var floatNaN2 = {
  identify: /* @__PURE__ */ __name((value) => typeof value === "number", "identify"),
  default: true,
  tag: "tag:yaml.org,2002:float",
  test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
  resolve: /* @__PURE__ */ __name((str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY, "resolve"),
  stringify: stringifyNumber
};
var floatExp2 = {
  identify: /* @__PURE__ */ __name((value) => typeof value === "number", "identify"),
  default: true,
  tag: "tag:yaml.org,2002:float",
  format: "EXP",
  test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
  resolve: /* @__PURE__ */ __name((str) => parseFloat(str.replace(/_/g, "")), "resolve"),
  stringify(node) {
    const num = Number(node.value);
    return isFinite(num) ? num.toExponential() : stringifyNumber(node);
  }
};
var float2 = {
  identify: /* @__PURE__ */ __name((value) => typeof value === "number", "identify"),
  default: true,
  tag: "tag:yaml.org,2002:float",
  test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
  resolve(str) {
    const node = new Scalar(parseFloat(str.replace(/_/g, "")));
    const dot = str.indexOf(".");
    if (dot !== -1) {
      const f = str.substring(dot + 1).replace(/_/g, "");
      if (f[f.length - 1] === "0") node.minFractionDigits = f.length;
    }
    return node;
  },
  stringify: stringifyNumber
};

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/schema/yaml-1.1/int.js
var intIdentify3 = /* @__PURE__ */ __name((value) => typeof value === "bigint" || Number.isInteger(value), "intIdentify");
function intResolve2(str, offset, radix, { intAsBigInt }) {
  const sign = str[0];
  if (sign === "-" || sign === "+") offset += 1;
  str = str.substring(offset).replace(/_/g, "");
  if (intAsBigInt) {
    switch (radix) {
      case 2:
        str = `0b${str}`;
        break;
      case 8:
        str = `0o${str}`;
        break;
      case 16:
        str = `0x${str}`;
        break;
    }
    const n2 = BigInt(str);
    return sign === "-" ? BigInt(-1) * n2 : n2;
  }
  const n = parseInt(str, radix);
  return sign === "-" ? -1 * n : n;
}
__name(intResolve2, "intResolve");
function intStringify2(node, radix, prefix) {
  const { value } = node;
  if (intIdentify3(value)) {
    const str = value.toString(radix);
    return value < 0 ? "-" + prefix + str.substr(1) : prefix + str;
  }
  return stringifyNumber(node);
}
__name(intStringify2, "intStringify");
var intBin = {
  identify: intIdentify3,
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "BIN",
  test: /^[-+]?0b[0-1_]+$/,
  resolve: /* @__PURE__ */ __name((str, _onError, opt) => intResolve2(str, 2, 2, opt), "resolve"),
  stringify: /* @__PURE__ */ __name((node) => intStringify2(node, 2, "0b"), "stringify")
};
var intOct2 = {
  identify: intIdentify3,
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "OCT",
  test: /^[-+]?0[0-7_]+$/,
  resolve: /* @__PURE__ */ __name((str, _onError, opt) => intResolve2(str, 1, 8, opt), "resolve"),
  stringify: /* @__PURE__ */ __name((node) => intStringify2(node, 8, "0"), "stringify")
};
var int2 = {
  identify: intIdentify3,
  default: true,
  tag: "tag:yaml.org,2002:int",
  test: /^[-+]?[0-9][0-9_]*$/,
  resolve: /* @__PURE__ */ __name((str, _onError, opt) => intResolve2(str, 0, 10, opt), "resolve"),
  stringify: stringifyNumber
};
var intHex2 = {
  identify: intIdentify3,
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "HEX",
  test: /^[-+]?0x[0-9a-fA-F_]+$/,
  resolve: /* @__PURE__ */ __name((str, _onError, opt) => intResolve2(str, 2, 16, opt), "resolve"),
  stringify: /* @__PURE__ */ __name((node) => intStringify2(node, 16, "0x"), "stringify")
};

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/schema/yaml-1.1/schema.js
var schema3 = [
  map,
  seq,
  string,
  nullTag,
  trueTag,
  falseTag,
  intBin,
  intOct2,
  int2,
  intHex2,
  floatNaN2,
  floatExp2,
  float2,
  binary,
  merge,
  omap,
  pairs,
  set,
  intTime,
  floatTime,
  timestamp
];

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/schema/tags.js
var schemas = /* @__PURE__ */ new Map([
  ["core", schema],
  ["failsafe", [
    map,
    seq,
    string
  ]],
  ["json", schema2],
  ["yaml11", schema3],
  ["yaml-1.1", schema3]
]);
var tagsByName = {
  binary,
  bool: boolTag,
  float,
  floatExp,
  floatNaN,
  floatTime,
  int,
  intHex,
  intOct,
  intTime,
  map,
  merge,
  null: nullTag,
  omap,
  pairs,
  seq,
  set,
  timestamp
};
var coreKnownTags = {
  "tag:yaml.org,2002:binary": binary,
  "tag:yaml.org,2002:merge": merge,
  "tag:yaml.org,2002:omap": omap,
  "tag:yaml.org,2002:pairs": pairs,
  "tag:yaml.org,2002:set": set,
  "tag:yaml.org,2002:timestamp": timestamp
};
function getTags(customTags, schemaName, addMergeTag) {
  const schemaTags = schemas.get(schemaName);
  if (schemaTags && !customTags) return addMergeTag && !schemaTags.includes(merge) ? schemaTags.concat(merge) : schemaTags.slice();
  let tags = schemaTags;
  if (!tags) if (Array.isArray(customTags)) tags = [];
  else {
    const keys = Array.from(schemas.keys()).filter((key) => key !== "yaml11").map((key) => JSON.stringify(key)).join(", ");
    throw new Error(`Unknown schema "${schemaName}"; use one of ${keys} or define customTags array`);
  }
  if (Array.isArray(customTags)) for (const tag of customTags) tags = tags.concat(tag);
  else if (typeof customTags === "function") tags = customTags(tags.slice());
  if (addMergeTag) tags = tags.concat(merge);
  return tags.reduce((tags2, tag) => {
    const tagObj = typeof tag === "string" ? tagsByName[tag] : tag;
    if (!tagObj) {
      const tagName = JSON.stringify(tag);
      const keys = Object.keys(tagsByName).map((key) => JSON.stringify(key)).join(", ");
      throw new Error(`Unknown custom tag ${tagName}; use one of ${keys}`);
    }
    if (!tags2.includes(tagObj)) tags2.push(tagObj);
    return tags2;
  }, []);
}
__name(getTags, "getTags");

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/schema/Schema.js
var sortMapEntriesByKey = /* @__PURE__ */ __name((a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0, "sortMapEntriesByKey");
var _a12;
var Schema = (_a12 = class {
  constructor({ compat, customTags, merge: merge2, resolveKnownTags, schema: schema4, sortMapEntries, toStringDefaults }) {
    this.compat = Array.isArray(compat) ? getTags(compat, "compat") : compat ? getTags(null, compat) : null;
    this.name = typeof schema4 === "string" && schema4 || "core";
    this.knownTags = resolveKnownTags ? coreKnownTags : {};
    this.tags = getTags(customTags, this.name, merge2);
    this.toStringOptions = toStringDefaults !== null && toStringDefaults !== void 0 ? toStringDefaults : null;
    Object.defineProperty(this, MAP, { value: map });
    Object.defineProperty(this, SCALAR, { value: string });
    Object.defineProperty(this, SEQ, { value: seq });
    this.sortMapEntries = typeof sortMapEntries === "function" ? sortMapEntries : sortMapEntries === true ? sortMapEntriesByKey : null;
  }
  clone() {
    const copy = Object.create(_a12.prototype, Object.getOwnPropertyDescriptors(this));
    copy.tags = this.tags.slice();
    return copy;
  }
}, __name(_a12, "Schema"), _a12);

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/stringify/stringifyDocument.js
function stringifyDocument(doc, options) {
  var _doc$directives;
  const lines = [];
  let hasDirectives = options.directives === true;
  if (options.directives !== false && doc.directives) {
    const dir = doc.directives.toString(doc);
    if (dir) {
      lines.push(dir);
      hasDirectives = true;
    } else if (doc.directives.docStart) hasDirectives = true;
  }
  if (hasDirectives) lines.push("---");
  const ctx = createStringifyContext(doc, options);
  const { commentString } = ctx.options;
  if (doc.commentBefore) {
    if (lines.length !== 1) lines.unshift("");
    const cs = commentString(doc.commentBefore);
    lines.unshift(indentComment(cs, ""));
  }
  let chompKeep = false;
  let contentComment = null;
  if (doc.contents) {
    if (isNode(doc.contents)) {
      if (doc.contents.spaceBefore && hasDirectives) lines.push("");
      if (doc.contents.commentBefore) {
        const cs = commentString(doc.contents.commentBefore);
        lines.push(indentComment(cs, ""));
      }
      ctx.forceBlockIndent = !!doc.comment;
      contentComment = doc.contents.comment;
    }
    const onChompKeep = contentComment ? void 0 : () => chompKeep = true;
    let body = stringify(doc.contents, ctx, () => contentComment = null, onChompKeep);
    if (contentComment) body += lineComment(body, "", commentString(contentComment));
    if ((body[0] === "|" || body[0] === ">") && lines[lines.length - 1] === "---") lines[lines.length - 1] = `--- ${body}`;
    else lines.push(body);
  } else lines.push(stringify(doc.contents, ctx));
  if ((_doc$directives = doc.directives) === null || _doc$directives === void 0 ? void 0 : _doc$directives.docEnd) if (doc.comment) {
    const cs = commentString(doc.comment);
    if (cs.includes("\n")) {
      lines.push("...");
      lines.push(indentComment(cs, ""));
    } else lines.push(`... ${cs}`);
  } else lines.push("...");
  else {
    let dc = doc.comment;
    if (dc && chompKeep) dc = dc.replace(/^\n+/, "");
    if (dc) {
      if ((!chompKeep || contentComment) && lines[lines.length - 1] !== "") lines.push("");
      lines.push(indentComment(commentString(dc), ""));
    }
  }
  return lines.join("\n") + "\n";
}
__name(stringifyDocument, "stringifyDocument");

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/doc/Document.js
var _a13;
var Document = (_a13 = class {
  constructor(value, replacer, options) {
    this.commentBefore = null;
    this.comment = null;
    this.errors = [];
    this.warnings = [];
    Object.defineProperty(this, NODE_TYPE, { value: DOC });
    let _replacer = null;
    if (typeof replacer === "function" || Array.isArray(replacer)) _replacer = replacer;
    else if (options === void 0 && replacer) {
      options = replacer;
      replacer = void 0;
    }
    const opt = Object.assign({
      intAsBigInt: false,
      keepSourceTokens: false,
      logLevel: "warn",
      prettyErrors: true,
      strict: true,
      stringKeys: false,
      uniqueKeys: true,
      version: "1.2"
    }, options);
    this.options = opt;
    let { version } = opt;
    if (options === null || options === void 0 ? void 0 : options._directives) {
      this.directives = options._directives.atDocument();
      if (this.directives.yaml.explicit) version = this.directives.yaml.version;
    } else this.directives = new Directives({ version });
    this.setSchema(version, options);
    this.contents = value === void 0 ? null : this.createNode(value, _replacer, options);
  }
  /**
  * Create a deep copy of this Document and its contents.
  *
  * Custom Node values that inherit from `Object` still refer to their original instances.
  */
  clone() {
    const copy = Object.create(_a13.prototype, { [NODE_TYPE]: { value: DOC } });
    copy.commentBefore = this.commentBefore;
    copy.comment = this.comment;
    copy.errors = this.errors.slice();
    copy.warnings = this.warnings.slice();
    copy.options = Object.assign({}, this.options);
    if (this.directives) copy.directives = this.directives.clone();
    copy.schema = this.schema.clone();
    copy.contents = isNode(this.contents) ? this.contents.clone(copy.schema) : this.contents;
    if (this.range) copy.range = this.range.slice();
    return copy;
  }
  /** Adds a value to the document. */
  add(value) {
    if (assertCollection(this.contents)) this.contents.add(value);
  }
  /** Adds a value to the document. */
  addIn(path, value) {
    if (assertCollection(this.contents)) this.contents.addIn(path, value);
  }
  /**
  * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
  *
  * If `node` already has an anchor, `name` is ignored.
  * Otherwise, the `node.anchor` value will be set to `name`,
  * or if an anchor with that name is already present in the document,
  * `name` will be used as a prefix for a new unique anchor.
  * If `name` is undefined, the generated anchor will use 'a' as a prefix.
  */
  createAlias(node, name) {
    if (!node.anchor) {
      const prev = anchorNames(this);
      node.anchor = !name || prev.has(name) ? findNewAnchor(name || "a", prev) : name;
    }
    return new Alias(node.anchor);
  }
  createNode(value, replacer, options) {
    var _options;
    let _replacer = void 0;
    if (typeof replacer === "function") {
      value = replacer.call({ "": value }, "", value);
      _replacer = replacer;
    } else if (Array.isArray(replacer)) {
      const keyToStr = /* @__PURE__ */ __name((v) => typeof v === "number" || v instanceof String || v instanceof Number, "keyToStr");
      const asStr = replacer.filter(keyToStr).map(String);
      if (asStr.length > 0) replacer = replacer.concat(asStr);
      _replacer = replacer;
    } else if (options === void 0 && replacer) {
      options = replacer;
      replacer = void 0;
    }
    const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = (_options = options) !== null && _options !== void 0 ? _options : {};
    const { onAnchor, setAnchors, sourceObjects } = createNodeAnchors(this, anchorPrefix || "a");
    const ctx = {
      aliasDuplicateObjects: aliasDuplicateObjects !== null && aliasDuplicateObjects !== void 0 ? aliasDuplicateObjects : true,
      keepUndefined: keepUndefined !== null && keepUndefined !== void 0 ? keepUndefined : false,
      onAnchor,
      onTagObj,
      replacer: _replacer,
      schema: this.schema,
      sourceObjects
    };
    const node = createNode(value, tag, ctx);
    if (flow && isCollection(node)) node.flow = true;
    setAnchors();
    return node;
  }
  /**
  * Convert a key and a value into a `Pair` using the current schema,
  * recursively wrapping all values as `Scalar` or `Collection` nodes.
  */
  createPair(key, value, options = {}) {
    return new Pair(this.createNode(key, null, options), this.createNode(value, null, options));
  }
  /**
  * Removes a value from the document.
  * @returns `true` if the item was found and removed.
  */
  delete(key) {
    return assertCollection(this.contents) ? this.contents.delete(key) : false;
  }
  /**
  * Removes a value from the document.
  * @returns `true` if the item was found and removed.
  */
  deleteIn(path) {
    if (isEmptyPath(path)) {
      if (this.contents == null) return false;
      this.contents = null;
      return true;
    }
    return assertCollection(this.contents) ? this.contents.deleteIn(path) : false;
  }
  /**
  * Returns item at `key`, or `undefined` if not found. By default unwraps
  * scalar values from their surrounding node; to disable set `keepScalar` to
  * `true` (collections are always returned intact).
  */
  get(key, keepScalar) {
    return isCollection(this.contents) ? this.contents.get(key, keepScalar) : void 0;
  }
  /**
  * Returns item at `path`, or `undefined` if not found. By default unwraps
  * scalar values from their surrounding node; to disable set `keepScalar` to
  * `true` (collections are always returned intact).
  */
  getIn(path, keepScalar) {
    if (isEmptyPath(path)) return !keepScalar && isScalar(this.contents) ? this.contents.value : this.contents;
    return isCollection(this.contents) ? this.contents.getIn(path, keepScalar) : void 0;
  }
  /**
  * Checks if the document includes a value with the key `key`.
  */
  has(key) {
    return isCollection(this.contents) ? this.contents.has(key) : false;
  }
  /**
  * Checks if the document includes a value at `path`.
  */
  hasIn(path) {
    if (isEmptyPath(path)) return this.contents !== void 0;
    return isCollection(this.contents) ? this.contents.hasIn(path) : false;
  }
  /**
  * Sets a value in this document. For `!!set`, `value` needs to be a
  * boolean to add/remove the item from the set.
  */
  set(key, value) {
    if (this.contents == null) this.contents = collectionFromPath(this.schema, [key], value);
    else if (assertCollection(this.contents)) this.contents.set(key, value);
  }
  /**
  * Sets a value in this document. For `!!set`, `value` needs to be a
  * boolean to add/remove the item from the set.
  */
  setIn(path, value) {
    if (isEmptyPath(path)) this.contents = value;
    else if (this.contents == null) this.contents = collectionFromPath(this.schema, Array.from(path), value);
    else if (assertCollection(this.contents)) this.contents.setIn(path, value);
  }
  /**
  * Change the YAML version and schema used by the document.
  * A `null` version disables support for directives, explicit tags, anchors, and aliases.
  * It also requires the `schema` option to be given as a `Schema` instance value.
  *
  * Overrides all previously set schema options.
  */
  setSchema(version, options = {}) {
    if (typeof version === "number") version = String(version);
    let opt;
    switch (version) {
      case "1.1":
        if (this.directives) this.directives.yaml.version = "1.1";
        else this.directives = new Directives({ version: "1.1" });
        opt = {
          resolveKnownTags: false,
          schema: "yaml-1.1"
        };
        break;
      case "1.2":
      case "next":
        if (this.directives) this.directives.yaml.version = version;
        else this.directives = new Directives({ version });
        opt = {
          resolveKnownTags: true,
          schema: "core"
        };
        break;
      case null:
        if (this.directives) delete this.directives;
        opt = null;
        break;
      default: {
        const sv = JSON.stringify(version);
        throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
      }
    }
    if (options.schema instanceof Object) this.schema = options.schema;
    else if (opt) this.schema = new Schema(Object.assign(opt, options));
    else throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
  }
  toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
    const ctx = {
      anchors: /* @__PURE__ */ new Map(),
      doc: this,
      keep: !json,
      mapAsMap: mapAsMap === true,
      mapKeyWarned: false,
      maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
    };
    const res = toJS(this.contents, jsonArg !== null && jsonArg !== void 0 ? jsonArg : "", ctx);
    if (typeof onAnchor === "function") for (const { count, res: res2 } of ctx.anchors.values()) onAnchor(res2, count);
    return typeof reviver === "function" ? applyReviver(reviver, { "": res }, "", res) : res;
  }
  /**
  * A JSON representation of the document `contents`.
  *
  * @param jsonArg Used by `JSON.stringify` to indicate the array index or
  *   property name.
  */
  toJSON(jsonArg, onAnchor) {
    return this.toJS({
      json: true,
      jsonArg,
      mapAsMap: false,
      onAnchor
    });
  }
  /** A YAML representation of the document. */
  toString(options = {}) {
    if (this.errors.length > 0) throw new Error("Document with errors cannot be stringified");
    if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
      const s = JSON.stringify(options.indent);
      throw new Error(`"indent" option must be a positive integer, not ${s}`);
    }
    return stringifyDocument(this, options);
  }
}, __name(_a13, "Document"), _a13);
function assertCollection(contents) {
  if (isCollection(contents)) return true;
  throw new Error("Expected a YAML collection as document contents");
}
__name(assertCollection, "assertCollection");

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/yaml/browser/dist/public-api.js
function stringify2(value, replacer, options) {
  let _replacer = null;
  if (typeof replacer === "function" || Array.isArray(replacer)) _replacer = replacer;
  else if (options === void 0 && replacer) options = replacer;
  if (typeof options === "string") options = options.length;
  if (typeof options === "number") {
    const indent = Math.round(options);
    options = indent < 1 ? void 0 : indent > 8 ? { indent: 8 } : { indent };
  }
  if (value === void 0) {
    var _ref, _options;
    const { keepUndefined } = (_ref = (_options = options) !== null && _options !== void 0 ? _options : replacer) !== null && _ref !== void 0 ? _ref : {};
    if (!keepUndefined) return void 0;
  }
  if (isDocument(value) && !_replacer) return value.toString(options);
  return new Document(value, _replacer, options).toString(options);
}
__name(stringify2, "stringify");

// node_modules/@varavel/vdl-plugin-sdk/dist/utils/yaml/index.js
function stringify3(value) {
  return stringify2(value);
}
__name(stringify3, "stringify");

// node_modules/@varavel/vdl-plugin-sdk/dist/utils/options/get-option-string.js
function getOptionString(options, key, defaultValue) {
  const value = options === null || options === void 0 ? void 0 : options[key];
  return value === void 0 ? defaultValue : value;
}
__name(getOptionString, "getOptionString");

// node_modules/@varavel/vdl-plugin-sdk/dist/node_modules/pathe/dist/shared/pathe.M-eThtNZ.js
var _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) return input;
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
__name(normalizeWindowsPath, "normalizeWindowsPath");
var _EXTNAME_RE = /.(\.[^./]+|\.)$/;
var extname = /* @__PURE__ */ __name(function(p) {
  if (p === "..") return "";
  const match = _EXTNAME_RE.exec(normalizeWindowsPath(p));
  return match && match[1] || "";
}, "extname");

// node_modules/@varavel/vdl-plugin-sdk/dist/utils/paths/index.js
function extname2(path) {
  return extname(path);
}
__name(extname2, "extname");

// src/options/index.ts
var DEFAULT_OUT_FILE = "openapi.yaml";
var DEFAULT_TITLE = "VDL RPC API";
var DEFAULT_VERSION = "1.0.0";
function resolvePluginOptions(options) {
  const outFile = getOptionString(options, "outFile", DEFAULT_OUT_FILE);
  const outFormat = resolveOutFormat(outFile);
  const title = requiredStrOption(options, "title", DEFAULT_TITLE);
  const version = requiredStrOption(options, "version", DEFAULT_VERSION);
  return {
    outFile,
    outFormat,
    title,
    version,
    description: optionalStrOption(options, "description"),
    baseUrl: optionalStrOption(options, "baseUrl"),
    contactName: optionalStrOption(options, "contactName"),
    contactEmail: optionalStrOption(options, "contactEmail"),
    licenseName: optionalStrOption(options, "licenseName")
  };
}
__name(resolvePluginOptions, "resolvePluginOptions");
function resolveOutFormat(outFile) {
  const extension = extname2(outFile).toLowerCase();
  if (extension === ".json") return "json";
  if (extension === ".yaml") return "yaml";
  if (extension === ".yml") return "yaml";
  fail(
    `Option "outFile" must end with .yaml, .yml, or .json. Received: ${JSON.stringify(outFile)}.`
  );
}
__name(resolveOutFormat, "resolveOutFormat");
function requiredStrOption(options, key, defaultValue) {
  const value = getOptionString(options, key, defaultValue);
  return value === "" ? defaultValue : value;
}
__name(requiredStrOption, "requiredStrOption");
function optionalStrOption(options, key) {
  const value = getOptionString(options, key, "");
  return value === "" ? void 0 : value;
}
__name(optionalStrOption, "optionalStrOption");

// node_modules/@varavel/vdl-plugin-sdk/dist/utils/ir/get-annotation.js
function getAnnotation(annotations, name) {
  if (!annotations) return void 0;
  return annotations.find((anno) => anno.name === name);
}
__name(getAnnotation, "getAnnotation");

// node_modules/@varavel/vdl-plugin-sdk/dist/utils/strings/words.js
var ACRONYM_TO_CAPITALIZED_WORD_BOUNDARY_RE = /([A-Z]+)([A-Z][a-z])/g;
var LOWERCASE_OR_DIGIT_TO_UPPERCASE_BOUNDARY_RE = /([a-z0-9])([A-Z])/g;
var NON_ALPHANUMERIC_SEQUENCE_RE = /[^A-Za-z0-9]+/g;
var WHITESPACE_SEQUENCE_RE = /\s+/;
function words(str) {
  const normalized = str.replace(ACRONYM_TO_CAPITALIZED_WORD_BOUNDARY_RE, "$1 $2").replace(LOWERCASE_OR_DIGIT_TO_UPPERCASE_BOUNDARY_RE, "$1 $2").replace(NON_ALPHANUMERIC_SEQUENCE_RE, " ").trim();
  return normalized.length === 0 ? [] : normalized.split(WHITESPACE_SEQUENCE_RE);
}
__name(words, "words");

// node_modules/@varavel/vdl-plugin-sdk/dist/utils/strings/pascal-case.js
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
__name(capitalize, "capitalize");
function pascalCase(str) {
  return words(str).map(capitalize).join("");
}
__name(pascalCase, "pascalCase");

// node_modules/@varavel/vdl-plugin-sdk/dist/utils/ir/unwrap-literal.js
function unwrapLiteral(value) {
  return unwrapLiteralValue(value);
}
__name(unwrapLiteral, "unwrapLiteral");
function unwrapLiteralValue(value) {
  switch (value.kind) {
    case "string":
      return value.stringValue;
    case "int":
      return value.intValue;
    case "float":
      return value.floatValue;
    case "bool":
      return value.boolValue;
    case "object": {
      var _value$objectEntries;
      const resolvedObject = {};
      const entries = (_value$objectEntries = value.objectEntries) !== null && _value$objectEntries !== void 0 ? _value$objectEntries : [];
      for (const entry of entries) resolvedObject[entry.key] = unwrapLiteralValue(entry.value);
      return resolvedObject;
    }
    case "array":
      var _value$arrayItems;
      return ((_value$arrayItems = value.arrayItems) !== null && _value$arrayItems !== void 0 ? _value$arrayItems : []).map((item) => unwrapLiteralValue(item));
    default:
      return null;
  }
}
__name(unwrapLiteralValue, "unwrapLiteralValue");

// src/rpc-model/index.ts
function extractRpcGroups(ir) {
  const groups = [];
  for (const typeDef of ir.types) {
    if (!hasAnnotation2(typeDef, "rpc")) {
      continue;
    }
    const group = extractRpcGroup(typeDef);
    if (group.procedures.length > 0 || group.streams.length > 0) {
      groups.push(group);
    }
  }
  return groups;
}
__name(extractRpcGroups, "extractRpcGroups");
function extractRpcGroup(typeDef) {
  var _a14;
  const procedures = [];
  const streams = [];
  const rpcFields = (_a14 = typeDef.typeRef.objectFields) != null ? _a14 : [];
  for (const field of rpcFields) {
    const operation = extractOperation(typeDef, field);
    if (!operation) {
      continue;
    }
    if (operation.kind === "procedure") {
      procedures.push(operation);
      continue;
    }
    streams.push(operation);
  }
  return {
    name: typeDef.name,
    doc: typeDef.doc,
    procedures,
    streams
  };
}
__name(extractRpcGroup, "extractRpcGroup");
function extractOperation(rpcType, field) {
  var _a14, _b, _c;
  const isProcedure = hasAnnotation2(field, "proc");
  const isStream = hasAnnotation2(field, "stream");
  if (!isProcedure && !isStream) {
    return void 0;
  }
  const operationFields = (_a14 = field.typeRef.objectFields) != null ? _a14 : [];
  const inputField = operationFields.find((item) => item.name === "input");
  const outputField = operationFields.find((item) => item.name === "output");
  return {
    rpcName: rpcType.name,
    rpcDoc: rpcType.doc,
    kind: isProcedure ? "procedure" : "stream",
    name: field.name,
    doc: field.doc,
    deprecated: hasAnnotation2(field, "deprecated"),
    inputFields: (_b = inputField == null ? void 0 : inputField.typeRef.objectFields) != null ? _b : [],
    outputFields: (_c = outputField == null ? void 0 : outputField.typeRef.objectFields) != null ? _c : []
  };
}
__name(extractOperation, "extractOperation");
function hasAnnotation2(typeDefOrField, name) {
  return getAnnotation(typeDefOrField.annotations, name) !== void 0;
}
__name(hasAnnotation2, "hasAnnotation");

// src/spec-builder/deprecation.ts
function hasDeprecatedAnnotation(annotations) {
  return getAnnotation(annotations, "deprecated") !== void 0;
}
__name(hasDeprecatedAnnotation, "hasDeprecatedAnnotation");
function getDeprecatedMessage(annotations) {
  const deprecatedAnnotation = getAnnotation(annotations, "deprecated");
  if (!deprecatedAnnotation) {
    return void 0;
  }
  if (!deprecatedAnnotation.argument) {
    return "";
  }
  const value = unwrapLiteral(deprecatedAnnotation.argument);
  return typeof value === "string" ? value : String(value);
}
__name(getDeprecatedMessage, "getDeprecatedMessage");

// src/spec-builder/schema-fragments.ts
function generateTypeSchema(typeDef) {
  var _a14, _b;
  let schema4;
  if (typeDef.typeRef.kind === "object") {
    const { properties, required } = generatePropertiesFromFields(
      (_a14 = typeDef.typeRef.objectFields) != null ? _a14 : []
    );
    schema4 = {
      type: "object",
      properties
    };
    if (required.length > 0) {
      schema4.required = required;
    }
  } else {
    schema4 = generateTypeRefSchema(typeDef.typeRef);
  }
  if (typeDef.doc) {
    schema4.description = typeDef.doc;
  }
  const deprecatedMessage = getDeprecatedMessage(typeDef.annotations);
  if (deprecatedMessage !== void 0) {
    schema4.deprecated = true;
    if (deprecatedMessage !== "") {
      const currentDescription = String((_b = schema4.description) != null ? _b : "");
      schema4.description = currentDescription === "" ? `Deprecated: ${deprecatedMessage}` : `${currentDescription}

Deprecated: ${deprecatedMessage}`;
    }
  }
  return schema4;
}
__name(generateTypeSchema, "generateTypeSchema");
function generateEnumSchema(enumDef) {
  const schema4 = {};
  if (enumDef.enumType === "string") {
    schema4.type = "string";
    schema4.enum = enumDef.members.map((member) => {
      return String(unwrapLiteral(member.value));
    });
  } else {
    schema4.type = "integer";
    schema4.enum = enumDef.members.map((member) => {
      return Number(unwrapLiteral(member.value));
    });
  }
  if (enumDef.doc) {
    schema4.description = enumDef.doc;
  }
  if (hasDeprecatedAnnotation(enumDef.annotations)) {
    schema4.deprecated = true;
  }
  return schema4;
}
__name(generateEnumSchema, "generateEnumSchema");
function generateTypeRefSchema(typeRef) {
  var _a14, _b, _c, _d;
  switch (typeRef.kind) {
    case "primitive":
      return primitiveToJsonSchema(typeRef.primitiveName);
    case "type":
      return { $ref: `#/components/schemas/${typeRef.typeName}` };
    case "enum":
      return { $ref: `#/components/schemas/${typeRef.enumName}` };
    case "array": {
      const dimensions = (_a14 = typeRef.arrayDims) != null ? _a14 : 1;
      let itemSchema = generateTypeRefSchema(
        (_b = typeRef.arrayType) != null ? _b : { kind: "object" }
      );
      for (let depth = 1; depth < dimensions; depth += 1) {
        itemSchema = {
          type: "array",
          items: itemSchema
        };
      }
      return {
        type: "array",
        items: itemSchema
      };
    }
    case "map":
      return {
        type: "object",
        additionalProperties: generateTypeRefSchema(
          (_c = typeRef.mapType) != null ? _c : { kind: "object" }
        )
      };
    case "object": {
      const { properties, required } = generatePropertiesFromFields(
        (_d = typeRef.objectFields) != null ? _d : []
      );
      const schema4 = {
        type: "object",
        properties
      };
      if (required.length > 0) {
        schema4.required = required;
      }
      return schema4;
    }
    default:
      return {};
  }
}
__name(generateTypeRefSchema, "generateTypeRefSchema");
function generatePropertiesFromFields(fields) {
  const properties = {};
  const required = [];
  for (const field of fields) {
    let propertySchema = generateTypeRefSchema(field.typeRef);
    if (field.doc) {
      if (propertySchema.$ref) {
        propertySchema = {
          allOf: [propertySchema, { description: field.doc }]
        };
      } else {
        propertySchema.description = field.doc;
      }
    }
    properties[field.name] = propertySchema;
    if (!field.optional) {
      required.push(field.name);
    }
  }
  return { properties, required };
}
__name(generatePropertiesFromFields, "generatePropertiesFromFields");
function generateRequestBody(fields, description) {
  const { properties, required } = generatePropertiesFromFields(fields);
  const schema4 = {
    type: "object",
    properties
  };
  if (required.length > 0) {
    schema4.required = required;
  }
  return {
    description,
    content: {
      "application/json": {
        schema: schema4
      }
    }
  };
}
__name(generateRequestBody, "generateRequestBody");
function generateProcedureResponse(fields, description) {
  return {
    description,
    content: {
      "application/json": {
        schema: buildOutputEnvelopeSchema(fields)
      }
    }
  };
}
__name(generateProcedureResponse, "generateProcedureResponse");
function generateStreamResponse(fields, description) {
  return {
    description,
    content: {
      "text/event-stream": {
        schema: buildOutputEnvelopeSchema(fields)
      }
    }
  };
}
__name(generateStreamResponse, "generateStreamResponse");
function buildOutputEnvelopeSchema(fields) {
  const { properties, required } = generateOutputProperties(fields);
  const schema4 = {
    type: "object",
    properties
  };
  if (required.length > 0) {
    schema4.required = required;
  }
  return schema4;
}
__name(buildOutputEnvelopeSchema, "buildOutputEnvelopeSchema");
function generateOutputProperties(fields) {
  const { properties: outputProperties, required: outputRequired } = generatePropertiesFromFields(fields);
  const output = {
    type: "object",
    properties: outputProperties
  };
  if (outputRequired.length > 0) {
    output.required = outputRequired;
  }
  return {
    properties: {
      ok: { type: "boolean" },
      output,
      error: {
        type: "object",
        properties: {
          message: { type: "string" },
          category: { type: "string" },
          code: { type: "string" },
          details: {
            type: "object",
            properties: {},
            additionalProperties: true
          }
        },
        required: ["message"]
      }
    },
    required: ["ok"]
  };
}
__name(generateOutputProperties, "generateOutputProperties");
function primitiveToJsonSchema(primitiveName) {
  switch (primitiveName) {
    case "string":
      return { type: "string" };
    case "int":
      return { type: "integer" };
    case "float":
      return { type: "number" };
    case "bool":
      return { type: "boolean" };
    case "datetime":
      return { type: "string", format: "date-time" };
    default:
      return { type: "string" };
  }
}
__name(primitiveToJsonSchema, "primitiveToJsonSchema");

// src/spec-builder/components.ts
var AUTH_TOKEN_DESCRIPTION = "Enter the full value for the Authorization header. The specific format (Bearer, Basic, API Key, etc.) is determined by the server's implementation.\n\n---\n**Examples:**\n- **Bearer Token:** `Bearer eyJhbGciOiJIUzI1Ni...` (a JWT token)\n- **Basic Auth:** `Basic dXNlcm5hbWU6cGFzc3dvcmQ=` (a base64 encoding of `username:password`)\n- **API Key:** `sk_live_123abc456def` (a raw token)";
function buildComponents(ir, rpcGroups) {
  const schemas2 = buildSchemas(ir);
  const requestBodies = buildRequestBodies(rpcGroups);
  const responses = buildResponses(rpcGroups);
  const components = {
    securitySchemes: {
      AuthToken: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
        description: AUTH_TOKEN_DESCRIPTION
      }
    }
  };
  if (Object.keys(schemas2).length > 0) {
    components.schemas = schemas2;
  }
  if (Object.keys(requestBodies).length > 0) {
    components.requestBodies = requestBodies;
  }
  if (Object.keys(responses).length > 0) {
    components.responses = responses;
  }
  return components;
}
__name(buildComponents, "buildComponents");
function buildSchemas(ir) {
  const typeEntries = [];
  const enumEntries = [];
  for (const typeDef of ir.types) {
    if (getAnnotation(typeDef.annotations, "rpc")) {
      continue;
    }
    typeEntries.push([typeDef.name, generateTypeSchema(typeDef)]);
  }
  for (const enumDef of ir.enums) {
    enumEntries.push([enumDef.name, generateEnumSchema(enumDef)]);
  }
  typeEntries.sort((left, right) => left[0].localeCompare(right[0]));
  enumEntries.sort((left, right) => left[0].localeCompare(right[0]));
  return entriesToRecord([...typeEntries, ...enumEntries]);
}
__name(buildSchemas, "buildSchemas");
function buildRequestBodies(rpcGroups) {
  const entries = [];
  for (const group of rpcGroups) {
    for (const operation of group.procedures) {
      const inputName = `${group.name}${pascalCase(operation.name)}Input`;
      entries.push([
        inputName,
        generateRequestBody(
          operation.inputFields,
          `Request body for ${group.name}/${operation.name} procedure`
        )
      ]);
    }
    for (const operation of group.streams) {
      const inputName = `${group.name}${pascalCase(operation.name)}Input`;
      entries.push([
        inputName,
        generateRequestBody(
          operation.inputFields,
          `Request body for ${group.name}/${operation.name} stream subscription`
        )
      ]);
    }
  }
  entries.sort((left, right) => left[0].localeCompare(right[0]));
  return entriesToRecord(entries);
}
__name(buildRequestBodies, "buildRequestBodies");
function buildResponses(rpcGroups) {
  const entries = [];
  for (const group of rpcGroups) {
    for (const operation of group.procedures) {
      const outputName = `${group.name}${pascalCase(operation.name)}Output`;
      entries.push([
        outputName,
        generateProcedureResponse(
          operation.outputFields,
          `Response for ${group.name}/${operation.name} procedure`
        )
      ]);
    }
    for (const operation of group.streams) {
      const outputName = `${group.name}${pascalCase(operation.name)}Output`;
      entries.push([
        outputName,
        generateStreamResponse(
          operation.outputFields,
          `Server-Sent Events for ${group.name}/${operation.name} stream`
        )
      ]);
    }
  }
  entries.sort((left, right) => left[0].localeCompare(right[0]));
  return entriesToRecord(entries);
}
__name(buildResponses, "buildResponses");
function entriesToRecord(entries) {
  const record = {};
  for (const [key, value] of entries) {
    record[key] = value;
  }
  return record;
}
__name(entriesToRecord, "entriesToRecord");

// src/spec-builder/info.ts
function buildInfo(options) {
  const info = {
    title: options.title,
    version: options.version
  };
  if (options.description) {
    info.description = options.description;
  }
  const contact = {};
  if (options.contactName) {
    contact.name = options.contactName;
  }
  if (options.contactEmail) {
    contact.email = options.contactEmail;
  }
  if (Object.keys(contact).length > 0) {
    info.contact = contact;
  }
  if (options.licenseName) {
    info.license = { name: options.licenseName };
  }
  return info;
}
__name(buildInfo, "buildInfo");

// src/spec-builder/paths.ts
function buildPaths(rpcGroups) {
  const entries = [];
  for (const group of rpcGroups) {
    for (const operation of group.procedures) {
      entries.push([
        `/${group.name}/${operation.name}`,
        {
          post: buildPathOperation(operation)
        }
      ]);
    }
    for (const operation of group.streams) {
      entries.push([
        `/${group.name}/${operation.name}`,
        {
          post: buildPathOperation(operation)
        }
      ]);
    }
  }
  entries.sort((left, right) => left[0].localeCompare(right[0]));
  return entriesToRecord2(entries);
}
__name(buildPaths, "buildPaths");
function buildPathOperation(operation) {
  const inputName = `${operation.rpcName}${pascalCase(operation.name)}Input`;
  const outputName = `${operation.rpcName}${pascalCase(operation.name)}Output`;
  const openApiOperation = {
    tags: [
      operation.kind === "procedure" ? `${operation.rpcName}Procedures` : `${operation.rpcName}Streams`
    ],
    requestBody: {
      $ref: `#/components/requestBodies/${inputName}`
    },
    responses: {
      200: {
        $ref: `#/components/responses/${outputName}`
      }
    }
  };
  if (operation.doc) {
    openApiOperation.description = operation.doc;
  }
  if (operation.deprecated) {
    openApiOperation.deprecated = true;
  }
  return openApiOperation;
}
__name(buildPathOperation, "buildPathOperation");
function entriesToRecord2(entries) {
  const record = {};
  for (const [key, value] of entries) {
    record[key] = value;
  }
  return record;
}
__name(entriesToRecord2, "entriesToRecord");

// src/spec-builder/tags.ts
function buildTags(rpcGroups) {
  var _a14, _b;
  const tags = [];
  for (const group of rpcGroups) {
    if (group.procedures.length > 0) {
      tags.push({
        name: `${group.name}Procedures`,
        description: (_a14 = group.doc) != null ? _a14 : `Procedures for ${group.name}`
      });
    }
    if (group.streams.length > 0) {
      tags.push({
        name: `${group.name}Streams`,
        description: (_b = group.doc) != null ? _b : `Streams for ${group.name}`
      });
    }
  }
  tags.sort((left, right) => {
    return String(left.name).localeCompare(String(right.name));
  });
  return tags;
}
__name(buildTags, "buildTags");

// src/spec-builder/index.ts
function buildOpenApiSpec(ir, rpcGroups, options) {
  const spec = {
    openapi: "3.0.0",
    info: buildInfo(options),
    security: [{ AuthToken: [] }]
  };
  if (options.baseUrl) {
    spec.servers = [{ url: options.baseUrl }];
  }
  const tags = buildTags(rpcGroups);
  if (tags.length > 0) {
    spec.tags = tags;
  }
  const paths = buildPaths(rpcGroups);
  spec.paths = paths;
  spec.components = buildComponents(ir, rpcGroups);
  return spec;
}
__name(buildOpenApiSpec, "buildOpenApiSpec");

// src/generate.ts
function generateOpenApi(input) {
  const options = resolvePluginOptions(input.options);
  assertValidIrForRpc(input.ir);
  const rpcGroups = extractRpcGroups(input.ir);
  const spec = buildOpenApiSpec(input.ir, rpcGroups, options);
  return {
    files: [
      {
        path: options.outFile,
        content: stringifySpec(spec, options.outFormat)
      }
    ]
  };
}
__name(generateOpenApi, "generateOpenApi");
function stringifySpec(spec, outFormat) {
  if (outFormat === "json") {
    return `${JSON.stringify(spec, null, 2)}
`;
  }
  return stringify3(spec);
}
__name(stringifySpec, "stringifySpec");

// src/index.ts
var generate = definePlugin((input) => generateOpenApi(input));
