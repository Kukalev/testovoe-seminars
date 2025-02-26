import React, { useEffect, useState } from 'react'
import DeleteModal from './DeleteModal'
import EditModal from './EditModal'
import SeminarCard from './SeminarCard'

// Основной компонент со списком семинаров
const SeminarList = () => {
	// Состояния для управления данными и UI
	const [seminars, setSeminars] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [editingSeminar, setEditingSeminar] = useState(null)
	const [deletingSeminarId, setDeletingSeminarId] = useState(null)

	// Загрузка семинаров с сервера
	const fetchSeminars = async () => {
		try {
			const response = await fetch('http://localhost:3001/seminars')
			if (!response.ok) {
				throw new Error('Ошибка загрузки данных')
			}
			const data = await response.json()
			setSeminars(data)
		} catch (err) {
			console.error('Ошибка:', err)
			setError('Ошибка при загрузке семинаров')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchSeminars()
	}, [])

	// Обработчик удаления семинара
	const handleDelete = async id => {
		setDeletingSeminarId(id)
	}

	// Подтверждение удаления семинара
	const handleConfirmDelete = async () => {
		try {
			const response = await fetch(
				`http://localhost:3001/seminars/${deletingSeminarId}`,
				{
					method: 'DELETE',
				}
			)
			if (!response.ok) {
				throw new Error('Ошибка при удалении')
			}
			setSeminars(seminars.filter(seminar => seminar.id !== deletingSeminarId))
			setDeletingSeminarId(null)
		} catch (err) {
			setError('Ошибка при удалении семинара')
		}
	}

	// Обработчик редактирования семинара
	const handleEdit = seminar => {
		setEditingSeminar(seminar)
	}

	if (loading)
		return <div className='text-center p-4 text-3xl'>Загрузка...</div>
	if (error)
		return <div className='text-center p-4 text-red-500 text-3xl'>{error}</div>
	if (!seminars.length)
		return <div className='text-center p-4 text-3xl'>Семинары не найдены</div>

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-3xl font-bold mb-6'>Семинары Kosmoteros</h1>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{seminars.map(seminar => (
					<SeminarCard
						key={seminar.id}
						seminar={seminar}
						onDelete={handleDelete}
						onEdit={handleEdit}
					/>
				))}
			</div>
			{editingSeminar && (
				<EditModal
					seminar={editingSeminar}
					onClose={() => setEditingSeminar(null)}
					onUpdate={updatedSeminar => {
						setSeminars(
							seminars.map(s =>
								s.id === updatedSeminar.id ? updatedSeminar : s
							)
						)
						setEditingSeminar(null)
					}}
				/>
			)}
			{deletingSeminarId && (
				<DeleteModal
					onClose={() => setDeletingSeminarId(null)}
					onConfirm={handleConfirmDelete}
				/>
			)}
		</div>
	)
}

export default SeminarList
