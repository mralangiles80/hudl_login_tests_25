class Actor {
  constructor(name, page) {
    this.name = name;
    this.page = page;
  }

  async attemptsTo(...tasks) {
    for (const task of tasks) {
      if (task && typeof task.performAs === 'function') {
        await task.performAs(this);
      }
    }
  }

  async asks(question) {
    return question.answeredBy(this);
  }
}

module.exports = { Actor };