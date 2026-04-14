import { useReducer, useEffect } from "react";
import type { GetPostWithFormListsQuery } from "../../../generated/graphql";

type State = {
  name: string;
  startDescription: string;
  endDescription: string;
  type: string;
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  imageUrl: string;
  imageCredit: string;
  sourceUrl: string;
  country: { name: string };
  subjects: { id: string; name: string }[];
  group: { id: number; name: string };
  civilisation?: boolean;
};

type Action =
  | { type: "SET_FIELD"; field: keyof State; value: any }
  | { type: "SET_ALL"; payload: Partial<State> };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_ALL":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

type FormPost = GetPostWithFormListsQuery["getPost"];

export function useFormReducer(postData?: FormPost) {
  const [state, dispatch] = useReducer(reducer, {
    name: "",
    startDescription: "",
    endDescription: "",
    type: "",
    startYear: 0,
    startMonth: 0,
    startDay: 0,
    endYear: 0,
    endMonth: 0,
    endDay: 0,
    imageUrl: "",
    imageCredit: "",
    sourceUrl: "",
    country: { name: "" },
    subjects: [],
    group: { id: 0, name: "" },
    civilisation: false,
  });

  useEffect(() => {
    if (postData) {
      dispatch({
        type: "SET_ALL",
        payload: {
          name: postData.name ?? "",
          startDescription: postData.startDescription ?? "",
          endDescription: postData.endDescription ?? "",
          type: postData.type ?? "",
          startYear: postData.startYear ?? 0,
          startMonth: postData.startMonth ?? 0,
          startDay: postData.startDay ?? 0,
          endYear: postData.endYear ?? 0,
          endMonth: postData.endMonth ?? 0,
          endDay: postData.endDay ?? 0,
          imageUrl: postData.imageUrl ?? "",
          imageCredit: postData.imageCredit ?? "",
          sourceUrl: postData.sourceUrl ?? "",
          country:  {name: postData.country.name ?? "" },
          subjects: postData.subjects.map((s) => ({ id: s.id, name: s.name })),
          group: {
            id: postData.group?.id ?? 0,
            name: postData.group?.name ?? "",
          },
          civilisation: postData.civilisation ?? false,
        },
      });
    }
  }, [postData]);

  return { state, dispatch };
}
