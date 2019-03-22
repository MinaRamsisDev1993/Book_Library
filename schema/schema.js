const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull
} = require("graphql");

const Book = require("../models/Book"); //This is the model
const Author = require("../models/Author"); //This is the model

// const books = [
//   { id: "1", name: "Last Day", genre: "Science Fiction", authorID: "1" },
//   { id: "2", name: "City of two tales", genre: "Drama", authorID: "2" },
//   { id: "3", name: "Animal Farm", genre: "Action", authorID: "3" },
//   { id: "4", name: "Forrest Gump", genre: "Drama", authorID: "2" },
//   { id: "5", name: "Cast Away", genre: "Drama", authorID: "3" },
//   { id: "6", name: "Expendables", genre: "Action", authorID: "1" }
// ];
// const authors = [
//   { id: "1", name: "John Doe", age: 33 },
//   { id: "2", name: "Mina Ramsis", age: 31 },
//   { id: "3", name: "Mary Williams", age: 22 }
// ];

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      // parent param is the whole book found
      resolve(parent, args) {
        // in the db there is authorID field
        return Author.findById(parent.authorID);

        // for (let i = 0; i < authors.length; i++) {
        //   if (parent.authorID == authors[i].id) {
        //     return authors[i];
        //   }
        // }
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // I THINK
        return Book.find({ authorID: parent.id });

        // let foundBooks = books.filter(book => {
        //   if (book.authorID == parent.id) {
        //     return book;
        //   }
        // });
        // return foundBooks;
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  // fields doesn't have to be a func as there is no worry about releations between types
  fields: {
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({});
        // return books;
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return Author.find({});
        // return authors;
      }
    },
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Book.findById(args.id);

        // for (let i = 0; i < books.length; i++) {
        //   if (books[i].id == args.id) {
        //     return books[i];
        //   }
        // }
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Author.findById(args.id);
        // for (let i = 0; i < authors.length; i++) {
        //   if (authors[i].id == args.id) {
        //     return authors[i];
        //   }
        // }
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addBook: {
      type: BookType,
      args: {
        // ALL OF THESE 3 ARE REQUIRED
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorID: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        const newBook = {
          name: args.name,
          genre: args.genre,
          authorID: args.authorID
        };
        const book = new Book(newBook);
        return book.save();
      }
    },
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        const newAuthor = {
          name: args.name,
          age: args.age
        };
        const author = new Author(newAuthor);
        return author.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
