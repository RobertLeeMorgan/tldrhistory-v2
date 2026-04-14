import type { PendingEditsQuery } from "../../../generated/graphql";
import { formatDate } from "../../../utils/formatDate";
import type { ReactNode } from "react";

type PendingEditItem = PendingEditsQuery["pendingEdits"]["edits"][number];

type SubjectItem = { name: string };

export interface FieldDiff {
  label: string;
  from: any;
  to: any;
  isDiff: boolean;
  render?: (value: any) => ReactNode;
}

interface ReviewDiffsResult {
  mainFields: FieldDiff[];
  descriptionFields: FieldDiff[];
  metadataFields: FieldDiff[];
  imageFields: FieldDiff[];
  hasAnyImageChange: boolean;
}

export function useReviewDiffs(suggestion: PendingEditItem): ReviewDiffsResult {
  const { post, changes } = suggestion;

  // Name
  const nameTo = String(changes.name?.to ?? post.name);
  const isNameDiff = post.name !== nameTo;

  // Type
  const typeFrom = String(post.type);
  const typeTo = String(changes.type?.to ?? post.type);
  const isTypeDiff = typeFrom !== typeTo;

  // Date
  const startFrom = formatDate(
    Number(post.startYear),
    Number(post.startMonth),
    Number(post.startDay),
  );
  const startTo = formatDate(
    Number(changes.startYear?.to ?? post.startYear),
    Number(changes.startMonth?.to ?? post.startMonth),
    Number(changes.startDay?.to ?? post.startDay),
  );
  const endFrom = formatDate(
    Number(post.endYear),
    Number(post.endMonth),
    Number(post.endDay),
  );
  const endTo = formatDate(
    Number(changes.endYear?.to ?? post.endYear),
    Number(changes.endMonth?.to ?? post.endMonth),
    Number(changes.endDay?.to ?? post.endDay),
  );
  const dateFrom = `${startFrom} → ${endFrom}`;
  const dateTo = `${startTo} → ${endTo}`;
  const isDateDiff = dateFrom !== dateTo;

  // Descriptions
  const startDescFrom = post.startDescription ?? "";
  const startDescTo = String(
    changes.startDescription?.to ?? post.startDescription ?? "",
  );
  const isStartDescDiff = startDescFrom !== startDescTo;

  const endDescFrom = post.endDescription ?? "";
  const endDescTo = String(
    changes.endDescription?.to ?? post.endDescription ?? "",
  );
  const isEndDescDiff = endDescFrom !== endDescTo;

  // Group & Country
  const groupFrom = post.group?.name ?? "";
  const groupTo = changes.group?.to?.name ?? post.group?.name ?? "";
  const isGroupDiff = groupFrom !== groupTo;

  const countryFrom = post.country?.name ?? "";
  const countryTo = changes.country?.to?.name ?? post.country?.name ?? "";
  const isCountryDiff = countryFrom !== countryTo;

  // Civilisation
  const civilisationFrom = Boolean(post.civilisation);
  const civilisationTo = Boolean(
    changes.civilisation?.to ?? post.civilisation,
  );
  const isCivilisationDiff = civilisationFrom !== civilisationTo;

  // Subjects
  const subjectsFrom: SubjectItem[] = post.subjects.map((s) => ({
    name: s.name,
  }));
  const subjectsTo: SubjectItem[] =
    (changes.subjects?.to as SubjectItem[] | undefined) ?? subjectsFrom;
  const isSubjectsDiff =
    JSON.stringify(subjectsFrom) !== JSON.stringify(subjectsTo);

  // Image changes
  const imageUrlFrom = post.imageUrl ?? "";
  const imageUrlTo = String(changes.imageUrl?.to ?? post.imageUrl ?? "");
  const isImageUrlDiff = imageUrlFrom !== imageUrlTo;

  const imageCreditFrom = post.imageCredit ?? "";
  const imageCreditTo = String(
    changes.imageCredit?.to ?? post.imageCredit ?? "",
  );
  const isImageCreditDiff = imageCreditFrom !== imageCreditTo;

  const sourceUrlFrom = post.sourceUrl ?? "";
  const sourceUrlTo = String(
    changes.sourceUrl?.to ?? post.sourceUrl ?? "",
  );
  const isSourceUrlDiff = sourceUrlFrom !== sourceUrlTo;

  const hasAnyImageChange =
    isImageUrlDiff || isImageCreditDiff || isSourceUrlDiff;

  return {
    mainFields: [
      { label: "Name", from: post.name, to: nameTo, isDiff: isNameDiff },
      { label: "Type", from: typeFrom, to: typeTo, isDiff: isTypeDiff },
      { label: "Date", from: dateFrom, to: dateTo, isDiff: isDateDiff },
    ],
    descriptionFields: [
      {
        label: "Start description",
        from: startDescFrom,
        to: startDescTo,
        isDiff: isStartDescDiff,
      },
      {
        label: "End description",
        from: endDescFrom,
        to: endDescTo,
        isDiff: isEndDescDiff,
      },
    ],
    metadataFields: [
      {
        label: "Group",
        from: groupFrom,
        to: groupTo,
        isDiff: isGroupDiff,
      },
      {
        label: "Country",
        from: countryFrom,
        to: countryTo,
        isDiff: isCountryDiff,
      },
      {
        label: "Civilisation",
        from: civilisationFrom,
        to: civilisationTo,
        isDiff: isCivilisationDiff,
        render: (value: boolean) => (
          <span>{value ? "True" : "False"}</span>
        ),
      },
      {
        label: "Subjects",
        from: subjectsFrom,
        to: subjectsTo,
        isDiff: isSubjectsDiff,
        render: (items: SubjectItem[]) =>
          items?.length ? (
            <span className="flex flex-wrap gap-1.5">
              {items.map((item) => (
                <span key={item.name}>{item.name}</span>
              ))}
            </span>
          ) : (
            <span className="text-stone-500 italic">empty</span>
          ),
      },
    ],
    imageFields: [
      {
        label: "Image URL",
        from: imageUrlFrom,
        to: imageUrlTo,
        isDiff: isImageUrlDiff,
      },
      {
        label: "Image credit",
        from: imageCreditFrom,
        to: imageCreditTo,
        isDiff: isImageCreditDiff,
      },
      {
        label: "Source URL",
        from: sourceUrlFrom,
        to: sourceUrlTo,
        isDiff: isSourceUrlDiff,
      },
    ],
    hasAnyImageChange,
  };
}