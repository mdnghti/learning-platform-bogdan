const Material = require('../models/Material');
const Module = require('../models/Module');

exports.createMaterial = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    const materialData = {
      ...req.body,
      module: module._id,
      course: module.course,
    };

    if (req.file) {
      materialData.fileUrl = '/uploads/' + req.file.filename;
    }

    const material = await Material.create(materialData);

    module.materials.push(material._id);
    await module.save();

    res.status(201).json({ message: 'Material created', material });
  } catch (error) {
    next(error);
  }
};

exports.getMaterialsByModule = async (req, res, next) => {
  try {
    const materials = await Material.find({ module: req.params.moduleId }).sort({
      order: 1,
    });
    res.json({ materials });
  } catch (error) {
    next(error);
  }
};

exports.getMaterialById = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    res.json({ material });
  } catch (error) {
    next(error);
  }
};

exports.updateMaterial = async (req, res, next) => {
  try {
    const material = await Material.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    res.json({ message: 'Material updated', material });
  } catch (error) {
    next(error);
  }
};

exports.deleteMaterial = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    await Module.findByIdAndUpdate(material.module, {
      $pull: { materials: material._id },
    });

    await Material.findByIdAndDelete(req.params.id);

    res.json({ message: 'Material deleted' });
  } catch (error) {
    next(error);
  }
};
