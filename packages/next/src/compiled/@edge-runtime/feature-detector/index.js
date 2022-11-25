"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var src_exports = {};
__export(src_exports, {
  findGlobals: () => findGlobals,
  hasEdgeSignature: () => hasEdgeSignature
});
module.exports = __toCommonJS(src_exports);

// src/find-globals.ts
var import_ts_morph2 = require("ts-morph");

// src/utils/project.ts
var import_ts_morph = require("ts-morph");

// src/utils/type-definition.txt
var type_definition_default = `/* We can not load default library types because it will bring too many of them, which the edge-runtime does not support */
/// <reference no-default-lib="true"/>

/* We load the minimal ES version supported by the edge-runtime (aka node@14) */
/// <reference lib="es2019" />

/*
Then we only need to declare edge-supported classes, functions and variables that are not part of ES standard, and supported by the runtime.
We don't need to fully declare them, except for the their static methods (because they produce instances of the var, like the new operator).
The simple declaration is enough for ts-morph to assign a Symbol to identifiers, which makes the distinctions between runtime builtins and undefined globals.
*/
interface AbortController {}
declare var AbortController: {
  prototype: AbortController;
  new(): AbortController;
};

interface AbortSignal {}
declare var AbortSignal: {
  prototype: AbortSignal;
  new(): AbortSignal;
  timeout(): AbortSignal;
  abort(): AbortSignal;
};

interface Blob {}
declare var Blob: {
  prototype: Blob;
  new(): Blob;
};

interface CacheStorage {}
declare var CacheStorage: {
  prototype: CacheStorage;
  new(): CacheStorage;
};

interface Cache {}
declare var Cache: {
  prototype: Cache;
  new(): Cache;
};

interface Crypto {}
declare var Crypto: {
  prototype: Crypto;
  new(): Crypto;
};

interface CryptoKey {}
declare var CryptoKey: {
  prototype: CryptoKey;
  new(): CryptoKey;
};

interface DOMException {}
declare var DOMException: {
  prototype: DOMException;
  new(): DOMException;
};

interface FetchEvent {}
declare var FetchEvent: {
  prototype: FetchEvent;
  new(): FetchEvent;
};

interface File {}
declare var File: {
  prototype: File;
  new(): File;
};

interface FormData {}
declare var FormData: {
  prototype: FormData;
  new(): FormData;
};

interface Headers {}
declare var Headers: {
  prototype: Headers;
  new(): Headers;
};

interface SubtleCrypto {}
declare var SubtleCrypto: {
  prototype: SubtleCrypto;
  new(): SubtleCrypto;
};

interface TextEncoder {}
declare var TextEncoder: {
  prototype: TextEncoder;
  new(): TextEncoder;
};

interface TextDecoder {}
declare var TextDecoder: {
  prototype: TextDecoder;
  new(): TextDecoder;
};

interface ReadableStream {}
declare var ReadableStream: {
  prototype: ReadableStream;
  new(): ReadableStream;
};

interface ReadableStreamBYOBReader {}
declare var ReadableStreamBYOBReader: {
  prototype: ReadableStreamBYOBReader;
  new(): ReadableStreamBYOBReader;
};

interface ReadableStreamDefaultReader {}
declare var ReadableStreamDefaultReader: {
  prototype: ReadableStreamDefaultReader;
  new(): ReadableStreamDefaultReader;
};

interface Request {}
declare var Request: {
  prototype: Request;
  new(): Request;
};

interface Response {}
declare var Response: {
  prototype: Response;
  new(): Response;
  error(): Response;
  redirect(): Response;
  json(): Response;
};

interface TransformStream {}
declare var TransformStream: {
  prototype: TransformStream;
  new(): TransformStream;
};

interface URL {}
declare var URL: {
  prototype: URL;
  new(): URL;
};

interface URLSearchParams {}
declare var URLSearchParams: {
  prototype: URLSearchParams;
  new(): URLSearchParams;
};

interface URLPattern {}
declare var URLPattern: {
  prototype: URLPattern;
  new(): URLPattern;
};

interface WritableStream {}
declare var WritableStream: {
  prototype: WritableStream;
  new(): WritableStream;
};

interface WritableStreamDefaultWriter {}
declare var WritableStreamDefaultWriter: {
  prototype: WritableStreamDefaultWriter;
  new(): WritableStreamDefaultWriter;
};

declare var atob: (encoded: string) => string;
declare var btoa: (str: string) => string;
declare var caches: CacheStorage;
declare var console: {};
declare var crypto: Crypto;
declare var createCaches: () => {
  cacheStorage(): CacheStorage;
  Cache: Cache;
  CacheStorage: CacheStorage;
};
declare var fetch: () => Promise<Response>;
declare var setTimeout: () => number;
declare var structuredClone: <T>(any: T) => T;`;

