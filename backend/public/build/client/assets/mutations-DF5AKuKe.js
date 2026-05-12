import{a as o}from"./chunk-OE4NN4TA-D45wUbcD.js";import{g as p}from"./mutation-vgu_P7A0.js";import{S as l,s as h,D as u,g as d,u as E,n as T,h as S}from"./api-IZa0Uo5G.js";import{a as i}from"./gql-BYRUW5kV.js";var I=class extends l{#e;#i=void 0;#t;#s;constructor(t,e){super(),this.#e=t,this.setOptions(e),this.bindMethods(),this.#a()}bindMethods(){this.mutate=this.mutate.bind(this),this.reset=this.reset.bind(this)}setOptions(t){const e=this.options;this.options=this.#e.defaultMutationOptions(t),h(this.options,e)||this.#e.getMutationCache().notify({type:"observerOptionsUpdated",mutation:this.#t,observer:this}),e?.mutationKey&&this.options.mutationKey&&u(e.mutationKey)!==u(this.options.mutationKey)?this.reset():this.#t?.state.status==="pending"&&this.#t.setOptions(this.options)}onUnsubscribe(){this.hasListeners()||this.#t?.removeObserver(this)}onMutationUpdate(t){this.#a(),this.#n(t)}getCurrentResult(){return this.#i}reset(){this.#t?.removeObserver(this),this.#t=void 0,this.#a(),this.#n()}mutate(t,e){return this.#s=e,this.#t?.removeObserver(this),this.#t=this.#e.getMutationCache().build(this.#e,this.options),this.#t.addObserver(this),this.#t.execute(t)}#a(){const t=this.#t?.state??p();this.#i={...t,isPending:t.status==="pending",isSuccess:t.status==="success",isError:t.status==="error",isIdle:t.status==="idle",mutate:this.mutate,reset:this.reset}}#n(t){d.batch(()=>{if(this.#s&&this.hasListeners()){const e=this.#i.variables,a=this.#i.context,s={client:this.#e,meta:this.options.meta,mutationKey:this.options.mutationKey};t?.type==="success"?(this.#s.onSuccess?.(t.data,e,a,s),this.#s.onSettled?.(t.data,null,e,a,s)):t?.type==="error"&&(this.#s.onError?.(t.error,e,a,s),this.#s.onSettled?.(void 0,t.error,e,a,s))}this.listeners.forEach(e=>{e(this.#i)})})}};function _(t,e){const a=E(),[s]=o.useState(()=>new I(a,t));o.useEffect(()=>{s.setOptions(t)},[s,t]);const n=o.useSyncExternalStore(o.useCallback(r=>s.subscribe(d.batchCalls(r)),[s]),()=>s.getCurrentResult(),()=>s.getCurrentResult()),c=o.useCallback((r,m)=>{s.mutate(r,m).catch(T)},[s]);if(n.error&&S(s.options.throwOnError,[n.error]))throw n.error;return{...n,mutate:c,mutateAsync:n.mutate}}const v=i`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      needsEmailVerification
      user {
        id
        username
        email
        role
        emailVerifiedAt
      }
    }
  }
`,f=i`
  mutation Register($email: String!, $password: String!, $username: String!) {
    register(email: $email, password: $password, username: $username) {
      token
      needsEmailVerification
      user {
        id
        username
        email
        role
        emailVerifiedAt
      }
    }
  }
`,R=i`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      success
      message
    }
  }
`,b=i`
  mutation ResendVerificationEmail {
    resendVerificationEmail {
      success
      message
    }
  }
`,y=i`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      success
      message
    }
  }
`,P=i`
  mutation ResetPassword($token: String!, $password: String!) {
    resetPassword(token: $token, password: $password) {
      token
      needsEmailVerification
      user {
        id
        username
        email
        role
        emailVerifiedAt
      }
    }
  }
`,M=i`
  mutation LikePost($postId: Int!) {
    likePost(postId: $postId) {
      id
      likes
      liked
    }
  }
`,C=i`
  mutation DeletePost($id: Int!) {
    deletePost(id: $id)
  }
`,w=`
  mutation SuggestEdit($postId: Int!, $input: PostInput!) {
    suggestEdit(postId: $postId, input: $input) {
      id
      status
      data
      post { id name }
      suggestedBy { id username }
    }
  }
`,D=`
  mutation ApproveEdit($id: Int!) {
    approveEdit(id: $id)
  }
`,U=`
  mutation RejectEdit($id: Int!) {
    rejectEdit(id: $id)
  }
`,N=i`
  mutation CreatePostSuggestion($input: PostInput!) {
    createPostSuggestion(input: $input) {
      id
      status
      data
      createdAt
      updatedAt
      suggestedBy {
        id
        username
      }
    }
  }
`,F=`
  mutation ApproveCreatedPost($id: Int!) {
    approveCreatedPost(id: $id)
  }
`,V=`
  mutation RejectCreatedPost($id: Int!) {
    rejectCreatedPost(id: $id)
  }
`,k=i`
  mutation SaveFilter($input: SaveFilterInput!) {
    saveFilter(input: $input) {
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
`,L=i`
  mutation EditSavedFilter($input: EditSavedFilterInput!) {
    editSavedFilter(input: $input) {
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
`,K=i`
  mutation DeleteSavedFilter($input: DeleteSavedFilterInput!) {
    deleteSavedFilter(input: $input) {
      id
      name
    }
  }
`;export{F as A,N as C,K as D,L as E,y as F,v as L,f as R,w as S,R as V,P as a,b,V as c,D as d,U as e,k as f,C as g,M as h,_ as u};
