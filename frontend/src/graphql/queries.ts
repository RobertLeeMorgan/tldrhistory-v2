import { gql } from "graphql-request";

export const TIMELINE_QUERY = gql`
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
`;

export const POPULATION_QUERY = gql`
  query GetPopulation($start: Int!) {
    getPopulation(start: $start)
  }
`;

export const SIGNIFICANT_QUERY = gql`
  query GetSignificant($startYear: Int!, $endYear: Int!, $filter: FilterInput) {
    getSignificant(startYear: $startYear, endYear: $endYear, filter: $filter) {
      id
      name
      imageUrl
      cdnId
    }
  }
`;

export const CIVILISATION_QUERY = gql`
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
`;

export const GET_POST = gql`
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
`;

export const GET_FORM_LISTS = gql`
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
`;

export const USER_POSTS = gql`
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
`;

export const USER_LIKES = gql`
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
`;

export const USER_STATS = gql`
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
`;

export const PENDING_CREATED_POSTS_QUERY = gql`
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
`;

export const PENDING_STATS_QUERY = gql`
  query PendingStats {
    pendingStats {
      pending
      approved
      rejected
    }
  }
`;

export const SAVED_FILTERS_QUERY = gql`
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
`;

export const PENDING_EDITS_QUERY = gql`
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
`;
