import axios from 'axios';

const PackageService = {
  getAllPackages: () => axios.get('/api/package/packages'),
  addPackage: (model) => axios.post('/api/package/add-package', model),
  getPackageById: (id) => axios.get(`/api/package/package/${id}`),
  updatePackage: (id, packageData) => axios.put(`/api/package/package/${id}`, packageData),
};

export default PackageService;