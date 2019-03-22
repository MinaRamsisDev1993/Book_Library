import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Link } from "react-router-dom";
import BookDetails from "./BookDetails";

const BOOKS_QUERY = gql`
  {
    books {
      id
      name
      genre
    }
  }
`;

class BookList extends Component {
  state = {
    book_id: ""
  };
  render() {
    return (
      <div>
        <h2>Book List</h2>
        <ul id="book-list">
          <Query query={BOOKS_QUERY}>
            {({ loading, error, data }) => {
              if (loading) return <p>Loading ...</p>;
              if (error) return <p>Error :(</p>;

              return data.books.map(book => (
                <li
                  key={book.id}
                  onClick={() => {
                    this.setState({ book_id: book.id });
                  }}
                >
                  {book.name}
                </li>
              ));
            }}
          </Query>
        </ul>
        <BookDetails book_id={this.state.book_id} />
      </div>
    );
  }
}
export default BookList;
