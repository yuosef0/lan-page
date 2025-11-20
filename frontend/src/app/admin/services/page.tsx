'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { servicesAPI } from '@/lib/api';
import { toast } from 'react-toastify';

export default function AdminServicesPage() {
  const [servicesPage, setServicesPage] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pageRes, servicesRes] = await Promise.all([
        servicesAPI.getServicesPage(),
        servicesAPI.getAllServices(),
      ]);
      setServicesPage(pageRes.data);
      setServices(servicesRes.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to fetch services data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      await servicesAPI.deleteService(id);
      toast.success('Service deleted successfully!');
      await fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete service');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await servicesAPI.updateService(id, { isActive: !currentStatus });
      toast.success(`Service ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      await fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update service');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Hero Section Info */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Services Page Hero</h2>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Title:
              </span>
              <p className="text-lg">{servicesPage?.hero?.title}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Subtitle:
              </span>
              <p>{servicesPage?.hero?.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Services List */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">All Services</h2>
            <p className="text-sm text-gray-500">
              Total: {services.length} services
            </p>
          </div>

          <div className="space-y-4">
            {services
              .sort((a, b) => a.order - b.order)
              .map((service) => (
                <div
                  key={service._id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-6">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-48 h-32 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{service.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <span>Order: {service.order}</span>
                            <span>•</span>
                            <span>Position: {service.imagePosition}</span>
                            <span>•</span>
                            <span className={service.isActive ? 'text-green-600' : 'text-red-600'}>
                              {service.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        {service.description}
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleToggleActive(service._id, service.isActive)}
                          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                            service.isActive
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {service.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteService(service._id)}
                          className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {services.length === 0 && (
            <p className="text-center text-gray-500 py-8">No services available</p>
          )}
        </div>

        {/* Note */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Note:</strong> To add or fully edit services, use the API endpoints directly or
            expand this admin panel with forms. Check the README for API documentation.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
