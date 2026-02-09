const documentUsecases = require('../../domain/usecases/documents/documentUsecases');

const generateAndDownload = async (req, res, next) => {
  try {
    const { employeeId, type, month, year } = req.body;
    const { html } = await documentUsecases.generateDocument(employeeId, type, { month, year });
    const pdfBuffer = await documentUsecases.getPdfBuffer(html);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${type.replace(/\s+/g, '_')}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
};

const sendBulkEmail = async (req, res, next) => {
  try {
    const { employeeId, types, subject, message, month, year } = req.body;
    const result = await documentUsecases.sendMultipleDocuments({
      employeeId,
      types,
      subject,
      message,
      month,
      year
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const bulkGenerate = async (req, res, next) => {
  try {
    const { employeeId, types, month, year } = req.body;
    const result = await documentUsecases.generateMultipleDocuments({ employeeId, types, month, year });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getByEmployee = async (req, res, next) => {
  try {
    const docs = await documentUsecases.getEmployeeDocuments(req.params.employeeId);
    res.json(docs);
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    const result = await documentUsecases.updateDocumentStatus(id, status, reason);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getMonthlyStatus = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const result = await documentUsecases.getMonthlyStatus(month, year);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  generateAndDownload,
  sendBulkEmail,
  bulkGenerate,
  getByEmployee,
  updateStatus,
  getMonthlyStatus
};