import { Query } from 'mongoose';

interface QueryString {
  page?: string;
  sort?: string;
  limit?: string;
  fields?: string;
  [key: string]: any;
}

class APIFeatures {
  public query: Query<any, any>;
  public queryString: QueryString;

  constructor(query: Query<any, any>, queryString: QueryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter(): APIFeatures {
    const queryParams = { ...this.queryString };
    const excludeQuery = ['page', 'sort', 'limit', 'fields'];
    excludeQuery.forEach((el) => delete queryParams[el]);

    let queryStr = JSON.stringify(queryParams);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort(): APIFeatures {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split('+').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields(): APIFeatures {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split('+').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate(): APIFeatures {
    const page = parseInt(this.queryString.page || '1');
    const limit = parseInt(this.queryString.limit || '100');
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures; 