// src/utils/project.ts
function buildProject() {
  const project = new import_ts_morph.Project({
    compilerOptions: {
      types: [],
      allowJs: true,
      checkJs: true
    }
  });
  project.createSourceFile("node_modules/index.d.ts", type_definition_default);
  project.addDirectoryAtPath(".");
  return project;
}

// src/find-globals.ts
function findGlobals(sourcePath, project = buildProject()) {
  const globals = /* @__PURE__ */ new Set();
  const sourceFile = project.addSourceFileAtPath(sourcePath);
  addFileGlobals(sourceFile, globals);
  return [...globals];
}
function addFileGlobals(sourceFile, globals) {
  const program = sourceFile.getProject().getProgram().compilerObject;
  const diagnostics = program.getSemanticDiagnostics(sourceFile.compilerNode);
  for (const { code, messageText } of diagnostics) {
    if (code === 2304 || code === 2311 || code === 2552 || code >= 2562 && code <= 2563 || code >= 2580 && code <= 2584 || code >= 2591 && code <= 2593) {
      const match = import_ts_morph2.ts.flattenDiagnosticMessageText(messageText, "\n").match(/^Cannot find name '([^']+)'\./);
      if (match) {
        globals.add(match[1]);
      }
    }
  }
}

// src/utils/exports.ts
function getDefaultExport(sourceFile) {
  var _a;
  const defaultExport = sourceFile.getDefaultExportSymbol();
  return (defaultExport == null ? void 0 : defaultExport.getValueDeclaration()) ?? ((_a = defaultExport == null ? void 0 : defaultExport.getDeclarations()) == null ? void 0 : _a[0]);
}

// src/utils/functions.ts
var import_ts_morph3 = require("ts-morph");
var { ExportAssignment, Identifier, FunctionDeclaration, ArrowFunction } = import_ts_morph3.SyntaxKind;
function getReturnType(node) {
  var _a, _b, _c, _d;
  switch (node == null ? void 0 : node.getKind()) {
    case ExportAssignment:
      return getReturnType((_a = node.asKind(ExportAssignment)) == null ? void 0 : _a.getExpression());
    case Identifier:
      return getReturnType((_b = node.getSymbol()) == null ? void 0 : _b.getValueDeclaration());
    case FunctionDeclaration:
      return (_c = node.asKind(FunctionDeclaration)) == null ? void 0 : _c.getReturnType();
    case ArrowFunction:
      return (_d = node.asKind(ArrowFunction)) == null ? void 0 : _d.getReturnType();
  }
}

// src/utils/types.ts
function extractFromPromise(type) {
  var _a;
  if (((_a = type == null ? void 0 : type.getTypeArguments()) == null ? void 0 : _a.length) === 1) {
    return type.getTypeArguments()[0];
  }
  return type;
}
function isSubClassOf(type, typeName) {
  if (!type) {
    return false;
  }
  for (const currentType of [type, ...type.getBaseTypes()]) {
    if (currentType.getText() === typeName) {
      return true;
    }
  }
  return false;
}

// src/has-edge-signature.ts
function hasEdgeSignature(sourcePath, project = buildProject()) {
  const sourceFile = project.addSourceFileAtPath(sourcePath);
  const defaultExport = getDefaultExport(sourceFile);
  if (!defaultExport) {
    return false;
  }
  const returnType = getReturnType(defaultExport);
  if (!returnType) {
    return false;
  }
  return isSubClassOf(extractFromPromise(returnType), "Response");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  findGlobals,
  hasEdgeSignature
});
