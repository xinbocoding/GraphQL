const graphql = require("graphql");
const _ = require("lodash");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLSchema,
} = graphql;

//dummy data
const books = [
  { name: "Gone with the wind", genre: "Fantasy", id: "1", authorid: '1' },
  { name: "The final empire", genre: "Fantasy", id: "2", authorid: '2' },
  { name: "The black hole", genre: "Science", id: "3", authorid: '3' },
];

const authors = [
  { name: "Patrick Rothfuss", age: 44, id: "1" },
  { name: "Brandon Sanderson", age: 42, id: "2" },
  { name: "Terry Pratchett", age: 66, id: "3" },
];

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    id: { type: GraphQLID },
  }),
});

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        let foundAuthor = authors.find(author => author.id === parent.authorid);
        return foundAuthor;
      }
    }
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // code to get data from db / other source
        let findBook = books.find((book) => book.id === args.id);
        return findBook;
        // return _.find(books, {id: args.id})
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        let foundAuthor = authors.find((author) => author.id === args.id);
        return foundAuthor;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
