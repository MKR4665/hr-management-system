const masterUsecases = require('../../domain/usecases/master/masterUsecases');

const getCompanyConfig = async (req, res, next) => {
  try {
    const config = await masterUsecases.getCompanyConfig();
    res.json(config);
  } catch (err) {
    next(err);
  }
};

const updateLogo = async (req, res, next) => {
  try {
    const { logo } = req.body;
    if (!logo) return res.status(400).json({ error: 'Logo data is required' });
    const config = await masterUsecases.updateLogo(logo);
    res.json(config);
  } catch (err) {
    next(err);
  }
};

const deleteLogo = async (req, res, next) => {
  try {
    await masterUsecases.deleteLogo();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

const createCountry = async (req, res, next) => {
  try {
    const country = await masterUsecases.createCountry(req.body);
    res.status(201).json(country);
  } catch (err) {
    next(err);
  }
};

const getAllCountries = async (req, res, next) => {
  try {
    const countries = await masterUsecases.getAllCountries();
    res.json(countries);
  } catch (err) {
    next(err);
  }
};

const deleteCountry = async (req, res, next) => {
  try {
    await masterUsecases.deleteCountry(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

const createState = async (req, res, next) => {
  try {
    const state = await masterUsecases.createState(req.body);
    res.status(201).json(state);
  } catch (err) {
    next(err);
  }
};

const getStatesByCountry = async (req, res, next) => {
  try {
    const states = await masterUsecases.getStatesByCountry(req.params.countryId);
    res.json(states);
  } catch (err) {
    next(err);
  }
};

const deleteState = async (req, res, next) => {
  try {
    await masterUsecases.deleteState(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

const createCity = async (req, res, next) => {
  try {
    const city = await masterUsecases.createCity(req.body);
    res.status(201).json(city);
  } catch (err) {
    next(err);
  }
};

const getCitiesByState = async (req, res, next) => {
  try {
    const cities = await masterUsecases.getCitiesByState(req.params.stateId);
    res.json(cities);
  } catch (err) {
    next(err);
  }
};

const deleteCity = async (req, res, next) => {
  try {
    await masterUsecases.deleteCity(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
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
