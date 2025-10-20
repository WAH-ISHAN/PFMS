import { useEffect, useState } from 'react';
import api from '../api/api';
import { downloadBlobResponse } from '../utils/download';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [downloadingExcel, setDownloadingExcel] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setErr('');
        const { data } = await api.get('/user/profile');
        setProfile(data);
      } catch {
        setErr('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const exportExcel = async () => {
    try {
      setDownloadingExcel(true);
      await downloadBlobResponse(
        api.get('/user/export', { responseType: 'blob' }),
        'export.xlsx'
      );
    } catch {
      setErr('Failed to export data');
    } finally {
      setDownloadingExcel(false);
    }
  };

  const backupZip = async () => {
    try {
      setDownloadingZip(true);
      await downloadBlobResponse(
        api.get('/user/backup', { responseType: 'blob' }),
        'backup.zip'
      );
    } catch {
      setErr('Failed to download backup');
    } finally {
      setDownloadingZip(false);
    }
  };

  const initial =
    (profile?.name || profile?.email || '?').charAt(0)?.toUpperCase() || '?';

  return (
    <div className="px-4 md:px-6">
      <div className="rounded-2xl border border-gray-200/60 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 backdrop-blur shadow-xl p-6 max-w-3xl mx-auto">
        {loading ? (
          <div className="animate-pulse">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="mt-6 h-10 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-indigo-600/10 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-200 dark:ring-indigo-700 flex items-center justify-center font-semibold">
                  {initial}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {profile?.name || '—'}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {profile?.email || '—'}
                  </p>
                </div>
              </div>
              {profile?.role && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">
                  {profile.role}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <span className="text-gray-500">Name:</span>{' '}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {profile?.name || '—'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Email:</span>{' '}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {profile?.email || '—'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Role:</span>{' '}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {profile?.role || '—'}
                </span>
              </div>
            </div>

            {err && (
              <div
                className="mt-4 rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm"
                role="alert"
                aria-live="polite"
              >
                {err}
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 text-white font-medium py-2.5 px-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition"
                onClick={exportExcel}
                disabled={downloadingExcel}
              >
                {downloadingExcel ? (
                  <>
                    <svg className="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Exporting...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v12m0 0l-3.5-3.5M12 15l3.5-3.5M4.5 21h15" />
                    </svg>
                    Export to Excel
                  </>
                )}
              </button>

              <button
                className="inline-flex items-center justify-center rounded-lg bg-gray-800 text-white font-medium py-2.5 px-4 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                onClick={backupZip}
                disabled={downloadingZip}
              >
                {downloadingZip ? (
                  <>
                    <svg className="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Preparing...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 7.5h16.5v9.75A2.25 2.25 0 0118 19.5H6a2.25 2.25 0 01-2.25-2.25V7.5zM7.5 7.5v-1.5a4.5 4.5 0 019 0V7.5" />
                    </svg>
                    Backup ZIP
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}