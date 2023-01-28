const { ApolloServer, gql } = require("apollo-server");
const axios = require("axios");

const typeDefs = gql`
  type Book {
    id: String
    title: String
    author: String
  }

  type breakingquotes {
    id: ID
    quote: String
    author: String
  }

  type Query {
    Getbooks: [Book]
    Getbook(id: String!): Book
    Getbreakings: [breakingquotes]
    Getbreaking(id: ID!): breakingquotes
  }
  type Mutation {
    CreateBook(id: String!, title: String!, author: String!): Book
    DeleteBook(id: String!): Book
    UpdateBook(id: String!, title: String!, author: String!): Book
    Createbreaking(quote: String!, author: String!): breakingquotes
    Deletebreaking(id: ID!): breakingquotes
    Updatebreaking(id: ID!, quote: String!, author: String!): breakingquotes
  }
`;

let breakingquotes = [];

let books = [
  {
    id: "1",
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    id: "2",
    title: "City of Glass",
    author: "Paul Auster",
  },
  {
    id: "3",
    title: "Del amor y otros demonios",
    author: "Gabriel garcia Marquez",
  },
];

const resolvers = {
  Mutation: {
    CreateBook: (_, arg) => {
      books.push(arg);
      return arg;
    },
    DeleteBook: (_, arg) => {
      let finalbooks = books.filter((book) => book.id != arg.id);
      let bookdeleted = books.find((book) => book.id == arg.id);
      books = [...finalbooks];
      return bookdeleted;
    },
    UpdateBook: (_, arg) => {
      let objIdx = books.findIndex((book) => book.id == arg.id);
      books[objIdx] = arg;
      return arg;
    },
    Createbreaking: (_, arg) => {
      arg.id = breakingquotes.length
      breakingquotes.push(arg);
      return arg;
    },
    Deletebreaking: (_, arg) => {
      let finalbreakingquotes = breakingquotes.filter((breakingquotes) => breakingquotes.id != arg.id);
      let breakingquotesdeleted = breakingquotes.find((breakingquotes) => breakingquotes.id == arg.id);
      breakingquotes = [...finalbreakingquotes];
      return breakingquotesdeleted;
    },
    Updatebreaking: (_, arg) => {
      let objIdx = breakingquotes.findIndex((breakingquotes) => breakingquotes.id == arg.id);
      breakingquotes[objIdx] = arg;
      return arg;
    },
  },
  Query: {
    Getbreakings: async () => {
      let data = await axios.get('https://api.breakingbadquotes.xyz/v1/quotes/10')
      if( breakingquotes.length < data.data.length ){
        for (let i = 0; i < data.data.length; i++) {
          data.data[i].id = i+1;
        }
        console.log(data.data[0])
        breakingquotes = [...breakingquotes, ...data.data]
        return breakingquotes
      }
      else {
        return breakingquotes
      }
    },
    Getbreaking: (_, arg) => breakingquotes.find((number) => number.id == arg.id),
    Getbooks: () => books,
    Getbook: (_, arg) => books.find((number) => number.id == arg.id),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
