// src/app/dosen/home/page.js
const DosenHomePage = () => {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
          <div className="max-w-7xl mx-auto text-white">
            <h1 className="text-3xl font-bold">LeADS: Dashboard</h1>
          </div>
        </div>
  
        <div className="p-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold">Messages</h2>
              <p>Communicate</p>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold">Profile</h2>
              <p>Your Profile</p>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold">Settings</h2>
              <p>Preferences</p>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold">Grades</h2>
              <p>Performance</p>
            </div>
          </div>
  
          <div className="mt-8">
            <h2 className="text-2xl font-bold">Recently accessed courses</h2>
            <div className="mt-4 bg-white p-6 rounded shadow">
              <h3 className="text-lg font-semibold">2024 Ganjil | Analisis dan Desain Perangkat Lunak</h3>
              <p className="text-sm">Mata Kuliah Analisis dan Desain Perangkat Lunak Kurikulum 511.2024</p>
              <div className="mt-2 bg-gray-200 h-2 rounded-full">
                <div className="bg-green-500 h-full rounded-full" style={{ width: '21%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default DosenHomePage;
  