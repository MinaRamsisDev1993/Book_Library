import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

const AUTHORS_QUERY = gql`
  {
    authors {
      name
      id
    }
  }
`;

// mutation{addBook(name: "Some Book Name", genre: "Drama", authorID: "34hg3j232j3h4"){
// name
// genre
// }}
const ADD_BOOK_MUTATION = gql`
  mutation($name: String!, $genre: String!, $authorID: ID!) {
    addBook(name: $name, genre: $genre, authorID: $authorID) {
      name
      genre
    }
  }
`;

class AddBook extends Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
  }
  state = {
    bookName: "",
    bookGenre: ""
  };
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { bookName, bookGenre } = this.state;
    return (
      <Mutation mutation={ADD_BOOK_MUTATION}>
        {addBook => (
          <div>
            <form
              id="add-book"
              onSubmit={e => {
                e.preventDefault();
                addBook({
                  variables: {
                    name: this.state.bookName,
                    genre: this.state.bookGenre,
                    authorID: this.inputRef.current.value
                  }
                });
                this.setState({ bookName: "", bookGenre: "" }, () => {
                  window.location.reload();
                });
              }}
            >
              <div className="field">
                <label htmlFor="bookName">Book Name</label>
                <input
                  type="text"
                  id="bookName"
                  name="bookName"
                  value={bookName}
                  onChange={this.onChange}
                />
              </div>
              <br />
              <div className="field">
                <label htmlFor="bookGenre">Book Genre</label>
                <input
                  type="text"
                  id="bookGenre"
                  name="bookGenre"
                  value={bookGenre}
                  onChange={this.onChange}
                />
              </div>
              <br />

              <Query query={AUTHORS_QUERY}>
                {({ loading, error, data }) => {
                  if (loading) return <p>Loading ...</p>;
                  if (error) return <p>Error :(</p>;

                  return (
                    <div className="field">
                      <label>Author</label>
                      <select ref={this.inputRef}>
                        {data.authors.map(author => (
                          <option key={author.id} value={author.id}>
                            {author.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }}
              </Query>
              <button>Add Book</button>
            </form>
          </div>
        )}
      </Mutation>
    );
  }
}
export default AddBook;
