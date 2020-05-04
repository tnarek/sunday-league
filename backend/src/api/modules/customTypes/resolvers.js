import { GraphQLScalarType } from 'graphql';
import moment from 'moment';
import validator from 'validator';

export const DateTimeResolver = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom type',
  parseValue(value) {
    if (!validator.isISO8601(value)) {
      throw new Error('Invalid date format');
    }
    return moment(value);
  },
  serialize(momentValue) {
    return momentValue.format();
  },
});

export const EmailResolver = new GraphQLScalarType({
  name: 'Email',
  description: 'Email custom type',
  parseValue(value) {
    if (!validator.isEmail(value)) {
      throw new Error('Invalid email format');
    }
    return value;
  },
  serialize(value) {
    return value;
  },
});