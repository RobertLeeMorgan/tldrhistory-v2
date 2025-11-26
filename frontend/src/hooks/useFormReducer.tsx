import { useReducer, useEffect } from "react";
import type { PostWithLists } from "../generated/graphql";

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
  sourceUrl: string;
  countryId: string;
  subjects: string[];
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

export function useFormReducer(postData?: PostWithLists["post"]) {
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
    sourceUrl: "",
    countryId: "",
    subjects: [],
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
          sourceUrl: postData.sourceUrl ?? "",
          countryId: postData.country?.name ?? "",
          subjects: postData.subjects.map((s) => s.id),
        },
      });
    }
  }, [postData]);

  return { state, dispatch };
}
