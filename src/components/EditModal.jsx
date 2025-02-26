import React, { useState } from 'react'

// Модальное окно редактирования семинара
const EditModal = ({ seminar, onClose, onUpdate }) => {
	// Состояние для хранения данных формы
	const [editedSeminar, setEditedSeminar] = useState({
		id: seminar.id,
		title: seminar.title,
		description: seminar.description,
		date: seminar.date,
		time: seminar.time,
		photo: seminar.photo,
	})
	// Состояние для ошибок валидации
	const [errors, setErrors] = useState({})
	// Состояние для сообщений об обновлении
	const [updateMessage, setUpdateMessage] = useState('')

	// Проверка валидности формы
	const validateForm = () => {
		const newErrors = {}

		// Проверка названия
		if (!editedSeminar.title.trim()) {
			newErrors.title = 'Название обязательно'
		}

		// Проверка описания
		if (!editedSeminar.description.trim()) {
			newErrors.description = 'Описание обязательно'
		}

		// Проверка даты
		const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/
		if (!dateRegex.test(editedSeminar.date)) {
			newErrors.date = 'Формат даты: ДД.ММ.ГГГГ'
		} else {
			const [day, month, year] = editedSeminar.date.split('.')
			const isValidDate =
				new Date(year, month - 1, day).getDate() === Number(day)
			if (!isValidDate) {
				newErrors.date = 'Некорректная дата'
			}
		}

		// Проверка времени
		const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
		if (!timeRegex.test(editedSeminar.time)) {
			newErrors.time = 'Формат времени: ЧЧ:ММ'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	// Проверка наличия изменений в форме
	const hasChanges = () => {
		return Object.keys(editedSeminar).some(
			key => editedSeminar[key] !== seminar[key]
		)
	}

	// Обработчик изменения полей формы
	const handleChange = (field, value) => {
		setEditedSeminar(prev => ({
			...prev,
			[field]: value,
		}))

		// Очищаем ошибку поля при изменении
		if (errors[field]) {
			setErrors(prev => ({
				...prev,
				[field]: '',
			}))
		}
	}

	// Обработчик отправки формы
	const handleSubmit = async e => {
		e.preventDefault()

		if (!hasChanges()) {
			setUpdateMessage('Нет изменений для сохранения')
			return
		}

		if (!validateForm()) {
			setUpdateMessage('Пожалуйста, исправьте ошибки')
			return
		}

		try {
			const response = await fetch(
				`http://localhost:3001/seminars/${seminar.id}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(editedSeminar),
				}
			)

			if (!response.ok) {
				throw new Error(`Ошибка сервера: ${response.status}`)
			}

			const updatedSeminar = await response.json()
			onUpdate(updatedSeminar)
			setUpdateMessage('Семинар успешно обновлен!')
			setTimeout(() => onClose(), 1500)
		} catch (err) {
			setUpdateMessage('Ошибка при сохранении семинара')
		}
	}

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
			<div className='bg-white p-6 rounded-lg w-full max-w-md'>
				<h2 className='text-2xl font-bold mb-4'>Редактировать семинар</h2>
				<form onSubmit={handleSubmit}>
					<div className='mb-4'>
						<label className='block text-gray-700 text-sm font-bold mb-2'>
							Название
						</label>
						<input
							type='text'
							value={editedSeminar.title}
							onChange={e => handleChange('title', e.target.value)}
							className={`w-full p-2 border rounded ${
								errors.title ? 'border-red-500' : ''
							}`}
						/>
						{errors.title && (
							<p className='text-red-500 text-xs mt-1'>{errors.title}</p>
						)}
					</div>

					<div className='mb-4'>
						<label className='block text-gray-700 text-sm font-bold mb-2'>
							Описание
						</label>
						<textarea
							value={editedSeminar.description}
							onChange={e => handleChange('description', e.target.value)}
							className={`w-full p-2 border rounded ${
								errors.description ? 'border-red-500' : ''
							}`}
							rows='3'
						/>
						{errors.description && (
							<p className='text-red-500 text-xs mt-1'>{errors.description}</p>
						)}
					</div>

					<div className='mb-4'>
						<label className='block text-gray-700 text-sm font-bold mb-2'>
							Дата (ДД.ММ.ГГГГ)
						</label>
						<input
							type='text'
							value={editedSeminar.date}
							onChange={e => handleChange('date', e.target.value)}
							className={`w-full p-2 border rounded ${
								errors.date ? 'border-red-500' : ''
							}`}
							placeholder='01.01.2024'
						/>
						{errors.date && (
							<p className='text-red-500 text-xs mt-1'>{errors.date}</p>
						)}
					</div>

					<div className='mb-4'>
						<label className='block text-gray-700 text-sm font-bold mb-2'>
							Время (ЧЧ:ММ)
						</label>
						<input
							type='text'
							value={editedSeminar.time}
							onChange={e => handleChange('time', e.target.value)}
							className={`w-full p-2 border rounded ${
								errors.time ? 'border-red-500' : ''
							}`}
							placeholder='14:30'
						/>
						{errors.time && (
							<p className='text-red-500 text-xs mt-1'>{errors.time}</p>
						)}
					</div>

					{updateMessage && (
						<div
							className={`mb-4 p-2 rounded ${
								updateMessage.includes('успешно')
									? 'bg-green-100 text-green-700'
									: 'bg-red-100 text-red-700'
							}`}
						>
							{updateMessage}
						</div>
					)}

					<div className='flex justify-end space-x-2'>
						<button
							type='button'
							onClick={onClose}
							className='px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400'
						>
							Отмена
						</button>
						<button
							type='submit'
							className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
								!hasChanges() ? 'opacity-50 cursor-not-allowed' : ''
							}`}
							disabled={!hasChanges()}
						>
							Сохранить
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default EditModal
