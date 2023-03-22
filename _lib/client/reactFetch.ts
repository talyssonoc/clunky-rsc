/**
 * @license React
 * react-fetch.browser.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import react from "react";

const Pending = 0;
const Resolved = 1;
const Rejected = 2;
// TODO: this is a browser-only version. Add a separate Node entry point.
const nativeFetch = (typeof globalThis !== "undefined" ? globalThis : window)
  .fetch;

function getRecordMap() {
  // @ts-ignore
  return react.unstable_getCacheForType(createRecordMap);
}

function createRecordMap() {
  return new Map();
}

function createRecordFromThenable(thenable: any /* TODO implement it */) {
  const record = {
    status: Pending,
    value: thenable,
  };
  thenable.then(
    function (value: any /* TODO implement it */) {
      if (record.status === Pending) {
        const resolvedRecord = record;
        resolvedRecord.status = Resolved;
        resolvedRecord.value = value;
      }
    },
    function (err: any /* TODO implement it */) {
      if (record.status === Pending) {
        const rejectedRecord = record;
        rejectedRecord.status = Rejected;
        rejectedRecord.value = err;
      }
    }
  );
  return record;
}

function readRecordValue(record: any /* TODO implement it */) {
  if (record.status === Resolved) {
    return record.value;
  } else {
    throw record.value;
  }
}

class Response {
  headers: any;
  ok: any;
  redirected: any;
  status: any;
  statusText: any;
  type: any;
  url: any;
  _response: any;
  _arrayBuffer: any;
  _blob: any;
  _json: any;
  _text: any;

  constructor(nativeResponse: any) {
    this.headers = nativeResponse.headers;
    this.ok = nativeResponse.ok;
    this.redirected = nativeResponse.redirected;
    this.status = nativeResponse.status;
    this.statusText = nativeResponse.statusText;
    this.type = nativeResponse.type;
    this.url = nativeResponse.url;
    this._response = nativeResponse;
    this._arrayBuffer = null;
    this._blob = null;
    this._json = null;
    this._text = null;
  }

  arrayBuffer() {
    return readRecordValue(
      // $FlowFixMe[object-this-reference] found when upgrading Flow
      this._arrayBuffer || // $FlowFixMe[object-this-reference] found when upgrading Flow
        (this._arrayBuffer = createRecordFromThenable(
          // $FlowFixMe[object-this-reference] found when upgrading Flow
          this._response.arrayBuffer()
        ))
    );
  }

  blob() {
    return readRecordValue(
      // $FlowFixMe[object-this-reference] found when upgrading Flow
      this._blob || // $FlowFixMe[object-this-reference] found when upgrading Flow
        (this._blob = createRecordFromThenable(this._response.blob()))
    );
  }

  json() {
    return readRecordValue(
      // $FlowFixMe[object-this-reference] found when upgrading Flow
      this._json || // $FlowFixMe[object-this-reference] found when upgrading Flow
        (this._json = createRecordFromThenable(this._response.json()))
    );
  }

  text() {
    return readRecordValue(
      // $FlowFixMe[object-this-reference] found when upgrading Flow
      this._text || // $FlowFixMe[object-this-reference] found when upgrading Flow
        (this._text = createRecordFromThenable(this._response.text()))
    );
  }
}

function preloadRecord(url: string, options?: RequestInit) {
  const map = getRecordMap();
  let record = map.get(url);

  if (!record) {
    if (options) {
      if (options.method || options.body || options.signal) {
        // TODO: wire up our own cancellation mechanism.
        // TODO: figure out what to do with POST.
        // eslint-disable-next-line react-internal/prod-error-codes
        throw Error("Unsupported option");
      }
    }

    const thenable = nativeFetch(url, options);
    record = createRecordFromThenable(thenable);
    map.set(url, record);
  }

  return record;
}

function preload(url: string, options?: RequestInit) {
  preloadRecord(url, options); // Don't return anything.
}
function fetch(url: string, options?: RequestInit) {
  const record = preloadRecord(url, options);
  const nativeResponse = readRecordValue(record);

  if (nativeResponse._reactResponse) {
    return nativeResponse._reactResponse;
  } else {
    // $FlowFixMe[invalid-constructor] Flow no longer supports calling new on functions
    return (nativeResponse._reactResponse = new Response(nativeResponse));
  }
}

export { fetch, preload };
