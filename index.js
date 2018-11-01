const { ApolloServer, gql } = require('apollo-server');

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.

// Based on https://www.apollographql.com/docs/apollo-server/essentials/data.html

const projects = [
  {
    projectId: 'abc',
  },
  {
    projectId: 'xyz',
  },
  {
    projectId: 'xxx',
  },
]

const workflows = [
  {
    id: 'w1',
    projectId: 'abc',
    triggerTypes: ['enter', 'exit'],
    actions: [{ name: 'do x' }],
  },
  {
    id: 'w2',
    projectId: 'xyz',
  },
]

const names = [
  {
    projectId: 'abc',
    name: 'i know my abcs',
  },
  {
    projectId: 'xyz',
    name: 'i know my xyzs',
  },
  {
    projectId: 'xxx',
    name: 'i know nothing jon snow',
  },
]

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.
  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    projects: [Project]
    workflow(id: String): Workflow
  }
  
  type Project {
    id: String
    name: String
    workflows: [Workflow]
  }
  
  type Workflow {
    projectId: String
    triggerTypes: [String]
    actions: [Action]
  }
  
  type Action {
    name: String
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    projects: () => projects.map(project => {
      const projectId = project.projectId
      return {
        id: projectId,
        name: () => {
          const result = names.find(name => {
            return name.projectId === projectId
          })
          return result.name
        },
        workflows: () => workflows.filter(workflow => workflow.projectId === projectId),
      }
    }),
    workflow: (parent, { id }) => {
      return workflows.find(workflow => workflow.id === id)
    },
  },

  Workflow: {
    projectId(workflow) {
      return workflow.projectId
    },
    triggerTypes(workflow) {
      return workflow.triggerTypes
    },
    actions(workflow) {
      return workflow.actions
    },
  },
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
