const filtering = async (options, req, res, next) => {
  const {
    model,
    db,
    searchFields,
    searchQuery,
    sortOrder,
    sortBy,
    include,
    condition,
    excludeFields,
  } = options;

  const Op = db.Sequelize.Op;

  // 5. Pagination (regular pagination)
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 0; // zero means get all
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  let whereClause = {};

  // Build search query
  let customSearch = false;
  if (searchQuery) {
    customSearch = searchFields.map((field) => {
      return { [field]: { [Op.like]: `%${searchQuery}%` } };
    });
    whereClause = { [Op.or]: customSearch };
  }

  // Custom condition
  if (condition) {
    whereClause = { ...whereClause, ...condition };
  }

  // To get all records without pagination
  let paging = {
    limit: limit,
    offset: startIndex,
  };

  if (limit == 0) {
    paging = {};
  }

  // Executing query
  let sortOrderTemp = sortOrder || 'ASC';
  let sortByTemp = sortBy || 'id';

  const results = await model.findAll({
    ...paging,
    where: whereClause,
    attributes: {
      exclude: excludeFields,
    },
    order: [[sortByTemp, sortOrderTemp.toUpperCase()]],
    include: include,
    paranoid: req?.user?.role === 'ADMIN' ? false : true,
  });

  const total = await model.count({
    where: whereClause,
    include: include,
    paranoid: req?.user?.role === 'ADMIN' ? false : true,
  });

  // Final pagination
  const pagination = {};

  if (endIndex < total) {
    pagination.next = { page: page + 1, limit };
  }

  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit };
  }

  pagination.count = total;

  res.filtered = {
    pagination,
    rows: results,
  };

  next();
};

module.exports = filtering;
