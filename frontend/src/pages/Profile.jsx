// src/pages/Profile.jsx
import { useEffect, useState } from 'react';
import api from '../api/api';
import { downloadBlobResponse } from '../utils/download';

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/user/profile');
      setProfile(data);
    })();
  }, []);

  const exportExcel = async () => {
    await downloadBlobResponse(api.get('/user/export', { responseType: 'blob' }), 'export.xlsx');
  };

  const backupZip = async () => {
    await downloadBlobResponse(api.get('/user/backup', { responseType: 'blob' }), 'backup.zip');
  };

  if (!profile) return <div className="text-gray-600">Loading...</div>;

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
        <div><span className="text-gray-500">Name:</span> <span className="font-medium">{profile.name}</span></div>
        <div><span className="text-gray-500">Email:</span> <span className="font-medium">{profile.email}</span></div>
        <div><span className="text-gray-500">Role:</span> <span className="badge">{profile.role}</span></div>
      </div>
      <div className="mt-6 flex gap-3">
        <button className="btn" onClick={exportExcel}>Export to Excel</button>
        <button className="btn btn-secondary" onClick={backupZip}>Backup Zip</button>
      </div>
    </div>
  );
}