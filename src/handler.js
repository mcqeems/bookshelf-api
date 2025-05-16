const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku, mohon isi nama buku.',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku, readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan Gagal Ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const queryParams = request.query;

  let filteredBooks = books;

  if (queryParams.name) {
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase() === queryParams.name.toLowerCase());
  }

  if (queryParams.finished !== undefined) {
    const finishedStatus = queryParams.finished === '1' ? true : false;
    filteredBooks = filteredBooks.filter((book) => book.finished === finishedStatus);
  }

  if (queryParams.reading !== undefined) {
    const finishedStatus = queryParams.reading === '1' ? true : false;
    filteredBooks = filteredBooks.filter((book) => book.reading === finishedStatus);
  }

  const summarizedBooks = filteredBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  const response = h.response({
    status: 'success',
    data: {
      books: summarizedBooks,
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.find((book) => book.id === bookId);

  if (!book) {
    const response = h.response({
      status: 'fail',
      message: 'buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      book,
    },
  });
  response.code(200);
  return response;
};

const editBookByIdHandler = () => {};

const deleteBookByIdHandler = () => {};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
