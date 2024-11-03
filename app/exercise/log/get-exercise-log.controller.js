import asyncHandler from 'express-async-handler'

import { prisma } from '../../prisma.js'

// @desc    Get exercise log
// @route   GET /api/exercises/log/:id
// @access  Private
export const getExerciseLog = asyncHandler(async (req, res) => {
	const exerciseLog = await prisma.exerciseLog.findUnique({
		where: {
			id: +req.params.id
		},
		include: {
			exercise: true,
			times: true
		}
	})

	if (!exerciseLog) {
		res.status(404)
		throw new Error('Exercise log not found!')
	}

	const prevExerciseLog = await prisma.exerciseLog.findFirst({
		where: {
			exerciseId: exerciseLog.exerciseId,
			userId: req.user.id,
			isCompleted: true
		},
		orderBy: {
			createdAt: 'desc'
		},
		include: {
			times: true
		}
	})

	console.log(prevExerciseLog)

	return

	res.json({
		...exerciseLog,
		times: addPrevValues(exerciseLog, prevExerciseLog)
	})
})
