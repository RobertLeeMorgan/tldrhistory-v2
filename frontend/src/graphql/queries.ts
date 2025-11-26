import { gql } from "graphql-request";

export const TIMELINE_QUERY = gql`
  query Timeline($startYear: Int!, $endYear: Int!, $page: Int) {
    timeline(
      page: $page
      filter: { yearStart: $startYear, yearEnd: $endYear }
    ) {
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
        likes
        liked
      }
    }
  }
`;

export const POPULATION_QUERY = gql`
  query GetPopulation($start: Int!) {
    getPopulation(start: $start)
  }
`;

export const SIGNIFICANT_QUERY = gql`
  query GetSignificant($start: Int!, $end: Int!) {
    getSignificant(startYear: $start, endYear: $end) {
      id
      name
      imageUrl
    }
  }
`;

export const CIVILISATION_QUERY = gql`
  query GetCivilisation($start: Int!, $end: Int!) {
    getCivilisation(startYear: $start, endYear: $end) {
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
      }
      allCountries {
        name
        continent
      }
      allSubjects {
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
        country {
          name
          continent
        }
        subjects {
          id
          name
        }
        imageUrl
      }
      createdAt
    }
  }
`;
