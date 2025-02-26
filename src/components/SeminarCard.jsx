import { Spin } from 'antd'
import React, { useState } from 'react'
import { antIcon } from '../utils/antIcon'

// Карточка отдельного семинара
const SeminarCard = ({ seminar, onDelete, onEdit }) => {
	// Состояние загрузки изображения
	const [imageLoaded, setImageLoaded] = useState(false)

	// Обработчик кнопки редактирования
	const handleEdit = e => {
		e.preventDefault() // Предотвращаем всплытие события
		e.stopPropagation() // Останавливаем дальнейшее распространение события
		onEdit(seminar)
	}

	// Обработчик кнопки удаления
	const handleDelete = e => {
		e.preventDefault()
		e.stopPropagation()
		onDelete(seminar.id)
	}

	return (
		<div className='overflow-hidden relative bg-[#1e2837] rounded-lg h-[400px]'>
			<div className='h-48 relative bg-gray-800 overflow-hidden'>
				<div
					className={`absolute inset-0 flex items-center justify-center ${
						imageLoaded ? 'hidden' : ''
					}`}
				>
					<Spin indicator={antIcon} />
				</div>
				<img
					src={seminar.photo}
					alt={seminar.title}
					className={`w-full h-full object-cover object-center ${
						!imageLoaded ? 'opacity-0' : 'opacity-100'
					}`}
					onLoad={() => setImageLoaded(true)}
				/>
			</div>
			<div className='p-4 flex flex-col h-[calc(400px-12rem)]'>
				<div className='flex-grow'>
					<h2 className='text-xl font-bold mb-2 text-white'>{seminar.title}</h2>
					<p className='text-gray-300 mb-2'>{seminar.description}</p>
					<div className='text-gray-400'>
						<p>Дата: {seminar.date}</p>
						<p>Время: {seminar.time}</p>
					</div>
				</div>

				<div className='flex justify-end space-x-2 mt-auto'>
					<button
						onClick={handleEdit}
						className='h-10 px-4 bg-blue-500 text-white rounded hover:bg-blue-600'
					>
						Редактировать
					</button>
					<button
						onClick={handleDelete}
						className='h-10 px-4 bg-red-500 text-white rounded hover:bg-red-600'
					>
						Удалить
					</button>
				</div>
			</div>
		</div>
	)
}

export default SeminarCard
