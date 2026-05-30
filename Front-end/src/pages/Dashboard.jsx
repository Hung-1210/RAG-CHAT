import React from 'react';
import { FolderOpen, MessageSquare, FileSignature, AlertTriangle, TrendingUp, Users, FileText } from 'lucide-react';

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const stats = [
    {
      title: 'Tổng tài liệu',
      value: '1,234',
      change: '+12%',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Chat RAG',
      value: '456',
      change: '+8%',
      icon: MessageSquare,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Ký số',
      value: '89',
      change: '+23%',
      icon: FileSignature,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Cảnh báo',
      value: '3',
      change: '-5%',
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const recentActivities = [
    { action: 'Upload tài liệu', file: 'Report_Q4.pdf', time: '5 phút trước' },
    { action: 'Chat RAG', file: 'Contract_2024.docx', time: '15 phút trước' },
    { action: 'Ký số', file: 'Invoice_001.pdf', time: '1 giờ trước' },
    { action: 'Xem tài liệu', file: 'Presentation.pptx', time: '2 giờ trước' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">
          Xin chào, {user.full_name}! 👋
        </h1>
        <p className="text-blue-100">
          {user.role === 'admin' 
            ? 'Chào mừng quản trị viên đến với hệ thống quản lý tài liệu'
            : 'Chào mừng bạn quay trở lại. Hãy bắt đầu công việc hôm nay!'}
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Hệ thống hoạt động tốt</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span>24 người đang online</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} size={24} />
                </div>
                <span className={`text-sm font-medium ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Hoạt động gần đây</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{activity.action}</p>
                  <p className="text-sm text-gray-500 truncate">{activity.file}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Thao tác nhanh</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group">
              <FolderOpen className="text-gray-400 group-hover:text-blue-500 mb-2" size={32} />
              <p className="font-medium text-gray-700 group-hover:text-blue-600">Upload File</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition group">
              <MessageSquare className="text-gray-400 group-hover:text-purple-500 mb-2" size={32} />
              <p className="font-medium text-gray-700 group-hover:text-purple-600">RAG Chat</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition group">
              <FileSignature className="text-gray-400 group-hover:text-green-500 mb-2" size={32} />
              <p className="font-medium text-gray-700 group-hover:text-green-600">Ký số</p>
            </button>
            {user.role === 'admin' && (
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition group">
                <AlertTriangle className="text-gray-400 group-hover:text-red-500 mb-2" size={32} />
                <p className="font-medium text-gray-700 group-hover:text-red-600">Rủi ro</p>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Trạng thái hệ thống</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium text-green-900">Database</span>
            </div>
            <p className="text-sm text-green-700">Hoạt động bình thường</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium text-green-900">API Server</span>
            </div>
            <p className="text-sm text-green-700">Hoạt động bình thường</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium text-green-900">Storage</span>
            </div>
            <p className="text-sm text-green-700">75% còn trống</p>
          </div>
        </div>
      </div>
    </div>
  );
}