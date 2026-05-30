import React, { useState, useEffect } from 'react';
import { Users, FileText, MessageSquare, ChevronRight, Eye } from 'lucide-react';
import apiClient from '../services/apiClient';

export default function AdminRAGDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('users'); // 'users', 'documents', 'chats'

  useEffect(() => {
    loadUsersStats();
  }, []);

  const loadUsersStats = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getUsersWithStats();
      setUsers(response.users || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    setView('documents');
    
    try {
      const response = await apiClient.getDocumentsByUser(user.user_id);
      setDocuments(response.documents || []);
    } catch (error) {
      console.error('Failed to load user documents:', error);
    }
  };

  const handleViewChats = async (user) => {
    setSelectedUser(user);
    setView('chats');
    
    try {
      const response = await apiClient.getChatHistoryByUser(user.user_id);
      setChats(response.chats || []);
    } catch (error) {
      console.error('Failed to load user chats:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">RAG Chat - Admin Dashboard</h1>
        <p className="text-purple-100">Quản lý tài liệu và lịch sử chat của người dùng</p>
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={() => { setView('users'); setSelectedUser(null); }}
          className={`px-6 py-3 rounded-lg font-medium transition ${
            view === 'users'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Users size={20} className="inline mr-2" />
          Người dùng
        </button>
        {selectedUser && (
          <>
            <button
              onClick={() => setView('documents')}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                view === 'documents'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FileText size={20} className="inline mr-2" />
              Tài liệu ({documents.length})
            </button>
            <button
              onClick={() => handleViewChats(selectedUser)}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                view === 'chats'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <MessageSquare size={20} className="inline mr-2" />
              Lịch sử Chat
            </button>
          </>
        )}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm">
        {view === 'users' && (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Danh sách người dùng</h2>
            {loading ? (
              <p className="text-gray-500">Đang tải...</p>
            ) : users.length === 0 ? (
              <p className="text-gray-500">Chưa có người dùng nào</p>
            ) : (
              <div className="grid gap-4">
                {users.map(user => (
                  <div
                    key={user.user_id}
                    className="border rounded-lg p-4 hover:border-purple-300 hover:bg-purple-50 transition cursor-pointer"
                    onClick={() => handleSelectUser(user)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                            {user.full_name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{user.full_name}</h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            {user.department && (
                              <p className="text-xs text-gray-500">{user.department}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-4 mt-3">
                          <div className="flex items-center gap-2 text-sm">
                            <FileText size={16} className="text-purple-600" />
                            <span className="font-medium">{user.document_count || 0}</span>
                            <span className="text-gray-500">tài liệu</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MessageSquare size={16} className="text-blue-600" />
                            <span className="font-medium">{user.chat_count || 0}</span>
                            <span className="text-gray-500">chat</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'documents' && selectedUser && (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">
              Tài liệu của {selectedUser.full_name}
            </h2>
            {documents.length === 0 ? (
              <p className="text-gray-500">Người dùng chưa tải lên tài liệu nào</p>
            ) : (
              <div className="grid gap-3">
                {documents.map(doc => (
                  <div key={doc.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {doc.type === 'pdf' ? '📄' : doc.type === 'xlsx' ? '📊' : '📝'}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-medium">{doc.title}</h4>
                        <p className="text-sm text-gray-500">
                          Tải lên: {doc.date}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'chats' && selectedUser && (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">
              Lịch sử chat của {selectedUser.full_name}
            </h2>
            {chats.length === 0 ? (
              <p className="text-gray-500">Chưa có lịch sử chat</p>
            ) : (
              <div className="space-y-4">
                {chats.map(chat => (
                  <div key={chat.id} className="border-l-4 border-purple-500 pl-4 py-2">
                    <p className="text-sm text-gray-500 mb-1">
                      {new Date(chat.created_at).toLocaleString('vi-VN')}
                      {chat.document_title && ` • ${chat.document_title}`}
                    </p>
                    <div className="bg-blue-50 rounded-lg p-3 mb-2">
                      <p className="text-sm font-medium text-blue-900">Người dùng:</p>
                      <p className="text-sm text-gray-700">{chat.user_message}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-900">Bot:</p>
                      <p className="text-sm text-gray-700">{chat.bot_response}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}