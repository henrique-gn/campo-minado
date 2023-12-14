function apply(app) {
  app.use((req, res) => {
    res.status(404).send();
  });

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({
      message: err.message,
      action: err.action,
    });
  });
}

export default Object.freeze({
  apply,
});
