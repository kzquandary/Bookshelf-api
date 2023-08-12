const { nanoid } = require('nanoid');
const books = require('./buku');

// Kriteria 3 : API dapat menyimpan buku
// API yang Anda buat harus dapat menyimpan buku melalui route:Method : POST
// URL : /books
const simpanBuku = (req, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;

  const id = nanoid(32);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  let finished = false;

  if (name === null || name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (readPage === pageCount) {
    finished = true;
  }

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
    message: 'Gagal menambahkan buku',
  });
  response.code(500);
  return response;
};

// Kriteria 4 : API dapat menampilkan seluruh buku
// API yang Anda buat harus dapat menampilkan seluruh buku yang disimpan melalui route:
// Method : GET
// URL: /books
const tampilBuku = (req, h) => {
  const { name, reading, finished } = req.query;

  let filteredBooks = books;
  //Saran
  // Tambahkan fitur query parameters pada route GET /books (Mendapatkan seluruh buku).
  // ?name : Tampilkan seluruh buku yang mengandung nama berdasarkan nilai yang diberikan pada query ini. Contoh /books?name=”dicoding”, maka akan menampilkan daftar buku yang mengandung nama “dicoding” secara non-case sensitive  (tidak peduli besar dan kecil huruf).
  // ?reading : Bernilai 0 atau 1. Bila 0, maka tampilkan buku yang sedang tidak dibaca (reading: false). Bila 1, maka tampilkan buku yang sedang dibaca (reading: true). Selain itu, tampilkan buku baik sedang dibaca atau tidak.
  // ?finished : Bernilai 0 atau 1. Bila 0, maka tampilkan buku yang sudah belum selesai dibaca (finished: false). Bila 1, maka tampilkan buku yang sudah selesai dibaca (finished: true). Selain itu, tampilkan buku baik yang sudah selesai atau belum dibaca.
  if (name !== undefined) {
    const query = name.toLowerCase();
    filteredBooks = books.filter((book) => book.name.toLowerCase().includes(query));
  } else if (reading === '1') {
    filteredBooks = books.filter((book) => book.reading === true);
  } else if (reading === '0') {
    filteredBooks = books.filter((book) => book.reading === false);
  } else if (finished === '1') {
    filteredBooks = books.filter((book) => book.finished === true);
  } else if (finished === '0') {
    filteredBooks = books.filter((book) => book.finished === false);
  }

  const response = h.response({
    status: 'success',
    data: {
      books: filteredBooks.map(({ id, name, publisher }) => ({ id, name, publisher })),
    },
  });

  response.code(200);
  return response;
};
// Kriteria 5 : API dapat menampilkan detail buku
// API yang Anda buat harus dapat menampilkan seluruh buku yang disimpan melalui route:
// Method : GET
// URL: /books/{bookId}
const detailBuku = (req, h) => {
  const { bookId } = req.params;

  const book = books.filter((b) => b.id === bookId)[0];

  if (book === null || book === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
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
// Kriteria 6 : API dapat mengubah data buku
// API yang Anda buat harus dapat mengubah data buku berdasarkan id melalui route:
//
// Method : PUT
// URL : /books/{bookId}
const updateBuku = (req, h) => {
  const { bookId } = req.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;

  if (name === null || name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  };

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

// Kriteria 7 : API dapat menghapus buku
// API yang Anda buat harus dapat menghapus buku berdasarkan id melalui route berikut:
//
// Method : DELETE
// URL: /books/{bookId}
const hapusBuku = (req, h) => {
  const { bookId } = req.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  books.splice(index, 1);

  return h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
};

module.exports = {
  saveBook: simpanBuku,
  getAllBooks: tampilBuku,
  getDetailBooks: detailBuku,
  editBook: updateBuku,
  deleteBook: hapusBuku,
};