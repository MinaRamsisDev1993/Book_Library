import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const BOOK_QUERY = gql`
  query($id: ID) {
    book(id: $id) {
      name
      genre
      author {
        name
        age
        books {
          id
          name
        }
      }
    }
  }
`;
class BookDetails extends Component {
  state = {
    id: ""
  };
  static getDerivedStateFromProps(nextProps) {
    if (nextProps.book_id) {
      return {
        id: nextProps.book_id
      };
    } else {
      return {
        id: ""
      };
    }
  }
  render() {
    const { id } = this.state;
    return (
      <div id="book-details">
        <h2>Book Details</h2>
        {id !== "" ? (
          <Query query={BOOK_QUERY} variables={{ id }}>
            {({ loading, error, data }) => {
              if (loading) return null;
              if (error) return `Error!: ${error}`;

              const { book } = data;
              return (
                <div>
                  <h2>{book.name}</h2>
                  <p>{book.genre}</p>
                  <p>{book.author.name}</p>
                  <p>All books by this author</p>
                  <ul className="other-books">
                    {book.author.books.map(book => (
                      <li key={book.id}>{book.name}</li>
                    ))}
                  </ul>
                </div>
              );
            }}
          </Query>
        ) : null}
      </div>
    );
  }
}
export default BookDetails;
