import{S as X,p as $,a as d,s as U,b as I,n as w,i as M,c as L,t as Z,d as E,f as ee,e as A,g as H,h as te,u as se}from"./api-Cm8Wl5Mn.js";import{f as re}from"./query-w49hk-3I.js";import{a as g,R as y}from"./chunk-OE4NN4TA-D45wUbcD.js";import{a as u}from"./gql-CkVVm-bu.js";var De=class extends X{constructor(e,t){super(),this.options=t,this.#s=e,this.#i=null,this.#r=$(),this.bindMethods(),this.setOptions(t)}#s;#e=void 0;#p=void 0;#t=void 0;#a;#u;#r;#i;#m;#h;#d;#o;#c;#n;#f=new Set;bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){this.listeners.size===1&&(this.#e.addObserver(this),G(this.#e,this.options)?this.#l():this.updateResult(),this.#v())}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return k(this.#e,this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return k(this.#e,this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,this.#S(),this.#I(),this.#e.removeObserver(this)}setOptions(e){const t=this.options,s=this.#e;if(this.options=this.#s.defaultQueryOptions(e),this.options.enabled!==void 0&&typeof this.options.enabled!="boolean"&&typeof this.options.enabled!="function"&&typeof d(this.options.enabled,this.#e)!="boolean")throw new Error("Expected enabled to be a boolean or a callback that returns a boolean");this.#R(),this.#e.setOptions(this.options),t._defaulted&&!U(this.options,t)&&this.#s.getQueryCache().notify({type:"observerOptionsUpdated",query:this.#e,observer:this});const r=this.hasListeners();r&&q(this.#e,s,this.options,t)&&this.#l(),this.updateResult(),r&&(this.#e!==s||d(this.options.enabled,this.#e)!==d(t.enabled,this.#e)||I(this.options.staleTime,this.#e)!==I(t.staleTime,this.#e))&&this.#g();const i=this.#b();r&&(this.#e!==s||d(this.options.enabled,this.#e)!==d(t.enabled,this.#e)||i!==this.#n)&&this.#y(i)}getOptimisticResult(e){const t=this.#s.getQueryCache().build(this.#s,e),s=this.createResult(t,e);return ne(this,s)&&(this.#t=s,this.#u=this.options,this.#a=this.#e.state),s}getCurrentResult(){return this.#t}trackResult(e,t){return new Proxy(e,{get:(s,r)=>(this.trackProp(r),t?.(r),r==="promise"&&(this.trackProp("data"),!this.options.experimental_prefetchInRender&&this.#r.status==="pending"&&this.#r.reject(new Error("experimental_prefetchInRender feature flag is not enabled"))),Reflect.get(s,r))})}trackProp(e){this.#f.add(e)}getCurrentQuery(){return this.#e}refetch({...e}={}){return this.fetch({...e})}fetchOptimistic(e){const t=this.#s.defaultQueryOptions(e),s=this.#s.getQueryCache().build(this.#s,t);return s.fetch().then(()=>this.createResult(s,t))}fetch(e){return this.#l({...e,cancelRefetch:e.cancelRefetch??!0}).then(()=>(this.updateResult(),this.#t))}#l(e){this.#R();let t=this.#e.fetch(this.options,e);return e?.throwOnError||(t=t.catch(w)),t}#g(){this.#S();const e=I(this.options.staleTime,this.#e);if(M||this.#t.isStale||!L(e))return;const s=Z(this.#t.dataUpdatedAt,e)+1;this.#o=E.setTimeout(()=>{this.#t.isStale||this.updateResult()},s)}#b(){return(typeof this.options.refetchInterval=="function"?this.options.refetchInterval(this.#e):this.options.refetchInterval)??!1}#y(e){this.#I(),this.#n=e,!(M||d(this.options.enabled,this.#e)===!1||!L(this.#n)||this.#n===0)&&(this.#c=E.setInterval(()=>{(this.options.refetchIntervalInBackground||ee.isFocused())&&this.#l()},this.#n))}#v(){this.#g(),this.#y(this.#b())}#S(){this.#o&&(E.clearTimeout(this.#o),this.#o=void 0)}#I(){this.#c&&(E.clearInterval(this.#c),this.#c=void 0)}createResult(e,t){const s=this.#e,r=this.options,i=this.#t,c=this.#a,n=this.#u,a=e!==s?e.state:this.#p,{state:f}=e;let o={...f},S=!1,l;if(t._optimisticResults){const h=this.hasListeners(),R=!h&&G(e,t),v=h&&q(e,s,t,r);(R||v)&&(o={...o,...re(f.data,e.options)}),t._optimisticResults==="isRestoring"&&(o.fetchStatus="idle")}let{error:Q,errorUpdatedAt:x,status:b}=o;l=o.data;let Y=!1;if(t.placeholderData!==void 0&&l===void 0&&b==="pending"){let h;i?.isPlaceholderData&&t.placeholderData===n?.placeholderData?(h=i.data,Y=!0):h=typeof t.placeholderData=="function"?t.placeholderData(this.#d?.state.data,this.#d):t.placeholderData,h!==void 0&&(b="success",l=A(i?.data,h,t),S=!0)}if(t.select&&l!==void 0&&!Y)if(i&&l===c?.data&&t.select===this.#m)l=this.#h;else try{this.#m=t.select,l=t.select(l),l=A(i?.data,l,t),this.#h=l,this.#i=null}catch(h){this.#i=h}this.#i&&(Q=this.#i,l=this.#h,x=Date.now(),b="error");const T=o.fetchStatus==="fetching",D=b==="pending",_=b==="error",N=D&&T,F=l!==void 0,p={status:b,fetchStatus:o.fetchStatus,isPending:D,isSuccess:b==="success",isError:_,isInitialLoading:N,isLoading:N,data:l,dataUpdatedAt:o.dataUpdatedAt,error:Q,errorUpdatedAt:x,failureCount:o.fetchFailureCount,failureReason:o.fetchFailureReason,errorUpdateCount:o.errorUpdateCount,isFetched:o.dataUpdateCount>0||o.errorUpdateCount>0,isFetchedAfterMount:o.dataUpdateCount>a.dataUpdateCount||o.errorUpdateCount>a.errorUpdateCount,isFetching:T,isRefetching:T&&!D,isLoadingError:_&&!F,isPaused:o.fetchStatus==="paused",isPlaceholderData:S,isRefetchError:_&&F,isStale:j(e,t),refetch:this.refetch,promise:this.#r,isEnabled:d(t.enabled,e)!==!1};if(this.options.experimental_prefetchInRender){const h=O=>{p.status==="error"?O.reject(p.error):p.data!==void 0&&O.resolve(p.data)},R=()=>{const O=this.#r=p.promise=$();h(O)},v=this.#r;switch(v.status){case"pending":e.queryHash===s.queryHash&&h(v);break;case"fulfilled":(p.status==="error"||p.data!==v.value)&&R();break;case"rejected":(p.status!=="error"||p.error!==v.reason)&&R();break}}return p}updateResult(){const e=this.#t,t=this.createResult(this.#e,this.options);if(this.#a=this.#e.state,this.#u=this.options,this.#a.data!==void 0&&(this.#d=this.#e),U(t,e))return;this.#t=t;const s=()=>{if(!e)return!0;const{notifyOnChangeProps:r}=this.options,i=typeof r=="function"?r():r;if(i==="all"||!i&&!this.#f.size)return!0;const c=new Set(i??this.#f);return this.options.throwOnError&&c.add("error"),Object.keys(this.#t).some(n=>{const m=n;return this.#t[m]!==e[m]&&c.has(m)})};this.#O({listeners:s()})}#R(){const e=this.#s.getQueryCache().build(this.#s,this.options);if(e===this.#e)return;const t=this.#e;this.#e=e,this.#p=e.state,this.hasListeners()&&(t?.removeObserver(this),e.addObserver(this))}onQueryUpdate(){this.updateResult(),this.hasListeners()&&this.#v()}#O(e){H.batch(()=>{e.listeners&&this.listeners.forEach(t=>{t(this.#t)}),this.#s.getQueryCache().notify({query:this.#e,type:"observerResultsUpdated"})})}};function ie(e,t){return d(t.enabled,e)!==!1&&e.state.data===void 0&&!(e.state.status==="error"&&t.retryOnMount===!1)}function G(e,t){return ie(e,t)||e.state.data!==void 0&&k(e,t,t.refetchOnMount)}function k(e,t,s){if(d(t.enabled,e)!==!1&&I(t.staleTime,e)!=="static"){const r=typeof s=="function"?s(e):s;return r==="always"||r!==!1&&j(e,t)}return!1}function q(e,t,s,r){return(e!==t||d(r.enabled,e)===!1)&&(!s.suspense||e.state.status!=="error")&&j(e,s)}function j(e,t){return d(t.enabled,e)!==!1&&e.isStaleByTime(I(t.staleTime,e))}function ne(e,t){return!U(e.getCurrentResult(),t)}var V=g.createContext(!1),ae=()=>g.useContext(V);V.Provider;function oe(){let e=!1;return{clearReset:()=>{e=!1},reset:()=>{e=!0},isReset:()=>e}}var ce=g.createContext(oe()),le=()=>g.useContext(ce),ue=(e,t)=>{(e.suspense||e.throwOnError||e.experimental_prefetchInRender)&&(t.isReset()||(e.retryOnMount=!1))},he=e=>{g.useEffect(()=>{e.clearReset()},[e])},de=({result:e,errorResetBoundary:t,throwOnError:s,query:r,suspense:i})=>e.isError&&!t.isReset()&&!e.isFetching&&r&&(i&&e.data===void 0||te(s,[e.error,r])),fe=e=>{if(e.suspense){const s=i=>i==="static"?i:Math.max(i??1e3,1e3),r=e.staleTime;e.staleTime=typeof r=="function"?(...i)=>s(r(...i)):s(r),typeof e.gcTime=="number"&&(e.gcTime=Math.max(e.gcTime,1e3))}},pe=(e,t)=>e.isLoading&&e.isFetching&&!t,me=(e,t)=>e?.suspense&&t.isPending,B=(e,t,s)=>t.fetchOptimistic(e).catch(()=>{s.clearReset()});function _e(e,t,s){const r=ae(),i=le(),c=se(),n=c.defaultQueryOptions(e);c.getDefaultOptions().queries?._experimental_beforeQuery?.(n),n._optimisticResults=r?"isRestoring":"optimistic",fe(n),ue(n,i),he(i);const m=!c.getQueryCache().get(n.queryHash),[a]=g.useState(()=>new t(c,n)),f=a.getOptimisticResult(n),o=!r&&e.subscribed!==!1;if(g.useSyncExternalStore(g.useCallback(S=>{const l=o?a.subscribe(H.batchCalls(S)):w;return a.updateResult(),l},[a,o]),()=>a.getCurrentResult(),()=>a.getCurrentResult()),g.useEffect(()=>{a.setOptions(n)},[n,a]),me(n,f))throw B(n,a,i);if(de({result:f,errorResetBoundary:i,throwOnError:n.throwOnError,query:c.getQueryCache().get(n.queryHash),suspense:n.suspense}))throw f.error;return c.getDefaultOptions().queries?._experimental_afterQuery?.(n,f),n.experimental_prefetchInRender&&!M&&pe(f,r)&&(m?B(n,a,i):c.getQueryCache().get(n.queryHash)?.promise)?.catch(w).finally(()=>{a.updateResult()}),n.notifyOnChangeProps?f:a.trackResult(f)}var K={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},z=y.createContext&&y.createContext(K),ge=["attr","size","title"];function be(e,t){if(e==null)return{};var s=ye(e,t),r,i;if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(i=0;i<c.length;i++)r=c[i],!(t.indexOf(r)>=0)&&Object.prototype.propertyIsEnumerable.call(e,r)&&(s[r]=e[r])}return s}function ye(e,t){if(e==null)return{};var s={};for(var r in e)if(Object.prototype.hasOwnProperty.call(e,r)){if(t.indexOf(r)>=0)continue;s[r]=e[r]}return s}function C(){return C=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var s=arguments[t];for(var r in s)Object.prototype.hasOwnProperty.call(s,r)&&(e[r]=s[r])}return e},C.apply(this,arguments)}function W(e,t){var s=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(i){return Object.getOwnPropertyDescriptor(e,i).enumerable})),s.push.apply(s,r)}return s}function P(e){for(var t=1;t<arguments.length;t++){var s=arguments[t]!=null?arguments[t]:{};t%2?W(Object(s),!0).forEach(function(r){ve(e,r,s[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(s)):W(Object(s)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(s,r))})}return e}function ve(e,t,s){return t=Se(t),t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}function Se(e){var t=Ie(e,"string");return typeof t=="symbol"?t:t+""}function Ie(e,t){if(typeof e!="object"||!e)return e;var s=e[Symbol.toPrimitive];if(s!==void 0){var r=s.call(e,t);if(typeof r!="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function J(e){return e&&e.map((t,s)=>y.createElement(t.tag,P({key:s},t.attr),J(t.child)))}function Ue(e){return t=>y.createElement(Re,C({attr:P({},e.attr)},t),J(e.child))}function Re(e){var t=s=>{var{attr:r,size:i,title:c}=e,n=be(e,ge),m=i||s.size||"1em",a;return s.className&&(a=s.className),e.className&&(a=(a?a+" ":"")+e.className),y.createElement("svg",C({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},s.attr,r,n,{className:a,style:P(P({color:e.color||s.color},s.style),e.style),height:m,width:m,xmlns:"http://www.w3.org/2000/svg"}),c&&y.createElement("title",null,c),e.children)};return z!==void 0?y.createElement(z.Consumer,null,s=>t(s)):t(K)}const we=u`
  query Timeline($cursor: ID, $filter: FilterInput, $viewerId: String) {
    timeline(cursor: $cursor, filter: $filter, viewerId: $viewerId) {
      posts {
        id
        name
        type
        startDescription
        endDescription
        startYear
        startMonth
        startDay
        endYear
        endMonth
        endDay
        startSignificance
        endSignificance
        imageUrl
        imageCredit
        sourceUrl
        cdnId
        country {
          name
          continent
        }
        subjects {
          id
          name
        }
        group {
          name
          icon
        }
        user {
          id
          username
        }
        likes
        liked
      }
      nextCursor
    }
  }
`,Me=u`
  query GetPopulation($start: Int!) {
    getPopulation(start: $start)
  }
`,ke=u`
  query GetSignificant($startYear: Int!, $endYear: Int!, $filter: FilterInput) {
    getSignificant(startYear: $startYear, endYear: $endYear, filter: $filter) {
      id
      name
      imageUrl
      cdnId
    }
  }
`,je=u`
  query GetCivilisation(
    $startYear: Int!
    $endYear: Int!
    $filter: FilterInput
  ) {
    getCivilisation(startYear: $startYear, endYear: $endYear, filter: $filter) {
      id
      name
      startYear
      endYear
      startSignificance
      country {
        name
        continent
      }
      group {
        id
      }
    }
  }
`,Qe=u`
  query GetPostWithFormLists($id: Int!) {
    getPost(id: $id) {
      id
      name
      type
      startDescription
      endDescription
      startYear
      startMonth
      startDay
      endYear
      endMonth
      endDay
      startSignificance
      endSignificance
      imageUrl
      imageCredit
      sourceUrl
      civilisation
      country {
        name
        continent
      }
      subjects {
        id
        name
      }
      group {
        id
        name
        icon
      }
    }
    formLists {
      allCountries {
        name
        continent
      }
      allSubjects {
        id
        name
      }
      allGroups {
        id
        name
      }
    }
  }
`,xe=u`
  query GetFormLists {
    formLists {
      allCountries {
        name
        continent
      }
      allSubjects {
        id
        name
      }
      allGroups {
        id
        name
      }
    }
  }
`,Ye=u`
  query UserPosts($userId: Int!) {
    userPosts(userId: $userId) {
      id
      name
      type
      startDescription
      endDescription
      startYear
      startMonth
      startDay
      endYear
      endMonth
      endDay
      startSignificance
      endSignificance
      imageUrl
      imageCredit
      sourceUrl
      cdnId
      civilisation
      country {
        name
        continent
      }
      subjects {
        id
        name
      }
      group {
        icon
      }
      user {
        id
        username
        createdAt
        role
      }
      likes
      liked
    }
  }
`,Ne=u`
  query UserLikes($userId: Int!) {
    userLikes(userId: $userId) {
      post {
        id
        name
        type
        startDescription
        endDescription
        startYear
        startMonth
        startDay
        endYear
        endMonth
        endDay
        startSignificance
        endSignificance
        imageUrl
        imageCredit
        sourceUrl
        cdnId
        civilisation
        country {
          name
          continent
        }
        subjects {
          id
          name
        }
        group {
          icon
        }
        user {
          id
          username
          createdAt
          role
        }
        likes
        liked
      }
    }
  }
`,Fe=u`
  query UserStats($userId: Int!) {
    userStats(userId: $userId) {
      id
      username
      emailVerifiedAt
      createdAt
      stats {
        mostLikedPost {
          id
          name
          likes
          cdnId
          imageUrl
          liked
        }
        favouriteEra
        favouriteGroup {
          name
          icon
        }
      }
    }
  }
`,$e=u`
  query PendingCreatedPosts {
    pendingCreatedPosts {
      createdPosts {
        id
        data
        createdAt
        updatedAt
        suggestedBy {
          id
          username
        }
      }
    }
  }
`,Le=u`
  query PendingStats {
    pendingStats {
      pending
      approved
      rejected
    }
  }
`,Ae=u`
  query SavedFilters {
    savedFilters {
      id
      name
      state {
        search
        sortBy
        type
        subject
        continent
        yearStart
        yearEnd
        group
        view
      }
      createdAt
      updatedAt
    }
  }
`,Ge=u`
  query PendingEdits {
    pendingEdits {
      edits {
        id
        suggestedBy {
          id
          username
        }
        hasImageChanges
        post {
          id
          name
          type
          startDescription
          endDescription
          startYear
          startMonth
          startDay
          endYear
          endMonth
          endDay
          startSignificance
          endSignificance
          imageUrl
          imageCredit
          sourceUrl
          cdnId
          civilisation
          country {
            name
            continent
          }
          subjects {
            id
            name
          }
          group {
            id
            name
            icon
          }
        }
        changes {
          name {
            label
            kind
            from
            to
          }
          type {
            label
            kind
            from
            to
          }
          startYear {
            label
            kind
            from
            to
          }
          startMonth {
            label
            kind
            from
            to
          }
          startDay {
            label
            kind
            from
            to
          }
          endYear {
            label
            kind
            from
            to
          }
          endMonth {
            label
            kind
            from
            to
          }
          endDay {
            label
            kind
            from
            to
          }
          startDescription {
            label
            kind
            from
            to
          }
          endDescription {
            label
            kind
            from
            to
          }
          startSignificance {
            label
            kind
            from
            to
          }
          endSignificance {
            label
            kind
            from
            to
          }
          civilisation {
            label
            kind
            from
            to
          }
          country {
            label
            kind
            from
            to
          }
          group {
            label
            kind
            from
            to
          }
          subjects {
            label
            kind
            from
            to
          }
          imageUrl {
            label
            kind
            from
            to
          }
          imageCredit {
            label
            kind
            from
            to
          }
          sourceUrl {
            label
            kind
            from
            to
          }
        }
      }
    }
  }
`;export{je as C,Ue as G,Me as P,De as Q,ke as S,we as T,Ye as U,Ne as a,Fe as b,Qe as c,Ge as d,Le as e,xe as f,$e as g,Ae as h,_e as u};
