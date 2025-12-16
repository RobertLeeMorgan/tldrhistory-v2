import { gql } from "graphql-request";

export const TIMELINE_QUERY = gql`
  query Timeline($cursor: ID, $filter: FilterInput) {
    timeline(cursor: $cursor, filter: $filter) {
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
          username
          id
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
  query GetSignificant($start: Int!, $end: Int!, $filter: FilterInput) {
    getSignificant(startYear: $start, endYear: $end, filter: $filter) {
      id
      name
      imageUrl
    }
  }
`;

export const CIVILISATION_QUERY = gql`
  query GetCivilisation($start: Int!, $end: Int!, $filter: FilterInput) {
    getCivilisation(startYear: $start, endYear: $end, filter: $filter) {
      id
      name
    }
  }
`;

export const GET_POST = gql`
  query GetPost($id: Int!) {
    getPost(id: $id) {
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
          id
        }
      }
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

export const GET_HEADLINE = gql`
  query GetHeadline($startYear: Int!, $endYear: Int!) {
    getHeadline(startYear: $startYear, endYear: $endYear)
  }
`;

export const GET_USER = gql`
  query GetUser($id: Int!) {
    getUser(id: $id) {
      id
      username
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
        imageUrl
        likes
        liked
      }
      likes {
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
          imageUrl
          likes
          liked
        }
      }
    }
  }
`;

export const PENDING_EDITS_QUERY = gql`
  query PendingEdits {
    pendingEdits {
      id
      status
      data
      suggestedBy {
        id
        username
      }
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
        sourceUrl
        imageCredit
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
          id
        }
        imageUrl
      }
      createdAt
    }
  }
`;
