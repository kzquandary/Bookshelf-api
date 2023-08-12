/*
routes.js disini berfungsi untuk melakukan assign route untuk setiap URL dan Method
disini route membutuhkan 3 variable untuk dijalankan, yaitu method, path/tujuan url dan nama function di controller
Route akan di export ke server.js untuk dimasukan kedalam server agar misa melakukan handle pada setiap path
*/
const {
    saveBook,
    getAllBooks,
    getDetailBooks,
    editBook,
    deleteBook,
  } = require('./controller');
  
  const routes = [
    {
      method: 'POST',
      path: '/books',
      handler: saveBook,
    },
    {
      method: 'GET',
      path: '/books',
      handler: getAllBooks,
    },
    {
      method: 'GET',
      path: '/books/{bookId}',
      handler: getDetailBooks,
    },
    {
      method: 'PUT',
      path: '/books/{bookId}',
      handler: editBook,
    },
    {
      method: 'DELETE',
      path: '/books/{bookId}',
      handler: deleteBook,
    },
  ];
  
  module.exports = routes;