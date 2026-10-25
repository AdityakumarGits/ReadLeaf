export const getMyBooks = (req, res) => {
  const author = req.user.authorId;
  if (!author) return res.json({ books: [] });
  res.json({ books: author.books || [] });
};
