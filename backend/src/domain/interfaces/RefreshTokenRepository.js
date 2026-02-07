class RefreshTokenRepository {
  async create() { throw new Error('Not implemented'); }
  async revokeByTokenHash() { throw new Error('Not implemented'); }
  async findValidByTokenHash() { throw new Error('Not implemented'); }
}

module.exports = { RefreshTokenRepository };
