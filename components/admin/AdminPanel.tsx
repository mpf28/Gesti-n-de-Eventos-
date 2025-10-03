import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../../App';
import { User, Role } from '../../types';
import { Modal } from '../ui/Modal';
import { PlusCircle, Edit, Trash2 } from '../ui/Icons';

const UserForm: React.FC<{ user?: User | null; onSubmit: (data: Omit<User, 'id'>) => void; onClose: () => void; }> = ({ user, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: Role.User,
    });
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name, email: user.email, password: '', role: user.role });
        }
    }, [user]);

    const validate = () => {
        const newErrors: any = {};
        if (!formData.name) newErrors.name = 'El nombre es requerido.';
        if (!formData.email) newErrors.email = 'El email es requerido.';
        if (!user && !formData.password) newErrors.password = 'La contraseña es requerida.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre</label>
                <input type="text" value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData(p => ({...p, email: e.target.value}))} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña {user ? '(dejar en blanco para no cambiar)' : ''}</label>
                <input type="password" value={formData.password} onChange={e => setFormData(p => ({...p, password: e.target.value}))} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rol</label>
                <select value={formData.role} onChange={e => setFormData(p => ({...p, role: e.target.value as Role}))} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value={Role.User}>Usuario</option>
                    <option value={Role.Admin}>Administrador</option>
                </select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Cancelar</button>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700">{user ? 'Actualizar' : 'Crear'} Usuario</button>
            </div>
        </form>
    );
};

export const AdminPanel: React.FC = () => {
    const { currentUser, users, addUser, updateUser, removeUser } = useContext(AppContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);

    if (currentUser?.role !== Role.Admin) {
        return <Navigate to="/" replace />;
    }

    const handleOpenModal = (user: User | null = null) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSubmit = (data: Omit<User, 'id'>) => {
        if (editingUser) {
            const finalData = { ...editingUser, ...data };
            if (!data.password) {
                finalData.password = editingUser.password;
            }
            updateUser(finalData);
        } else {
            addUser(data);
        }
        handleCloseModal();
    };

    const handleDelete = () => {
        if (deletingUser) {
            removeUser(deletingUser.id);
            setDeletingUser(null);
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Panel de Administración</h1>
                <button onClick={() => handleOpenModal()} className="inline-flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Agregar Usuario
                </button>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nombre</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Rol</th>
                            <th scope="col" className="px-6 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.name}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.role === Role.Admin ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 space-x-2">
                                    <button onClick={() => handleOpenModal(user)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline"><Edit className="w-5 h-5 inline" /></button>
                                    {currentUser.id !== user.id && (
                                        <button onClick={() => setDeletingUser(user)} className="font-medium text-red-600 dark:text-red-500 hover:underline"><Trash2 className="w-5 h-5 inline" /></button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingUser ? 'Editar Usuario' : 'Agregar Usuario'}>
                <UserForm user={editingUser} onSubmit={handleSubmit} onClose={handleCloseModal} />
            </Modal>
            
            <Modal isOpen={!!deletingUser} onClose={() => setDeletingUser(null)} title="Confirmar Eliminación" size="sm">
                <div>
                    <p className="text-gray-600 dark:text-gray-300">
                        ¿Estás seguro de que deseas eliminar a <strong className="font-semibold">{deletingUser?.name}</strong>?
                    </p>
                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={() => setDeletingUser(null)} className="py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Cancelar</button>
                        <button onClick={handleDelete} className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:focus:ring-red-900">Eliminar</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
