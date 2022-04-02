# Sequelize Filtering

Sequelize filtering, pagination, sort, and search middleware for Express Server on NodeJS.

## Installation

```
npm install nes-filter --save
```

## Features

- Search on specific fields
- Sort by your specified fields in ascending or descending
- Filtering (e.g. filter users by role)
- Pagination

## Options

Possible options for the filtering.

| Option       | Value                                         |
| ------------ | --------------------------------------------- |
| model        | Your model name                               |
| db           | `db` object of sequelize                      |
| searchFields | Array of database fields to search on         |
| searchQuery  | Keyword to search                             |
| sortBy       | Field to sort on                              |
| sortOrder    | asc \| desc                                   |
| include      | Array of other models to execute a join query |
| condition    | Condition to fetch specific rows              |

## Example

```
// Configuration options
const options = {
    model: UserModel,
    db: dbObject,
    searchFields: ['firstName', 'lastName', 'email'],
    searchQuery: 'john',
    sortBy: 'firstName',
    sortOrder: 'asc',
    include: [
        {
            model: Media,
            as: 'media', // for profile picture
        }
    ],
    condition: {
      id: {
        [Op.ne]: 1, // exclude user with id 1
      },
    },
  }
}

// Call the filter function, it will embded the data in response object
await filtering(options, req, res, next)

// Send the response
response.status(200).json({
    success: true,
    message: 'All users fetched successfully.',
    data: response.filtered,
})
```

## License

MIT
