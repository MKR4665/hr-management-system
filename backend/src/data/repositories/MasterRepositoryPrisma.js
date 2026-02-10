const { prisma } = require('../models/prismaClient');

class MasterRepositoryPrisma {
  // Company Config
  async getCompanyConfig() {
    return prisma.companyConfig.findFirst();
  }

  async updateCompanyConfig(data) {
    const existing = await this.getCompanyConfig();
    if (existing) {
      return prisma.companyConfig.update({
        where: { id: existing.id },
        data
      });
    }
    return prisma.companyConfig.create({ data });
  }

  async clearLogo() {
    const existing = await this.getCompanyConfig();
    if (existing) {
      return prisma.companyConfig.update({
        where: { id: existing.id },
        data: { logoPath: null }
      });
    }
    return null;
  }

  // Country
  async createCountry(data) {
    return prisma.country.create({ data });
  }

  async getAllCountries() {
    return prisma.country.findMany({
      include: { _count: { select: { states: true } } },
      orderBy: { name: 'asc' }
    });
  }

  async deleteCountry(id) {
    return prisma.country.delete({ where: { id } });
  }

  // State
  async createState(data) {
    return prisma.state.create({ data });
  }

  async getStatesByCountry(countryId) {
    return prisma.state.findMany({
      where: { countryId },
      include: { _count: { select: { cities: true } } },
      orderBy: { name: 'asc' }
    });
  }

  async deleteState(id) {
    return prisma.state.delete({ where: { id } });
  }

  // City
  async createCity(data) {
    return prisma.city.create({ data });
  }

  async getCitiesByState(stateId) {
    return prisma.city.findMany({
      where: { stateId },
      orderBy: { name: 'asc' }
    });
  }

  async deleteCity(id) {
    return prisma.city.delete({ where: { id } });
  }
}

module.exports = { MasterRepositoryPrisma };
