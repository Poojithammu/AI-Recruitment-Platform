class CollectorError extends Error {
  constructor(message, source) {
    super(message);
    this.name = 'CollectorError';
    this.source = source;
  }
}

class ParseError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ParseError';
    this.field = field;
  }
}

class RetryLimitExceededError extends Error {
  constructor(message, source) {
    super(message);
    this.name = 'RetryLimitExceededError';
    this.source = source;
  }
}

class DuplicateJobError extends Error {
  constructor(message, hash) {
    super(message);
    this.name = 'DuplicateJobError';
    this.hash = hash;
  }
}

module.exports = {
  CollectorError,
  ParseError,
  RetryLimitExceededError,
  DuplicateJobError
};
