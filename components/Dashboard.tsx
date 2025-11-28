import React, { useState } from 'react';
import { Medicine, Order, OrderStatus, MedicineCategory } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, CheckCircle, XCircle, Trash2, Edit2, Plus, Upload, Save, FileText } from 'lucide-react';

interface DashboardProps {
  medicines: Medicine[];
  orders: Order[];
  onAddMedicine: (m: Medicine) => void;
  onUpdateMedicine: (m: Medicine) => void;
  onDeleteMedicine: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  medicines,
  orders,
  onAddMedicine,
  onUpdateMedicine,
  onDeleteMedicine,
  onUpdateOrderStatus
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'orders'>('overview');
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Stats
  const totalSales = orders.reduce((acc, order) => acc + order.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING_VERIFICATION).length;
  const lowStockItems = medicines.filter(m => m.stock < 10).length;

  const data = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  const handleSaveMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMedicine) {
      if (isAddingNew) {
        onAddMedicine(editingMedicine);
      } else {
        onUpdateMedicine(editingMedicine);
      }
      setEditingMedicine(null);
      setIsAddingNew(false);
    }
  };

  const startAddNew = () => {
    setIsAddingNew(true);
    setEditingMedicine({
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      brand: '',
      price: 0,
      stock: 0,
      requiresPrescription: false,
      category: MedicineCategory.OTC,
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&q=80&w=400'
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Operations Dashboard</h1>
      
      {/* Tabs */}
      <div className="flex space-x-1 bg-white p-1 rounded-xl border border-gray-200 w-fit">
        {['overview', 'inventory', 'orders'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
              activeTab === tab ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">${totalSales.toFixed(2)}</p>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Pending Prescriptions</p>
                <p className="text-2xl font-bold text-orange-600">{pendingOrders}</p>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Low Stock Alerts</p>
                <p className="text-2xl font-bold text-red-600">{lowStockItems}</p>
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-80">
            <h3 className="text-lg font-bold mb-4">Weekly Revenue</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="sales" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-lg">Medicine Inventory (CRUD)</h2>
            <button 
              onClick={startAddNew} 
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Medicine
            </button>
          </div>

          {editingMedicine ? (
            <form onSubmit={handleSaveMedicine} className="p-6 space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input required className="w-full p-2 border rounded-lg" value={editingMedicine.name} onChange={e => setEditingMedicine({...editingMedicine, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <input required className="w-full p-2 border rounded-lg" value={editingMedicine.brand} onChange={e => setEditingMedicine({...editingMedicine, brand: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input required type="number" step="0.01" className="w-full p-2 border rounded-lg" value={editingMedicine.price} onChange={e => setEditingMedicine({...editingMedicine, price: parseFloat(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input required type="number" className="w-full p-2 border rounded-lg" value={editingMedicine.stock} onChange={e => setEditingMedicine({...editingMedicine, stock: parseInt(e.target.value)})} />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select className="w-full p-2 border rounded-lg" value={editingMedicine.category} onChange={e => setEditingMedicine({...editingMedicine, category: e.target.value as MedicineCategory})}>
                      {Object.values(MedicineCategory).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
               </div>
               <div className="flex space-x-3 pt-4">
                  <button type="button" onClick={() => setEditingMedicine(null)} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center"><Save className="w-4 h-4 mr-2" /> Save Item</button>
               </div>
            </form>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Category</th>
                    <th className="px-6 py-3 font-medium">Stock</th>
                    <th className="px-6 py-3 font-medium">Price</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {medicines.map(m => (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{m.name}</td>
                      <td className="px-6 py-4 text-gray-500">{m.category}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${m.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {m.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">${m.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => setEditingMedicine(m)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => onDeleteMedicine(m.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? <div className="text-gray-500 text-center py-10">No active orders</div> : orders.map(order => (
            <div key={order.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                 <div>
                   <h3 className="font-bold text-gray-900">Order #{order.id}</h3>
                   <p className="text-sm text-gray-500">{new Date(order.timestamp).toLocaleString()}</p>
                 </div>
                 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                   order.status === OrderStatus.PENDING_VERIFICATION ? 'bg-orange-100 text-orange-700' :
                   order.status === OrderStatus.APPROVED ? 'bg-green-100 text-green-700' :
                   order.status === OrderStatus.REJECTED ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                 }`}>
                   {order.status}
                 </span>
              </div>
              
              <div className="border-t border-b border-gray-50 py-4 my-4 space-y-2">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="text-gray-500">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {order.prescriptionUrl && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                   <div className="flex items-center text-blue-700 text-sm font-medium">
                     <FileText className="w-4 h-4 mr-2" />
                     Prescription Uploaded
                   </div>
                   <button className="text-xs bg-white px-2 py-1 rounded border border-blue-200 text-blue-600">View</button>
                </div>
              )}

              {/* Pharmacist Actions */}
              {order.status === OrderStatus.PENDING_VERIFICATION && (
                <div className="flex space-x-3 mt-4">
                  <button 
                    onClick={() => onUpdateOrderStatus(order.id, OrderStatus.APPROVED)}
                    className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium flex justify-center items-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" /> Approve
                  </button>
                  <button 
                     onClick={() => onUpdateOrderStatus(order.id, OrderStatus.REJECTED)}
                     className="flex-1 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-medium flex justify-center items-center"
                  >
                    <XCircle className="w-4 h-4 mr-2" /> Reject
                  </button>
                </div>
              )}

              {/* Warehouse Actions */}
              {order.status === OrderStatus.APPROVED && (
                 <button 
                   onClick={() => onUpdateOrderStatus(order.id, OrderStatus.PACKED)}
                   className="w-full py-2 bg-primary-600 text-white rounded-lg font-medium flex justify-center items-center"
                 >
                   <Package className="w-4 h-4 mr-2" /> Mark as Packed
                 </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};