const { EmployeeRepositoryPrisma } = require('../../../data/repositories/EmployeeRepositoryPrisma');
const { UserRepositoryPrisma } = require('../../../data/repositories/UserRepositoryPrisma');
const documentUsecases = require('../documents/documentUsecases');
const { saveBase64File } = require('../../../shared/helpers/fileStorage');
const { hashPassword } = require('../../../shared/helpers/hash');

const employeeRepo = new EmployeeRepositoryPrisma();
const userRepo = new UserRepositoryPrisma();

const getAllEmployees = async () => {
  return employeeRepo.findAll();
};

const getEmployeeById = async (id) => {
  const employee = await employeeRepo.findById(id);
  if (!employee) {
    const err = new Error('Employee not found');
    err.status = 404;
    throw err;
  }
  return employee;
};

const createEmployee = async (data) => {
  const existing = await employeeRepo.findByEmail(data.email);
  if (existing) {
    const err = new Error('Employee with this email already exists');
    err.status = 409;
    throw err;
  }

  // Handle Files
  const uploads = {};
  if (data.profilePicture) uploads.profilePicturePath = saveBase64File(data.profilePicture, 'profiles');
  if (data.experienceCert) uploads.experienceCertPath = saveBase64File(data.experienceCert, 'certificates');
  if (data.idProof) uploads.idProofPath = saveBase64File(data.idProof, 'ids');
  if (data.educationCert) uploads.educationCertPath = saveBase64File(data.educationCert, 'education');

  const finalData = { ...data, ...uploads };

  // Clean up raw data before saving to DB
  delete finalData.profilePicture;
  delete finalData.experienceCert;
  delete finalData.idProof;
  delete finalData.educationCert;

  // Handle User Credentials if provided
  let userId = null;
  if (finalData.password) {
    const user = await userRepo.create({
      email: finalData.email,
      passwordHash: await hashPassword(finalData.password),
      role: 'EMPLOYEE'
    });
    userId = user.id;
    delete finalData.password;
  }
  
  const employee = await employeeRepo.create({ ...finalData, userId });

  // Create Document Records for Uploads
  if (uploads.idProofPath) await documentUsecases.createDocumentRecord(employee.id, 'ID_PROOF', uploads.idProofPath);
  if (uploads.educationCertPath) await documentUsecases.createDocumentRecord(employee.id, 'EDUCATION_CERT', uploads.educationCertPath);
  if (uploads.experienceCertPath) await documentUsecases.createDocumentRecord(employee.id, 'EXPERIENCE_CERT', uploads.experienceCertPath);

  // Auto-generate Offer Letter
  try {
    await documentUsecases.generateMultipleDocuments({
      employeeId: employee.id,
      types: ['OFFER_LETTER']
    });
  } catch (error) {
    console.error('Failed to auto-generate documents:', error);
  }

  return employee;
};

const updateEmployee = async (id, data) => {
  const employee = await getEmployeeById(id);

  // Handle Files
  const uploads = {};
  if (data.profilePicture) uploads.profilePicturePath = saveBase64File(data.profilePicture, 'profiles');
  if (data.experienceCert) uploads.experienceCertPath = saveBase64File(data.experienceCert, 'certificates');
  if (data.idProof) uploads.idProofPath = saveBase64File(data.idProof, 'ids');
  if (data.educationCert) uploads.educationCertPath = saveBase64File(data.educationCert, 'education');

  const finalData = { ...data, ...uploads };

  delete finalData.profilePicture;
  delete finalData.experienceCert;
  delete finalData.idProof;
  delete finalData.educationCert;

  // Handle User Update if password provided
  if (finalData.password && employee.userId) {
    await userRepo.update(employee.userId, {
      passwordHash: await hashPassword(finalData.password)
    });
    delete finalData.password;
  } else if (finalData.password && !employee.userId) {
    const user = await userRepo.create({
      email: finalData.email || employee.email,
      passwordHash: await hashPassword(finalData.password),
      role: 'EMPLOYEE'
    });
    finalData.userId = user.id;
    delete finalData.password;
  }

  const updatedEmployee = await employeeRepo.update(id, finalData);

  // Update Document Records for new Uploads
  if (uploads.idProofPath) await documentUsecases.createDocumentRecord(id, 'ID_PROOF', uploads.idProofPath);
  if (uploads.educationCertPath) await documentUsecases.createDocumentRecord(id, 'EDUCATION_CERT', uploads.educationCertPath);
  if (uploads.experienceCertPath) await documentUsecases.createDocumentRecord(id, 'EXPERIENCE_CERT', uploads.experienceCertPath);

  return updatedEmployee;
};

const deleteEmployee = async (id) => {
  await getEmployeeById(id);
  return employeeRepo.delete(id);
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
