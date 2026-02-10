const { MasterRepositoryPrisma } = require('../../../data/repositories/MasterRepositoryPrisma');
const { saveBase64File } = require('../../../shared/helpers/fileStorage');

const masterRepo = new MasterRepositoryPrisma();

const getCompanyConfig = async () => {
  return masterRepo.getCompanyConfig();
};

const updateLogo = async (base64Data) => {
  const logoPath = saveBase64File(base64Data, 'company');
  return masterRepo.updateCompanyConfig({ logoPath });
};

const deleteLogo = async () => {
  return masterRepo.clearLogo();
};

const createCountry = async (data) => {
  return masterRepo.createCountry(data);
};

const getAllCountries = async () => {
  return masterRepo.getAllCountries();
};

const deleteCountry = async (id) => {
  return masterRepo.deleteCountry(id);
};

const createState = async (data) => {
  return masterRepo.createState(data);
};

const getStatesByCountry = async (countryId) => {
  return masterRepo.getStatesByCountry(countryId);
};

const deleteState = async (id) => {
  return masterRepo.deleteState(id);
};

const createCity = async (data) => {
  return masterRepo.createCity(data);
};

const getCitiesByState = async (stateId) => {
  return masterRepo.getCitiesByState(stateId);
};

const deleteCity = async (id) => {
  return masterRepo.deleteCity(id);
};

module.exports = {
  getCompanyConfig,
  updateLogo,
  deleteLogo,
  createCountry,
  getAllCountries,
  deleteCountry,
  createState,
  getStatesByCountry,
  deleteState,
  createCity,
  getCitiesByState,
  deleteCity
};
