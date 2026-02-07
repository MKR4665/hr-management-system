class User {
  constructor({ id, email, role, employee = null }) {
    this.id = id;
    this.email = email;
    this.role = role;
    this.employee = employee;
  }
}

module.exports = { User };