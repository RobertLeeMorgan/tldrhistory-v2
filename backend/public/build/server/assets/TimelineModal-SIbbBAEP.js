import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { u as useAuth, i as useToast, l as api, m as DELETE_POST, B as Button, n as formatDate, o as CardSubjects, q as CardFooter } from "./server-build-C73aGNsQ.js";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Link } from "react-router";
import { M as ModalShell, a as ModalCloseButton } from "./ModalCloseButton-C8qR-nFa.js";
import "node:stream";
import "@react-router/node";
import "isbot";
import "react-dom/server";
import "react";
import "framer-motion";
import "axios";
import "react-icons/gi";
import "graphql-request";
import "d3-geo";
import "d3-selection";
import "topojson-client";
import "d3-scale";
import "d3-transition";
import "react-icons/fa";
import "react-icons/lu";
import "react-icons/md";
import "masonic";
import "zod";
import "react-icons/io";
import "react-dom";
function useDeletePost(onClose) {
  const { isAuth } = useAuth();
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const currentUser = isAuth?.id ? { id: Number(isAuth.id), role: isAuth.role } : null;
  const { mutate, isPending } = useMutation({
    mutationFn: async (postId) => {
      const res = await api.post("", {
        query: DELETE_POST,
        variables: { id: postId }
      });
      if (res.data.errors) throw new Error(res.data.errors[0].message);
      return postId;
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["timeline"] });
      const previous = queryClient.getQueryData(["timeline"]);
      queryClient.setQueryData(
        ["timeline"],
        (old) => old?.filter((p) => p.id !== postId)
      );
      return { previous };
    },
    onError: (_err, _postId, context) => {
      queryClient.setQueryData(["timeline"], context?.previous);
      addToast({ message: _err.message, type: "error" });
    },
    onSuccess: (_postId) => {
      addToast({ message: "Post deleted", type: "success" });
      onClose();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["timeline"] });
    }
  });
  return {
    isPending,
    canDelete: currentUser?.role === "ADMIN",
    delete: mutate
  };
}
function ModalActions({ post, deleteMutation }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex gap-4 justify-center", children: [
    /* @__PURE__ */ jsx(Button, { label: "Suggest Edit", to: `/articles/edit/${post.id}` }),
    deleteMutation.canDelete && /* @__PURE__ */ jsx(
      Button,
      {
        onClick: () => post?.id && deleteMutation.delete(Number(post.id)),
        label: "Delete Post",
        loading: "Deleting...",
        isLoading: deleteMutation.isPending,
        primary: true
      }
    )
  ] });
}
function ModalHeader({ post }) {
  const start = formatDate(
    Number(post.startYear),
    Number(post.startMonth),
    Number(post.startDay)
  );
  const end = formatDate(
    Number(post.endYear),
    Number(post.endMonth),
    Number(post.endDay)
  );
  const imageSrc = post.cdnId ? `https://cdn.tldrhistory.xyz/${post.cdnId}` : post.imageUrl;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `grid ${imageSrc ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"} gap-4`,
      children: [
        imageSrc && /* @__PURE__ */ jsxs("div", { className: "relative max-w-300 mx-auto rounded", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: post.sourceUrl ? post.sourceUrl : "",
              target: "_blank",
              rel: "noopener noreferrer",
              children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: imageSrc ? imageSrc : "",
                  alt: post.name,
                  style: { maxHeight: "10rem" },
                  className: "object-cover justify-self-center rounded",
                  loading: "lazy"
                }
              )
            }
          ),
          post.imageCredit && /* @__PURE__ */ jsxs("div", { className: "group relative justify-content-center", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-[10px] bg-stone-950 text-wrap text-stone-300/90 pl-2 italic line-clamp-2 break-words whitespace-normal", children: [
              "Credit:",
              " ",
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: post.sourceUrl ? post.sourceUrl : "",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "underline hover:text-stone-200",
                  children: post.imageCredit
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute left-0 top-full mt-1 hidden text-wrap break-words rounded bg-stone-950 px-2 py-1 text-sm text-stone-200 shadow-lg group-hover:block", children: post.imageCredit })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 sm:space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[max-content_1fr] gap-x-3 gap-y-2 text-stone-300 sm:text-lg", children: [
            post.type === "person" ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-stone-400", children: "Born:" }),
              /* @__PURE__ */ jsx("span", { children: start }),
              end && end !== "0 CE" && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-stone-400", children: "Died:" }),
                /* @__PURE__ */ jsx("span", { children: end })
              ] })
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-stone-400", children: "From:" }),
              /* @__PURE__ */ jsx("span", { children: start }),
              end && end !== "0 CE" && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-stone-400", children: "To:" }),
                /* @__PURE__ */ jsx("span", { children: end })
              ] })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-stone-400", children: "Locale: " }),
            /* @__PURE__ */ jsx("span", { children: post.country.name }),
            post.group?.name && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-stone-400", children: "Group:" }),
              /* @__PURE__ */ jsx("span", { children: post.group?.name })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "items-start", children: /* @__PURE__ */ jsx(CardSubjects, { subjects: post.subjects, modal: true }) })
        ] })
      ]
    }
  );
}
function ModalDescription({ post }) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsx("p", { className: "md:text-lg text-stone-300", children: post.startDescription }),
    post.endDescription && /* @__PURE__ */ jsx("p", { className: "md:text-lg text-stone-400", children: post.endDescription })
  ] });
}
function PostModal({ open, post, onClose }) {
  const deleteMutation = useDeletePost(onClose);
  if (!post) return null;
  return /* @__PURE__ */ jsx(ModalShell, { open, onClose, panelClassName: "max-w-2xl", children: /* @__PURE__ */ jsxs("div", { className: "overflow-y-auto space-y-4 sm:space-y-6 max-h-[calc(95vh-3rem)] sm:max-h-[calc(95vh-5rem)]", children: [
    /* @__PURE__ */ jsx(ModalCloseButton, { onClose }),
    /* @__PURE__ */ jsx("h2", { className: "card-title text-stone-300 text-xl sm:text-2xl", children: post.name }),
    /* @__PURE__ */ jsx(ModalHeader, { post }),
    /* @__PURE__ */ jsx(ModalDescription, { post }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
      /* @__PURE__ */ jsxs("p", { className: "italic text-md text-stone-300", children: [
        "by",
        " ",
        /* @__PURE__ */ jsx(Link, { to: `/user/${post.user.id}`, children: /* @__PURE__ */ jsx("span", { className: "text-gold text-lg not-italic", children: post.user.username }) })
      ] }),
      /* @__PURE__ */ jsx(CardFooter, { post })
    ] }),
    /* @__PURE__ */ jsx(
      ModalActions,
      {
        post,
        deleteMutation,
        onClose
      }
    )
  ] }) });
}
export {
  PostModal as default
};
