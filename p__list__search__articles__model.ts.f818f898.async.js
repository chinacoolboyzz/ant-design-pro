(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[16],{SMBZ:function(e,t,a){"use strict";var r=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.queryFakeList=i;var n=r(a("d6i3")),u=r(a("1l/V")),s=r(a("io9h"));function i(e){return c.apply(this,arguments)}function c(){return c=(0,u.default)(n.default.mark(function e(t){return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,s.default)("/api/fake_list",{params:t}));case 1:case"end":return e.stop()}},e)})),c.apply(this,arguments)}},xzdv:function(e,t,a){"use strict";var r=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=r(a("p0pE")),u=r(a("d6i3")),s=a("SMBZ"),i={namespace:"listSearchArticles",state:{list:[]},effects:{fetch:u.default.mark(function e(t,a){var r,n,i,c;return u.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,n=a.call,i=a.put,e.next=4,n(s.queryFakeList,r);case 4:return c=e.sent,e.next=7,i({type:"queryList",payload:Array.isArray(c)?c:[]});case 7:case"end":return e.stop()}},e)}),appendFetch:u.default.mark(function e(t,a){var r,n,i,c;return u.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,n=a.call,i=a.put,e.next=4,n(s.queryFakeList,r);case 4:return c=e.sent,e.next=7,i({type:"appendList",payload:Array.isArray(c)?c:[]});case 7:case"end":return e.stop()}},e)})},reducers:{queryList:function(e,t){return(0,n.default)({},e,{list:t.payload})},appendList:function(e,t){return(0,n.default)({},e,{list:e.list.concat(t.payload)})}}},c=i;t.default=c}}]);
//# sourceMappingURL=p__list__search__articles__model.ts.f818f898.async.js.map