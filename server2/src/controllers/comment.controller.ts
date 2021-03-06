import { Request, Response } from 'express'
import { AppDataSource } from '../AppDataSource'
import { Comment } from '../entities/comment.entity'

export async function getComment(request: Request, response: Response) {
  AppDataSource.getRepository(Comment)
    .find({
      where: {
        id: parseInt(request.params.id),
      },
    })
    .then((data) => {
      response.send(data)
    })
    .catch((err) => {
      console.log(err)
      response.sendStatus(400)
    })
}

export async function newComment(request: Request, response: Response) {
  const commentRepository = AppDataSource.getRepository(Comment)

  try {
    const item = commentRepository.create(request.body)
    commentRepository.save(item)
    response.send(item)
  } catch (err) {
    console.log(err)
    response.sendStatus(400)
  }
}
