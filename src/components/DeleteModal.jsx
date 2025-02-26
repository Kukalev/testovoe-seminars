import React from 'react'

// Модальное окно подтверждения удаления
const DeleteModal = ({ onClose, onConfirm }) => {
	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
			<div className='bg-white p-6 rounded-lg w-full max-w-md'>
				<h2 className='text-2xl font-bold mb-4'>Подтверждение удаления</h2>
				<p className='text-gray-700 mb-6'>
					Вы уверены, что хотите удалить этот семинар?
				</p>
				<div className='flex justify-end space-x-2'>
					<button
						onClick={onClose}
						className='px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400'
					>
						Отмена
					</button>
					<button
						onClick={onConfirm}
						className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
					>
						Удалить
					</button>
				</div>
			</div>
		</div>
	)
}

export default DeleteModal
